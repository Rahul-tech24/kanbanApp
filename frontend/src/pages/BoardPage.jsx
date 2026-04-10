import { useParams } from "react-router-dom";
import { useBoard } from "../hooks/useBoard";
import { useState, useEffect } from "react";

import { DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { useMutation } from "@tanstack/react-query";
import { moveCard } from "../api/card";

import ListColumn from "../components/ListColumn";
import AddList from "../components/AddList";

export default function BoardPage() {

  const { boardId } = useParams();

  const { data, isLoading } = useBoard(boardId);

  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (data) {
      setLists(data.lists);
      setCards(data.cards);
    }
  }, [data]);
    
    const moveCardMutation = useMutation({
  mutationFn: moveCard
});

  const handleDragEnd = (event) => {

  const { active, over } = event;

  if (!over) return;
  if (active.id === over.id) return;

  const oldIndex = cards.findIndex(
    card => card._id === active.id
  );

  const newIndex = cards.findIndex(
    card => card._id === over.id
  );

  const activeCard = cards[oldIndex];
  const overCard = cards[newIndex];

  let updatedCards;

  // same list reorder
  if (activeCard.listId === overCard.listId) {

    updatedCards = arrayMove(cards, oldIndex, newIndex);

  } else {

    const copy = [...cards];

    copy[oldIndex] = {
      ...activeCard,
      listId: overCard.listId
    };

    updatedCards = arrayMove(copy, oldIndex, newIndex);

  }

  // optimistic update
  setCards(updatedCards);

  // backend mutation
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
    return <div>Loading...</div>;
  }

  const { board } = data;

  const sortedLists = [...lists].sort((a, b) => a.order - b.order);

  return (
    <div>

      <h1>{board.title}</h1>

      <DndContext onDragEnd={handleDragEnd}>

        <div className="board">

          {sortedLists.map((list) => {

            const listCards = cards
              .filter(card => card.listId === list._id)
              .sort((a, b) => a.order - b.order);

            return (
              <ListColumn
                key={list._id}
                list={list}
                cards={listCards}
              />
            );

          })}
                  <AddList boardId={boardId} />

        </div>

      </DndContext>

    </div>
  );

}