import { supabase } from "@/src/lib/supabaseClient";

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high";
  created_at: string;
  updated_at: string;
}

export interface CreateSupportTicketData {
  subject: string;
  message: string;
  priority?: "low" | "normal" | "high";
}

export const supportService = {
  async createTicket(data: CreateSupportTicketData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: "Debes iniciar sesión para crear un ticket",
        };
      }

      const { data: ticket, error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user.id,
          subject: data.subject,
          message: data.message,
          priority: data.priority || "normal",
          status: "open",
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data: ticket };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al crear el ticket",
      };
    }
  },

  async getUserTickets() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          success: false,
          error: "Debes iniciar sesión para ver tus tickets",
        };
      }

      const { data: tickets, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return { success: true, data: tickets || [] };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al obtener los tickets",
      };
    }
  },

  async getTicketById(ticketId: string) {
    try {
      const { data: ticket, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("id", ticketId)
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data: ticket };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al obtener el ticket",
      };
    }
  },

  async updateTicketStatus(
    ticketId: string,
    status: "open" | "in_progress" | "resolved" | "closed",
  ) {
    try {
      const { data: ticket, error } = await supabase
        .from("support_tickets")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, data: ticket };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Error al actualizar el ticket",
      };
    }
  },
};
