<template>
  <div class="team-create-bg">
    <div class="team-create-panel">
      <h2>创建队伍</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>队伍名称</label>
          <input v-model="form.name" required placeholder="请输入队伍名称" />
        </div>
        <div class="form-group">
          <label>队伍描述</label>
          <input v-model="form.description" placeholder="请输入队伍描述" />
        </div>
        <div class="form-group">
          <label>最大人数</label>
          <input v-model.number="form.maxNum" type="number" min="1" required />
        </div>
        <div class="form-group">
          <label>过期时间</label>
          <input v-model="form.expireTime" type="date" />
        </div>
        <div class="form-group">
          <label>队伍密码（可选）</label>
          <input v-model="form.password" placeholder="如需加密请输入密码" />
        </div>
        <div class="form-group">
          <label>队伍状态</label>
          <select v-model.number="form.status">
            <option :value="0">公开</option>
            <option :value="1">加密</option>
            <option :value="2">私有</option>
          </select>
        </div>
        <button type="submit" class="create-btn">创建队伍</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { addTeam } from '@/api/team-api'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const router = useRouter()
const form = ref({
  name: '',
  description: '',
  maxNum: 5,
  expireTime: '',
  password: '',
  status: 0,
  userId: 0
})

async function handleSubmit() {
  // 格式化截止时间
  if (form.value.expireTime) {
    form.value.expireTime = dayjs(form.value.expireTime).format('YYYY-MM-DD HH:mm:ss')
  }
  try {
    const res = await addTeam(form.value)
    if (res && res.code === 0) {
      alert('创建成功！')
      router.push('/team/MyCreateTeams')
    } else {
      alert(res.data.message || '创建失败')
    }
  } catch (e) {
    alert('创建失败')
  }
}
</script>

<style scoped>
.team-create-bg {
  min-height: 100%;
  background: linear-gradient(120deg, #e0e7ff 0%, #f7faff 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 0;
}
.team-create-panel {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 380px;
  max-width: 480px;
  width: 100%;
}
.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 600;
  margin-bottom: 6px;
}
input, select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e0e7ff;
  font-size: 1rem;
}
.create-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(90deg, #0078ff 0%, #00c6ff 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 16px;
}
.create-btn:hover {
  background: linear-gradient(90deg, #005ecc 0%, #00aaff 100%);
}
</style>