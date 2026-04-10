import CardItem from "./CardItem";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard } from "../api/card";
import { deleteList, updateList } from "../api/list";

export default function ListColumn({ list, cards, boardId }) {

  const cardIds = cards.map(card => card._id);
  const { setNodeRef, isOver } = useDroppable({
    id: list._id,
    data: {
      type: "list",
      listId: list._id
    }
  });

  const [title, setTitle] = useState("");
  const [isEditingList, setIsEditingList] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);

  const queryClient = useQueryClient();
  const boardQueryKey = ["board", boardId];

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKey });
    }
  });

  const updateListMutation = useMutation({
    mutationFn: updateList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKey });
      setIsEditingList(false);
    }
  });

  const deleteListMutation = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKey });
    }
  });

  const handleCreateCard = () => {

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    createCardMutation.mutate({
      listId: list._id,
      title: trimmedTitle
    }, {
      onSuccess: () => setTitle("")
    });
  };

  const startEditingList = () => {
    setListTitle(list.title);
    setIsEditingList(true);
  };

  const cancelEditingList = () => {
    setListTitle(list.title);
    setIsEditingList(false);
  };

  const handleUpdateList = (event) => {
    event.preventDefault();

    const trimmedTitle = listTitle.trim();
    if (!trimmedTitle) return;

    updateListMutation.mutate({
      listId: list._id,
      data: { title: trimmedTitle }
    });
  };

  const handleDeleteList = () => {
    const shouldDelete = window.confirm(
      `Delete "${list.title}" and all cards inside it?`
    );

    if (!shouldDelete) return;

    deleteListMutation.mutate(list._id);
  };

  return (

    <div className="list-column">

      <div className="list-header">
        {isEditingList ? (
          <form className="list-title-form" onSubmit={handleUpdateList}>
            <input
              value={listTitle}
              onChange={(event) => setListTitle(event.target.value)}
              aria-label="List title"
            />

            <div className="inline-actions">
              <button type="submit" disabled={updateListMutation.isPending}>
                {updateListMutation.isPending ? "Saving..." : "Save"}
              </button>

              <button
                className="ghost-button"
                type="button"
                onClick={cancelEditingList}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h3>{list.title}</h3>

            <div className="list-actions">
              <button
                className="ghost-button"
                type="button"
                onClick={startEditingList}
              >
                Edit
              </button>

              <button
                className="danger-button"
                type="button"
                onClick={handleDeleteList}
                disabled={deleteListMutation.isPending}
              >
                {deleteListMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        )}
      </div>

      <SortableContext items={cardIds}>

        <div
          className={`card-list ${isOver ? "is-over" : ""}`}
          ref={setNodeRef}
        >

          {cards.length === 0 && (
            <p className="empty-state">No cards yet. Add the first task.</p>
          )}

          {cards.map((card) => (
            <CardItem key={card._id} card={card} boardId={boardId} />
          ))}

        </div>

      </SortableContext>

      <div className="add-card">

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a card..."
        />

        <button onClick={handleCreateCard}>
          {createCardMutation.isPending ? "Adding..." : "Add"}
        </button>

      </div>

    </div>

  );

}
