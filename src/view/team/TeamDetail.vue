<template>
  <div class="team-detail-bg">
    <div class="team-detail-panel" v-if="team">
      <h2 class="panel-title">{{ team.name }}</h2>
      <div class="team-info">
        <div><b>队伍描述：</b>{{ team.description }}</div>
        <div><b>人数：</b>{{ team.hasJoinNum }}/{{ team.maxNum }}</div>
        <div><b>状态：</b>{{ formatStatus(team.status) }}</div>
        <div><b>截止时间：</b>{{ team.expireTime }}</div>
        <div class="creator-info">
          <b>创建者：</b>
          <img :src="team.createUser?.avatarUrl || defaultAvatar" class="avatar" alt="创建者头像" />
          <span class="creator-name">{{ team.createUser?.username }}</span>
        </div>
      </div>
      <div v-if="!team.hasJoin" class="join-btn-wrap">
        <el-button type="primary" size="large" @click="handleJoin">加入队伍</el-button>
      </div>
      <div v-else class="joined-tip">
        你已加入该队伍
      </div>
    </div>
    <div v-else class="loading">加载中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTeamById, joinTeam } from '@/api/team-api'

const route = useRoute()
const router = useRouter()
const team = ref(null)
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
  const id = route.params.id || route.query.id
  if (!id) {
    alert('参数错误')
    router.back()
    return
  }
  try {
    const res = await getTeamById(id)
    if (res && res.code === 0) {
      team.value = res.data
    } else {
      alert(res.message || '获取队伍信息失败')
      router.back()
    }
  } catch (e) {
    alert('获取队伍信息失败')
    router.back()
  }
})

async function handleJoin() {
  try {
    const res = await joinTeam({ teamId: team.value.id })
    if (res && res.code === 0) {
      alert('加入成功！')
      // 刷新队伍详情
      location.reload()
    } else {
      alert(res.message || '加入失败')
    }
  } catch (e) {
    alert('加入失败')
  }
}
</script>

<style scoped>
.team-detail-bg {
  min-height: 100%;
  background: linear-gradient(120deg, #e0e7ff 0%, #f7faff 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 0;
}
.team-detail-panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 380px;
  max-width: 600px;
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
.team-info {
  font-size: 1.1rem;
  color: #232f3e;
  margin-bottom: 24px;
  line-height: 2;
}
.creator-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
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
  font-size: 1rem;
  color: #232f3e;
}
.join-btn-wrap {
  text-align: center;
  margin-top: 24px;
}
.joined-tip {
  text-align: center;
  color: #7faaff;
  font-size: 1.1rem;
  margin-top: 24px;
}
.loading {
  text-align: center;
  color: #aaa;
  font-size: 1.1rem;
  margin: 2rem 0;
}
</style>