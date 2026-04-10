import api from "./axios";

export const moveCard = async ({ cardId, data }) => {
  const res = await api.patch(`/cards/${cardId}/move`, data);
  return res.data;
};


export const createCard = async (data) => {
  const res = await api.post("/cards", data);
  return res.data;
};