import Logo from "@/components/Logo";
import { Outlet } from "react-router-dom";
const AurhLayout = () => {
  return (
    <>
      <div>
        <div className=" py-5 mx-auto w-[450px] flex flex-col">
          <div className="w-28 md:w-32 flex items-center">
            <Logo />
            <p className="flex text-6xl">
              Task <span className=" text-pink-600">Sphere</span>
            </p>
          </div>
          <div className="mt-2">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AurhLayout;
