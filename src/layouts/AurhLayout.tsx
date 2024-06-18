import Logo from "@/components/Logo";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
const AurhLayout = () => {
  return (
    <>
      <div>
        <div className=" py-5 mx-auto w-[450px] flex flex-col">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-28 md:w-32 flex items-center">
              <Logo />
              <p className="flex text-6xl">
                Task <span className=" text-pink-600">Sphere</span>
              </p>
            </div>
          </motion.div>
          <div className="mt-2">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AurhLayout;
