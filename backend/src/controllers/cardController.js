import Card from "../models/Card.js";

export const createCard = async (req, res) => {

    try {
        const { title, description, listId } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ message: "Card title is required" });
        }

        if (!listId) {
            return res.status(400).json({ message: "List id is required" });
        }

        const lastCard = await Card.findOne({ listId }).sort({ order: -1 });

        const newOrder = lastCard ? lastCard.order + 1 : 0;

        const card = await Card.create({
          listId,
          title: title.trim(),
          description,
          order: newOrder
        });

        res.status(201).json(card);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: "Card title is required" });
    }

    const updates = {};

    if (title !== undefined) {
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description;
    }

    const card = await Card.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(card);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(card);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ message: "Card deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const moveCard = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      sourceListId,
      destinationListId,
      destinationIndex,
      destinationCardId
    } = req.body;

    if (!sourceListId || !destinationListId) {
      return res.status(400).json({ message: "Source and destination lists are required" });
    }

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const destinationCards = await Card.find({
      listId: destinationListId,
      _id: { $ne: id }
    }).sort({ order: 1 });

    const requestedIndex = Number(destinationIndex);

    if (!Number.isInteger(requestedIndex)) {
      return res.status(400).json({ message: "Destination index is required" });
    }

    const safeIndex = Math.max(
      0,
      Math.min(requestedIndex, destinationCards.length)
    );

    const prevCard = destinationCards[safeIndex - 1];
    const nextCard = destinationCards[safeIndex];

    let newOrder;

    if (prevCard && nextCard) {
      newOrder = (prevCard.order + nextCard.order) / 2;
    } else if (prevCard) {
      newOrder = prevCard.order + 1;
    } else if (nextCard) {
      newOrder = nextCard.order - 1;
    } else {
      newOrder = 1;
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      {
        listId: destinationListId,
        order: newOrder
      },
      { new: true, runValidators: true }
    );

    res.json({
      card: updatedCard,
      sourceListId,
      destinationListId,
      destinationIndex: safeIndex,
      destinationCardId: destinationCardId || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
