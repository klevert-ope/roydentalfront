import SideBarComponent from "@/components/SideBarComponent";
import AdminUsersPage from "@/features/users/AdminUsersPage";

export const metadata = {
	title: "Users",
};

export default function UsersPage() {
  return (
	  <SideBarComponent>
		  <div
			  className="container mx-auto px-2 w-full my-16 transition-all fade-in-60 animate-in -translate-y-3">
			  <h1 className="text-center mb-8">USERS</h1>
			  <AdminUsersPage/>
		  </div>
	  </SideBarComponent>
  );
}
