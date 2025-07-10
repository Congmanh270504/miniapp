import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="h-full flex flex-col items-center justify-center">
    <UserProfile />
  </div>
);

export default UserProfilePage;
