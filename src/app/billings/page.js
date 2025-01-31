import {LoadingPage} from '@/components/LoadingPage';
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
			<LoadingPage>
				<BillingsTable/>
				<BillingCharts/>
			</LoadingPage>
		</SideBarComponent>
	);
}
