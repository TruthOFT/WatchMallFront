<template>
  <div class="page-shell">
    <section class="panel">
      <div class="toolbar">
        <div class="toolbar-left">
          <a-input-search
            v-model:value="queryForm.name"
            placeholder="搜索分类名称"
            allow-clear
            class="search-input"
            @search="fetchData(true)"
          />
          <a-select
            v-model:value="queryForm.isShow"
            allow-clear
            placeholder="展示状态"
            class="status-select"
            :options="statusFilterOptions"
          />
        </div>
        <div class="toolbar-right">
          <a-button @click="handleResetSearch">重置</a-button>
          <a-button type="primary" @click="openCreateModal">新增分类</a-button>
        </div>
      </div>

      <a-table
        row-key="id"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: 1100 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'icon'">
            <a-image v-if="record.icon" :src="getImageUrl(record.icon)" :width="56" />
            <span v-else>-</span>
          </template>

          <template v-else-if="column.key === 'isShow'">
            <a-tag :color="record.isShow === 1 ? 'green' : 'default'">
              {{ record.isShow === 1 ? "展示" : "隐藏" }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'createTime' || column.key === 'updateTime'">
            {{ formatDate(record[column.key]) }}
          </template>

          <template v-else-if="column.key === 'action'">
            <div class="table-actions">
              <a-button type="link" @click="openEditModal(record)">编辑</a-button>
              <a-popconfirm title="确认删除该分类？" @confirm="handleDelete(record.id)">
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </section>

    <a-modal
      v-model:open="modalOpen"
      :title="isEdit ? '编辑分类' : '新增分类'"
      :confirm-loading="submitting"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleSubmit"
      @cancel="resetModal"
    >
      <a-form layout="vertical">
        <a-form-item label="分类名称" required>
          <a-input v-model:value="formState.name" placeholder="请输入分类名称" />
        </a-form-item>

        <a-form-item label="父级分类">
          <a-select
            v-model:value="formState.parentId"
            :options="parentOptions"
            allow-clear
            placeholder="不选则为一级分类"
          />
        </a-form-item>

        <a-form-item label="分类描述">
          <a-textarea v-model:value="formState.description" :rows="3" placeholder="请输入分类描述" />
        </a-form-item>

        <div class="form-grid">
          <a-form-item label="排序">
            <a-input-number v-model:value="formState.sortOrder" class="full-width" :min="0" :precision="0" />
          </a-form-item>

          <a-form-item label="展示">
            <a-switch v-model:checked="formState.isShow" :checked-value="1" :un-checked-value="0" />
          </a-form-item>
        </div>

        <a-form-item label="分类图片">
          <a-upload :show-upload-list="false" :before-upload="handleSelectFile">
            <a-button>选择图片</a-button>
          </a-upload>
          <div v-if="selectedFile" class="upload-tip">{{ selectedFile.name }}</div>
          <a-image v-if="previewImage" class="preview-image" :src="previewImage" :width="120" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import type { TableColumnsType } from "ant-design-vue";
import { addCategory, deleteCategory, listCategory, listCategoryByPage, updateCategory } from "@/api/categoryController";
import { uploadFile } from "@/api/fileController";
import { BASE_URL } from "@/request";

type QueryForm = {
  name: string;
  isShow: number | undefined;
};

const columns: TableColumnsType<API.Category> = [
  { title: "分类名称", dataIndex: "name", key: "name", width: 180 },
  { title: "父级分类", dataIndex: "parentId", key: "parentId", width: 120 },
  { title: "图片", dataIndex: "icon", key: "icon", width: 110 },
  { title: "描述", dataIndex: "description", key: "description", ellipsis: true, width: 260 },
  { title: "排序", dataIndex: "sortOrder", key: "sortOrder", width: 90 },
  { title: "展示状态", dataIndex: "isShow", key: "isShow", width: 120 },
  { title: "创建时间", dataIndex: "createTime", key: "createTime", width: 180 },
  { title: "更新时间", dataIndex: "updateTime", key: "updateTime", width: 180 },
  { title: "操作", key: "action", fixed: "right", width: 140 },
];

const queryForm = reactive<QueryForm>({
  name: "",
  isShow: undefined,
});

const formState = reactive<API.Category>({
  name: "",
  parentId: "0",
  description: "",
  sortOrder: 0,
  isShow: 1,
  icon: "",
});

const tableData = ref<API.Category[]>([]);
const allCategories = ref<API.Category[]>([]);
const loading = ref(false);
const modalOpen = ref(false);
const isEdit = ref(false);
const editingId = ref<string>();
const submitting = ref(false);
const selectedFile = ref<File>();
const previewObjectUrl = ref<string>();

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
});

const statusFilterOptions = [
  { label: "展示", value: 1 },
  { label: "隐藏", value: 0 },
];

const visibleCount = computed(() => tableData.value.filter((item) => item.isShow === 1).length);
const previewImage = computed(() => {
  if (previewObjectUrl.value) {
    return previewObjectUrl.value;
  }
  if (formState.icon) {
    return getImageUrl(formState.icon);
  }
  return "";
});

const parentOptions = computed(() => [
  { label: "一级分类", value: "0" },
  ...allCategories.value
    .filter((item) => item.id !== editingId.value)
    .map((item) => ({
      label: item.name || `分类 ${item.id}`,
      value: item.id!,
    })),
]);

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

const fetchAllCategories = async () => {
  const res = await listCategory();
  if (res.code === 0) {
    allCategories.value = res.data ?? [];
  }
};

const fetchData = async (reset = false) => {
  if (reset) {
    pagination.current = 1;
  }
  loading.value = true;
  try {
    const res = await listCategoryByPage({
      current: pagination.current,
      pageSize: pagination.pageSize,
      name: queryForm.name.trim() || undefined,
      isShow: queryForm.isShow,
    });
    if (res.code === 0 && res.data) {
      tableData.value = res.data.records ?? [];
      pagination.total = Number(res.data.total ?? 0);
      pagination.current = Number(res.data.current ?? pagination.current);
      pagination.pageSize = Number(res.data.size ?? pagination.pageSize);
      return;
    }
    message.error(res.message || "加载分类失败");
  } catch {
    message.error("加载分类失败");
  } finally {
    loading.value = false;
  }
};

const resetModal = () => {
  modalOpen.value = false;
  isEdit.value = false;
  editingId.value = undefined;
  formState.name = "";
  formState.parentId = "0";
  formState.description = "";
  formState.sortOrder = 0;
  formState.isShow = 1;
  formState.icon = "";
  selectedFile.value = undefined;
  if (previewObjectUrl.value) {
    URL.revokeObjectURL(previewObjectUrl.value);
    previewObjectUrl.value = undefined;
  }
};

const openCreateModal = () => {
  resetModal();
  modalOpen.value = true;
};

const openEditModal = (record: API.Category) => {
  resetModal();
  isEdit.value = true;
  editingId.value = record.id;
  formState.name = record.name ?? "";
  formState.parentId = record.parentId ?? "0";
  formState.description = record.description ?? "";
  formState.sortOrder = record.sortOrder ?? 0;
  formState.isShow = record.isShow ?? 1;
  formState.icon = record.icon ?? "";
  modalOpen.value = true;
};

const handleSelectFile = (file: File) => {
  selectedFile.value = file;
  if (previewObjectUrl.value) {
    URL.revokeObjectURL(previewObjectUrl.value);
  }
  previewObjectUrl.value = URL.createObjectURL(file);
  return false;
};

const uploadPendingImage = async () => {
  if (!selectedFile.value) {
    return formState.icon;
  }
  const res = await uploadFile({ biz: "category" }, selectedFile.value);
  if (res.code !== 0 || !res.data) {
    throw new Error(res.message || "分类图片上传失败");
  }
  return res.data;
};

const handleSubmit = async () => {
  if (submitting.value) {
    return;
  }
  if (!formState.name?.trim()) {
    message.warning("分类名称不能为空");
    return;
  }

  submitting.value = true;
  try {
    const icon = await uploadPendingImage();
    const payload: API.Category = {
      ...formState,
      id: editingId.value,
      name: formState.name.trim(),
      icon: icon || undefined,
      parentId: formState.parentId || "0",
      description: formState.description?.trim() || undefined,
      sortOrder: formState.sortOrder ?? 0,
      isShow: formState.isShow ?? 1,
    };

    const res = isEdit.value ? await updateCategory(payload) : await addCategory(payload);
    if (res.code !== 0) {
      message.error(res.message || "保存分类失败");
      return;
    }

    message.success(isEdit.value ? "分类更新成功" : "分类创建成功");
    resetModal();
    await Promise.all([fetchAllCategories(), fetchData()]);
  } catch (error: any) {
    message.error(error?.message || "保存分类失败");
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id?: string) => {
  if (!id) {
    return;
  }
  const res = await deleteCategory({ id });
  if (res.code !== 0) {
    message.error(res.message || "删除分类失败");
    return;
  }
  message.success("分类已删除");
  if (tableData.value.length === 1 && pagination.current > 1) {
    pagination.current -= 1;
  }
  await Promise.all([fetchAllCategories(), fetchData()]);
};

const handleTableChange = (pageInfo: { current?: number; pageSize?: number }) => {
  pagination.current = pageInfo.current ?? 1;
  pagination.pageSize = pageInfo.pageSize ?? 10;
  fetchData();
};

const handleResetSearch = () => {
  queryForm.name = "";
  queryForm.isShow = undefined;
  fetchData(true);
};

onMounted(async () => {
  await Promise.all([fetchAllCategories(), fetchData()]);
});

onBeforeUnmount(() => {
  if (previewObjectUrl.value) {
    URL.revokeObjectURL(previewObjectUrl.value);
  }
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
  color: #aacdf0;
}

.desc {
  margin: 12px 0 0;
  max-width: 520px;
  line-height: 1.7;
  color: #d3e4f5;
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
  width: 280px;
}

.status-select {
  width: 140px;
}

.table-actions {
  display: flex;
  gap: 4px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;
}

.full-width {
  width: 100%;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #587493;
}

.preview-image {
  display: block;
  margin-top: 12px;
}

@media (max-width: 900px) {
  .toolbar,
  .toolbar-left,
  .toolbar-right,
  .form-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .search-input,
  .status-select {
    width: 100%;
  }
}
</style>
