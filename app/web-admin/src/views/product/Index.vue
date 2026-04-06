<template>
  <div class="page-shell">
    <section class="hero-card">
      <div>
        <p class="eyebrow">Product Editor</p>
        <h2>{{ isEditMode ? "编辑商品" : "新增商品" }}</h2>
        <p class="desc">维护商品基础信息、图片和纯 SKU 配置，不再使用属性值映射。</p>
      </div>
      <div class="hero-stats">
        <div class="stat-card">
          <span>已选分类</span>
          <strong>{{ formState.categoryIds.length }}</strong>
        </div>
        <div class="stat-card">
          <span>图片数量</span>
          <strong>{{ imageItems.length }}</strong>
        </div>
        <div class="stat-card">
          <span>SKU 数量</span>
          <strong>{{ skuItems.length }}</strong>
        </div>
      </div>
    </section>

    <section class="panel">
      <a-spin :spinning="loading">
        <a-form layout="vertical">
          <div class="form-grid">
            <a-form-item label="商品名称" required>
              <a-input v-model:value="formState.name" placeholder="请输入商品名称" />
            </a-form-item>

            <a-form-item label="副标题">
              <a-input v-model:value="formState.title" placeholder="请输入副标题" />
            </a-form-item>

            <a-form-item label="价格" required>
              <a-input-number v-model:value="formState.price" class="full-width" :min="0" :precision="2" />
            </a-form-item>

            <a-form-item label="状态">
              <a-select v-model:value="formState.status" :options="statusOptions" />
            </a-form-item>

            <a-form-item label="分类" required>
              <a-select
                v-model:value="formState.categoryIds"
                mode="multiple"
                :options="categoryOptions"
                placeholder="请选择商品分类"
              />
            </a-form-item>

            <a-form-item label="标签">
              <a-select v-model:value="tagValues" mode="tags" placeholder="输入后回车生成标签" />
            </a-form-item>

            <a-form-item class="full-span" label="feature 配置">
              <div class="section-toolbar">
                <a-button @click="addFeatureRow">新增卖点</a-button>
              </div>
              <div class="feature-list">
                <div v-for="(item, index) in featureItems" :key="`feature-${index}`" class="feature-row">
                  <a-input v-model:value="item.label" placeholder="label，例如：材质" />
                  <a-input v-model:value="item.value" placeholder="value，例如：精钢表壳" />
                  <a-button danger type="text" @click="removeFeatureRow(index)">删除</a-button>
                </div>
              </div>
            </a-form-item>

            <a-form-item class="full-span" label="商品描述">
              <a-textarea v-model:value="formState.description" :rows="4" placeholder="请输入商品描述" />
            </a-form-item>
          </div>

          <div class="flag-grid">
            <a-form-item label="首页主推">
              <a-switch v-model:checked="formState.isHero" :checked-value="1" :un-checked-value="0" />
            </a-form-item>
            <a-form-item label="轮播">
              <a-switch v-model:checked="formState.isBanner" :checked-value="1" :un-checked-value="0" />
            </a-form-item>
            <a-form-item label="推荐">
              <a-switch v-model:checked="formState.isRec" :checked-value="1" :un-checked-value="0" />
            </a-form-item>
          </div>

          <a-divider orientation="left">商品图片</a-divider>
          <div class="section-toolbar">
            <a-button type="dashed" @click="addImageRow">新增图片</a-button>
          </div>
          <div class="group-list">
            <div v-for="(item, index) in imageItems" :key="`image-${index}`" class="group-card">
              <div class="group-header">
                <strong>图片 {{ index + 1 }}</strong>
                <a-button danger type="text" :disabled="imageItems.length === 1" @click="removeImageRow(index)">
                  删除
                </a-button>
              </div>

              <div class="image-grid">
                <a-form-item label="图片文件" required>
                  <a-upload :show-upload-list="false" :before-upload="(file) => selectImageFile(index, file)">
                    <a-button>选择图片</a-button>
                  </a-upload>
                  <div v-if="item.pendingFile" class="upload-tip">{{ item.pendingFile.name }}</div>
                  <a-image v-if="getImagePreview(item)" :src="getImagePreview(item)" :width="110" class="preview-image" />
                </a-form-item>

                <a-form-item label="排序">
                  <a-input-number v-model:value="item.sortOrder" class="full-width" :min="0" :precision="0" />
                </a-form-item>

                <a-form-item label="主图">
                  <a-switch
                    v-model:checked="item.isMain"
                    :checked-value="1"
                    :un-checked-value="0"
                    @change="(checked) => onMainImageChange(index, checked)"
                  />
                </a-form-item>
              </div>
            </div>
          </div>

          <a-divider orientation="left">SKU</a-divider>
          <div class="section-toolbar">
            <a-button type="dashed" @click="addSkuRow">新增 SKU</a-button>
          </div>
          <div v-if="skuItems.length === 0" class="empty-tip">SKU 不是必填，按需配置即可。</div>
          <div class="group-list">
            <div v-for="(item, index) in skuItems" :key="`sku-${index}`" class="group-card">
              <div class="group-header">
                <strong>SKU {{ index + 1 }}</strong>
                <a-button danger type="text" @click="removeSkuRow(index)">删除</a-button>
              </div>

              <div class="sku-grid">
                <a-form-item label="SKU 编码">
                  <a-input v-model:value="item.skuCode" />
                </a-form-item>

                <a-form-item label="SKU 名称">
                  <a-input v-model:value="item.skuName" />
                </a-form-item>

                <a-form-item label="SKU 图片">
                  <a-upload :show-upload-list="false" :before-upload="(file) => selectSkuImageFile(index, file)">
                    <a-button>选择图片</a-button>
                  </a-upload>
                  <div v-if="item.pendingImageFile" class="upload-tip">{{ item.pendingImageFile.name }}</div>
                  <a-image v-if="getSkuPreview(item)" :src="getSkuPreview(item)" :width="110" class="preview-image" />
                </a-form-item>

                <a-form-item label="SKU 价格">
                  <a-input-number v-model:value="item.price" class="full-width" :min="0" :precision="2" />
                </a-form-item>

                <a-form-item label="划线价">
                  <a-input-number v-model:value="item.marketPrice" class="full-width" :min="0" :precision="2" />
                </a-form-item>

                <a-form-item label="库存">
                  <a-input-number v-model:value="item.stock" class="full-width" :min="0" :precision="0" />
                </a-form-item>

                <a-form-item label="锁定库存">
                  <a-input-number v-model:value="item.lockStock" class="full-width" :min="0" :precision="0" />
                </a-form-item>
              </div>
            </div>
          </div>

          <div class="actions">
            <a-button @click="router.push('/product/list')">返回列表</a-button>
            <a-button @click="resetForm">重置</a-button>
            <a-button type="primary" :loading="submitting" @click="handleSubmit">
              {{ isEditMode ? "保存修改" : "创建商品" }}
            </a-button>
          </div>
        </a-form>
      </a-spin>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { addProduct, getAdminProductDetail, updateProduct } from "@/api/productController";
import { listCategory } from "@/api/categoryController";
import { uploadFile } from "@/api/fileController";
import { BASE_URL } from "@/request";

type FeatureFormItem = {
  label: string;
  value: string;
};

type ImageFormItem = API.ProductAdminImageItemVO & {
  pendingFile?: File;
  localPreviewUrl?: string;
};

type SkuFormItem = API.ProductAdminSkuItemVO & {
  pendingImageFile?: File;
  localPreviewUrl?: string;
};

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const submitting = ref(false);
const tagValues = ref<string[]>([]);
const categoryOptions = ref<{ label: string; value: string }[]>([]);
const featureItems = ref<FeatureFormItem[]>([{ label: "", value: "" }]);
const imageItems = ref<ImageFormItem[]>([]);
const skuItems = ref<SkuFormItem[]>([]);

const formState = reactive({
  name: "",
  title: "",
  description: "",
  price: undefined as number | undefined,
  isHero: 0,
  isBanner: 0,
  isRec: 0,
  status: 1,
  categoryIds: [] as string[],
});

const statusOptions = [
  { label: "上架", value: 1 },
  { label: "下架", value: 0 },
];

const isEditMode = computed(() => typeof route.params.id === "string" && route.params.id.length > 0);
const productId = computed(() => (typeof route.params.id === "string" ? route.params.id : ""));

const createImageItem = (initial?: Partial<ImageFormItem>): ImageFormItem => ({
  id: initial?.id,
  url: initial?.url,
  isMain: initial?.isMain ?? 0,
  sortOrder: initial?.sortOrder ?? 0,
  createTime: initial?.createTime,
  pendingFile: undefined,
  localPreviewUrl: undefined,
});

const createSkuItem = (initial?: Partial<SkuFormItem>): SkuFormItem => ({
  id: initial?.id,
  skuCode: initial?.skuCode,
  skuName: initial?.skuName,
  image: initial?.image,
  price: initial?.price ?? 0,
  marketPrice: initial?.marketPrice ?? 0,
  stock: initial?.stock ?? 0,
  lockStock: initial?.lockStock ?? 0,
  version: initial?.version,
  createTime: initial?.createTime,
  updateTime: initial?.updateTime,
  pendingImageFile: undefined,
  localPreviewUrl: undefined,
});

const resolveImageUrl = (path?: string) => {
  if (!path) {
    return "";
  }
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};

const getImagePreview = (item: ImageFormItem) => item.localPreviewUrl || resolveImageUrl(item.url);
const getSkuPreview = (item: SkuFormItem) => item.localPreviewUrl || resolveImageUrl(item.image);

const cleanupPreviewUrls = () => {
  imageItems.value.forEach((item) => {
    if (item.localPreviewUrl) {
      URL.revokeObjectURL(item.localPreviewUrl);
    }
  });
  skuItems.value.forEach((item) => {
    if (item.localPreviewUrl) {
      URL.revokeObjectURL(item.localPreviewUrl);
    }
  });
};

const resetForm = () => {
  cleanupPreviewUrls();
  formState.name = "";
  formState.title = "";
  formState.description = "";
  formState.price = undefined;
  formState.isHero = 0;
  formState.isBanner = 0;
  formState.isRec = 0;
  formState.status = 1;
  formState.categoryIds = [];
  tagValues.value = [];
  featureItems.value = [{ label: "", value: "" }];
  imageItems.value = [createImageItem({ isMain: 1, sortOrder: 0 })];
  skuItems.value = [];
};

const fetchCategories = async () => {
  const res = await listCategory();
  if (res.code === 0) {
    categoryOptions.value = (res.data ?? [])
      .filter((item): item is API.Category & { id: string } => Boolean(item.id))
      .map((item) => ({
        label: item.name || `分类 ${item.id}`,
        value: item.id,
      }));
  }
};

const parseFeature = (feature?: string) => {
  if (!feature) {
    return [{ label: "", value: "" }];
  }
  try {
    const parsed = JSON.parse(feature) as FeatureFormItem[];
    return parsed.length > 0 ? parsed : [{ label: "", value: "" }];
  } catch {
    return [{ label: "", value: "" }];
  }
};

const fetchDetail = async () => {
  if (!isEditMode.value || !productId.value) {
    return;
  }
  loading.value = true;
  try {
    const res = await getAdminProductDetail({ id: productId.value });
    if (res.code !== 0 || !res.data) {
      message.error(res.message || "加载商品详情失败");
      return;
    }
    const detail = res.data;
    cleanupPreviewUrls();
    formState.name = detail.name ?? "";
    formState.title = detail.title ?? "";
    formState.description = detail.description ?? "";
    formState.price = detail.price;
    formState.isHero = detail.isHero ?? 0;
    formState.isBanner = detail.isBanner ?? 0;
    formState.isRec = detail.isRec ?? 0;
    formState.status = detail.status ?? 1;
    formState.categoryIds = detail.categoryIds ?? [];
    tagValues.value = (detail.tags || "").split(",").map((item) => item.trim()).filter(Boolean);
    featureItems.value = parseFeature(detail.feature);
    imageItems.value = detail.images && detail.images.length > 0
      ? detail.images.map((item) => createImageItem(item))
      : [createImageItem({ isMain: 1 })];
    skuItems.value = (detail.skus ?? []).map((item) => createSkuItem(item));
  } finally {
    loading.value = false;
  }
};

const addFeatureRow = () => {
  featureItems.value.push({ label: "", value: "" });
};

const removeFeatureRow = (index: number) => {
  featureItems.value.splice(index, 1);
  if (featureItems.value.length === 0) {
    featureItems.value = [{ label: "", value: "" }];
  }
};

const addImageRow = () => {
  imageItems.value.push(createImageItem({ isMain: 0, sortOrder: 0 }));
};

const removeImageRow = (index: number) => {
  const current = imageItems.value[index];
  if (current?.localPreviewUrl) {
    URL.revokeObjectURL(current.localPreviewUrl);
  }
  imageItems.value.splice(index, 1);
  if (imageItems.value.length === 0) {
    imageItems.value = [createImageItem({ isMain: 1, sortOrder: 0 })];
  }
  if (!imageItems.value.some((item) => item.isMain === 1)) {
    imageItems.value[0].isMain = 1;
  }
};

const selectImageFile = (index: number, file: File) => {
  const target = imageItems.value[index];
  if (!target) {
    return false;
  }
  if (target.localPreviewUrl) {
    URL.revokeObjectURL(target.localPreviewUrl);
  }
  target.pendingFile = file;
  target.localPreviewUrl = URL.createObjectURL(file);
  return false;
};

const onMainImageChange = (index: number, checked: string | number | boolean) => {
  if (Number(checked) !== 1) {
    return;
  }
  imageItems.value = imageItems.value.map((item, itemIndex) => ({
    ...item,
    isMain: itemIndex === index ? 1 : 0,
  }));
};

const addSkuRow = () => {
  skuItems.value.push(createSkuItem());
};

const removeSkuRow = (index: number) => {
  const current = skuItems.value[index];
  if (current?.localPreviewUrl) {
    URL.revokeObjectURL(current.localPreviewUrl);
  }
  skuItems.value.splice(index, 1);
};

const selectSkuImageFile = (index: number, file: File) => {
  const target = skuItems.value[index];
  if (!target) {
    return false;
  }
  if (target.localPreviewUrl) {
    URL.revokeObjectURL(target.localPreviewUrl);
  }
  target.pendingImageFile = file;
  target.localPreviewUrl = URL.createObjectURL(file);
  return false;
};

const normalizeFeature = () => {
  const result = featureItems.value
    .map((item) => ({
      label: item.label.trim(),
      value: item.value.trim(),
    }))
    .filter((item) => item.label || item.value);
  if (result.some((item) => !item.label || !item.value)) {
    message.warning("feature 的 label 和 value 必须成对填写");
    return null;
  }
  return result;
};

const uploadImageIfNeeded = async (file: File | undefined, currentUrl?: string) => {
  if (!file) {
    return currentUrl;
  }
  const res = await uploadFile({ biz: "product" }, file);
  if (res.code !== 0 || !res.data) {
    throw new Error(res.message || "图片上传失败");
  }
  return res.data;
};

const normalizeImages = async () => {
  const result: API.ImageItem[] = [];
  for (const item of imageItems.value) {
    const url = await uploadImageIfNeeded(item.pendingFile, item.url);
    if (!url) {
      continue;
    }
    result.push({
      url,
      isMain: item.isMain === 1 ? 1 : 0,
      sortOrder: item.sortOrder ?? 0,
    });
  }
  if (result.length === 0) {
    message.warning("至少保留一张商品图片");
    return null;
  }
  if (!result.some((item) => item.isMain === 1)) {
    result[0].isMain = 1;
  }
  return result;
};

const normalizeSkus = async () => {
  const result: API.SkuItem[] = [];
  for (const item of skuItems.value) {
    const hasContent = Boolean(
      item.skuCode?.trim() ||
        item.skuName?.trim() ||
        item.image ||
        item.pendingImageFile ||
        item.price ||
        item.marketPrice ||
        item.stock ||
        item.lockStock
    );
    if (!hasContent) {
      continue;
    }
    const image = await uploadImageIfNeeded(item.pendingImageFile, item.image);
    result.push({
      skuCode: item.skuCode?.trim() || undefined,
      skuName: item.skuName?.trim() || undefined,
      image: image || undefined,
      price: item.price ?? 0,
      marketPrice: item.marketPrice ?? 0,
      stock: item.stock ?? 0,
      lockStock: item.lockStock ?? 0,
    });
  }
  return result;
};

const handleSubmit = async () => {
  if (submitting.value) {
    return;
  }
  if (!formState.name.trim()) {
    message.warning("商品名称不能为空");
    return;
  }
  if (formState.price === undefined || formState.price < 0) {
    message.warning("商品价格不能为空");
    return;
  }
  if (formState.categoryIds.length === 0) {
    message.warning("至少选择一个分类");
    return;
  }

  const feature = normalizeFeature();
  if (!feature) {
    return;
  }

  submitting.value = true;
  try {
    const images = await normalizeImages();
    if (!images) {
      return;
    }
    const skus = await normalizeSkus();
    const payload: API.UpdateProductRequest = {
      id: productId.value || undefined,
      name: formState.name.trim(),
      title: formState.title.trim() || undefined,
      description: formState.description.trim() || undefined,
      price: formState.price,
      isHero: formState.isHero,
      isBanner: formState.isBanner,
      isRec: formState.isRec,
      status: formState.status,
      categoryIds: [...formState.categoryIds],
      tags: tagValues.value.map((item) => item.trim()).filter(Boolean).join(",") || undefined,
      feature: feature.length > 0 ? JSON.stringify(feature) : undefined,
      images,
      skus: skus.length > 0 ? skus : undefined,
    };

    const res = isEditMode.value ? await updateProduct(payload) : await addProduct(payload);
    if (res.code !== 0) {
      message.error(res.message || "保存商品失败");
      return;
    }
    message.success(isEditMode.value ? "商品更新成功" : "商品创建成功");
    await router.replace("/product/list");
  } catch (error: any) {
    message.error(error?.message || "保存商品失败");
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  resetForm();
  await fetchCategories();
  if (isEditMode.value) {
    await fetchDetail();
  }
});

onBeforeUnmount(() => {
  cleanupPreviewUrls();
});
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
  background: linear-gradient(120deg, rgba(15, 52, 98, 0.95) 0%, rgba(18, 112, 189, 0.9) 100%);
  color: #f4f9ff;
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  font-size: 12px;
  color: #b4d6f3;
}

.hero-card h2 {
  margin: 0;
  font-size: 30px;
}

.desc {
  margin: 12px 0 0;
  max-width: 620px;
  line-height: 1.7;
  color: #d8e8f7;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(110px, 1fr));
  gap: 12px;
  min-width: 360px;
}

.stat-card {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
}

.stat-card span {
  display: block;
  font-size: 12px;
  color: #d5e9fb;
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  font-size: 28px;
}

.panel {
  padding: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.flag-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 16px;
}

.full-width {
  width: 100%;
}

.full-span {
  grid-column: 1 / -1;
}

.section-toolbar {
  margin-bottom: 12px;
}

.feature-list,
.group-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  gap: 10px;
}

.group-card {
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(186, 201, 218, 0.55);
  background: rgba(250, 252, 255, 0.8);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.image-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 0 16px;
}

.sku-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 16px;
}

.preview-image {
  display: block;
  margin-top: 10px;
}

.upload-tip,
.empty-tip {
  margin-top: 8px;
  color: #5e7694;
  font-size: 12px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 1080px) {
  .hero-card,
  .feature-row {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .hero-stats {
    grid-template-columns: 1fr;
    min-width: 0;
  }

  .form-grid,
  .flag-grid,
  .image-grid,
  .sku-grid {
    grid-template-columns: 1fr;
  }
}
</style>
