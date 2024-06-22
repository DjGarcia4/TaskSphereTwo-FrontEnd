import { deleteNote } from "@/api/NoteAPI";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatDate } from "@/util/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";

type NoteDetailProps = {
  note: Note;
};

const NoteDetail = ({ note }: NoteDetailProps) => {
  const { data } = useAuth();
  const canDelete = useMemo(
    () => data?._id === note.createdBy._id,
    [data?._id, note.createdBy._id]
  );
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const projectId = params.projectId!;
  const taskId = queryParams.get("viewTask")!;
  const queryCliente = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteNote,
  });
  const handleDeleteNote = async () => {
    const data = {
      projectId,
      taskId,
      noteId: note._id,
    };

    const myPromise = mutation.mutateAsync(data);

    toast.promise(myPromise, {
      loading: "Elimnando Nota...",
      success: "Nota eliminada correctamente!",
      error: (err) => {
        const errorMessage = err.message || "Error sin especificar";
        return errorMessage;
      },
    });
    await myPromise;
    queryCliente.invalidateQueries({ queryKey: ["task", taskId] });
    queryCliente.invalidateQueries({ queryKey: ["project", projectId] });
  };

  return (
    <div className=" p-3 flex justify-between items-center">
      <div className="w-full flex justify-between items-center">
        <div>
          <p className="text-gray-700">{note.content}</p>

          <p className="text-gray-400 text-sm">
            {" "}
            <span className=" text-pink-600">{note.createdBy.name}</span> -{" "}
            {formatDate(note.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canDelete && (
            <button
              className="  p-1   cursor-pointer  rounded-lg flex justify-center items-center gap-2"
              onClick={handleDeleteNote}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 hover:text-red-500 text-gray-500 transition-colors"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
