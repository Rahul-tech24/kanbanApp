import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoard } from "../api/board";
import { useBoards } from "../hooks/useBoards";

export default function HomePage() {
  const [title, setTitle] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: boards = [], isLoading, isError, error } = useBoards();

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: (board) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      navigate(`/boards/${board._id}`);
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    createBoardMutation.mutate({ title: trimmedTitle });
  };

  return (
    <main className="home-page">
      <section className="hero-panel">
        <p className="eyebrow">Kanban workspace</p>
        <h1>Plan work one board at a time.</h1>
        <p className="hero-copy">
          Create a board, split work into lists, and move cards as your tasks
          progress.
        </p>

        <form className="create-board-form" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: Product launch"
            aria-label="Board title"
          />

          <button type="submit" disabled={createBoardMutation.isPending}>
            {createBoardMutation.isPending ? "Creating..." : "Create board"}
          </button>
        </form>

        {createBoardMutation.isError && (
          <p className="form-error">
            {createBoardMutation.error?.response?.data?.message ||
              "Could not create board."}
          </p>
        )}
      </section>

      <section className="boards-section">
        <div className="section-heading">
          <p className="eyebrow">Your boards</p>
          <h2>Open a board</h2>
        </div>

        {isLoading && <div className="page-state">Loading boards...</div>}

        {isError && (
          <div className="page-state error-state">
            {error?.response?.data?.message || "Could not load boards."}
          </div>
        )}

        {!isLoading && !isError && boards.length === 0 && (
          <div className="empty-home-state">
            No boards yet. Create your first board above.
          </div>
        )}

        {!isLoading && !isError && boards.length > 0 && (
          <div className="boards-grid">
            {boards.map((board) => (
              <Link
                className="board-card"
                key={board._id}
                to={`/boards/${board._id}`}
              >
                <span>{board.title}</span>
                <small>
                  Created{" "}
                  {board.createdAt
                    ? new Date(board.createdAt).toLocaleDateString()
                    : "recently"}
                </small>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
