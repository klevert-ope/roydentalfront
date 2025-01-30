"use server";
import {axiosInstance} from "@/config/axiosInstance";
import {handleAxiosError} from '@/utility/handleError';
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {match} from "path-to-regexp";

// Constants for configuration
const AUTH_DECRYPT_ENDPOINT = "/auth/decrypt";
const LOGIN_PAGE = "/login";
const UNAUTHORIZED_PAGE = "/unauthorized";

// Define roles and their hierarchy
export const ROLES = {
	ADMIN: "Admin",
	DOCTOR: "Doctor",
	RECEPTIONIST: "Receptionist",
};

const roleHierarchy = {
	[ROLES.ADMIN]: [ROLES.DOCTOR, ROLES.RECEPTIONIST],
	[ROLES.DOCTOR]: [ROLES.RECEPTIONIST],
	[ROLES.RECEPTIONIST]: [],
};

// Define protected routes and allowed roles
const protectedRoutes = {
	"/": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/doctors": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/patients": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/patients/:id": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/insurance-companies": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/users": [ROLES.ADMIN],
	"/billings": [ROLES.ADMIN],
};

// Precompute route matchers for efficient matching
const routeMatchers = Object.keys(protectedRoutes).map((route) => ({
	route,
	matcher: match(route, {decode: decodeURIComponent}),
}));

// Check if a user has access based on their role
function hasAccess(userRole, allowedRoles) {
	if (!userRole) return false;
	return allowedRoles.includes(userRole) || (roleHierarchy[userRole] || []).some(role => allowedRoles.includes(role));
}

// Match the requested pathname to a protected route
function matchRoute(pathname) {
	for (const {route, matcher} of routeMatchers) {
		if (matcher(pathname)) return route;
	}
	return null;
}

// Verify the access token with the backend
async function verifyToken(token) {
	try {
		const response = await axiosInstance.post(AUTH_DECRYPT_ENDPOINT, {token});
		return response.data;
	} catch (error) {
		handleAxiosError(error);
	}
}

// Middleware function to handle authentication and authorization
export async function middleware(req) {
	const {pathname} = req.nextUrl;

	// Allow unauthenticated users to access the login page
	if (pathname === LOGIN_PAGE) {
		return NextResponse.next();
	}

	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken", {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
	})?.value;

	try {
		// Redirect unauthenticated users to the login page
		if (!accessToken) {
			console.warn(`Redirecting unauthenticated user from ${pathname} to ${LOGIN_PAGE}`);
			return NextResponse.redirect(new URL(LOGIN_PAGE, req.url));
		}

		// Verify the access token
		const decodedToken = await verifyToken(accessToken);
		if (!decodedToken) {
			console.warn(`Invalid token detected. Clearing cookie and redirecting to ${LOGIN_PAGE}`);
			cookieStore.delete("accessToken");
			return NextResponse.redirect(new URL(LOGIN_PAGE, req.url));
		}

		const userRole = decodedToken.role;
		if (!userRole) {
			console.warn(`Missing role in token for access to ${pathname}`);
		}

		// Check if the route is protected and if the user has access
		const matchedRoute = matchRoute(pathname);
		if (matchedRoute) {
			const allowedRoles = protectedRoutes[matchedRoute];

			if (!hasAccess(userRole, allowedRoles)) {
				console.warn(`Unauthorized access attempt to ${pathname} by role ${userRole}`);
				return NextResponse.redirect(new URL(UNAUTHORIZED_PAGE, req.url));
			}
		}

		// Allow access to the requested route
		return NextResponse.next();
	} catch (error) {
		console.error("Middleware error:", error.message);

		// Handle specific error cases
		if (error.response?.status === 401) {
			console.warn("Token is invalid or expired");
			cookieStore.delete("accessToken");
			return NextResponse.redirect(new URL(LOGIN_PAGE, req.url));
		}
	}
}

// Middleware configuration
export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
