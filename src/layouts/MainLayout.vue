<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
        <div class="sidebar-header">
          <h2 v-if="!isCollapse" class="logo-text">伙伴匹配</h2>
          <el-icon v-else class="logo-icon"><User /></el-icon>
        </div>
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
          router
          class="sidebar-menu"
        >
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>
            <template #title>首页</template>
          </el-menu-item>
          <el-menu-item index="/usersearch">
            <el-icon><Search /></el-icon>
            <template #title>用户搜索</template>
          </el-menu-item>
          <el-menu-item index="/usermatch">
            <el-icon><Compass /></el-icon>
            <template #title>用户匹配</template>
          </el-menu-item>
          <el-sub-menu index="team">
            <template #title>
              <el-icon><Avatar /></el-icon>
              <span>队伍</span>
            </template>
            <el-menu-item index="/team/list">队伍列表</el-menu-item>
            <el-menu-item index="/team/create">创建队伍</el-menu-item>
            <el-menu-item index="/team/mycreateteams">我创建的队伍</el-menu-item>
            <el-menu-item index="/team/myjointeams">我加入的队伍</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="user">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>用户中心</span>
            </template>
            <el-menu-item :index="'/user/profile/' + currentUserId">个人主页</el-menu-item>
            <el-menu-item @click="handleLogout">退出登录</el-menu-item>
            <el-menu-item :index="'/friendtest/' + currentUserId">好友测试</el-menu-item>
           
          </el-sub-menu>
        </el-menu>
        <div class="sidebar-footer">
          <el-switch
            v-model="isCollapse"
            inline-prompt
            active-icon="Expand"
            inactive-icon="Fold"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </div>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 头部 -->
        <el-header class="header">
          <div class="header-left">
            <el-icon @click="toggleCollapse" class="collapse-icon">
              <Expand v-if="isCollapse" />
              <Fold v-else />
            </el-icon>
          </div>
          <div class="header-right">
            <el-dropdown>
              <div class="user-info">
                <el-avatar :src="userInfo.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
                <span class="username">{{ userInfo.username }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push('/user/profile/' + currentUserId)">个人中心</el-dropdown-item>
                  <el-dropdown-item @click="$router.push('/user/edit')">编辑资料</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区 -->
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentUser } from '@/api/user-api'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 侧边栏折叠状态
const isCollapse = ref(false)

// 用户信息
const userInfo = ref({
  id: 0,
  username: '',
  avatarUrl: ''
})

const currentUserId = ref(0)

// 当前激活的菜单项
const activeMenu = ref('/home')

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理退出登录
const handleLogout = async () => {
  try {
    // 调用退出登录接口
    // await logout()
    // 清除本地存储的用户信息
    localStorage.removeItem('token')
    // 跳转到登录页
    router.push('/auth/login')
    ElMessage.success('退出登录成功')
  } catch (err) {
    ElMessage.error('退出登录失败')
  }
}

// 获取当前用户信息
const fetchCurrentUser = async () => {
  try {
    const res = await getCurrentUser()
    if (res.code === 0 && res.data) {
      userInfo.value = res.data
      currentUserId.value = res.data.id
    } else {
      ElMessage.error('获取用户信息失败')
      router.push('/auth/login')
    }
  } catch (err) {
    ElMessage.error('获取用户信息失败')
    router.push('/auth/login')
  }
}

// 监听路由变化，更新激活的菜单项
const updateActiveMenu = () => {
  activeMenu.value = route.path
}

onMounted(async () => {
  await fetchCurrentUser()
  updateActiveMenu()
})

// 监听路由变化
router.afterEach(() => {
  updateActiveMenu()
})
</script>

<style scoped>
.common-layout, .el-container {
  height: 100%;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background-color: #2c3e50;
  color: white;
  border-bottom: 1px solid #4a5b6e;
}

.logo-text {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.logo-icon {
  font-size: 24px;
  color: white;
}

.sidebar-menu {
  flex: 1;
  border: none;
}

.sidebar-footer {
  padding: 15px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #4a5b6e;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 10px;
  font-size: 14px;
  color: #606266;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>