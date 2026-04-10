import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCard, updateCard } from "../api/card";
import { useCard } from "../hooks/useCard";

function CardDetailForm({ card, boardId }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateCardMutation = useMutation({
    mutationFn: updateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", card._id] });
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    }
  });

  const deleteCardMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
      navigate(`/boards/${boardId}`);
    }
  });

  const handleSave = (event) => {
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

  const handleDelete = () => {
    const shouldDelete = window.confirm(`Delete "${card.title}"?`);

    if (!shouldDelete) return;

    deleteCardMutation.mutate(card._id);
  };

  return (
    <form className="card-detail-form" onSubmit={handleSave}>
      <label htmlFor="card-title">Title</label>
      <input
        id="card-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="card-description">Description</label>
      <textarea
        id="card-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Add notes, acceptance criteria, or next steps..."
      />

      {updateCardMutation.isError && (
        <p className="form-error">
          {updateCardMutation.error?.response?.data?.message ||
            "Could not save card."}
        </p>
      )}

      {deleteCardMutation.isError && (
        <p className="form-error">
          {deleteCardMutation.error?.response?.data?.message ||
            "Could not delete card."}
        </p>
      )}

      <div className="card-detail-actions">
        <button type="submit" disabled={updateCardMutation.isPending}>
          {updateCardMutation.isPending ? "Saving..." : "Save changes"}
        </button>

        <button
          className="danger-button"
          type="button"
          onClick={handleDelete}
          disabled={deleteCardMutation.isPending}
        >
          {deleteCardMutation.isPending ? "Deleting..." : "Delete card"}
        </button>
      </div>
    </form>
  );
}

export default function CardDetailPage() {
  const { boardId, cardId } = useParams();
  const { data: card, isLoading, isError, error } = useCard(cardId);

  if (isLoading) {
    return <div className="page-state">Loading card...</div>;
  }

  if (isError) {
    return (
      <div className="page-state error-state">
        {error?.response?.data?.message || "Could not load this card."}
      </div>
    );
  }

  if (!card) {
    return <div className="page-state">No card found.</div>;
  }

  return (
    <main className="card-detail-page">
      <Link className="back-link" to={`/boards/${boardId}`}>
        Back to board
      </Link>

      <section className="card-detail-panel">
        <p className="eyebrow">Card details</p>
        <h1>{card.title}</h1>

        <CardDetailForm key={card._id} card={card} boardId={boardId} />
      </section>
    </main>
  );
}
