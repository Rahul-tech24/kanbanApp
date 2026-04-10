import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

const fetchBoard = async (boardId) => {
  const { data } = await api.get(`/boards/${boardId}`);
  return data;
};

export const useBoard = (boardId) => {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: () => fetchBoard(boardId),
    enabled: Boolean(boardId)
  });
};
