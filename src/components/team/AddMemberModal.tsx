import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddMemberModal() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const addMember = queryParams.get("addMember");
  const show = addMember ? true : false;

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => navigate(location.pathname, { replace: true })}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-8">
                  <Dialog.Title as="h3" className="text-3xl md:text-4xl">
                    Agregar Integrante al equipo
                  </Dialog.Title>
                  <p className="text-xl md:text-1xl text-gray-500">
                    Busca el nuevo integrante por email {""}
                    <span className="text-pink-600">
                      para agregarlo al proyecto
                    </span>
                  </p>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
