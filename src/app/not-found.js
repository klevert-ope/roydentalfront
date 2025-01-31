import Link from "next/link";

export const metadata = {
	title: "Not Found",
};

export default function NotFound() {
	return (
			<div className="flex flex-col items-center justify-center h-svh">
				<h2>Not Found</h2>
				<p className="text-red-700">
					Could not find requested resource
				</p>
				<Link href="/">Return Home</Link>
			</div>
	);
}
