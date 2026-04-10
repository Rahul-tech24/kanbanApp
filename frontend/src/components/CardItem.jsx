import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCard, updateCard } from "../api/card";


export default function CardItem({ card, boardId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");

  const queryClient = useQueryClient();
  const boardQueryKey = ["board", boardId];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: card._id,
    disabled: isEditing
  });

  const updateCardMutation = useMutation({
    mutationFn: updateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKey });
      setIsEditing(false);
    }
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKey });
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const startEditing = () => {
    setTitle(card.title);
    setDescription(card.description || "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setTitle(card.title);
    setDescription(card.description || "");
    setIsEditing(false);
  };

  const handleUpdateCard = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    updateCardMutation.mutate({
      cardId: card._id,
      data: {
        title: trimmedTitle,
        description
      }
    });
  };

  const handleDeleteCard = () => {
    const shouldDelete = window.confirm(`Delete "${card.title}"?`);

    if (!shouldDelete) return;

    deleteCardMutation.mutate(card._id);
  };

  return (

    <div
      ref={setNodeRef}
      style={style}
      className={`card ${isEditing ? "is-editing" : ""}`}
    >
      {isEditing ? (
        <form className="card-edit-form" onSubmit={handleUpdateCard}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="Card title"
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add a description..."
            aria-label="Card description"
          />

          <div className="inline-actions">
            <button type="submit" disabled={updateCardMutation.isPending}>
              {updateCardMutation.isPending ? "Saving..." : "Save"}
            </button>

            <button className="ghost-button" type="button" onClick={cancelEditing}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="card-topline">
            <button
              className="drag-handle"
              type="button"
              aria-label={`Drag ${card.title}`}
              {...attributes}
              {...listeners}
            >
              Drag
            </button>

            <strong>{card.title}</strong>
          </div>

          {card.description && (
            <p className="card-description">{card.description}</p>
          )}

          <div className="card-actions">
            <button className="ghost-button" type="button" onClick={startEditing}>
              Edit
            </button>

            <button
              className="danger-button"
              type="button"
              onClick={handleDeleteCard}
              disabled={deleteCardMutation.isPending}
            >
              {deleteCardMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>

  );
}
