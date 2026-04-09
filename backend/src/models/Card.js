import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    order: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);
export default Card;