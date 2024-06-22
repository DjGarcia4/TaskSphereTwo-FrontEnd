import { Task } from "@/types/index";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";

type NotesPanelProps = {
  notes: Task["notes"];
};
const NotesPanel = ({ notes }: NotesPanelProps) => {
  return (
    <div className=" bg-white rounded-lg shadow p-5">
      <AddNoteForm />
      <p className="mt-5">Notas:</p>
      <div className="divide-y divide-gray-100 mt-2 h-auto max-h-[200px] md:max-h-[250px] overflow-scroll">
        {notes.length ? (
          <>
            {notes.map((note) => (
              <NoteDetail key={note._id} note={note} />
            ))}
          </>
        ) : (
          <p className=" text-gray-500 text-center py-3">No hay notas aún</p>
        )}
      </div>
    </div>
  );
};

export default NotesPanel;
