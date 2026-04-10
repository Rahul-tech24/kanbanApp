import List from "../models/List.js";
import Card from "../models/Card.js";

export const createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "List title is required" });
    }

    if (!boardId) {
      return res.status(400).json({ message: "Board id is required" });
    }
      
    const lastList = await List.findOne({ boardId }).sort({ order: -1 });
      
    const newOrder = lastList ? lastList.order + 1 : 0;
      
    const list = await List.create({
      title: title.trim(),
      boardId,
      order: newOrder
    });
    
    res.status(201).json(list);
      
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "List title is required" });
    }
      
    const list = await List.findByIdAndUpdate(
      id,
      { title: title.trim() },
      { new: true, runValidators: true }
    );
    
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const deleteList = async (req, res) => {
  try {
    const { id } = req.params;

    const list = await List.findByIdAndDelete(id);

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const deleteResult = await Card.deleteMany({ listId: id });

    res.json({
      message: "List deleted",
      deletedCards: deleteResult.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
