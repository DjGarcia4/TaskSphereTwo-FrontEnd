import { Outlet, Link } from "react-router-dom";
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";

const AppLayout = () => {
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
          <NavMenu />
        </div>
      </header>
      <section className=" max-w-screen-xl mx-auto mt-10 p-5">
        <Outlet />
      </section>
    </>
  );
};

export default AppLayout;
