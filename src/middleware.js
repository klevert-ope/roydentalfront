"use server";
import {axiosInstance} from "@/config/axiosInstance";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {match} from "path-to-regexp";

// Centralized Configuration
const appConfig = {
	endpoints: {
		authDecrypt: process.env.AUTH_DECRYPT_ENDPOINT || "/auth/decrypt",
	},
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

// Logger Utility
const logger = {
	warn: (message) => console.warn(`[WARN] ${message}`),
	error: (message) => console.error(`[ERROR] ${message}`),
};

// Route Matchers Cache
const routeMatchersCache = new Map();

function getRouteMatcher(route) {
	if (!routeMatchersCache.has(route)) {
		routeMatchersCache.set(route, match(route, {decode: decodeURIComponent}));
	}
	return routeMatchersCache.get(route);
}

const routeMatchers = Object.keys(appConfig.protectedRoutes).map((route) => ({
	route,
	matcher: getRouteMatcher(route),
}));

// Check if a user has access based on their role
function hasAccess(userRole, allowedRoles) {
	if (!userRole) return false;
	return allowedRoles.has(userRole) || Array.from(appConfig.roleHierarchy[userRole] || new Set()).some(role => allowedRoles.has(role));
}


// Match the requested pathname to a protected route
function matchRoute(pathname) {
	const matchedRoute = routeMatchers.find(({matcher}) => matcher(pathname));
	return matchedRoute ? appConfig.protectedRoutes[matchedRoute.route] : null;
}

// Verify the access token with the backend
async function verifyToken(token) {
	try {
		const response = await axiosInstance.post(appConfig.endpoints.authDecrypt, {token});
		return response.data;
	} catch (error) {
		logger.error(`Token verification failed: ${error.message}`);
		return null;
	}
}

// Error Handling Middleware
async function withErrorHandling(fn, req) {
	const CookieStore = await cookies();
	try {
		return await fn(req);
	} catch (error) {
		logger.error(`Middleware error: ${error.message}`);

		if (error.response?.status === 401) {
			logger.warn("Token is invalid or expired");
			CookieStore.delete("accessToken");
			return NextResponse.redirect(new URL(appConfig.pages.login, req.url));
		}

		return NextResponse.redirect(new URL(appConfig.pages.unauthorized, req.url));
	}
}

// Security Headers
function setSecurityHeaders(response) {
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-XSS-Protection", "1; mode=block");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	return response;
}

// Middleware Function
export async function middleware(req) {
	return withErrorHandling(async (req) => {
		const {pathname} = req.nextUrl;

		// Allow unauthenticated users to access the login page
		if (pathname === appConfig.pages.login) {
			return NextResponse.next();
		}

		const cookieStore = await cookies();
		const accessToken = cookieStore.get("accessToken")?.value;

		// Redirect unauthenticated users to the login page
		if (!accessToken) {
			logger.warn(`Redirecting unauthenticated user from ${pathname} to ${appConfig.pages.login}`);
			return NextResponse.redirect(new URL(appConfig.pages.login, req.url));
		}

		// Verify the access token
		const decodedToken = await verifyToken(accessToken);
		if (!decodedToken) {
			logger.warn(`Invalid token detected. Clearing cookie and redirecting to ${appConfig.pages.login}`);
			cookieStore.delete("accessToken");
			return NextResponse.redirect(new URL(appConfig.pages.login, req.url));
		}

		const userRole = decodedToken.role;
		if (!userRole) {
			logger.warn(`Missing role in token for access to ${pathname}`);
			return NextResponse.redirect(new URL(appConfig.pages.unauthorized, req.url));
		}

		// Check if the route is protected and if the user has access
		const allowedRoles = matchRoute(pathname);
		if (allowedRoles) {
			if (!hasAccess(userRole, allowedRoles)) {
				logger.warn(`Unauthorized access attempt to ${pathname} by role ${userRole}`);
				return NextResponse.redirect(new URL(appConfig.pages.unauthorized, req.url));
			}
		}

		// Allow access to the requested route
		const response = NextResponse.next();
		return setSecurityHeaders(response);
	}, req);
}

// Middleware Configuration
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
