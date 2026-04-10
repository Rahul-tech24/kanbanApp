import { useQuery } from "@tanstack/react-query";
import { getCard } from "../api/card";

export const useCard = (cardId) => {
  return useQuery({
    queryKey: ["card", cardId],
    queryFn: () => getCard(cardId),
    enabled: Boolean(cardId)
  });
};
