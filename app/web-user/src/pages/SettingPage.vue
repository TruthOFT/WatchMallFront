<template>
  <div class="setting-page">
    <div class="container">
      <div class="page-header">
        <h1>账户设置</h1>
        <p>管理您的账号安全与收货地址。</p>
      </div>

      <div class="settings-layout liquid-glass">
        <a-tabs v-model:activeKey="activeTab" tab-position="left" class="settings-tabs">
          <a-tab-pane key="security">
            <template #tab>
              <span><lock-outlined /> 账号安全</span>
            </template>
            <div class="tab-content">
              <h3>账号安全</h3>
              <p class="tab-desc">定期更新密码，保护您的账户安全。</p>

              <div class="setting-item">
                <div class="item-info">
                  <h4>修改密码</h4>
                  <p>验证当前密码后设置新密码，修改成功后需要重新登录。</p>
                </div>
                <a-button type="primary" @click="goToChangePassword">去修改</a-button>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="address">
            <template #tab>
              <span><environment-outlined /> 地址管理</span>
            </template>
            <div class="tab-content">
              <div class="header-with-action">
                <div>
                  <h3>收货地址</h3>
                  <p class="tab-desc">管理您的配送地址，结算时可快速选择。</p>
                </div>
                <a-button type="primary" @click="openCreateModal">新增地址</a-button>
              </div>

              <a-skeleton :loading="loading" active :paragraph="{ rows: 4 }">
                <a-empty v-if="addresses.length === 0" description="暂无收货地址">
                  <a-button type="primary" @click="openCreateModal">立即添加</a-button>
                </a-empty>

                <div v-else class="address-list">
                  <div v-for="addr in addresses" :key="addr.id" class="address-card">
                    <div class="addr-header">
                      <a-tag v-if="addr.isDefault === 1" color="gold" class="addr-tag">默认地址</a-tag>
                      <span v-else class="addr-tag-placeholder"></span>
                      <div class="addr-actions">
                        <a-button
                          type="link"
                          size="small"
                          :disabled="addr.isDefault === 1"
                          @click="handleSetDefault(addr)"
                        >
                          设为默认
                        </a-button>
                        <a-button type="link" size="small" @click="openEditModal(addr)">编辑</a-button>
                        <a-popconfirm
                          title="确认删除这个地址吗？"
                          ok-text="删除"
                          cancel-text="取消"
                          @confirm="handleDelete(addr)"
                        >
                          <a-button type="link" size="small" danger>删除</a-button>
                        </a-popconfirm>
                      </div>
                    </div>

                    <div class="addr-body">
                      <p class="addr-name">
                        {{ addr.receiverName }}
                        <span class="addr-phone">{{ addr.receiverPhone }}</span>
                      </p>
                      <p class="addr-detail">{{ formatAddress(addr) }}</p>
                      <p v-if="addr.postalCode" class="addr-meta">邮编：{{ addr.postalCode }}</p>
                    </div>
                  </div>
                </div>
              </a-skeleton>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <a-modal
      v-model:open="modalVisible"
      :title="editingId ? '编辑地址' : '新增地址'"
      :confirm-loading="submitting"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleSubmit"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        layout="vertical"
      >
        <a-form-item label="收货人" name="receiverName">
          <a-input v-model:value="formState.receiverName" :maxlength="64" placeholder="请输入收货人姓名" />
        </a-form-item>

        <a-form-item label="手机号" name="receiverPhone">
          <a-input v-model:value="formState.receiverPhone" :maxlength="32" placeholder="请输入收货人手机号" />
        </a-form-item>

        <div class="region-grid">
          <a-form-item label="省" name="province">
            <a-input v-model:value="formState.province" :maxlength="64" placeholder="省份" />
          </a-form-item>
          <a-form-item label="市" name="city">
            <a-input v-model:value="formState.city" :maxlength="64" placeholder="城市" />
          </a-form-item>
          <a-form-item label="区" name="district">
            <a-input v-model:value="formState.district" :maxlength="64" placeholder="区县" />
          </a-form-item>
        </div>

        <a-form-item label="详细地址" name="detailAddress">
          <a-textarea
            v-model:value="formState.detailAddress"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            :maxlength="255"
            placeholder="请输入详细地址"
          />
        </a-form-item>

        <a-form-item label="邮编" name="postalCode">
          <a-input v-model:value="formState.postalCode" :maxlength="20" placeholder="选填" />
        </a-form-item>

        <div class="default-switch">
          <span>设为默认地址</span>
          <a-switch
            :checked="formState.isDefault === 1"
            @change="handleDefaultChange"
          />
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance } from 'ant-design-vue';
import { EnvironmentOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {
  addAddress,
  deleteAddress,
  getMyAddressDetail,
  listMyAddress,
  setDefaultAddress,
  updateAddress,
} from '@/api/addressController';

type AddressFormState = {
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  postalCode: string;
  isDefault: number;
};

const router = useRouter();
const activeTab = ref('security');
const loading = ref(false);
const submitting = ref(false);
const modalVisible = ref(false);
const editingId = ref<string>();
const addresses = ref<API.UserAddressVO[]>([]);
const formRef = ref<FormInstance>();

const createInitialFormState = (): AddressFormState => ({
  receiverName: '',
  receiverPhone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  postalCode: '',
  isDefault: 0,
});

const formState = reactive<AddressFormState>(createInitialFormState());

const rules: Record<string, Array<Record<string, unknown>>> = {
  receiverName: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  receiverPhone: [
    { required: true, message: '请输入收货人手机号', trigger: 'blur' },
    { min: 6, max: 32, message: '手机号长度需在 6 到 32 位之间', trigger: 'blur' },
  ],
  province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  district: [{ required: true, message: '请输入区县', trigger: 'blur' }],
  detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
};

const goToChangePassword = () => {
  void router.push('/user/change-password');
};

const resetForm = () => {
  Object.assign(formState, createInitialFormState());
  editingId.value = undefined;
  formRef.value?.clearValidate();
};

const formatAddress = (addr: API.UserAddressVO) => {
  return [addr.province, addr.city, addr.district, addr.detailAddress].filter(Boolean).join(' ');
};

const loadAddresses = async () => {
  loading.value = true;
  try {
    const res = await listMyAddress();
    if (res.code === 0) {
      addresses.value = res.data ?? [];
      return;
    }
    message.error(res.message || '地址列表加载失败');
  } catch (error) {
    console.error('Load addresses error:', error);
    message.error('地址列表加载失败');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  resetForm();
  modalVisible.value = true;
};

const openEditModal = async (addr: API.UserAddressVO) => {
  if (!addr.id) {
    message.error('地址数据缺少 id');
    return;
  }
  submitting.value = true;
  try {
    const res = await getMyAddressDetail({ id: addr.id });
    if (res.code !== 0 || !res.data) {
      message.error(res.message || '地址详情加载失败');
      return;
    }
    editingId.value = res.data.id;
    Object.assign(formState, {
      receiverName: res.data.receiverName ?? '',
      receiverPhone: res.data.receiverPhone ?? '',
      province: res.data.province ?? '',
      city: res.data.city ?? '',
      district: res.data.district ?? '',
      detailAddress: res.data.detailAddress ?? '',
      postalCode: res.data.postalCode ?? '',
      isDefault: res.data.isDefault ?? 0,
    });
    modalVisible.value = true;
  } catch (error) {
    console.error('Load address detail error:', error);
    message.error('地址详情加载失败');
  } finally {
    submitting.value = false;
  }
};

const handleSubmit = async () => {
  await formRef.value?.validate();
  submitting.value = true;
  try {
    const payload = {
      ...formState,
      postalCode: formState.postalCode.trim(),
    };
    const res = editingId.value
      ? await updateAddress({ id: editingId.value, ...payload })
      : await addAddress(payload);
    if (res.code !== 0 || !res.data) {
      message.error(res.message || '地址保存失败');
      return;
    }
    message.success(editingId.value ? '地址已更新' : '地址已新增');
    modalVisible.value = false;
    resetForm();
    await loadAddresses();
  } catch (error) {
    console.error('Submit address error:', error);
    message.error('地址保存失败');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (addr: API.UserAddressVO) => {
  if (!addr.id) {
    message.error('地址数据缺少 id');
    return;
  }
  try {
    const res = await deleteAddress({ id: addr.id });
    if (res.code !== 0 || !res.data) {
      message.error(res.message || '地址删除失败');
      return;
    }
    message.success('地址已删除');
    await loadAddresses();
  } catch (error) {
    console.error('Delete address error:', error);
    message.error('地址删除失败');
  }
};

const handleSetDefault = async (addr: API.UserAddressVO) => {
  if (!addr.id) {
    message.error('地址数据缺少 id');
    return;
  }
  try {
    const res = await setDefaultAddress({ id: addr.id });
    if (res.code !== 0 || !res.data) {
      message.error(res.message || '默认地址设置失败');
      return;
    }
    message.success('已设为默认地址');
    await loadAddresses();
  } catch (error) {
    console.error('Set default address error:', error);
    message.error('默认地址设置失败');
  }
};

const handleDefaultChange = (checked: string | number | boolean) => {
  formState.isDefault = checked ? 1 : 0;
};

onMounted(() => {
  void loadAddresses();
});
</script>

<style scoped>
.setting-page {
  padding: 160px 0 100px;
  background-color: var(--color-bg-main);
  min-height: 100vh;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: 8px;
}

.page-header p {
  color: var(--color-secondary);
  font-family: var(--font-heading);
  font-size: 1.2rem;
}

.settings-layout {
  min-height: 600px;
  background: #fff;
}

.settings-tabs {
  height: 100%;
}

:deep(.ant-tabs-nav) {
  width: 250px;
  padding: 32px 0;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

:deep(.ant-tabs-tab) {
  padding: 16px 32px !important;
  font-size: 1rem !important;
  margin: 0 !important;
  transition: all 0.3s;
}

:deep(.ant-tabs-tab-active) {
  background: rgba(202, 138, 4, 0.05);
}

:deep(.ant-tabs-ink-bar) {
  background-color: var(--color-cta) !important;
}

.tab-content {
  padding: 40px 60px;
}

.tab-content h3 {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.tab-desc {
  color: var(--color-text-muted);
  margin-bottom: 40px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.item-info h4 {
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.item-info p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 8px;
}

.header-with-action .tab-desc {
  margin-bottom: 0;
}

.address-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.address-card {
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 18px;
  transition: all 0.3s;
}

.address-card:hover {
  border-color: var(--color-cta);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
}

.addr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.addr-tag {
  margin: 0;
}

.addr-tag-placeholder {
  display: inline-block;
  min-height: 22px;
}

.addr-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.addr-name {
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 8px;
}

.addr-phone {
  font-weight: 400;
  color: var(--color-text-muted);
  font-size: 0.92rem;
  margin-left: 8px;
}

.addr-detail {
  margin: 0;
  color: var(--color-secondary);
  line-height: 1.75;
}

.addr-meta {
  margin: 10px 0 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.default-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 12px 14px;
}

@media (max-width: 900px) {
  :deep(.ant-tabs-nav) {
    width: 100%;
  }

  .header-with-action {
    flex-direction: column;
    align-items: stretch;
  }

  .address-list {
    grid-template-columns: 1fr;
  }

  .region-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

@media (max-width: 640px) {
  .tab-content {
    padding: 28px 20px;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .addr-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .addr-actions {
    flex-wrap: wrap;
  }
}
</style>
