import { Link, useParams } from "react-router-dom";
import { useBoard } from "../hooks/useBoard";

import { DndContext } from "@dnd-kit/core";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveCard } from "../api/card";

import ListColumn from "../components/ListColumn";
import AddList from "../components/AddList";

export default function BoardPage() {

  const { boardId } = useParams();

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useBoard(boardId);

  const moveCardMutation = useMutation({
    mutationFn: moveCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    }
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const cards = data?.cards || [];

    const oldIndex = cards.findIndex(
      card => card._id === active.id
    );

    const newIndex = cards.findIndex(
      card => card._id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const activeCard = cards[oldIndex];
    const overCard = cards[newIndex];

    moveCardMutation.mutate({
      cardId: activeCard._id,
      data: {
        sourceListId: activeCard.listId,
        destinationListId: overCard.listId,
        destinationIndex: newIndex
      }
    });
  };

  if (isLoading) {
    return <div className="page-state">Loading board...</div>;
  }

  if (isError) {
    return (
      <div className="page-state error-state">
        {error?.response?.data?.message || "Could not load this board."}
      </div>
    );
  }

  if (!data) {
    return <div className="page-state">No board data found.</div>;
  }

  const { board } = data;
  const lists = data.lists || [];
  const cards = data.cards || [];

  const sortedLists = [...lists].sort((a, b) => a.order - b.order);

  return (
    <main className="board-page">
      <Link className="back-link" to="/">
        Back to boards
      </Link>

      <h1>{board.title}</h1>

      <DndContext onDragEnd={handleDragEnd}>

        <div className="board">

          {sortedLists.length === 0 && (
            <div className="empty-board">
              No lists yet. Create your first list to start planning.
            </div>
          )}

          {sortedLists.map((list) => {

            const listCards = cards
              .filter(card => card.listId === list._id)
              .sort((a, b) => a.order - b.order);

            return (
              <ListColumn
                key={list._id}
                list={list}
                cards={listCards}
                boardId={boardId}
              />
            );

          })}

          <AddList boardId={boardId} />

        </div>

      </DndContext>

    </main>
  );

}
