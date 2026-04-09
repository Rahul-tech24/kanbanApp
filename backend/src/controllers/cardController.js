import Card from "../models/Card.js";

export const createCard = async (req, res) => {

    try {
        const { title, description, listId } = req.body;

        const lastCard = await Card.findOne({ listId }).sort({ order: -1 });

        const newOrder = lastCard ? lastCard.order + 1 : 0;

        const card = await Card.create({ listId, title, description, order: newOrder });

        res.status(201).json(card);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(card);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    res.json(card);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const moveCard = async (req, res) => {
  try {
      const { id } = req.params;
      
      const {
  sourceListId,
  destinationListId,
  destinationIndex
      } = req.body;
      
      const destinationCards = await Card.find({
  listId: destinationListId
      }).sort({ order: 1 });
      
      const prevCard = destinationCards[destinationIndex - 1];
      const nextCard = destinationCards[destinationIndex];
      
      let newOrder;
      
      if (prevCard && nextCard) {
          newOrder = (prevCard.order + nextCard.order) / 2;
        } else if (prevCard && !nextCard) {
          newOrder = prevCard.order + 1;
        } else if (!prevCard && nextCard) {
          newOrder = nextCard.order / 2 ;
        } else {
          newOrder = 1;
      }
      
      const updatedCard = await Card.findByIdAndUpdate(
  id,
  {
    listId: destinationListId,
    order: newOrder
  },
  { new: true }
);

    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

