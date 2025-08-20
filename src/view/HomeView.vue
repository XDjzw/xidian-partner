<template>
  <div class="home-bg">
    <div class="home-header">
      <h1>欢迎来到 FriendMatch 平台</h1>
      <p class="subtitle">高效组队 · 智能匹配 · 结识志同道合的伙伴</p>
    </div>
    <div class="card-container">
      <router-link to="/team/list" class="card">
        <div class="card-icon">
          <el-icon><UserFilled /></el-icon>
        </div>
        <div class="card-title">召集大厅</div>
        <div class="card-desc">浏览并加入各类兴趣队伍</div>
      </router-link>
      <router-link to="/team/create" class="card">
        <div class="card-icon">
          <el-icon><Plus /></el-icon>
        </div>
        <div class="card-title">创建队伍</div>
        <div class="card-desc">发起新队伍，寻找队友</div>
      </router-link>
      <router-link to="/guide" class="card">
        <div class="card-icon">
          <el-icon><Document /></el-icon>
        </div>
        <div class="card-title">新手教程</div>
        <div class="card-desc">快速了解平台使用方法</div>
      </router-link>
      <router-link to="/usersearch" class="card">
        <div class="card-icon">
          <el-icon><Search /></el-icon>
        </div>
        <div class="card-title">查找用户</div>
        <div class="card-desc">精准搜索平台用户</div>
      </router-link>
      <router-link to="/usermatch" class="card">
        <div class="card-icon">
          <el-icon><User /></el-icon>
        </div>
        <div class="card-title">匹配用户</div>
        <div class="card-desc">智能推荐合适的队友</div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { UserFilled, Plus, Document, Search, User } from '@element-plus/icons-vue'
</script>

<style scoped>
.home-bg {
  min-height: 100%;
  background: linear-gradient(120deg, #e0e7ff 0%, #f7faff 100%);
  padding-bottom: 60px;
}
.home-header {
  text-align: center;
  padding: 60px 0 30px 0;
}
.home-header h1 {
  font-size: 2.6rem;
  font-weight: 800;
  color: #232f3e;
  margin-bottom: 12px;
  letter-spacing: 2px;
}
.subtitle {
  color: #7faaff;
  font-size: 1.2rem;
  margin-bottom: 0;
  letter-spacing: 1px;
}
.card-container {
  display: flex;
  justify-content: center;
  gap: 36px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}
.card {
  width: 260px;
  height: 260px;
  background: linear-gradient(135deg, #fff 60%, #e0e7ff 100%);
  border-radius: 18px;
  box-shadow: 0 6px 24px 0 rgba(31, 38, 135, 0.10);
  text-decoration: none;
  color: #232f3e;
  transition: transform 0.18s, box-shadow 0.18s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 12px 32px 0 rgba(31, 38, 135, 0.18);
}
.card-icon {
  font-size: 54px;
  color: #409EFF;
  margin-bottom: 18px;
  margin-top: 8px;
  transition: color 0.2s;
}
.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #232f3e;
  margin-bottom: 8px;
  letter-spacing: 1px;
}
.card-desc {
  font-size: 1rem;
  color: #7faaff;
  text-align: center;
  margin-top: 2px;
  padding: 0 10px;
}
@media (max-width: 900px) {
  .card-container {
    gap: 18px;
  }
  .card {
    width: 90vw;
    max-width: 340px;
    height: 180px;
  }
}
</style>