import SideBarComponent from "@/components/SideBarComponent";
import BillingCharts from "@/features/billings/BillingCharts";
import BillingsTable from "@/features/billings/BillingsTable";
import React from "react";

export const metadata = {
	title: "Billings",
};

export default function Billings() {
	return (
		<SideBarComponent>
			<div
				className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
				<BillingsTable/>
				<BillingCharts/>
			</div>
		</SideBarComponent>
	);
}
