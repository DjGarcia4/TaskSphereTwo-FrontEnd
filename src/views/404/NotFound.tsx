import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <h1 className=" text-center text-4xl ">Página no encontrada</h1>
      <p className="mt-10 text-center ">
        Tal vez quieras volver a{" "}
        <Link to={"/"} className=" text-pink-600">
          Proyectos
        </Link>
      </p>
    </>
  );
};

export default NotFound;
