import api from "./axios";

export const createList = async (data) => {
  const res = await api.post("/lists", data);
  return res.data;
};