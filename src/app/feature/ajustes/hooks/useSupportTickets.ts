import { useCallback, useState } from "react";
import { supportService, SupportTicket } from "../services/support.Service";

export const useSupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    const response = await supportService.getUserTickets();
    if ("data" in response && response.success) {
      setTickets(response.data);
    }
    setIsLoading(false);
  }, []);

  return {
    tickets,
    isLoading,
    loadTickets,
    refetch: loadTickets,
  };
};
