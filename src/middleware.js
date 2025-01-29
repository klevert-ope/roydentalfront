"use server";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";

// Define roles and their hierarchy
export const ROLES = {
	ADMIN: "Admin",
	DOCTOR: "Doctor",
	RECEPTIONIST: "Receptionist",
};

// Define role hierarchy (higher roles inherit permissions from lower roles)
const roleHierarchy = {
	[ROLES.ADMIN]: [ROLES.DOCTOR, ROLES.RECEPTIONIST],
	[ROLES.DOCTOR]: [ROLES.RECEPTIONIST],
	[ROLES.RECEPTIONIST]: [],
};

// Define protected routes and their allowed roles
const protectedRoutes = {
	"/": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/doctors": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/patients": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/patients/:id": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/insurance-companies": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/users": [ROLES.ADMIN],
	"/billings": [ROLES.ADMIN],
};

// Helper function to check if a user's role has access to a route
function hasAccess(userRole, allowedRoles) {
	if (!userRole) return false;

	// Check if the user's role is directly allowed
	if (allowedRoles.includes(userRole)) return true;

	// Check if the user's role inherits permissions from a higher role
	const inheritedRoles = roleHierarchy[userRole] || [];
	return inheritedRoles.some((role) => allowedRoles.includes(role));
}

// Helper function to match dynamic routes
function matchRoute(pathname) {
	for (const route in protectedRoutes) {
		if (route.includes(":")) {
			// Convert dynamic route to regex (e.g., "/patients/:id" => "/patients/.*")
			const regex = new RegExp(`^${route.replace(/:\w+/g, ".*")}$`);
			if (regex.test(pathname)) {
				return route;
			}
		} else if (route === pathname) {
			return route;
		}
	}
	return null;
}

export async function middleware(req) {
	const {pathname} = req.nextUrl;
	const cookieStore = await cookies();

	try {
		// Check if the user is authenticated
		const accessToken = cookieStore.get("accessToken")?.value;
		const userCookie = cookieStore.get("user")?.value;

		// Parse the user cookie to get the role
		let userRole = null;
		if (userCookie) {
			try {
				userRole = JSON.parse(userCookie).role;
			} catch (error) {
				console.error("Failed to parse user cookie:", error);
				return NextResponse.redirect(new URL("/login", req.url));
			}
		}

		// If the user is authenticated and tries to access the login page,
		// redirect to home
		if (pathname === "/login" && accessToken && userRole) {
			return NextResponse.redirect(new URL("/", req.url));
		}

		// Check if the current route is protected
		const matchedRoute = matchRoute(pathname);
		const routeRoles = matchedRoute ? protectedRoutes[matchedRoute] : null;

		if (routeRoles) {
			// If no accessToken or role, redirect to log in
			if (!accessToken || !userRole) {
				console.warn(`Unauthenticated access attempt to ${pathname}`);
				return NextResponse.redirect(new URL("/login", req.url));
			}

			// Check if the user's role is allowed to access the route
			if (!hasAccess(userRole, routeRoles)) {
				console.warn(
					`Unauthorized access attempt to ${pathname} by role ${userRole}`,
				);
				return NextResponse.redirect(new URL("/unauthorized", req.url));
			}
		}

		// Allow the request to proceed
		return NextResponse.next();
	} catch (error) {
		console.error("Middleware error:", error);
		return NextResponse.redirect(new URL("/error", req.url));
	}
}

// Configure the middleware to match all routes
export const config = {
	matcher: ["/:path*"],
};
