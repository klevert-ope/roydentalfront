import SideBarComponent from "@/components/SideBarComponent";
import {Loader} from "lucide-react";

export default function Loading() {
	return (
		<SideBarComponent>
			<div className="flex flex-col items-center justify-center h-svh">
				<Loader className="motion-safe:animate-spin"
				        color={"var(--primary)"}/>
			</div>
		</SideBarComponent>
	);
}
