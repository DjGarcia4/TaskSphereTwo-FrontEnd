import { useDroppable } from "@dnd-kit/core";

type DropTaskProps = {
  status: string;
};

const DropTask = ({ status }: DropTaskProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const style = { opacity: isOver ? 0.4 : undefined };
  return (
    <div
      style={style}
      ref={setNodeRef}
      className=" text-xs uppercase p-2 border border-dashed border-gray-400 mt-5 grid  place-content-center text-gray-400 rounded-lg"
    >
      Soltar tarea aqui
    </div>
  );
};

export default DropTask;
