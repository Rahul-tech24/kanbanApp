import Board from "../models/Board.js";
import List from "../models/List.js";
import Card from "../models/Card.js";

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createBoard = async (req, res) => {
  try {
        const { title } = req.body;
      
    const board = await Board.create({ title });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    }
};

export const getBoard = async (req, res) => {
    try {
       const { id } = req.params;

        const board = await Board.findById(id);
        
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const lists = await List.find({ boardId: id }).sort({ order: 1 });

        const listIds = lists.map(list => list._id);

         const cards = await Card.find({
                listId: { $in: listIds }
                            }).sort({ order: 1 });

            res.json({
      board,
      lists,
      cards
                      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
};