import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createList } from "../api/list";

export default function AddList({ boardId }) {

  const [title, setTitle] = useState("");

  const queryClient = useQueryClient();

  const createListMutation = useMutation({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    }
  });

  const handleCreateList = () => {

    if (!title.trim()) return;

    createListMutation.mutate({
      boardId,
      title
    });

    setTitle("");
  };

  return (

    <div className="add-list">

      <input
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        placeholder="Add a list..."
      />

      <button onClick={handleCreateList}>
        {createListMutation.isPending ? "Adding..." : "Add List"}
      </button>

    </div>

  );

}
