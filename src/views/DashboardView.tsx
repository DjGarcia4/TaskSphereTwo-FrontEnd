import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const DashboardView = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className=" text-5xl ">Mis Proyectos</h1>
        <p className=" text-2xl font-light text-gray-500 mt-5">
          Maneja y administra tus proyectos.
        </p>
      </div>
      <nav className=" my-5">
        <Link
          to="/projects/create"
          className=" bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl  cursor-pointer transition-colors rounded-lg"
        >
          Nuevo Proyecto
        </Link>
      </nav>
    </div>
  );
};

export default DashboardView;
