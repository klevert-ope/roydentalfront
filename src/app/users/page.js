import {AnimatePage} from '@/components/AnimatePage';
import SideBarComponent from "@/components/SideBarComponent";
import AdminUsersPage from "@/features/users/AdminUsersPage";

export const metadata = {
	title: "Users",
};

export default function UsersPage() {
  return (
	  <SideBarComponent>
		  <AnimatePage>
			  <h1 className="text-center mb-8">USERS</h1>
			  <AdminUsersPage/>
		  </AnimatePage>
	  </SideBarComponent>
  );
}
