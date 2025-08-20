<template>
  <div class="user-match-bg">
    <div class="user-match-panel">
      <h2 class="panel-title">智能用户匹配</h2>
      <div class="match-form">
        <el-input-number
          v-model="num"
          :min="1"
          :max="20"
          label="推荐数量"
          style="width: 120px; margin-right: 16px;"
        />
        <el-button type="primary" @click="handleMatch" :loading="loading">开始匹配</el-button>
      </div>
      <div v-if="users.length > 0" class="match-list">
        <el-row :gutter="24">
          <el-col
            v-for="user in users"
            :key="user.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="6"
          >
            <div class="user-card">
              <img :src="user.avatarUrl || defaultAvatar" class="avatar" alt="头像" />
              <div class="user-info">
                <div class="user-name">{{ user.username }}</div>
                <div class="user-tags">
                  <el-tag
                    v-for="tag in (user.tags ? user.tags.split(',') : [])"
                    :key="tag"
                    type="info"
                    size="small"
                    style="margin-right: 4px;"
                  >{{ tag }}</el-tag>
                </div>
                <div class="user-desc">
                  <span>星球编号：{{ user.planetCode }}</span>
                </div>
              
                <router-link
                 :to="`/user/profile?id=${user.id}`" 
                 class="view-btn"
                 style="margin-top:8px;display:inline-block;"
                >
                查看详情
              </router-link>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="!loading" class="empty-tip">暂无匹配结果</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { matchUsers } from '@/api/user-api'

const num = ref(5)
const users = ref([])
const loading = ref(false)
const defaultAvatar = 'https://via.placeholder.com/80x80?text=U'

async function handleMatch() {
  loading.value = true
  users.value = []
  try {
    const res = await matchUsers(num.value)
    if (res && res.code === 0) {
      users.value = res.data || []
    } else {
      users.value = []
    }
  } catch (e) {
    users.value = []
  }
  loading.value = false
  console.log(users.value)
}
</script>

<style scoped>
.user-match-bg {
  min-height: 100vh; /* 保证背景始终铺满屏幕 */
  background: linear-gradient(120deg, #e0e7ff 0%, #f7faff 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 0;
}
.user-match-panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 380px;
  max-width: 1100px;
  width: 100%;
  min-height: 500px; /* 新增，保证内容区高度 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.panel-title {
  font-size: 2rem;
  font-weight: 700;
  color: #232f3e;
  margin-bottom: 32px;
  letter-spacing: 2px;
  text-align: center;
}
.match-form {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  justify-content: center;
}
.match-list {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
.user-card {
  background: linear-gradient(135deg, #f7faff 60%, #e0e7ff 100%);
  border-radius: 14px;
  box-shadow: 0 2px 12px #e3eaff;
  padding: 18px 14px 14px 14px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 100px;
}
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #7faaff;
  background: #f4f7fa;
  flex-shrink: 0;
}
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.user-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #232f3e;
  margin-bottom: 4px;
}
.user-tags {
  margin-bottom: 4px;
}
.user-desc {
  font-size: 0.95rem;
  color: #555;
}
.view-btn {
  margin-top: 8px;
  display: inline-block;
  background: linear-gradient(90deg, #0078ff 0%, #00c6ff 100%);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;
  padding: 4px 18px;
  transition: background 0.2s;
}
.view-btn:hover {
  background: linear-gradient(90deg, #005ecc 0%, #00aaff 100%);
}
.empty-tip {
  text-align: center;
  color: #aaa;
  font-size: 1.1rem;
  margin: 2rem 0;
}
</style>