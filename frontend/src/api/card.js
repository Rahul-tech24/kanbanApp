import api from "./axios";

export const moveCard = async ({ cardId, data }) => {
  const res = await api.patch(`/cards/${cardId}/move`, data);
  return res.data;
};

export const getCard = async (cardId) => {
  const res = await api.get(`/cards/${cardId}`);
  return res.data;
};

export const createCard = async (data) => {
  const res = await api.post("/cards", data);
  return res.data;
};

export const updateCard = async ({ cardId, data }) => {
  const res = await api.patch(`/cards/${cardId}`, data);
  return res.data;
};

export const deleteCard = async (cardId) => {
  const res = await api.delete(`/cards/${cardId}`);
  return res.data;
};
