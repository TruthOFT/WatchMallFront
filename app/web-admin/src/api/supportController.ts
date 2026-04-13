import { request } from "@/request";

type BaseResponse<T> = {
  code?: number;
  data?: T;
  message?: string;
};

export type SupportAdminQueryRequest = {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  source?: string;
};

export type SupportAdminPageVO = {
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

export type SupportTicketDetailVO = {
  ticket?: SupportTicketVO;
  messageList?: SupportMessageVO[];
};

export type SupportMessageSendRequest = {
  ticketId?: string;
  content?: string;
};

export type SupportTicketStatusUpdateRequest = {
  ticketId?: string;
  status?: string;
};

type PageResult<T> = {
  current?: number;
  size?: number;
  total?: number;
  records?: T[];
};

export async function pageAdminSupportTickets(body: SupportAdminQueryRequest) {
  return request<BaseResponse<PageResult<SupportAdminPageVO>>>("/support/admin/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  });
}

export async function getAdminSupportDetail(ticketId: string) {
  return request<BaseResponse<SupportTicketDetailVO>>("/support/admin/detail", {
    method: "GET",
    params: { ticketId },
  });
}

export async function replyAdminSupport(body: SupportMessageSendRequest) {
  return request<BaseResponse<SupportMessageVO>>("/support/admin/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  });
}

export async function updateAdminSupportStatus(body: SupportTicketStatusUpdateRequest) {
  return request<BaseResponse<boolean>>("/support/admin/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  });
}
