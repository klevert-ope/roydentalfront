"use server";
import {axiosInstance} from "@/config/axiosInstance";
import {handleAxiosError} from "@/utility/handleError";
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
	[ROLES.ADMIN]: new Set([ROLES.DOCTOR, ROLES.RECEPTIONIST]),
	[ROLES.DOCTOR]: new Set([ROLES.RECEPTIONIST]),
	[ROLES.RECEPTIONIST]: new Set(),
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
const routeMatchers = Object.entries(protectedRoutes).map(([route, roles]) => ({
	route,
	roles,
	matcher: match(route, {decode: decodeURIComponent}),
}));

// Check if a user has access based on their role
function hasAccess(userRole, allowedRoles) {
	if (!userRole) return false;
	return (
		allowedRoles.includes(userRole) ||
		(roleHierarchy[userRole] && [...roleHierarchy[userRole]].some((role) => allowedRoles.includes(role)))
	);
}

// Match the requested pathname to a protected route
function matchRoute(pathname) {
	const matched = routeMatchers.find(({matcher}) => matcher(pathname));
	return matched ? matched.route : null;
}

// Verify the access token with the backend
async function verifyToken(token) {
	try {
		const response = await axiosInstance.post(AUTH_DECRYPT_ENDPOINT, {token});
		return response.data;
	} catch (error) {
		handleAxiosError(error);
		return null;
	}
}

// Helper function to handle unauthorized access
function redirectTo(url, cookieStore) {
	cookieStore.delete("accessToken");
	return NextResponse.redirect(new URL(url, process.env.NEXT_PUBLIC_BASE_URL));
}

// Middleware function to handle authentication and authorization
export async function middleware(req) {
	const {pathname} = req.nextUrl;

	// Allow unauthenticated users to access the login page
	if (pathname === LOGIN_PAGE) {
		return NextResponse.next();
	}

	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	try {
		if (!accessToken) {
			console.warn(`Redirecting unauthenticated user from ${pathname} to ${LOGIN_PAGE}`);
			return redirectTo(LOGIN_PAGE, cookieStore);
		}

		const decodedToken = await verifyToken(accessToken);
		if (!decodedToken) {
			console.warn(`Invalid token detected. Clearing cookie and redirecting to ${LOGIN_PAGE}`);
			return redirectTo(LOGIN_PAGE, cookieStore);
		}

		const userRole = decodedToken.role;
		if (!userRole) {
			console.warn(`Missing role in token for access to ${pathname}`);
			return redirectTo(LOGIN_PAGE, cookieStore);
		}

		const matchedRoute = matchRoute(pathname);
		if (matchedRoute && !hasAccess(userRole, protectedRoutes[matchedRoute])) {
			console.warn(`Unauthorized access attempt to ${pathname} by role ${userRole}`);
			return redirectTo(UNAUTHORIZED_PAGE, cookieStore);
		}

		return NextResponse.next();
	} catch (error) {
		console.error("Middleware error:", error.message);
		return redirectTo(LOGIN_PAGE, cookieStore);
	}
}

// Middleware configuration
const IGNORED_PATHS = ["/_next/static", "/_next/image", "/favicon.ico"];
export const config = {
	matcher: [`/((?!${IGNORED_PATHS.join("|")}).*)`],
};
