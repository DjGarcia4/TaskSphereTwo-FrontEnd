import { motion } from "framer-motion";
import { Task } from "@/types/index";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";

type NotesPanelProps = {
  notes: Task["notes"];
};

const listVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const NotesPanel = ({ notes }: NotesPanelProps) => {
  // Ordenar notas de la más nueva a la más vieja
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow p-5">
      <AddNoteForm />
      <p className="mt-5">Notas:</p>
      <motion.div
        className="divide-y divide-gray-100 mt-2 h-auto max-h-[200px] md:max-h-[250px] overflow-scroll"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedNotes.length ? (
          <>
            {sortedNotes.map((note, index) => (
              <motion.div key={note._id} variants={itemVariants} custom={index}>
                <NoteDetail note={note} />
              </motion.div>
            ))}
          </>
        ) : (
          <p className="text-gray-500 text-center py-3">No hay notas aún</p>
        )}
      </motion.div>
    </div>
  );
};

export default NotesPanel;
