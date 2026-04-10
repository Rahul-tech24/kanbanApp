import CardItem from "./CardItem";
import { SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard } from "../api/card";

export default function ListColumn({ list, cards }) {

  const cardIds = cards.map(card => card._id);

  const [title, setTitle] = useState("");

  const queryClient = useQueryClient();

  const createCardMutation = useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries(["board"]);
    }
  });

  const handleCreateCard = () => {

    if (!title.trim()) return;

    createCardMutation.mutate({
      listId: list._id,
      title
    });

    setTitle("");
  };

  return (

    <div className="list-column">

      <h3>{list.title}</h3>

      <SortableContext items={cardIds}>

        <div className="card-list">

          {cards.map((card) => (
            <CardItem key={card._id} card={card} />
          ))}

        </div>

      </SortableContext>

      <div className="add-card">

        <input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="Add a card..."
        />

        <button onClick={handleCreateCard}>
          Add
        </button>

      </div>

    </div>

  );

}