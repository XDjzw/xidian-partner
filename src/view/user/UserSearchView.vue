<template>
  <div class="user-search-bg">
    <div class="user-search-panel">
      <h2 class="title">用户搜索</h2>
      <div class="search-bar">
        <el-input
          v-model="keyword"
          placeholder="请输入用户名或昵称"
          size="large"
          clearable
          @keyup.enter="handleSearchUsers"
          style="flex:1"
        />
        <el-button type="primary" size="large" @click="handleSearchUsers" style="margin-left:12px;">
          搜索
        </el-button>
        <el-select
          v-model="selectedTags"
          multiple
          filterable
          clearable
          allow-create
          placeholder="按标签筛选或自定义"
          style="width: 220px; margin-left: 12px;"
        >
          <el-option
            v-for="tag in allTags"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
        <el-button type="success" size="large" @click="searchByTags" style="margin-left:12px;">
          标签搜索
        </el-button>
      </div>
      <div class="search-result">
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
              <div class="info">
                <div class="username">{{ user.username }}</div>
                <div class="nickname">{{ user.nickname }}</div>
                <div class="tags" v-if="user.tags">
                  <el-tag
                    v-for="tag in user.tags.split(',')"
                    :key="tag"
                    size="small"
                    type="info"
                    effect="plain"
                    style="margin-right:4px;margin-bottom:2px;"
                  >{{ tag }}</el-tag>
                </div>
              </div>
              <router-link :to="`/user/profile?id=${user.id}`" class="view-btn">查看主页</router-link>
            </div>
          </el-col>
        </el-row>
        <div v-if="!users.length && searched" class="empty-tip">
          未找到相关用户
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchUsers as apiSearchUsers, searchUsersByTags } from '@/api/user-api'

const keyword = ref("")
const users = ref([])
const searched = ref(false)
const defaultAvatar = 'https://via.placeholder.com/80x80?text=U'

const allTags = ref(['王者荣耀', '第五人格', '火影忍者', 'zf', '音乐', '运动', '摄影'])
const selectedTags = ref([])

async function handleSearchUsers() {
  if (!keyword.value.trim()) {
    users.value = []
    searched.value = false
    return
  }
  try {
    const res = await apiSearchUsers(keyword.value)
    users.value = res.data || []
  } catch (e) {
    users.value = []
  }
  searched.value = true
}

async function searchByTags() {
  if (!selectedTags.value.length) {
    users.value = []
    searched.value = false
    return
  }
  try {
    const res = await searchUsersByTags(selectedTags.value)
    users.value = res.data || []
  } catch (e) {
    users.value = []
  }
  searched.value = true
}
</script>

<style scoped>
.user-search-bg {
  min-height: 100%;
  background: linear-gradient(120deg, #e0e7ff 0%, #f7faff 100%);
  padding: 48px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.user-search-panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 380px;
  max-width: 1100px;
  width: 100%;
}
.title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #232f3e;
  margin-bottom: 32px;
  letter-spacing: 2px;
}
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.search-result {
  margin-top: 8px;
}
.user-card {
  background: linear-gradient(135deg, #f7faff 60%, #e0e7ff 100%);
  border-radius: 14px;
  box-shadow: 0 2px 12px #e3eaff;
  padding: 24px 18px 18px 18px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.18s, transform 0.18s;
  position: relative;
  min-height: 210px;
}
.user-card:hover {
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  transform: translateY(-4px) scale(1.03);
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #7faaff;
  margin-bottom: 12px;
  background: #f4f7fa;
}
.info {
  text-align: center;
  margin-bottom: 10px;
}
.username {
  font-size: 1.1rem;
  font-weight: 600;
  color: #232f3e;
}
.nickname {
  font-size: 0.98rem;
  color: #7faaff;
  margin-bottom: 4px;
}
.tags {
  margin-top: 4px;
}
.view-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 4px 18px;
  background: linear-gradient(90deg, #0078ff 0%, #00c6ff 100%);
  color: white;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;
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
@media (max-width: 900px) {
  .user-search-panel {
    padding: 1.2rem 0.5rem;
    min-width: unset;
    max-width: 100vw;
  }
  .search-bar {
    flex-direction: column;
    gap: 8px;
  }
}
</style>