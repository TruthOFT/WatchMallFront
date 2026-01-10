<template>
  <div class="profile-container">
    <a-skeleton :loading="loading" active :avatar="{ size: 'large' }" :paragraph="{ rows: 8 }">
      <a-watermark :content="userInfo.username || '精准之路'" :font="{ color: 'rgba(0,0,0,0.04)' }">
        <a-card :bordered="false" class="profile-card">
          <a-flex class="profile-header" align="center" justify="space-between">
            <a-flex align="center" gap="small">
              <a-upload
                  v-model:file-list="fileList"
                  name="file"
                  :action="uploadAvatarAction"
                  :show-upload-list="false"
                  :before-upload="beforeAvatarUpload"
                  :with-credentials="true"
                  @change="handleAvatarChange"
              >
                <a-avatar :size="80" :src="fullAvatarUrl" class="avatar-upload-trigger">
                  <template #icon>
                    <UserOutlined v-if="!userInfo.avatarUrl" />
                  </template>
                  <template v-if="!userInfo.avatarUrl && userInfo.username">{{ userInfo.username?.charAt(0) }}</template>
                </a-avatar>
              </a-upload>

              <div class="user-main-info">
                <a-flex align="center" gap="small">
                  <a-typography-title :level="4" style="margin: 0;">{{ userInfo.username || '未设置昵称' }}</a-typography-title>
                  <a-tag color="black">PRO 会员</a-tag>
                </a-flex>
                <a-typography-text type="secondary">Account ID: {{ userInfo.userAccount }}</a-typography-text>
              </div>
            </a-flex>
            <a-button type="primary" ghost @click="handleEdit">设置资料</a-button>
          </a-flex>
        </a-card>

        <a-row :gutter="[20, 20]" style="margin-top: 20px;">
          <a-col :xs="24" :sm="12" :md="8">
            <a-card title="账户余额" :bordered="false">
              <template #extra><a-button type="link">充值 ></a-button></template>
              <a-statistic title="余额" :value="12850.00" prefix="¥" :precision="2" />
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8">
            <a-card title="精准积分" :bordered="false">
              <template #extra><a-button type="link">兑换礼品 ></a-button></template>
              <a-statistic title="积分" :value="4260" />
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="24" :md="8">
            <a-card title="优惠券" :bordered="false">
              <template #extra><a-button type="link">领券中心 ></a-button></template>
              <a-statistic title="可用" :value="3" suffix="张" />
            </a-card>
          </a-col>
        </a-row>
        <a-row :gutter="[20, 20]" style="margin-top: 20px;">
          <a-col :xs="24" :lg="16">
            <a-card title="详细档案" :bordered="false">
              <a-descriptions :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }" layout="horizontal">
                <a-descriptions-item label="用户角色">
                  <a-badge :status="userInfo.userRole === 'admin' ? 'processing' : 'success'" :text="userInfo.userRole === 'admin' ? '首席管理员' : '普通用户'" />
                </a-descriptions-item>
                <a-descriptions-item label="性别">{{ userInfo.gender === 1 ? '男' : (userInfo.gender === 0 ? '女' : '未知') }}</a-descriptions-item>
                <a-descriptions-item label="电子邮箱">{{ userInfo.email || '未绑定' }}</a-descriptions-item>
                <a-descriptions-item label="联系电话">{{ userInfo.phone || '未绑定' }}</a-descriptions-item>
                <a-descriptions-item label="注册时间">{{ userInfo.createTime }}</a-descriptions-item>
                <a-descriptions-item label="最后登录">{{ userInfo.updateTime }}</a-descriptions-item>
              </a-descriptions>
            </a-card>
          </a-col>

          <a-col :xs="24" :lg="8">
            <a-card title="默认收货地址" :bordered="false">
              <template #extra><a href="#">管理地址</a></template>
              <a-typography-paragraph>
                <strong>{{ userInfo.username }}</strong>
                <a-typography-text type="secondary" style="margin-left: 10px;">138****8000</a-typography-text>
              </a-typography-paragraph>
              <a-typography-paragraph style="margin-bottom: 8px;">
                上海市浦东新区张江高科技园区 核心路 1 号精准大厦 A 座 1201 室
              </a-typography-paragraph>
              <a-tag color="blue">默认</a-tag>
            </a-card>
          </a-col>
        </a-row>
      </a-watermark>
    </a-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { getLoginUser } from '@/api';
import { useUserStore } from '@/config/stores';
import type { LoginUserVo } from '@/api';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue'; // 引入 Ant Design Vue 的上传类型

const userStore = useUserStore();
const userInfo = ref<LoginUserVo>({});
const loading = ref(true);

const fileList = ref<UploadProps['fileList']>([]); // 用于 v-model:file-list
const uploadAvatarAction = ref('http://localhost:8080/api/user/avatar'); // 合并后的上传头像接口

const fullAvatarUrl = computed(() => {
  if (userInfo.value.avatarUrl) {
    return userInfo.value.avatarUrl.startsWith('http') ? userInfo.value.avatarUrl : `http://localhost:8080${userInfo.value.avatarUrl}`;
  }
  return '';
});

// 上传前校验
const beforeAvatarUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const handleAvatarChange = (info: UploadChangeParam) => {
  if (info.file.status === 'done') {
    console.log(info);
    const response = info.file.response;
    if (response && response.code === 0) {
      userInfo.value.avatarUrl = response.data;
      userStore.setLoginUser(userInfo.value);
      message.success('头像上传成功!');
    } else {
      message.error(response?.message || '头像上传失败!');
    }
  } else if (info.file.status === 'error') {
    message.error('头像上传失败，请重试!');
  }
};


// --- 数据加载 ---
const loadData = async () => {
  loading.value = true;
  try {
    const res = await getLoginUser(); // 从后端获取用户完整信息
    if (res.data?.code === 0 && res.data.data) {
      console.log(res.data);
      userInfo.value = res.data.data;
      if (userInfo.value.avatarUrl && !userInfo.value.avatarUrl.startsWith('http')) {
        userInfo.value.avatarUrl = `http://localhost:8080${userInfo.value.avatarUrl}`;
      }
      console.log(userInfo)
      userStore.setLoginUser(userInfo.value);
    }
  } catch (error) {
    message.error("无法加载用户信息");
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadData());

// --- 业务操作 ---
const handleEdit = () => {
  message.info('正在进入安全设置...');
  // 实际会跳转到编辑资料页面
  // router.push('/user/settings');
};
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 10px;
}

.profile-card {
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); /* 替换原来的 apple-shadow */
}

.avatar-upload-trigger {
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-upload-trigger:hover {
  filter: brightness(1.1);
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.2); /* Ant Design Primary Color */
}

.user-main-info {
  flex-grow: 1; /* 占据剩余空间 */
}

</style>