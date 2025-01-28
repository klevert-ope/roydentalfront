"use server";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";

export const ROLES = {
	ADMIN: "Admin",
	DOCTOR: "Doctor",
	RECEPTIONIST: "Receptionist",
};

// Define the protected routes and their allowed roles
const protectedRoutes = {
	"/": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/doctors": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/patients": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/patients/:id": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/insurancecompanies": [ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST],
	"/users": [ROLES.ADMIN],
	"/billings": [ROLES.ADMIN],
};

export async function middleware(req) {
	const {pathname} = req.nextUrl;
	const cookieStore = await cookies();

	// Check if the current route is protected
	const routeRoles = protectedRoutes[pathname];
	if (routeRoles) {
		const accessToken = cookieStore.get("accessToken")?.value;
		const userCookie = cookieStore.get("user")?.value;

		// Parse the user cookie to get the role
		const userRole = userCookie ? JSON.parse(userCookie).role : null;

		// If no accessToken or role, redirect to log in
		if (!accessToken || !userRole) {
			return NextResponse.redirect(new URL("/login", req.url));
		}

		// Check if the user's role is allowed to access the route
		if (!routeRoles.includes(userRole)) {
			return NextResponse.redirect(new URL("/unauthorized", req.url));
		}
	}

	return NextResponse.next();
}

// Configure the middleware to match all routes
export const config = {
	matcher: [
		"/:path*",
	],
};
