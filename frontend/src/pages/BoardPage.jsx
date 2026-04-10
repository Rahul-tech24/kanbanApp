import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useBoard } from "../hooks/useBoard";

import { DndContext, DragOverlay } from "@dnd-kit/core";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveCard } from "../api/card";

import ListColumn from "../components/ListColumn";
import AddList from "../components/AddList";

const sortCardsByOrder = (a, b) => a.order - b.order;

const reorderCardsForPreview = (
  cards,
  activeCard,
  destinationListId,
  destinationIndex
) => {
  const otherCards = cards.filter(card => card._id !== activeCard._id);
  const destinationCards = otherCards
    .filter(card => card.listId === destinationListId)
    .sort(sortCardsByOrder);

  const safeIndex = Math.max(
    0,
    Math.min(destinationIndex, destinationCards.length)
  );

  destinationCards.splice(safeIndex, 0, {
    ...activeCard,
    listId: destinationListId
  });

  const previewDestinationCards = destinationCards.map((card, index) => ({
    ...card,
    order: index
  }));

  return [
    ...otherCards.filter(card => card.listId !== destinationListId),
    ...previewDestinationCards
  ];
};

export default function BoardPage() {

  const { boardId } = useParams();

  const queryClient = useQueryClient();
  const boardQueryKey = ["board", boardId];
  const [draggingCard, setDraggingCard] = useState(null);

  const { data, isLoading, isError, error } = useBoard(boardId);

  const moveCardMutation = useMutation({
    mutationFn: moveCard,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: boardQueryKey });

      const previousBoard = queryClient.getQueryData(boardQueryKey);

      queryClient.setQueryData(boardQueryKey, (oldBoard) => {
        if (!oldBoard || !variables.activeCard) return oldBoard;

        return {
          ...oldBoard,
          cards: reorderCardsForPreview(
            oldBoard.cards || [],
            variables.activeCard,
            variables.data.destinationListId,
            variables.data.destinationIndex
          )
        };
      });

      return { previousBoard };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(boardQueryKey, context.previousBoard);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardQueryKey });
    }
  });

  const handleDragStart = (event) => {
    const cards = data?.cards || [];
    const activeCard = cards.find(card => card._id === event.active.id);

    setDraggingCard(activeCard || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setDraggingCard(null);

    if (!over) return;
    if (active.id === over.id) return;

    const cards = data?.cards || [];

    const activeCard = cards.find(
      card => card._id === active.id
    );

    if (!activeCard) return;

    const overData = over.data.current;
    let destinationListId;
    let destinationIndex;
    let destinationCardId = null;

    if (overData?.type === "list") {
      destinationListId = overData.listId;
      destinationIndex = cards
        .filter(card => card.listId === destinationListId)
        .filter(card => card._id !== activeCard._id)
        .length;
    }

    if (overData?.type === "card") {
      const overCard = overData.card;
      const destinationCards = cards
        .filter(card => card.listId === overCard.listId)
        .sort(sortCardsByOrder);

      destinationListId = overCard.listId;
      destinationIndex = destinationCards.findIndex(
        card => card._id === overCard._id
      );
      destinationCardId = overCard._id;
    }

    if (!destinationListId || destinationIndex < 0) return;

    moveCardMutation.mutate({
      cardId: activeCard._id,
      activeCard,
      data: {
        sourceListId: activeCard.listId,
        destinationListId,
        destinationIndex,
        destinationCardId
      }
    });
  };

  const handleDragCancel = () => {
    setDraggingCard(null);
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

      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >

        <div className="board">

          {sortedLists.length === 0 && (
            <div className="empty-board">
              No lists yet. Create your first list to start planning.
            </div>
          )}

          {sortedLists.map((list) => {

            const listCards = cards
              .filter(card => card.listId === list._id)
              .sort(sortCardsByOrder);

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

        <DragOverlay>
          {draggingCard ? (
            <article className="card drag-overlay-card">
              <span className="drag-handle">Drag</span>
              <strong>{draggingCard.title}</strong>
            </article>
          ) : null}
        </DragOverlay>

      </DndContext>

    </main>
  );

}
