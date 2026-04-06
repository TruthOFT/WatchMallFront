<template>
  <div class="layout-container">
    <header :class="['header', { scrolled: isScrolled, 'search-active': isSearchOpen }]">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">
            PRECISION PATH | WATCH MALL
          </router-link>
        </div>

        <nav :class="['nav-menu', { 'nav-hidden': isSearchOpen }]">
          <router-link to="/" class="nav-item">collections</router-link>
          <router-link to="/about" class="nav-item">brand story</router-link>
          <router-link to="/support" class="nav-item">support</router-link>
        </nav>

        <div class="header-actions">
          <div :class="['search-wrapper', { active: isSearchOpen }]">
            <div class="search-input-container">
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="Search watches, series, or ideas..."
                @keyup.enter="handleSearch"
                @blur="closeSearchIfEmpty"
              />
            </div>
            <div class="icon-btn search-trigger" @click="toggleSearch">
              <close-outlined v-if="isSearchOpen" />
              <search-outlined v-else />
            </div>
          </div>

          <router-link to="/user/cart" class="icon-btn" :class="{ 'hidden-mobile': isSearchOpen }">
            <shopping-outlined />
          </router-link>

          <div v-if="userStore.isLogin" class="user-profile-dropdown" :class="{ 'hidden-mobile': isSearchOpen }">
            <a-dropdown placement="bottomRight">
              <div class="user-info-trigger">
                <a-avatar :src="userStore.loginUser.avatarUrl" :size="32">
                  <template #icon><user-outlined /></template>
                </a-avatar>
                <span class="username">{{ userStore.loginUser.username || userStore.loginUser.userAccount }}</span>
              </div>
              <template #overlay>
                <a-menu class="luxury-menu">
                  <template v-for="item in menuItems" :key="item.key">
                    <a-menu-divider v-if="item.type === 'divider'" />
                    <a-menu-item
                      v-else
                      :key="item.key"
                      @click="item.action"
                      :danger="item.danger"
                    >
                      <template #icon>
                        <component :is="item.icon" />
                      </template>
                      {{ item.label }}
                    </a-menu-item>
                  </template>
                </a-menu>
              </template>
            </a-dropdown>
          </div>

          <router-link v-else to="/user/login" :class="{ 'hidden-mobile': isSearchOpen }">
            <a-button type="primary" class="login-btn">
              Sign In
            </a-button>
          </router-link>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <h3>PRECISION PATH</h3>
          <p>Modern watch design shaped for everyday collectors.</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h4>shop</h4>
            <a href="#">new arrivals</a>
            <a href="#">best sellers</a>
            <a href="#">limited editions</a>
          </div>
          <div class="link-group">
            <h4>brand</h4>
            <router-link to="/about">about us</router-link>
            <a href="#">careers</a>
            <a href="#">press</a>
          </div>
          <div class="link-group">
            <h4>help</h4>
            <router-link to="/support">contact us</router-link>
            <a href="#">shipping & returns</a>
            <router-link to="/faq">faq</router-link>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 PRECISION PATH. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import {
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  HeartOutlined,
  SearchOutlined,
  CloseOutlined,
} from '@ant-design/icons-vue';
import { useUserStore } from '@/config/stores';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const userStore = useUserStore();
const router = useRouter();
const isScrolled = ref(false);
const isSearchOpen = ref(false);
const searchQuery = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (isSearchOpen.value) {
    nextTick(() => {
      searchInput.value?.focus();
    });
  } else {
    searchQuery.value = '';
  }
};

const closeSearchIfEmpty = () => {
  if (searchQuery.value === '') {
    isSearchOpen.value = false;
  }
};

const handleSearch = () => {
  const keyword = searchQuery.value.trim();
  if (!keyword) {
    return;
  }
  void router.push({
    path: '/search',
    query: {
      keyword,
      page: '1',
    },
  });
  isSearchOpen.value = false;
  searchQuery.value = '';
};

const handleLogout = async () => {
  try {
    await userStore.logout();
    message.success('Signed out');
    router.push('/');
  } catch (error) {
    message.error('Sign out failed');
  }
};

const menuItems = [
  {
    key: 'profile',
    label: 'Profile',
    icon: UserOutlined,
    action: () => router.push('/user/profile'),
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: ShoppingOutlined,
    action: () => router.push('/user/orders'),
  },
  {
    key: 'favorites',
    label: 'Favorites',
    icon: HeartOutlined,
    action: () => router.push('/user/favorites'),
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: SettingOutlined,
    action: () => router.push('/user/settings'),
  },
  {
    key: 'divider-1',
    type: 'divider',
  },
  {
    key: 'logout',
    label: 'Sign Out',
    icon: LogoutOutlined,
    danger: true,
    action: handleLogout,
  },
];

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 24px 0;
}

.header.scrolled {
  background: rgba(250, 250, 249, 0.85);
  backdrop-filter: blur(12px);
  padding: 16px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo a {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--color-primary);
  text-decoration: none;
  white-space: nowrap;
}

.nav-menu {
  display: flex;
  gap: 48px;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.nav-menu.nav-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px);
}

.nav-item {
  font-family: var(--font-body);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-primary);
  text-decoration: none;
  position: relative;
  transition: color 0.3s;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: var(--color-cta);
  transition: width 0.3s;
}

.nav-item:hover {
  color: var(--color-cta);
}

.nav-item:hover::after {
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.icon-btn {
  font-size: 20px;
  color: var(--color-primary);
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.icon-btn:hover {
  color: var(--color-cta);
  transform: translateY(-2px);
}

.search-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input-container {
  width: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.search-wrapper.active .search-input-container {
  width: 300px;
  margin-right: 12px;
  opacity: 1;
}

.search-input-container input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-bottom: 1px solid var(--color-primary);
  padding: 8px 0;
  font-size: 16px;
  color: var(--color-primary);
  outline: none;
  font-family: var(--font-body);
}

.search-input-container input::placeholder {
  color: rgba(0, 0, 0, 0.3);
  font-weight: 300;
}

.user-info-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: background 0.3s;
}

.user-info-trigger:hover {
  background: rgba(0, 0, 0, 0.05);
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  font-family: var(--font-body);
}

.luxury-menu {
  min-width: 180px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.footer {
  background-color: var(--color-primary);
  color: var(--color-text-light);
  padding: 100px 0 48px;
  font-family: var(--font-body);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  gap: 100px;
  margin-bottom: 80px;
}

.footer-brand {
  flex: 1;
}

.footer-brand h3 {
  color: #fff;
  font-family: var(--font-heading);
  font-size: 24px;
  letter-spacing: 3px;
  margin-bottom: 24px;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  line-height: 1.8;
  max-width: 280px;
}

.footer-links {
  flex: 2;
  display: flex;
  justify-content: flex-end;
  gap: 80px;
}

.link-group h4 {
  color: #fff;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 32px;
  font-weight: 600;
}

.link-group a {
  display: block;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.link-group a:hover {
  color: var(--color-cta);
  transform: translateX(5px);
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 40px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
  letter-spacing: 1px;
}

@media (max-width: 1024px) {
  .footer-content {
    gap: 60px;
  }

  .footer-links {
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 60px 0 32px;
  }

  .footer-content {
    flex-direction: column;
    gap: 60px;
    text-align: center;
  }

  .footer-brand p {
    max-width: 100%;
  }

  .footer-links {
    flex-direction: column;
    align-items: center;
    gap: 48px;
  }

  .link-group h4 {
    margin-bottom: 24px;
  }
}

@media (max-width: 1024px) {
  .nav-menu {
    gap: 24px;
  }

  .search-wrapper.active .search-input-container {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .hidden-mobile {
    display: v-bind(isSearchOpen ? 'none' : 'flex');
  }

  .search-wrapper.active {
    position: absolute;
    right: 40px;
    width: calc(100vw - 120px);
    background: rgba(255, 255, 255, 0.95);
    padding: 0 15px;
    z-index: 10;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
