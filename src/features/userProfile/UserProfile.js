import {logoff} from "@/api/auth";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useUserData} from "@/hooks/useUserData";
import {useRouter} from "next/navigation";

const UserProfile = () => {
  const router = useRouter();
    const {data: userProfile = []} = useUserData();

    const onLogoff = async () => {
        const result = await logoff();
        if (result.success) {
            router.push(result.redirectUrl);
        }
    };

    const roleName = userProfile?.user?.role?.name;
    const username = userProfile?.user?.username;
    const email = userProfile?.user?.email;

  return (
      <Card>
          <CardHeader>
              <CardTitle className="text-center">{roleName}</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="mb-4">
                  <p>{username}</p>
                  <p>{email}</p>
              </div>
              <Button variant="destructive" onClick={onLogoff}
                      className="w-full">
                  Logoff
              </Button>
          </CardContent>
      </Card>
  );
};

export default UserProfile;
