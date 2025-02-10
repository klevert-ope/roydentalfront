"use server";
import {getUserProfile, refreshToken, verifyToken} from "@/api/auth";
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
		"/users": new Set(["Admin"]),
		"/billings": new Set(["Admin"]),
	},
};

// Caches for Tokens and User Profiles
const tokenCache = new Map(); // Cache for decoded tokens
const userProfileCache = new Map(); // Cache for user profiles

// Logger Utility (Asynchronous)
const logger = {
	warn: (message) => setTimeout(() => console.warn(`[WARN] ${message}`), 0),
	error: (message) => setTimeout(() => console.error(`[ERROR] ${message}`), 0),
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

// Check if a user has access based on their role
function hasAccess(userRole, allowedRoles) {
	if (!userRole) return false;
	return (
		allowedRoles.has(userRole) ||
		Array.from(appConfig.roleHierarchy[userRole] || new Set()).some((role) => allowedRoles.has(role))
	);
}

// Match the requested pathname to a protected route
function matchRoute(pathname) {
	const matchedRoute = routeMatchers.find(({matcher}) => matcher(pathname));
	return matchedRoute ? appConfig.protectedRoutes[matchedRoute.route] : null;
}

// Security Headers (Precomputed)
const securityHeaders = new Headers({
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"X-XSS-Protection": "1; mode=block",
	"Referrer-Policy": "strict-origin-when-cross-origin",
});

function setSecurityHeaders(response) {
	securityHeaders.forEach((value, key) => response.headers.set(key, value));
	return response;
}

// Token Verification with Cache
async function verifyTokenWithCache(accessToken) {
	if (tokenCache.has(accessToken)) {
		return tokenCache.get(accessToken);
	}
	const decodedToken = await verifyToken(accessToken);
	tokenCache.set(accessToken, decodedToken);
	return decodedToken;
}

// Token Refresh with Cache
async function refreshTokenWithCache() {
	const newAccessToken = await refreshToken();
	tokenCache.delete(accessToken); // Clear old token from cache
	tokenCache.set(newAccessToken, await verifyToken(newAccessToken));
	return newAccessToken;
}

// User Profile Fetching with Cache
async function getUserProfileWithCache(userId) {
	if (userProfileCache.has(userId)) {
		return userProfileCache.get(userId);
	}
	const profile = await getUserProfile(userId);
	userProfileCache.set(userId, profile);
	return profile;
}

// Middleware Function
export async function middleware(req) {
	const {pathname} = req.nextUrl;
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	// Allow unauthenticated users to access the login page
	if (pathname === appConfig.pages.login) {
		return NextResponse.next();
	}

	// Redirect unauthenticated users to the login page
	if (!accessToken) {
		logger.warn(`Redirecting unauthenticated user from ${pathname} to ${appConfig.pages.login}`);
		return NextResponse.redirect(new URL(appConfig.pages.login, req.url));
	}

	// Verify the access token with cache
	let decodedToken;
	try {
		decodedToken = await verifyTokenWithCache(accessToken);
	} catch (error) {
		logger.warn(`Token verification failed: ${error.message}`);
		cookieStore.delete("accessToken");
		return NextResponse.redirect(new URL(appConfig.pages.login, req.url));
	}

	// Refresh token if necessary
	if (!decodedToken) {
		try {
			const newAccessToken = await refreshTokenWithCache();
			cookieStore.set("accessToken", newAccessToken, {
				maxAge: 86400,
				secure: true,
				sameSite: "Strict",
				httpOnly: true,
				priority: "high",
			});
			decodedToken = await verifyTokenWithCache(newAccessToken);
		} catch (error) {
			logger.warn(`Token refresh failed: ${error.message}`);
			cookieStore.delete("accessToken");
			return NextResponse.redirect(new URL(appConfig.pages.login, req.url));
		}
	}

	// Check a user role
	const userRole = decodedToken.role;
	if (!userRole) {
		logger.warn(`Missing role in token for access to ${pathname}`);
		return NextResponse.redirect(new URL(appConfig.pages.unauthorized, req.url));
	}

	// Fetch user profile with cache
	try {
		await getUserProfileWithCache(decodedToken.userId);
	} catch (error) {
		logger.warn(`User profile not available: ${error.message}`);
		return NextResponse.redirect(new URL(appConfig.pages.login, req.url));
	}

	// Check if the route is protected and if the user has access
	const allowedRoles = matchRoute(pathname);
	if (allowedRoles && !hasAccess(userRole, allowedRoles)) {
		logger.warn(`Unauthorized access attempt to ${pathname} by role ${userRole}`);
		return NextResponse.redirect(new URL(appConfig.pages.unauthorized, req.url));
	}

	// Allow access to the requested route
	const response = NextResponse.next();
	return setSecurityHeaders(response);
}

// Middleware Configuration
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
