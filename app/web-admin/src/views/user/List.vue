<template>
  <div class="page-shell">
    <section class="hero-card">
      <div>
        <p class="eyebrow">User Admin</p>
        <h2>用户管理</h2>
        <p class="desc">按账号、昵称、邮箱、手机号快速筛选用户，并在详情抽屉中查看基础信息和地址信息。</p>
      </div>
      <div class="hero-stats">
        <div class="stat-card">
          <span>用户总数</span>
          <strong>{{ pagination.total }}</strong>
        </div>
        <div class="stat-card">
          <span>当前页</span>
          <strong>{{ pagination.current }}</strong>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="toolbar">
        <div class="toolbar-left">
          <a-input-search
            v-model:value="queryForm.keyword"
            placeholder="搜索账号、昵称、邮箱、手机号"
            allow-clear
            class="search-input"
            @search="fetchData(true)"
          />
          <a-select
            v-model:value="queryForm.userRole"
            allow-clear
            placeholder="筛选角色"
            class="role-select"
            :options="roleOptions"
          />
        </div>
        <div class="toolbar-right">
          <a-button @click="handleResetSearch">重置</a-button>
        </div>
      </div>

      <a-table
        row-key="id"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: 1120 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'user'">
            <div class="user-cell">
              <a-avatar v-if="record.avatarUrl" :src="getImageUrl(record.avatarUrl)" :size="48" />
              <a-avatar v-else :size="48" class="avatar-placeholder">
                {{ (record.username || record.userAccount || "U").slice(0, 1).toUpperCase() }}
              </a-avatar>
              <div class="user-meta">
                <strong>{{ record.username || "未设置昵称" }}</strong>
                <span>{{ record.userAccount || "-" }}</span>
              </div>
            </div>
          </template>

          <template v-else-if="column.key === 'contact'">
            <div class="contact-cell">
              <span>{{ record.email || "-" }}</span>
              <span>{{ record.phone || "-" }}</span>
            </div>
          </template>

          <template v-else-if="column.key === 'userRole'">
            <a-tag :color="getRoleColor(record.userRole)">{{ getRoleText(record.userRole) }}</a-tag>
          </template>

          <template v-else-if="column.key === 'balance'">
            {{ formatAmount(record.balance) }}
          </template>

          <template v-else-if="column.key === 'createTime'">
            {{ formatDate(record.createTime) }}
          </template>

          <template v-else-if="column.key === 'action'">
            <a-button type="link" @click="openDetail(record.id)">查看详情</a-button>
          </template>
        </template>
      </a-table>
    </section>

    <a-drawer
      v-model:open="detailVisible"
      title="用户详情"
      :width="760"
      destroy-on-close
    >
      <a-spin :spinning="detailLoading">
        <template v-if="detailData">
          <section class="detail-section detail-profile">
            <a-avatar v-if="detailData.avatarUrl" :src="getImageUrl(detailData.avatarUrl)" :size="72" />
            <a-avatar v-else :size="72" class="avatar-placeholder large">
              {{ (detailData.username || detailData.userAccount || "U").slice(0, 1).toUpperCase() }}
            </a-avatar>
            <div>
              <h3>{{ detailData.username || "未设置昵称" }}</h3>
              <p>{{ detailData.userAccount || "-" }}</p>
            </div>
          </section>

          <section class="detail-section">
            <h3>基础信息</h3>
            <a-descriptions :column="2" size="small" bordered>
              <a-descriptions-item label="用户ID">{{ detailData.id || "-" }}</a-descriptions-item>
              <a-descriptions-item label="角色">
                <a-tag :color="getRoleColor(detailData.userRole)">{{ getRoleText(detailData.userRole) }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="邮箱">{{ detailData.email || "-" }}</a-descriptions-item>
              <a-descriptions-item label="手机号">{{ detailData.phone || "-" }}</a-descriptions-item>
              <a-descriptions-item label="余额">{{ formatAmount(detailData.balance) }}</a-descriptions-item>
              <a-descriptions-item label="性别">{{ getGenderText(detailData.gender) }}</a-descriptions-item>
              <a-descriptions-item label="创建时间">{{ formatDate(detailData.createTime) }}</a-descriptions-item>
              <a-descriptions-item label="更新时间">{{ formatDate(detailData.updateTime) }}</a-descriptions-item>
            </a-descriptions>
          </section>

          <section class="detail-section">
            <h3>地址信息</h3>
            <div v-if="addressLoading" class="inner-loading">
              <a-spin />
            </div>
            <div v-else-if="addressList.length" class="address-list">
              <div v-for="item in addressList" :key="item.id" class="address-card">
                <div class="address-head">
                  <strong>{{ item.receiverName || "-" }}</strong>
                  <a-tag v-if="item.isDefault === 1" color="blue">默认地址</a-tag>
                </div>
                <div class="address-body">
                  <span>{{ item.receiverPhone || "-" }}</span>
                  <span>{{ formatAddress(item) }}</span>
                  <span>邮编：{{ item.postalCode || "-" }}</span>
                </div>
              </div>
            </div>
            <a-empty v-else description="暂无地址信息" />
          </section>
        </template>
      </a-spin>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import { pageAdminUsers, getAdminUserDetail } from "@/api/userController";
import { listAdminAddress } from "@/api/addressController";
import { BASE_URL } from "@/request";

const columns: TableColumnsType<API.UserAdminPageVO> = [
  { title: "用户", key: "user", width: 280 },
  { title: "联系信息", key: "contact", width: 220 },
  { title: "角色", dataIndex: "userRole", key: "userRole", width: 120 },
  { title: "余额", key: "balance", width: 140 },
  { title: "创建时间", key: "createTime", width: 180 },
  { title: "操作", key: "action", width: 120, fixed: "right" },
];

const queryForm = reactive<API.UserAdminQueryRequest>({
  keyword: "",
  userRole: undefined,
});

const roleOptions = [
  { label: "管理员", value: "admin" },
  { label: "普通用户", value: "user" },
  { label: "封禁用户", value: "ban" },
];

const tableData = ref<API.UserAdminPageVO[]>([]);
const loading = ref(false);
const detailVisible = ref(false);
const detailLoading = ref(false);
const addressLoading = ref(false);
const detailData = ref<API.UserAdminDetailVO>();
const addressList = ref<API.UserAddressAdminVO[]>([]);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
});

const getImageUrl = (path?: string) => {
  if (!path) {
    return "";
  }
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }
  return dayjs(value).isValid() ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : value;
};

const formatAmount = (value?: number) => `¥${Number(value ?? 0).toFixed(2)}`;

const getRoleText = (role?: string) => {
  if (role === "admin") {
    return "管理员";
  }
  if (role === "ban") {
    return "封禁";
  }
  return "用户";
};

const getRoleColor = (role?: string) => {
  if (role === "admin") {
    return "purple";
  }
  if (role === "ban") {
    return "red";
  }
  return "blue";
};

const getGenderText = (gender?: number) => {
  if (gender === 1) {
    return "男";
  }
  if (gender === 2) {
    return "女";
  }
  return "未设置";
};

const formatAddress = (item?: API.UserAddressAdminVO) => {
  const parts = [item?.province, item?.city, item?.district, item?.detailAddress]
    .map((part) => (part || "").trim())
    .filter(Boolean);
  return parts.length ? parts.join(" ") : "-";
};

const fetchData = async (reset = false) => {
  if (reset) {
    pagination.current = 1;
  }
  loading.value = true;
  try {
    const res = await pageAdminUsers({
      current: pagination.current,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword?.trim() || undefined,
      userRole: queryForm.userRole,
    });
    if (res.code === 0 && res.data) {
      tableData.value = res.data.records ?? [];
      pagination.total = Number(res.data.total ?? 0);
      pagination.current = Number(res.data.current ?? pagination.current);
      pagination.pageSize = Number(res.data.size ?? pagination.pageSize);
      return;
    }
    message.error(res.message || "加载用户失败");
  } catch {
    message.error("加载用户失败");
  } finally {
    loading.value = false;
  }
};

const openDetail = async (id?: string) => {
  if (!id) {
    return;
  }
  detailVisible.value = true;
  detailLoading.value = true;
  addressLoading.value = true;
  detailData.value = undefined;
  addressList.value = [];
  try {
    const [detailRes, addressRes] = await Promise.all([
      getAdminUserDetail({ id }),
      listAdminAddress({ userId: id }),
    ]);
    if (detailRes.code === 0 && detailRes.data) {
      detailData.value = detailRes.data;
    } else {
      throw new Error(detailRes.message || "加载用户详情失败");
    }
    if (addressRes.code === 0) {
      addressList.value = addressRes.data ?? [];
    } else {
      message.warning(addressRes.message || "加载地址信息失败");
    }
  } catch (error) {
    message.error(error instanceof Error ? error.message : "加载用户详情失败");
    detailVisible.value = false;
  } finally {
    detailLoading.value = false;
    addressLoading.value = false;
  }
};

const handleResetSearch = () => {
  queryForm.keyword = "";
  queryForm.userRole = undefined;
  fetchData(true);
};

const handleTableChange = (pageInfo: { current?: number; pageSize?: number }) => {
  pagination.current = pageInfo.current ?? 1;
  pagination.pageSize = pageInfo.pageSize ?? 10;
  fetchData();
};

fetchData();
</script>

<style scoped>
.page-shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hero-card,
.panel {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(186, 201, 218, 0.55);
  box-shadow: 0 18px 40px rgba(19, 42, 68, 0.08);
}

.hero-card {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 24px;
  background: linear-gradient(120deg, rgba(114, 28, 121, 0.92) 0%, rgba(38, 84, 124, 0.92) 100%);
  color: #fdf7ff;
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  font-size: 12px;
  color: #f3d5ff;
}

.hero-card h2 {
  margin: 0;
  font-size: 30px;
}

.desc {
  margin: 12px 0 0;
  max-width: 560px;
  line-height: 1.7;
  color: #f7e7ff;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 12px;
  min-width: 260px;
}

.stat-card {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
}

.stat-card span {
  display: block;
  font-size: 12px;
  color: #f8dfff;
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  font-size: 28px;
}

.panel {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 320px;
}

.role-select {
  width: 180px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-meta,
.contact-cell,
.address-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-meta span,
.contact-cell span,
.address-body span {
  color: #68829f;
  font-size: 12px;
}

.avatar-placeholder {
  background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
}

.avatar-placeholder.large {
  font-size: 24px;
}

.detail-section + .detail-section {
  margin-top: 20px;
}

.detail-section h3 {
  margin: 0 0 12px;
  color: #17304c;
}

.detail-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-profile h3 {
  margin: 0;
}

.detail-profile p {
  margin: 6px 0 0;
  color: #68829f;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-card {
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(186, 201, 218, 0.55);
  background: #f8fbff;
}

.address-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.inner-loading {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

@media (max-width: 980px) {
  .hero-card,
  .toolbar,
  .toolbar-left,
  .toolbar-right {
    flex-direction: column;
  }

  .search-input,
  .role-select {
    width: 100%;
  }
}
</style>
