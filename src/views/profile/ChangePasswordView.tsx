import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { UpdateCurrentPasswordForm } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword } from "@/api/ProfileAPI";
import toast from "react-hot-toast";

export default function ChangePasswordView() {
  const initialValues: UpdateCurrentPasswordForm = {
    current_password: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });
  const queryClient = useQueryClient();

  const password = watch("password");

  const mutation = useMutation({
    mutationFn: changePassword,
  });

  const handleChangePassword = async (formData: UpdateCurrentPasswordForm) => {
    const myPromise = mutation.mutateAsync(formData);

    toast.promise(myPromise, {
      loading: "Modificando Contraseña...",
      success: "Contraseña modificada correctamente!",
      error: (err) => {
        const errorMessage = err.message || "Error sin especificar";
        return errorMessage;
      },
    });
    await myPromise;
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl  ">Cambiar Contraseña</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Utiliza este formulario para cambiar tu contraseña
        </p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className=" mt-14 space-y-5 bg-white shadow p-10 rounded-lg"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase " htmlFor="current_password">
              Contraseña Actual
            </label>
            <input
              id="current_password"
              type="password"
              placeholder="Contraseña Actual"
              className="w-full p-3  border border-gray-200 rounded-lg"
              {...register("current_password", {
                required: "La contraseña actual es obligatoria",
              })}
            />
            {errors.current_password && (
              <ErrorMessage>{errors.current_password.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase " htmlFor="password">
              Nueva contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Nueva contraseña"
              className="w-full p-3  border border-gray-200 rounded-lg"
              {...register("password", {
                required: "La Nueva Contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe ser mínimo de 8 caracteres",
                },
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>
          <div className="mb-5 space-y-3">
            <label
              htmlFor="password_confirmation"
              className="text-sm uppercase "
            >
              Repetir Contraseña
            </label>

            <input
              id="password_confirmation"
              type="password"
              placeholder="Repetir Contraseña"
              className="w-full p-3  border border-gray-200 rounded-lg"
              {...register("password_confirmation", {
                required: "Este campo es obligatorio",
                validate: (value) =>
                  value === password || "Las contraseñas no son iguales",
              })}
            />
            {errors.password_confirmation && (
              <ErrorMessage>
                {errors.password_confirmation.message}
              </ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value="Cambiar Contraseña"
            className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl  cursor-pointer transition-colors rounded-lg w-full"
          />
        </form>
      </div>
    </>
  );
}
