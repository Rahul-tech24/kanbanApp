import { useNavigate } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


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
    </article>

  );
}
