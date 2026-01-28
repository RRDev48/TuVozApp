import { useCallback, useState } from "react";
import { supportService, SupportTicket } from "../(services)/supportService";

export const useSupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    const response = await supportService.getUserTickets();
    if (response.success && response.data) {
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
