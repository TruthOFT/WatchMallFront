<template>
  <div class="support-page">
    <div class="hero-section">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">客户支持</p>
          <h1>售前咨询、售后反馈与在线客服都在这里</h1>
          <p class="hero-desc">
            您可以提交商品咨询、配送问题、售后申请，或直接发起在线对话。人工客服与 AI 客服分开展示，处理进度更清晰。
          </p>
          <div class="support-info-grid">
            <div class="info-card liquid-glass">
              <span class="label">服务热线</span>
              <strong>400-888-2026</strong>
              <p>工作日 09:00 - 21:00，节假日 10:00 - 18:00</p>
            </div>
            <div class="info-card liquid-glass">
              <span class="label">客服邮箱</span>
              <strong>support@shouhuanshoubiao.com</strong>
              <p>复杂售后问题会在 1 个工作日内回访</p>
            </div>
            <div class="info-card liquid-glass">
              <span class="label">线下接待</span>
              <strong>上海市黄浦区腕表体验中心</strong>
              <p>支持预约到店鉴定、调试与保养咨询</p>
            </div>
          </div>
        </div>

        <div class="hero-panel glass-panel">
          <h3>提交反馈</h3>
          <p class="panel-desc">创建一条客服工单，后续人工回复会保留在“我的客服会话”里。</p>

          <a-form :model="ticketForm" layout="vertical" @finish="handleCreateTicket">
            <a-form-item label="反馈主题" name="subject" :rules="[{ required: true, message: '请输入反馈主题' }]">
              <a-input v-model:value="ticketForm.subject" size="large" placeholder="例如：配送延迟、表带问题、预约保养" />
            </a-form-item>

            <a-form-item label="联系人" name="contactName" :rules="[{ required: true, message: '请输入联系人' }]">
              <a-input v-model:value="ticketForm.contactName" size="large" placeholder="请输入联系人姓名" />
            </a-form-item>

            <div class="inline-grid">
              <a-form-item label="联系电话">
                <a-input v-model:value="ticketForm.contactPhone" size="large" placeholder="手机号或座机" />
              </a-form-item>
              <a-form-item label="联系邮箱">
                <a-input v-model:value="ticketForm.contactEmail" size="large" placeholder="方便接收回访" />
              </a-form-item>
            </div>

            <a-form-item label="问题描述" name="content" :rules="[{ required: true, message: '请输入问题描述' }]">
              <a-textarea
                v-model:value="ticketForm.content"
                :rows="5"
                placeholder="请尽量描述订单、商品、问题现象和您的期望处理方式"
              />
            </a-form-item>

            <a-button type="primary" html-type="submit" size="large" block :loading="creatingTicket">
              提交反馈
            </a-button>
          </a-form>
        </div>
      </div>
    </div>

    <div class="container support-content">
      <section class="ticket-section glass-panel">
        <div class="panel-header">
          <div>
            <h3>我的客服会话</h3>
            <p>登录后可查看历史工单、回复进度和人工客服消息。</p>
          </div>
          <a-button v-if="userStore.isLogin" @click="fetchMyTickets(true)" :loading="ticketLoading">刷新会话</a-button>
        </div>

        <div v-if="!userStore.isLogin" class="empty-state">
          <p>登录后可查看您的客服会话并继续与人工客服沟通。</p>
          <a-button type="primary" @click="goLogin">去登录</a-button>
        </div>

        <div v-else class="ticket-grid">
          <div class="ticket-list-panel">
            <a-spin :spinning="ticketLoading">
              <div v-if="myTickets.length" class="ticket-list">
                <button
                  v-for="ticket in myTickets"
                  :key="ticket.id"
                  type="button"
                  :class="['ticket-card', { active: activeTicketId === ticket.id }]"
                  @click="handleSelectTicket(ticket.id)"
                >
                  <div class="ticket-card-head">
                    <strong>{{ ticket.subject || "未命名会话" }}</strong>
                    <a-tag :color="getStatusColor(ticket.status)">{{ getStatusText(ticket.status) }}</a-tag>
                  </div>
                  <p class="ticket-preview">{{ ticket.latestMessage || "客服暂未回复，您可继续补充信息。" }}</p>
                  <div class="ticket-card-meta">
                    <span>{{ getSourceText(ticket.source) }}</span>
                    <span>{{ formatDate(ticket.lastMessageTime || ticket.createTime) }}</span>
                  </div>
                </button>
              </div>
              <a-empty v-else description="您还没有客服会话，先提交一条反馈吧" />
            </a-spin>
          </div>

          <div class="chat-panel">
            <div v-if="activeTicket" class="chat-shell">
              <div class="chat-ticket-meta">
                <div>
                  <h4>{{ activeTicket.subject || "人工客服会话" }}</h4>
                  <p>
                    当前状态：
                    <a-tag :color="getStatusColor(activeTicket.status)">{{ getStatusText(activeTicket.status) }}</a-tag>
                  </p>
                </div>
                <div class="chat-ticket-extra">
                  <span>最近更新：{{ formatDate(activeTicket.lastMessageTime || activeTicket.createTime) }}</span>
                  <span>来源：{{ getSourceText(activeTicket.source) }}</span>
                </div>
              </div>

              <a-spin :spinning="detailLoading">
                <div class="message-list manual-message-list">
                  <div
                    v-for="messageItem in activeMessages"
                    :key="messageItem.id"
                    :class="['message-item', messageItem.senderRole === 'user' ? 'self' : 'other']"
                  >
                    <div class="message-bubble">
                      <div class="message-meta">
                        <span>{{ messageItem.senderName || getSenderLabel(messageItem.senderRole) }}</span>
                        <span>{{ formatDate(messageItem.createTime) }}</span>
                      </div>
                      <p>{{ messageItem.content }}</p>
                    </div>
                  </div>
                  <a-empty v-if="!activeMessages.length && !detailLoading" description="当前会话还没有消息记录" />
                </div>
              </a-spin>

              <div class="composer">
                <a-textarea
                  v-model:value="messageInput"
                  :rows="4"
                  placeholder="继续补充问题、订单信息或与人工客服沟通"
                />
                <div class="composer-actions">
                  <a-button type="primary" @click="handleSendMessage" :loading="sendingMessage">发送给人工客服</a-button>
                </div>
              </div>
            </div>

            <div v-else class="empty-state inner-empty">
              <p>请选择左侧会话，或先提交一条新的客服反馈。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="ai-chat-panel glass-panel">
        <div class="panel-header">
          <div>
            <h3>在线 AI 客服</h3>
            <p>无需登录，输入问题即可直接开始对话。</p>
          </div>
        </div>

        <div class="ai-chat-box">
          <div class="support-subpanel ai-message-panel">
            <div class="message-list ai-message-list">
              <div
                v-for="messageItem in aiMessages"
                :key="messageItem.id"
                :class="['message-item', messageItem.senderRole === 'user' ? 'self' : 'other']"
              >
                <div class="message-bubble">
                  <div class="message-meta">
                    <span>{{ messageItem.senderName || getSenderLabel(messageItem.senderRole) }}</span>
                    <span>{{ formatDate(messageItem.createTime) }}</span>
                  </div>
                  <p>{{ messageItem.content }}</p>
                </div>
              </div>
              <a-empty v-if="aiMessages.length === 0" description="输入问题后，AI 客服会在这里回复" />
            </div>
          </div>

          <div class="support-subpanel ai-composer-panel">
            <div class="composer ai-composer">
              <a-textarea
                v-model:value="chatInput"
                :rows="4"
                placeholder="例如：这款手表适合日常通勤吗？售后保修多久？"
              />
              <div class="composer-actions">
                <a-button type="primary" @click="handleSendAi" :loading="sendingAi">发送给 AI 客服</a-button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/config/stores";
import { BASE_URL } from "@/request";
import {
  createSupportTicket,
  getSupportTicketDetail,
  listMySupportTickets,
  sendSupportMessage,
  type SupportMessageVO,
  type SupportTicketDetailVO,
  type SupportTicketVO,
} from "@/api/supportController";

const router = useRouter();
const userStore = useUserStore();

const ticketForm = reactive({
  subject: "",
  content: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
});

const creatingTicket = ref(false);
const ticketLoading = ref(false);
const detailLoading = ref(false);
const sendingMessage = ref(false);
const sendingAi = ref(false);

const myTickets = ref<SupportTicketVO[]>([]);
const activeTicketId = ref<string>("");
const activeTicketDetail = ref<SupportTicketDetailVO>();
const messageInput = ref("");

const aiMessages = ref<SupportMessageVO[]>([]);
const chatInput = ref("");
const aiMemoryId = ref(1);

const activeTicket = computed(() => activeTicketDetail.value?.ticket);
const activeMessages = computed(() => activeTicketDetail.value?.messageList ?? []);

const fillContactForm = () => {
  ticketForm.contactName = (userStore.loginUser.username || userStore.loginUser.userAccount || "") as string;
  ticketForm.contactPhone = (userStore.loginUser.phone || "") as string;
  ticketForm.contactEmail = (userStore.loginUser.email || "") as string;
};

const resetTicketState = () => {
  myTickets.value = [];
  activeTicketId.value = "";
  activeTicketDetail.value = undefined;
  messageInput.value = "";
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSenderLabel = (senderRole?: string) => {
  if (senderRole === "admin") {
    return "人工客服";
  }
  if (senderRole === "ai") {
    return "AI 客服";
  }
  return "我";
};

const getStatusText = (status?: string) => {
  if (status === "replied") {
    return "已回复";
  }
  if (status === "closed") {
    return "已关闭";
  }
  return "待处理";
};

const getStatusColor = (status?: string) => {
  if (status === "replied") {
    return "green";
  }
  if (status === "closed") {
    return "default";
  }
  return "gold";
};

const getSourceText = (source?: string) => {
  return source === "ai" ? "AI 会话" : "人工会话";
};

const goLogin = () => {
  void router.push("/user/login");
};

const loadTicketDetail = async (ticketId: string) => {
  detailLoading.value = true;
  try {
    const res = await getSupportTicketDetail(ticketId);
    if (res.code === 0 && res.data) {
      activeTicketDetail.value = res.data;
      activeTicketId.value = ticketId;
      return true;
    }
    message.error(res.message || "加载客服会话失败");
  } catch (error) {
    console.error("get support ticket detail error", error);
    message.error("加载客服会话失败");
  } finally {
    detailLoading.value = false;
  }
  return false;
};

const handleSelectTicket = async (ticketId?: string) => {
  if (!ticketId || ticketId === activeTicketId.value) {
    return;
  }
  messageInput.value = "";
  await loadTicketDetail(ticketId);
};

const fetchMyTickets = async (forceReloadDetail = false) => {
  if (!userStore.isLogin) {
    resetTicketState();
    return;
  }
  ticketLoading.value = true;
  try {
    const res = await listMySupportTickets();
    if (res.code === 0) {
      myTickets.value = res.data ?? [];
      if (!myTickets.value.length) {
        activeTicketId.value = "";
        activeTicketDetail.value = undefined;
        return;
      }
      const nextTicketId =
        myTickets.value.find((ticket) => ticket.id === activeTicketId.value)?.id ||
        myTickets.value[0]?.id;
      if (!nextTicketId) {
        return;
      }
      if (forceReloadDetail || activeTicketId.value !== nextTicketId || !activeTicketDetail.value) {
        await loadTicketDetail(nextTicketId);
      }
      return;
    }
    message.error(res.message || "加载客服会话列表失败");
  } catch (error) {
    console.error("list my support tickets error", error);
    message.error("加载客服会话列表失败");
  } finally {
    ticketLoading.value = false;
  }
};

const handleCreateTicket = async () => {
  if (!userStore.isLogin) {
    message.warning("请先登录后再提交反馈");
    return;
  }
  if (!ticketForm.subject.trim()) {
    message.warning("请输入反馈主题");
    return;
  }
  if (!ticketForm.contactName.trim()) {
    message.warning("请输入联系人");
    return;
  }
  if (!ticketForm.content.trim()) {
    message.warning("请输入问题描述");
    return;
  }
  creatingTicket.value = true;
  try {
    const res = await createSupportTicket(ticketForm);
    if (res.code === 0 && res.data?.id) {
      message.success("反馈已提交，客服会尽快回复");
      ticketForm.subject = "";
      ticketForm.content = "";
      await fetchMyTickets(true);
      if (res.data.id) {
        await loadTicketDetail(res.data.id);
      }
      return;
    }
    message.error(res.message || "反馈提交失败");
  } catch (error) {
    console.error("create support ticket error", error);
    message.error("反馈提交失败");
  } finally {
    creatingTicket.value = false;
  }
};

const handleSendMessage = async () => {
  if (!userStore.isLogin) {
    message.warning("请先登录后再发送消息");
    return;
  }
  if (!activeTicketId.value) {
    message.warning("请先选择一个客服会话");
    return;
  }
  if (!messageInput.value.trim()) {
    message.warning("请输入消息内容");
    return;
  }
  sendingMessage.value = true;
  try {
    const res = await sendSupportMessage({
      ticketId: activeTicketId.value,
      content: messageInput.value.trim(),
    });
    if (res.code === 0) {
      message.success("消息已发送");
      messageInput.value = "";
      await fetchMyTickets(true);
      return;
    }
    message.error(res.message || "发送消息失败");
  } catch (error) {
    console.error("send support message error", error);
    message.error("发送消息失败");
  } finally {
    sendingMessage.value = false;
  }
};

const handleSendAi = async () => {
  if (!chatInput.value.trim()) {
    message.warning("请输入消息内容");
    return;
  }
  sendingAi.value = true;
  const userMessage = chatInput.value.trim();
  aiMessages.value = [
    ...aiMessages.value,
    {
      id: `user-${Date.now()}`,
      senderRole: "user",
      senderName: "我",
      content: userMessage,
      createTime: new Date().toISOString(),
    },
  ];
  const aiMessage: SupportMessageVO = {
    id: `ai-${Date.now()}`,
    senderRole: "ai",
    senderName: "AI 客服",
    content: "",
    createTime: new Date().toISOString(),
  };
  aiMessages.value = [...aiMessages.value, aiMessage];
  chatInput.value = "";
  try {
    await new Promise<void>((resolve) => {
      const eventSource = new EventSource(
        `${BASE_URL}/api/ai/chat?chatMemoryId=${aiMemoryId.value}&userMsg=${encodeURIComponent(userMessage)}`
      );
      let hasChunk = false;
      eventSource.onmessage = (event) => {
        hasChunk = true;
        aiMessage.content = `${aiMessage.content || ""}${event.data || ""}`;
        aiMessages.value = [...aiMessages.value];
      };
      eventSource.onerror = () => {
        eventSource.close();
        if (!hasChunk) {
          aiMessage.content = "AI 客服暂时不可用，请稍后再试。";
          aiMessages.value = [...aiMessages.value];
        }
        aiMemoryId.value += 1;
        resolve();
      };
    });
  } catch (error) {
    console.error("chat with support ai error", error);
    message.error("AI 客服暂时不可用");
  } finally {
    sendingAi.value = false;
  }
};

watch(
  () => userStore.isLogin,
  (isLogin) => {
    if (isLogin) {
      fillContactForm();
      void fetchMyTickets(true);
      return;
    }
    resetTicketState();
  },
  { immediate: true }
);

onMounted(() => {
  fillContactForm();
});
</script>

<style scoped>
.support-page {
  padding-bottom: 96px;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(185, 146, 92, 0.14), transparent 28%),
    linear-gradient(180deg, #f8f3eb 0%, #f5efe6 220px, #f7f4ef 100%);
}

.container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero-section {
  padding: 136px 0 40px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 28px;
  align-items: start;
}

.eyebrow {
  margin: 0 0 14px;
  color: #a8702c;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 12px;
}

.hero-copy h1 {
  margin: 0;
  max-width: 780px;
  font-size: clamp(2.6rem, 5vw, 4.2rem);
  line-height: 1.05;
  color: #21170f;
}

.hero-desc {
  max-width: 760px;
  margin: 18px 0 0;
  font-size: 1.05rem;
  line-height: 1.9;
  color: #5c5042;
}

.support-info-grid {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.glass-panel,
.info-card,
.ticket-list-panel,
.chat-panel,
.support-subpanel {
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(250, 245, 237, 0.92) 100%);
  border: 1px solid rgba(111, 83, 47, 0.08);
  box-shadow: 0 20px 44px rgba(66, 43, 12, 0.08);
}

.info-card {
  padding: 22px 20px;
  min-width: 0;
  overflow: hidden;
}

.info-card .label {
  display: inline-block;
  margin-bottom: 12px;
  color: #a8702c;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.info-card strong {
  display: block;
  font-size: 1.15rem;
  color: #21170f;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.info-card p {
  margin: 10px 0 0;
  color: #6a5d4d;
  line-height: 1.7;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.hero-panel {
  padding: 30px;
}

.hero-panel h3,
.panel-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #21170f;
}

.panel-desc,
.panel-header p,
.chat-ticket-meta p,
.chat-ticket-extra span {
  margin: 8px 0 0;
  color: #7a6c5d;
  line-height: 1.7;
}

.inline-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.support-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ticket-section,
.ai-chat-panel {
  padding: 24px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.empty-state {
  display: flex;
  min-height: 220px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
  text-align: center;
  color: #7a6c5d;
}

.inner-empty {
  min-height: 420px;
}

.ticket-grid {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.ticket-list-panel,
.chat-panel,
.support-subpanel {
  padding: 18px;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 620px;
  overflow: auto;
}

.ticket-card {
  width: 100%;
  padding: 18px;
  border: 1px solid rgba(111, 83, 47, 0.12);
  border-radius: 22px;
  background: linear-gradient(180deg, #fffdfa 0%, #f7efe3 100%);
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.ticket-card:hover,
.ticket-card.active {
  transform: translateY(-2px);
  border-color: rgba(168, 112, 44, 0.38);
  box-shadow: 0 14px 30px rgba(96, 67, 27, 0.1);
}

.ticket-card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.ticket-card-head strong {
  color: #2f2317;
  line-height: 1.6;
}

.ticket-preview {
  margin: 12px 0 0;
  color: #6f6152;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ticket-card-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  color: #9a856d;
  font-size: 12px;
}

.chat-shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 620px;
}

.ai-message-panel {
  min-height: 420px;
}

.ai-composer-panel {
  align-self: stretch;
}

.chat-ticket-meta {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.chat-ticket-meta h4 {
  margin: 0;
  font-size: 1.2rem;
  color: #21170f;
}

.chat-ticket-extra {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: right;
}

.message-list {
  flex: 1;
  padding: 4px 4px 8px;
  overflow: auto;
}

.manual-message-list,
.ai-message-list {
  min-height: 320px;
  max-height: 420px;
  border: 1px solid rgba(111, 83, 47, 0.08);
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(251, 247, 240, 0.9) 0%, rgba(245, 238, 227, 0.82) 100%);
  padding: 18px;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
}

.message-item.self {
  justify-content: flex-end;
}

.message-bubble {
  max-width: min(560px, 86%);
  border-radius: 22px;
  padding: 14px 16px;
  background: #f2ede5;
  border: 1px solid rgba(111, 83, 47, 0.08);
}

.message-item.self .message-bubble {
  background: linear-gradient(135deg, #1f1a16 0%, #6d5534 100%);
  color: #fff8ee;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  font-size: 12px;
  opacity: 0.82;
}

.message-bubble p {
  margin: 8px 0 0;
  line-height: 1.8;
  white-space: pre-wrap;
}

.composer {
  border-top: 1px solid rgba(111, 83, 47, 0.08);
  padding-top: 18px;
}

.ai-chat-box {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 20px;
  align-items: start;
  margin-top: 18px;
}

.ai-composer {
  margin-top: 0;
  border-top: 0;
  padding-top: 0;
}

.composer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 14px;
}

@media (max-width: 1100px) {
  .hero-grid,
  .support-info-grid,
  .ticket-grid,
  .ai-chat-box {
    grid-template-columns: 1fr;
  }

  .chat-ticket-meta {
    flex-direction: column;
  }

  .chat-ticket-extra {
    text-align: left;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding-top: 120px;
  }

  .hero-panel,
  .ticket-section,
  .ai-chat-panel,
  .ticket-list-panel,
  .chat-panel,
  .support-subpanel {
    padding: 18px;
  }

  .inline-grid,
  .panel-header,
  .composer-actions,
  .ticket-card-head,
  .ticket-card-meta {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
