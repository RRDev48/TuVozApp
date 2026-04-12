import { supabase } from "@/src/lib/supabaseClient";
import { auditLogService } from "./auditLog.Service";

type SupportResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function getAuthenticatedUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

async function logSupportEvent(
  eventType: string,
  description: string,
  source: string,
  metadata?: Record<string, unknown>,
) {
  await auditLogService.logEventSafe({
    event_type: eventType,
    description,
    metadata,
    source,
  });
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender: "user" | "support";
  message: string;
  created_at: string;
}

export interface CreateSupportTicketData {
  subject: string;
  message: string;
  priority?: "low" | "normal" | "high";
}

export interface CreateGuestSupportTicketData {
  email: string;
  subject: string;
  message: string;
  priority?: "low" | "normal" | "high";
}

export interface CreateSupportMessageData {
  ticket_id: string;
  message: string;
  sender?: "user" | "support";
}

export interface SupportTicket {
  id: string;
  user_id: string | null;
  contact_email: string | null;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high";
  created_at: string;
  updated_at: string;
}

async function createSupportTicket(
  data: CreateSupportTicketData,
  userId: string,
): Promise<SupportResult<SupportTicket>> {
  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: userId,
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

  await logSupportEvent(
    auditLogService.events.SUPPORT_TICKET_CREATED,
    `Support ticket created: ${data.subject}`,
    "support.service.createTicket",
    {
      ticket_id: ticket.id,
      subject: data.subject,
      priority: data.priority || "normal",
    },
  );

  return { success: true, data: ticket };
}

async function createGuestSupportTicket(
  data: CreateGuestSupportTicketData,
): Promise<SupportResult<SupportTicket>> {
  const normalizedEmail = data.email.trim().toLowerCase();

  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: null,
      contact_email: normalizedEmail,
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

  await logSupportEvent(
    auditLogService.events.SUPPORT_TICKET_CREATED,
    `Guest support ticket created: ${data.subject}`,
    "support.service.createGuestTicket",
    {
      ticket_id: ticket.id,
      contact_email: normalizedEmail,
      priority: data.priority || "normal",
    },
  );

  return { success: true, data: ticket };
}

async function getUserSupportTickets(
  userId: string,
): Promise<SupportResult<SupportTicket[]>> {
  const { data: tickets, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return { success: true, data: tickets || [] };
}

async function getSupportTicketById(
  ticketId: string,
): Promise<SupportResult<SupportTicket>> {
  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", ticketId)
    .single();

  if (error) {
    throw error;
  }

  return { success: true, data: ticket };
}

async function updateSupportTicketStatus(
  ticketId: string,
  status: SupportTicket["status"],
): Promise<SupportResult<SupportTicket>> {
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

  await logSupportEvent(
    auditLogService.events.SUPPORT_TICKET_UPDATED,
    `Support ticket status updated to ${status}`,
    "support.service.updateTicketStatus",
    { ticket_id: ticketId, status },
  );

  return { success: true, data: ticket };
}

async function getSupportTicketMessages(
  ticketId: string,
): Promise<SupportResult<SupportMessage[]>> {
  const { data: messages, error } = await supabase
    .from("support_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return { success: true, data: messages || [] };
}

async function createSupportMessage(
  data: CreateSupportMessageData,
): Promise<SupportResult<SupportMessage>> {
  const sender = data.sender || "user";

  const { data: message, error } = await supabase
    .from("support_messages")
    .insert({
      ticket_id: data.ticket_id,
      message: data.message,
      sender,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  await logSupportEvent(
    auditLogService.events.SUPPORT_MESSAGE_CREATED,
    "Support message added to ticket",
    "support.service.addMessageToTicket",
    {
      ticket_id: data.ticket_id,
      sender,
      message_length: data.message.length,
    },
  );

  return { success: true, data: message };
}

export const supportService = {
  async createTicket(data: CreateSupportTicketData) {
    try {
      const user = await getAuthenticatedUser();

      if (!user) {
        return {
          success: false,
          error: "Debes iniciar sesión para crear un ticket",
        };
      }

      return await createSupportTicket(data, user.id);
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al crear el ticket"),
      };
    }
  },

  async createGuestTicket(data: CreateGuestSupportTicketData) {
    try {
      return await createGuestSupportTicket(data);
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al crear el ticket"),
      };
    }
  },

  async getUserTickets() {
    try {
      const user = await getAuthenticatedUser();

      if (!user) {
        return {
          success: false,
          error: "Debes iniciar sesión para ver tus tickets",
        };
      }

      return await getUserSupportTickets(user.id);
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al obtener los tickets"),
      };
    }
  },

  async getTicketById(ticketId: string) {
    try {
      return await getSupportTicketById(ticketId);
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al obtener el ticket"),
      };
    }
  },

  async updateTicketStatus(
    ticketId: string,
    status: "open" | "in_progress" | "resolved" | "closed",
  ) {
    try {
      return await updateSupportTicketStatus(ticketId, status);
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al actualizar el ticket"),
      };
    }
  },

  async getTicketMessages(ticketId: string) {
    try {
      return await getSupportTicketMessages(ticketId);
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al obtener los mensajes"),
      };
    }
  },

  async addMessageToTicket(data: CreateSupportMessageData) {
    try {
      return await createSupportMessage(data);
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, "Error al agregar mensaje"),
      };
    }
  },
};
