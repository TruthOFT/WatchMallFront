import { request } from "@/request";

export type BaseResponse<T> = {
  code?: number;
  data?: T;
  message?: string;
};

export type SupportTicketCreateRequest = {
  subject?: string;
  content?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
};

export type SupportMessageSendRequest = {
  ticketId?: string;
  content?: string;
};

export type SupportAiChatRequest = {
  ticketId?: string;
  message?: string;
};

export type SupportTicketVO = {
  id?: string;
  userId?: string;
  userName?: string;
  userAccount?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  subject?: string;
  latestMessage?: string;
  status?: string;
  source?: string;
  lastMessageTime?: string;
  createTime?: string;
};

export type SupportMessageVO = {
  id?: string;
  ticketId?: string;
  senderId?: string;
  senderRole?: string;
  senderName?: string;
  messageType?: string;
  content?: string;
  isAi?: number;
  createTime?: string;
};

export type SupportTicketDetailVO = {
  ticket?: SupportTicketVO;
  messageList?: SupportMessageVO[];
};

export type SupportAiChatVO = {
  ticketId?: string;
  reply?: string;
};

export async function createSupportTicket(body: SupportTicketCreateRequest) {
  return request<BaseResponse<SupportTicketVO>>("/support/ticket/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  });
}

export async function listMySupportTickets() {
  return request<BaseResponse<SupportTicketVO[]>>("/support/ticket/my", {
    method: "GET",
  });
}

export async function getSupportTicketDetail(ticketId: string) {
  return request<BaseResponse<SupportTicketDetailVO>>("/support/ticket/detail", {
    method: "GET",
    params: { ticketId },
  });
}

export async function listSupportMessages(ticketId: string) {
  return request<BaseResponse<SupportMessageVO[]>>("/support/message/list", {
    method: "GET",
    params: { ticketId },
  });
}

export async function sendSupportMessage(body: SupportMessageSendRequest) {
  return request<BaseResponse<SupportMessageVO>>("/support/message/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  });
}

export async function chatWithSupportAi(body: SupportAiChatRequest) {
  return request<BaseResponse<SupportAiChatVO>>("/support/chat/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  });
}
