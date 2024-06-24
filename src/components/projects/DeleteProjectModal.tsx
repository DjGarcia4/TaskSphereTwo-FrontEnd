import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { CheckPasswordForm } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkPassword } from "@/api/AuthAPI";
import toast from "react-hot-toast";
import { deleteProject } from "@/api/ProjectAPI";

export default function DeleteProjectModal() {
  const initialValues: CheckPasswordForm = {
    password: "",
  };
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const deleteProjectId = queryParams.get("deleteProject")!;
  const show = deleteProjectId ? true : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });
  const queryClient = useQueryClient();

  const checkPasswordMutation = useMutation({
    mutationFn: checkPassword,
  });
  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
  });

  const handleForm = async (formData: CheckPasswordForm) => {
    const checkPasswordPromise = checkPasswordMutation.mutateAsync(formData);
    toast.promise(checkPasswordPromise, {
      loading: "Comprobando Contraseña...",
      success: "Contraseña Correcta!",
      error: (err) => {
        const errorMessage = err.message || "Error sin especificar";
        return errorMessage;
      },
    });
    await checkPasswordPromise;

    const deleteProjectPromise =
      deleteProjectMutation.mutateAsync(deleteProjectId);
    toast.promise(deleteProjectPromise, {
      loading: "Eliminando Proyecto...",
      success: "Proyecto Eliminado correctamente!",
      error: "Error al eliminar el proyecto",
    });
    await deleteProjectPromise;
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    navigate(location.pathname, { replace: true });
  };

  return (
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
                <Dialog.Title as="h3" className=" text-4xl  my-5">
                  Eliminar Proyecto{" "}
                </Dialog.Title>

                <p className="text-xl ">
                  Confirma la eliminación del proyecto {""}
                  <span className="text-pink-600">colocando tu contrasña</span>
                </p>

                <form
                  className="mt-10 space-y-5"
                  onSubmit={handleSubmit(handleForm)}
                  noValidate
                >
                  <div className="flex flex-col gap-3">
                    <label className="font-normal text-2xl" htmlFor="password">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Contraseña Inicio de Sesión"
                      className="w-full p-3  border-gray-300 border rounded-lg"
                      {...register("password", {
                        required: "El password es obligatorio",
                      })}
                    />
                    {errors.password && (
                      <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                  </div>

                  <input
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl  cursor-pointer transition-colors rounded-lg w-full"
                    value="Eliminar Proyecto"
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
