import SideBarComponent from "@/components/SideBarComponent";
import Unauthorized from "@/features/Unauthorized/Unauthorized";

export const metadata = {
	title: "Unauthorized",
};

export default function UnauthorizedPage() {
  return (
	  <SideBarComponent>
		  <Unauthorized/>
	  </SideBarComponent>
  );
}
