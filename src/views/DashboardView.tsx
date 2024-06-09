import { deleteProject, getProjects } from "@/api/ProjectAPI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

import { Menu, Transition } from "@headlessui/react";
import { Project } from "../types";
import toast from "react-hot-toast";

const DashboardView = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteProject,
  });

  const handleDelete = async (id: Project["_id"]) => {
    const myPromise = mutation.mutateAsync(id);

    toast.promise(myPromise, {
      loading: "Eliminando Proyecto...",
      success: "Proyecto Eliminado correctamente!",
      error: "Error al eliminar el proyecto",
    });
    await myPromise;
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  if (isLoading) return "Cargando...";
  if (data)
    return (
      <>
        <div className="flex flex-col md:flex-row  justify-between">
          <div>
            <h1 className=" text-4xl md:text-5xl ">Mis Proyectos</h1>
            <p className="  text-1xl md:text-2xl font-light text-gray-500 mt-5">
              Maneja y administra tus proyectos.
            </p>
          </div>
          <nav className=" my-5">
            <Link
              to="/projects/create"
              className=" bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-1xl cursor-pointer transition-colors rounded-lg"
            >
              Nuevo Proyecto
            </Link>
          </nav>
        </div>
        {data.length ? (
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-5 ">
            {data.map((project) => (
              <div
                className=" bg-white p-5 rounded-lg shadow relative"
                key={project._id}
              >
                {/* <div className=" bg-white px-5 pt-5 pb-12 rounded-lg shadow relative"> */}
                <div className="flex shrink-0 items-center gap-x-6 absolute right-0">
                  <Menu as="div" className="relative flex-none">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon
                        className="h-9 w-9"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                          <Link
                            to={`/projects/${project._id}/edit`}
                            className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-100 transition-colors"
                          >
                            Editar Proyecto
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            type="button"
                            className="block px-3 py-1 text-sm leading-6 text-red-500 hover:bg-gray-100 transition-colors w-full text-left"
                            onClick={() => {
                              handleDelete(project._id);
                            }}
                          >
                            Eliminar Proyecto
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className=" my-2">
                  <Link
                    to={`/projects/${project._id}`}
                    className=" text-2xl hover:text-pink-600 transition-colors"
                  >
                    {project.projectName}
                  </Link>
                  <h1 className=" text-1xl">{project.clientName}</h1>
                  <p className=" text-gray-400">{project.description}</p>
                </div>
                <div className=" w-full flex justify-end">
                  <Link
                    to={`/projects/${project._id}`}
                    className="bg-emerald-500 hover:bg-emerald-600 px-2 py-1 text-white cursor-pointer transition-colors rounded-lg text-sm"
                  >
                    Ver Proyecto
                  </Link>
                </div>
                {/* <div className=" text-right absolute left-0 bottom-0 w-full">
                  <p className=" text-white bg-rose-400 rounded-b-lg p-1 text-sm">
                    Colaborador
                  </p>
                </div> */}
              </div>
            ))}
          </div>
        ) : (
          <p className=" text-center py-20">
            No hay proyectos aún{" "}
            <Link to="/projects/create" className=" text-pink-600 font-bold">
              Crea un Proyecto
            </Link>
          </p>
        )}
      </>
    );
};

export default DashboardView;
