import { useNavigate } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil } from "lucide-react";


export default function CardItem({ card, boardId }) {
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transform,
    transition
  } = useSortable({
    id: card._id,
    data: {
      type: "card",
      card
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const openCardDetail = () => {
    navigate(`/boards/${boardId}/cards/${card._id}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCardDetail();
    }
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    openCardDetail();
  };

  return (

    <article
      ref={setNodeRef}
      style={style}
      className={`card ${isDragging ? "is-dragging" : ""}`}
      role="button"
      tabIndex={0}
      onClick={openCardDetail}
      onKeyDown={handleKeyDown}
    >
      <button
        className="drag-handle"
        type="button"
        aria-label={`Drag ${card.title}`}
        {...attributes}
        {...listeners}
        onClick={(event) => event.stopPropagation()}
      >
        Drag
      </button>

      <strong>{card.title}</strong>

      <button
        className="card-edit-icon"
        type="button"
        aria-label={`Open ${card.title} details`}
        onClick={handleEditClick}
      >
        <Pencil aria-hidden="true" size={14} />
      </button>
    </article>

  );
}
