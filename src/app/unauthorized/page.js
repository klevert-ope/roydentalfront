import ErrorBoundary from "@/components/ErrorComponent";
import SideBarComponent from "@/components/SideBarComponent";
import Unauthorized from "@/features/Unauthorized/Unauthorized";

export default function UnauthorizedPage() {
  return (
    <ErrorBoundary>
      <SideBarComponent>
        <Unauthorized />
      </SideBarComponent>
    </ErrorBoundary>
  );
}
