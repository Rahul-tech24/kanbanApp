import { useParams } from "react-router-dom";
import { useBoard } from "../hooks/useBoard";
import ListColumn from "../components/ListColumn";

export default function BoardPage() {

  const { boardId } = useParams();

  const { data, isLoading } = useBoard(boardId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { board, lists, cards } = data;

  const sortedLists = [...lists].sort((a,b)=>a.order-b.order);

  return (
    <div>

      <h1>{board.title}</h1>

      <div className="board">

        {sortedLists.map((list) => {

          const listCards = cards
            .filter(card => card.listId === list._id)
            .sort((a,b)=>a.order-b.order);

          return (
            <ListColumn
              key={list._id}
              list={list}
              cards={listCards}
            />
          );
        })}

      </div>

    </div>
  );
}