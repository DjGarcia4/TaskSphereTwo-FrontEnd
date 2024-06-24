import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/hooks/useAuth";

const ProfileView = () => {
  const { data, isLoading } = useAuth();

  if (isLoading) "Cargando...";
  if (data) return <ProfileForm data={data} />;
};

export default ProfileView;
