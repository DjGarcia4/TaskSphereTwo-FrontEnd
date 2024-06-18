import { Outlet, Link, Navigate } from "react-router-dom";
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import { useAuth } from "@/hooks/useAuth";

const AppLayout = () => {
  const { data, isError, isLoading } = useAuth();
  if (isLoading) return "Cargando...";
  if (isError) {
    return <Navigate to="/auth/login" />;
  }

  if (data)
    return (
      <>
        <header className=" bg-white py-2">
          <div className=" max-w-screen-xl mx-10 md:mx-auto flex flex-row justify-between items-center">
            <Link to="/" className="w-12 flex items-center">
              <Logo />
              <p className="flex text-2xl">
                Task <span className=" text-pink-600">Sphere</span>
              </p>
            </Link>
            <NavMenu name={data.name} />
          </div>
        </header>
        <section className=" max-w-screen-2xl   mx-auto mt-10 p-5">
          <Outlet />
        </section>
      </>
    );
};

export default AppLayout;
