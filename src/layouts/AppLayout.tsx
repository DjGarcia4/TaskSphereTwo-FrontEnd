import { Outlet, Link, Navigate } from "react-router-dom";
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const AppLayout = () => {
  const { data, isError, isLoading } = useAuth();
  if (isLoading) return "Cargando...";
  if (isError) {
    return <Navigate to="/auth/login" />;
  }

  if (data)
    return (
      <>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
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
        </motion.div>
        <section className=" max-w-screen-2xl md:mx-auto mt-5 p-5">
          <Outlet />
        </section>
      </>
    );
};

export default AppLayout;
