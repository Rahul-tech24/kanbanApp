import List from "../models/List.js";
import Card from "../models/Card.js";

export const createList = async (req, res) => {
  try {
      const { title, boardId } = req.body;
      
      const lastList = await List.findOne({ boardId }).sort({ order: -1 });
      
      const newOrder = lastList ? lastList.order + 1 : 0;
      
        const list = await List.create({ title, boardId, order: newOrder });
    
      res.status(201).json(list);
      
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateList = async (req, res) => {
  try {
    const { id } = req.params;
        const { title } = req.body;
      
    const list = await List.findByIdAndUpdate(id, { title }, { new: true });
    
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};