<template>
  <div class="team-list-bg">
    <div class="team-list-panel">
      <h2 class="panel-title">召集大厅 · 队伍列表</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else>
        <div v-if="teams.length === 0" class="empty-tip">暂无队伍</div>
        <el-row :gutter="24">
          <el-col
            v-for="team in teams"
            :key="team.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="6"
          >
            <div class="team-card">
              <div class="team-title">{{ team.name }}</div>
              <div class="team-desc">{{ team.description }}</div>
              <div class="team-info">
                <span>人数：{{ team.hasJoinNum }}/{{ team.maxNum }}</span>
                <span>状态：{{ formatStatus(team.status) }}</span>
                <span>截止：{{ team.expireTime }}</span>
              </div>
              <div class="creator-info">
                <img :src="team.createUser.avatarUrl || defaultAvatar" class="avatar" alt="创建者头像" />
                <span class="creator-name">{{ team.createUser.username }}</span>
              </div>
              <router-link :to="`/team/detail/${team.id}`" class="view-btn">查看详情</router-link>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listTeams } from '@/api/team-api'

const teams = ref([])
const loading = ref(true)
const defaultAvatar = 'https://via.placeholder.com/40?text=U'

function formatStatus(status) {
  switch (status) {
    case 0: return '公开'
    case 1: return '加密'
    case 2: return '私有'
    default: return '未知'
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await listTeams({})
    if (res && res.code === 0) {
      teams.value = res.data || []
    } else {
      teams.value = []
    }
  } catch (e) {
    teams.value = []
  }
  loading.value = false
})
</script>

<style scoped>
.team-list-bg {
  min-height: 100%;
  background: linear-gradient(120deg, #e0e7ff 0%, #f7faff 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 0;
}
.team-list-panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 380px;
  max-width: 1100px;
  width: 100%;
}
.panel-title {
  font-size: 2rem;
  font-weight: 700;
  color: #232f3e;
  margin-bottom: 32px;
  letter-spacing: 2px;
  text-align: center;
}
.loading {
  text-align: center;
  color: #7faaff;
  font-size: 1.2rem;
  margin: 2rem 0;
}
.empty-tip {
  text-align: center;
  color: #aaa;
  font-size: 1.1rem;
  margin: 2rem 0;
}
.team-card {
  background: linear-gradient(135deg, #f7faff 60%, #e0e7ff 100%);
  border-radius: 14px;
  box-shadow: 0 2px 12px #e3eaff;
  padding: 24px 18px 18px 18px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: box-shadow 0.18s, transform 0.18s;
  position: relative;
  min-height: 180px;
}
.team-card:hover {
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  transform: translateY(-4px) scale(1.03);
}
.team-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #232f3e;
  margin-bottom: 8px;
}
.team-desc {
  font-size: 1rem;
  color: #7faaff;
  margin-bottom: 8px;
}
.team-info {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 10px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.creator-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #7faaff;
  background: #f4f7fa;
}
.creator-name {
  font-size: 0.98rem;
  color: #232f3e;
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
@media (max-width: 900px) {
  .team-list-panel {
    padding: 1.2rem 0.5rem;
    min-width: unset;
    max-width: 100%;
  }
}
</style>