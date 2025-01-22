import SideBarComponent from "@/components/SideBarComponent";
import Unauthorized from "@/features/Unauthorized/Unauthorized";

export default function UnauthorizedPage() {
  return (
    <SideBarComponent>
      <Unauthorized />
    </SideBarComponent>
  );
}
