import api from "./axios";

export const createList = async (data) => {
  const res = await api.post("/lists", data);
  return res.data;
};

export const updateList = async ({ listId, data }) => {
  const res = await api.patch(`/lists/${listId}`, data);
  return res.data;
};

export const deleteList = async (listId) => {
  const res = await api.delete(`/lists/${listId}`);
  return res.data;
};
