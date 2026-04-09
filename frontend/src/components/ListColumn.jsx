import CardItem from "./CardItem";

export default function ListColumn({ list, cards }) {

  return (

    <div className="list-column">

      <h3>{list.title}</h3>

      <div className="card-list">

        {cards.map((card) => (
          <CardItem key={card._id} card={card} />
        ))}

      </div>

    </div>

  );

}