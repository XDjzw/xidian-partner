<template>
  <div class="user-container">
    <!-- 左侧导航 -->
    <aside class="user-sidebar">
      <div class="user-header">
        <img
          :src="currentUser?.avatarUrl || defaultAvatar"
          alt="用户头像"
          class="avatar"
        />
        <h2 class="username">
          {{ currentUser?.username || currentUser?.userAccount || '用户' }}
        </h2>
      </div>

      <nav class="user-nav">
        <ul>
          <li>
            <router-link to="/user/profile">主页</router-link>
          </li>
        
        </ul>
      </nav>
    </aside>

    <!-- 右侧内容 -->
    <main class="user-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCurrentUser } from '@/api/user-api'

const currentUser = ref(null)
const defaultAvatar = 'https://via.placeholder.com/100?text=U'

onMounted(async () => {
  try {
    const res = await getCurrentUser()
    currentUser.value = res.data
  } catch (e) {
    console.error('获取用户信息失败:', e)
  }
})
</script>

<style scoped>
.user-container {
  display: flex;
  height: 100%;
  background: transparent;
}
.user-sidebar {
  width: 200px;
  background-color: #fff;
  padding: 2rem 1.5rem;
  box-shadow: 1px 0 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-right: 32px;
  height: fit-content;
}
.user-main {
  flex: 1;
  padding: 2rem;
  max-width: 800px;
}
</style>