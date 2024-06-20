import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types";
import { useQueryClient } from "@tanstack/react-query";

type NavMenuProps = {
  name: User["name"];
};

export default function NavMenu({ name }: NavMenuProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logOut = () => {
    queryClient.removeQueries({ queryKey: ["user"] });
    localStorage.removeItem("AUTH_TS");
    navigate("/auth/login");
  };
  return (
    <div className=" flex justify-center items-center gap-5">
      <Link
        to="/"
        className=" p-2 hover:text-pink-600 text-gray-600 hidden md:block"
      >
        Mis Proyectos
      </Link>
      <Popover className="relative">
        <Popover.Button className="bg-pink-600 hover:bg-pink-700 p-2 text-white text-1xl cursor-pointer transition-colors rounded-lg flex justify-center items-center">
          <p className=" text-white px-2">{name}</p>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute left-24 z-10 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">
            <div className="w-full lg:w-56 shrink rounded-xl bg-white p-4 text-sm  leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
              <Link
                to="/profile"
                className=" p-2 hover:text-pink-600 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                Mi Perfil
              </Link>
              <Link to="/" className="block p-2 md:hidden hover:text-pink-600 ">
                Mis Proyectos
              </Link>
              <button
                className=" p-2 hover:text-pink-600 flex items-center gap-2"
                type="button"
                onClick={logOut}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  );
}
