"use server";
import {getUserProfile, refreshToken, verifyToken} from "@/api/auth";
import {LRUCache} from "lru-cache";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {match} from "path-to-regexp";

// Centralized Configuration
const appConfig = {
	pages: {
		login: process.env.LOGIN_PAGE || "/login",
		unauthorized: process.env.UNAUTHORIZED_PAGE || "/unauthorized",
	},
	roles: {
		ADMIN: "Admin",
		DOCTOR: "Doctor",
		RECEPTIONIST: "Receptionist",
	},
	roleHierarchy: {
		Admin: new Set(["Doctor", "Receptionist"]),
		Doctor: new Set(["Receptionist"]),
		Receptionist: new Set(),
	},
	protectedRoutes: {
		"/": new Set(["Admin", "Doctor", "Receptionist"]),
		"/doctors": new Set(["Admin", "Doctor", "Receptionist"]),
		"/patients": new Set(["Admin", "Doctor", "Receptionist"]),
		"/patients/:id": new Set(["Admin", "Doctor", "Receptionist"]),
		"/insurance-companies": new Set(["Admin", "Doctor", "Receptionist"]),
		"/users": new Set(["Admin", "Doctor"]),
		"/billings": new Set(["Admin", "Doctor"]),
	},
};

// Caches with LRU (essential for production)
const tokenCache = new LRUCache({max: 1000}); // Adjust max as needed
const userProfileCache = new LRUCache({max: 500}); // Adjust max as needed

// Logger Utility (using console for simplicity,
// replace with Winston/Pino in real production)
const logger = {
	warn: (message) => console.warn(`[WARN] ${message}`),
	error: (message) => console.error(`[ERROR] ${message}`),
	debug: (message) => console.debug(`[DEBUG] ${message}`),
};

// Route Matchers Cache
const routeMatchersCache = new Map();

function getRouteMatcher(route) {
	if (!routeMatchersCache.has(route)) {
		routeMatchersCache.set(route, match(route, {decode: decodeURIComponent}));
	}
	return routeMatchersCache.get(route);
}

// Precompute Route Matchers at Startup
const routeMatchers = Object.keys(appConfig.protectedRoutes).map((route) => ({
	route,
	matcher: getRouteMatcher(route),
}));

// Check user access based on a role (simplified)
function hasAccess(userRole, allowedRoles) {
	if (!userRole) return false;
	return allowedRoles.has(userRole) || (appConfig.roleHierarchy[userRole] && Array.from(appConfig.roleHierarchy[userRole]).some(role => allowedRoles.has(role)));
}


// Match requested pathname to a protected route (optimized)
function matchRoute(pathname) {
	for (const {matcher, route} of routeMatchers) {
		if (matcher(pathname)) {
			return appConfig.protectedRoutes[route];
		}
	}
	return null;
}

// Security Headers (CSP is crucial)
const securityHeaders = {
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"X-XSS-Protection": "1; mode=block",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'", // Example, customize!
};

function setSecurityHeaders(response) {
	for (const [key, value] of Object.entries(securityHeaders)) {
		response.headers.set(key, value);
	}
	return response;
}

// Token Verification with Cache
async function verifyTokenWithCache(accessToken) {
	let decodedToken = tokenCache.get(accessToken);
	if (decodedToken) {
		return decodedToken;
	}

	try {
		decodedToken = await verifyToken(accessToken);
		if (decodedToken) { // Check if verifyToken actually returned a value
			tokenCache.set(accessToken, decodedToken);
		} else {
			logger.warn("verifyToken returned null or undefined")
		}
		return decodedToken;
	} catch (error) {
		logger.warn(`Token verification failed: ${error.message}`);
		return null;
	}
}


// Token Refresh Handling (improved error handling)
async function refreshTokenWithCache(oldAccessToken) {
	try {
		const newAccessToken = await refreshToken();
		if (!newAccessToken) {
			logger.warn("refreshToken returned null or undefined")
			return null
		}
		const decodedToken = await verifyToken(newAccessToken);
		if (!decodedToken) {
			logger.warn("Newly generated token failed verification")
			return null
		}
		tokenCache.delete(oldAccessToken);
		tokenCache.set(newAccessToken, decodedToken);
		return newAccessToken;
	} catch (error) {
		logger.warn(`Token refresh failed: ${error.message}`);
		return null;
	}
}

// Fetch User Profile with Cache
async function getUserProfileWithCache(userId) {
	let profile = userProfileCache.get(userId);
	if (profile) {
		return profile;
	}

	try {
		profile = await getUserProfile(userId);
		if (profile) {
			userProfileCache.set(userId, profile);
		} else {
			logger.warn("getUserProfile returned null or undefined")
		}
		return profile;
	} catch (error) {
		logger.warn(`User profile not available: ${error.message}`);
		return null;
	}
}

// Middleware Function
export async function middleware(req) {
	const {pathname} = req.nextUrl;
	const cookieStore = await cookies();
	let accessToken = cookieStore.get("accessToken")?.value;

	// Allow access to login page without authentication
	if (pathname === appConfig.pages.login) {
		return NextResponse.next();
	}

	// Redirect if no access token found
	if (!accessToken) {
		logger.warn(`Redirecting unauthenticated user from ${pathname} to login`);
		return NextResponse.redirect(new URL(appConfig.pages.login, req.url));
	}

	// Verify token
	let decodedToken = await verifyTokenWithCache(accessToken);
	if (!decodedToken) {
		// Attempt to refresh token if verification fails
		const newAccessToken = await refreshTokenWithCache(accessToken);
		if (!newAccessToken) {
			// Refresh failed, force re-login
			cookieStore.delete("accessToken");
			return NextResponse.redirect(new URL(appConfig.pages.login, req.url));
		}

		// Set new token in cookies
		cookieStore.set("accessToken", newAccessToken, {
			maxAge: 86400,
			expires: new Date(Date.now() + 86400 * 1000),
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			httpOnly: true,
			priority: "high",
		});

		// Verify new token
		decodedToken = await verifyTokenWithCache(newAccessToken);
		if (!decodedToken) {
			logger.warn("Newly refreshed token failed verification");
			cookieStore.delete("accessToken");
			return NextResponse.redirect(new URL(appConfig.pages.login, req.url));
		}
	}

	// Validate user role
	const userRole = decodedToken.role;
	if (!userRole) {
		logger.warn(`Missing role in token for access to ${pathname}`);
		return NextResponse.redirect(new URL(appConfig.pages.unauthorized, req.url));
	}

	// Fetch user profile (ensures user still exists)
	const userProfile = await getUserProfileWithCache(decodedToken.userId);
	if (!userProfile) {
		logger.warn(`User profile not found for ID: ${decodedToken.userId}`);
		return NextResponse.redirect(new URL(appConfig.pages.login, req.url));
	}

	// Check route permissions
	const allowedRoles = matchRoute(pathname);
	if (allowedRoles && !hasAccess(userRole, allowedRoles)) {
		logger.warn(`Unauthorized access attempt to ${pathname} by role ${userRole}`);
		return NextResponse.redirect(new URL(appConfig.pages.unauthorized, req.url));
	}

	// Allow access
	const response = NextResponse.next();
	return setSecurityHeaders(response);
}

// Middleware Configuration
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
