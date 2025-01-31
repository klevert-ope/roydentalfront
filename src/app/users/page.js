import {LoadingPage} from '@/components/LoadingPage';
import SideBarComponent from "@/components/SideBarComponent";
import AdminUsersPage from "@/features/users/AdminUsersPage";

export const metadata = {
	title: "Users",
};

export default function UsersPage() {
  return (
	  <SideBarComponent>
		  <LoadingPage>
			  <h1 className="text-center mb-8">USERS</h1>
			  <AdminUsersPage/>
		  </LoadingPage>
	  </SideBarComponent>
  );
}
