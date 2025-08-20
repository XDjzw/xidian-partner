<template>
  <div class="user-profile">
    <div class="profile-card">
      <div class="profile-header">
        <img
          v-if="targetUser?.avatarUrl"
          :src="targetUser.avatarUrl"
          alt="用户头像"
          class="avatar-image"
        />
        <div class="profile-title">
          <h1>
            <span v-if="isSelf">我的主页</span>
            <span v-else>{{ targetUser?.username || targetUser?.userAccount }} 的主页</span>
          </h1>
          <span class="user-id">ID: {{ targetUser?.id }}</span>
        </div>
      </div>
      <div v-if="targetUser" class="profile-info">
        <div class="info-row">
          <span class="label">用户名</span>
          <span class="value">{{ targetUser.username }}</span>
        </div>
        <div class="info-row">
          <span class="label">班级号</span>
          <span class="value">{{ targetUser.planetCode }}</span>
        </div>
        <div class="info-row">
          <span class="label">性别</span>
          <span class="value">{{ formatGender(targetUser.gender) }}</span>
        </div>
        <div class="info-row">
          <span class="label">注册时间</span>
          <span class="value">{{ formatDate(targetUser.createTime) }}</span>
        </div>
        <div class="info-row">
          <span class="label">手机号</span>
          <span class="value">{{ targetUser.phone }}</span>
        </div>
        <div class="info-row">
          <span class="label">邮箱</span>
          <span class="value">{{ targetUser.email }}</span>
        </div>
        <div class="info-row">
          <span class="label">兴趣标签</span>
          <span class="value tag-list">
            <el-tag
              v-for="tag in (targetUser.tags ? targetUser.tags.split(',') : [])"
              :key="tag"
              type="info"
              effect="plain"
              style="margin-right: 6px;"
            >{{ tag }}</el-tag>
          </span>
        </div>
      </div>
      <div v-else class="loading">加载中...</div>
      <div v-if="isSelf && targetUser" class="actions">
        <router-link :to="`/user/edit?id=${targetUser.id}`" class="edit-btn"
          >编辑资料</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCurrentUser, getUserById } from '@/api/user-api'

export default {
  setup() {
    const route = useRoute()
    const { userId } = route.params

    const targetUser = ref(null)
    const currentUser = ref(null)
    const isSelf = ref(false)

    onMounted(async () => {
      try {
        const currentRes = await getCurrentUser()
        currentUser.value = currentRes.data

        const idStr = route.query.id
        if (idStr) {
          const userRes = await getUserById(idStr)
          targetUser.value = userRes.data
          isSelf.value = currentUser.value.id === Number(idStr)
        } else {
          targetUser.value = currentUser.value
          isSelf.value = true
        }
      } catch (error) {
        console.error('加载用户信息失败:', error)
      }
    })

    const formatGender = (gender) => {
      if (gender === 0) return '男'
      if (gender === 1) return '女'
      return '未知'
    }

    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString()
    }

    return {
      targetUser,
      isSelf,
      formatGender,
      formatDate,
    }
  },
}
</script>

<style scoped>
.user-profile {
  display: flex;
  justify-content: center;
  align-items: flex-start;
    width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e0e7ff 0%, #fff 100%);
 
}
.profile-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 380px;
  max-width: 480px;
  width: 100%;
  animation: fadeIn 0.7s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1.2rem;
}
.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #7faaff;
  margin-right: 1.5rem;
  background: #f4f7fa;
  box-shadow: 0 2px 8px #e3eaff;
}
.profile-title h1 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #232f3e;
  margin: 0;
}
.user-id {
  font-size: 0.95rem;
  color: #7faaff;
  margin-top: 0.5rem;
  display: block;
}
.profile-info {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.08rem;
  padding: 0.3rem 0.2rem;
  border-bottom: 1px dashed #f0f0f0;
}
.info-row:last-child {
  border-bottom: none;
}
.label {
  color: #7faaff;
  font-weight: 500;
  width: 90px;
}
.value {
  color: #232f3e;
  font-weight: 500;
  word-break: break-all;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.tag {
  background: linear-gradient(90deg, #7faaff 0%, #a3e3ff 100%);
  color: #fff;
  border-radius: 12px;
  padding: 0.2rem 0.8rem;
  font-size: 0.95rem;
  margin-right: 0.2rem;
  margin-bottom: 0.2rem;
  box-shadow: 0 1px 4px #e3eaff;
}
.actions {
  margin-top: 2.5rem;
  text-align: right;
}
.edit-btn {
  display: inline-block;
  padding: 0.6rem 1.6rem;
  background: linear-gradient(90deg, #0078ff 0%, #00c6ff 100%);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1.08rem;
  box-shadow: 0 2px 8px #e3eaff;
  transition: background 0.2s;
}
.edit-btn:hover {
  background: linear-gradient(90deg, #005ecc 0%, #00aaff 100%);
}
.loading {
  text-align: center;
  color: #aaa;
  font-size: 1.1rem;
  margin: 2rem 0;
}
</style>