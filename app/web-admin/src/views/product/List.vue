<template>
  <div class="page-shell">
    <section class="panel">
      <div class="toolbar">
        <div class="toolbar-left">
          <a-input-search
            v-model:value="queryForm.keyword"
            placeholder="搜索商品名称、标题、标签"
            allow-clear
            class="search-input"
            @search="fetchData(true)"
          />
          <a-select
            v-model:value="queryForm.categoryId"
            allow-clear
            placeholder="筛选分类"
            class="category-select"
            :options="categoryOptions"
          />
          <a-select
            v-model:value="queryForm.status"
            allow-clear
            placeholder="筛选状态"
            class="status-select"
            :options="statusOptions"
          />
        </div>

        <div class="toolbar-right">
          <a-button @click="handleResetSearch">重置</a-button>
          <router-link to="/product/new">
            <a-button type="primary">新增商品</a-button>
          </router-link>
        </div>
      </div>

      <a-table
        row-key="id"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: 1180 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'product'">
            <div class="product-cell">
              <a-image v-if="record.mainUrl" :src="getImageUrl(record.mainUrl)" :width="58" class="product-image" />
              <div v-else class="product-placeholder">
                {{ (record.name || "P").slice(0, 1) }}
              </div>
              <div class="product-meta">
                <strong>{{ record.name || "-" }}</strong>
                <span>{{ record.title || "无副标题" }}</span>
              </div>
            </div>
          </template>

          <template v-else-if="column.key === 'price'">
            <strong>¥ {{ Number(record.price || 0).toFixed(2) }}</strong>
          </template>

          <template v-else-if="column.key === 'tags'">
            <div class="tag-list">
              <a-tag v-for="tag in splitTags(record.tags)" :key="tag" color="blue">
                {{ tag }}
              </a-tag>
            </div>
          </template>

          <template v-else-if="column.key === 'flags'">
            <div class="tag-list">
              <a-tag v-if="record.isHero === 1" color="gold">主推</a-tag>
              <a-tag v-if="record.isBanner === 1" color="cyan">轮播</a-tag>
              <a-tag v-if="record.isRec === 1" color="green">推荐</a-tag>
              <span v-if="record.isHero !== 1 && record.isBanner !== 1 && record.isRec !== 1">-</span>
            </div>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'default'">
              {{ record.status === 1 ? "上架" : "下架" }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'updateTime'">
            {{ formatDate(record.updateTime) }}
          </template>

          <template v-else-if="column.key === 'action'">
            <div class="table-actions">
              <a-button type="link" @click="router.push(`/product/${record.id}/edit`)">编辑</a-button>
              <a-popconfirm title="确认删除该商品？" @confirm="handleDelete(record.id)">
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import { useRouter } from "vue-router";
import { listCategoryByPage } from "@/api/categoryController";
import { deleteProduct, pageAdminProducts } from "@/api/productController";
import { BASE_URL } from "@/request";

const router = useRouter();

const columns: TableColumnsType<API.ProductAdminPageVO> = [
  { title: "商品", key: "product", width: 280 },
  { title: "分类", dataIndex: "categoryNames", key: "categoryNames", width: 220 },
  { title: "价格", dataIndex: "price", key: "price", width: 120 },
  { title: "标签", dataIndex: "tags", key: "tags", width: 180 },
  { title: "运营标记", key: "flags", width: 180 },
  { title: "sku 数", dataIndex: "skuCount", key: "skuCount", width: 90 },
  { title: "状态", dataIndex: "status", key: "status", width: 100 },
  { title: "更新时间", dataIndex: "updateTime", key: "updateTime", width: 180 },
  { title: "操作", key: "action", fixed: "right", width: 140 },
];

const queryForm = reactive<API.ProductAdminQueryRequest>({
  keyword: "",
  categoryId: undefined,
  status: undefined,
});

const tableData = ref<API.ProductAdminPageVO[]>([]);
const categoryOptions = ref<{ label: string; value: string }[]>([]);
const loading = ref(false);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
});

const statusOptions = [
  { label: "上架", value: 1 },
  { label: "下架", value: 0 },
];

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

const splitTags = (value?: string) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const fetchCategories = async () => {
  const res = await listCategoryByPage({
    current: 1,
    pageSize: 100,
  });
  if (res.code === 0) {
    categoryOptions.value = (res.data?.records ?? [])
      .filter((item): item is API.Category & { id: string } => Boolean(item.id))
      .map((item) => ({
        label: item.name || `分类 ${item.id}`,
        value: item.id,
      }));
  }
};

const fetchData = async (reset = false) => {
  if (reset) {
    pagination.current = 1;
  }
  loading.value = true;
  try {
    const res = await pageAdminProducts({
      current: pagination.current,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword?.trim() || undefined,
      categoryId: queryForm.categoryId,
      status: queryForm.status,
    });
    if (res.code === 0 && res.data) {
      tableData.value = res.data.records ?? [];
      pagination.total = Number(res.data.total ?? 0);
      pagination.current = Number(res.data.current ?? pagination.current);
      pagination.pageSize = Number(res.data.size ?? pagination.pageSize);
      return;
    }
    message.error(res.message || "加载商品失败");
  } catch {
    message.error("加载商品失败");
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id?: string) => {
  if (!id) {
    return;
  }
  const res = await deleteProduct({ id });
  if (res.code !== 0) {
    message.error(res.message || "删除商品失败");
    return;
  }
  message.success("商品已删除");
  if (tableData.value.length === 1 && pagination.current > 1) {
    pagination.current -= 1;
  }
  await fetchData();
};

const handleResetSearch = () => {
  queryForm.keyword = "";
  queryForm.categoryId = undefined;
  queryForm.status = undefined;
  fetchData(true);
};

const handleTableChange = (pageInfo: { current?: number; pageSize?: number }) => {
  pagination.current = pageInfo.current ?? 1;
  pagination.pageSize = pageInfo.pageSize ?? 10;
  fetchData();
};

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchData()]);
});
</script>

<style scoped>
.page-shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel {
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(186, 201, 218, 0.55);
  box-shadow: 0 18px 40px rgba(19, 42, 68, 0.08);
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  font-size: 12px;
  color: #b7f3dd;
}

.desc {
  margin: 12px 0 0;
  max-width: 520px;
  line-height: 1.7;
  color: #d9f8eb;
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
  width: 300px;
}

.category-select,
.status-select {
  width: 180px;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  border-radius: 12px;
  overflow: hidden;
}

.product-placeholder {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #16a34a 0%, #10b981 100%);
  color: #fff;
  font-size: 20px;
  font-weight: 800;
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-meta span {
  color: #68829f;
  font-size: 12px;
}

.tag-list,
.table-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 980px) {
  .toolbar,
  .toolbar-left,
  .toolbar-right {
    flex-direction: column;
  }

  .search-input,
  .category-select,
  .status-select {
    width: 100%;
  }
}
</style>
