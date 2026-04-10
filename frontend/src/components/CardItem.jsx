import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


export default function CardItem({ card }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: card._id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (

    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card"
    >
      {card.title}
    </div>

  );
}