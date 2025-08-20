<template>
  <div class="add-friend-test">
    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <span>搜索用户</span>
        </div>
      </template>
      
      <el-form :model="searchForm" @submit.prevent="handleSearch">
        <el-form-item label="用户名">
          <el-input 
            v-model="searchForm.username" 
            placeholder="请输入用户名" 
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleSearch" 
            :loading="searchLoading"
          >
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="results-card">
      <template #header>
        <div class="card-header">
          <span>搜索结果</span>
        </div>
      </template>
      
      <div v-if="searchLoading" class="loading">
        <el-skeleton v-for="i in 3" :key="i" :rows="3" animated />
      </div>
      
      <div v-else-if="searchResults.length > 0">
        <el-row :gutter="20">
          <el-col 
            v-for="user in searchResults" 
            :key="user.id" 
            :span="24" 
            class="user-item"
          >
            <el-card shadow="hover">
              <el-row :gutter="10" align="middle">
                <el-col :span="3">
                  <el-avatar :src="user.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
                </el-col>
                <el-col :span="15">
                  <div class="user-info">
                    <div class="user-name">{{ user.username }}</div>
                    <div class="user-tags">
                      <el-tag 
                        v-for="tag in user.tags" 
                        :key="tag" 
                        size="small" 
                        type="info"
                        style="margin-right: 5px;"
                      >
                        {{ tag }}
                      </el-tag>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6" style="text-align: right;">
                  <el-button 
                    size="small" 
                    type="primary" 
                    @click="addFriend(user.id)"
                    :loading="addingFriendId === user.id"
                    :disabled="user.id === currentUserId"
                  >
                    {{ user.id === currentUserId ? '自己' : '添加好友' }}
                  </el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <el-empty v-else description="暂无搜索结果" />
    </el-card>

    <!-- 好友请求通知 -->
    <el-drawer
      v-model="showFriendRequests"
      title="好友请求通知"
      direction="rtl"
      size="30%"
    >
      <div v-if="friendRequests.length === 0" class="no-requests">
        <el-empty description="暂无好友请求" />
      </div>
      
      <div v-else>
        <el-card 
          v-for="request in friendRequests" 
          :key="request.id" 
          class="request-card"
        >
          <div class="request-info">
            <div class="request-user">{{ request.username }}</div>
            <div class="request-actions">
              <el-button 
                type="primary" 
                size="small" 
                @click="handleFriendRequestFunc(request.fromUserId || request.id, 1)"
                :loading="processingRequestId === (request.fromUserId || request.id)"
              >
                同意
              </el-button>
              <el-button 
                type="info" 
                size="small" 
                @click="handleFriendRequestFunc(request.fromUserId || request.id, 0)"
                :loading="processingRequestId === (request.fromUserId || request.id)"
              >
                拒绝
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-drawer>
    
    <!-- 好友列表 -->
    <el-card class="friend-list-card">
      <template #header>
        <div class="card-header">
          <span>我的好友</span>
          <el-button class="button" type="primary" @click="loadFriendList" :loading="friendListLoading">
            刷新
          </el-button>
        </div>
      </template>
      
      <div v-if="friendListLoading" class="loading">
        <el-skeleton v-for="i in 3" :key="i" :rows="3" animated />
      </div>
      
      <div v-else-if="friendList.length > 0">
        <el-row :gutter="20">
          <el-col 
            v-for="friend in friendList" 
            :key="friend.id" 
            :span="24" 
            class="friend-item"
          >
            <el-card shadow="hover">
              <el-row :gutter="10" align="middle">
                <el-col :span="3">
                  <el-avatar :src="friend.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
                </el-col>
                <el-col :span="15">
                  <div class="friend-info">
                    <div class="friend-name">{{ friend.username }}</div>
                    <div class="friend-tags">
                      <el-tag 
                        v-for="tag in friend.tags" 
                        :key="tag" 
                        size="small" 
                        type="info"
                        style="margin-right: 5px;"
                      >
                        {{ tag }}
                      </el-tag>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6" style="text-align: right;">
                  <el-button 
                    size="small" 
                    type="danger" 
                    @click="deleteFriendFunc(friend.id)"
                  >
                    删除好友
                  </el-button>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <el-empty v-else description="暂无好友" />
    </el-card>
    
    <!-- WebSocket状态显示 -->
    <el-card class="websocket-status-card">
      <template #header>
        <div class="card-header">
          <span>WebSocket状态</span>
        </div>
      </template>
      <div>
        <p>连接状态: {{ websocketStatus }}</p>
        <p>用户ID: {{ currentUserId || '未获取' }}</p>
        <el-button @click="reconnectWebSocket" :disabled="websocketConnecting">
          {{ websocketConnecting ? '连接中...' : '重新连接' }}
        </el-button>
        <el-button @click="showFriendRequests = true" style="margin-left: 10px;">
          查看好友请求 ({{ friendRequests.length }})
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import websocketService from '@/services/websocket'
import { getCurrentUser, searchUsers, addFriendRequest, getFriendList, handleFriendRequest, deleteFriend, getFriendRequestCount } from '@/api/user-api'

// 响应式数据
const searchForm = ref({
  username: ''
})

const searchResults = ref([])
const searchLoading = ref(false)

const friendList = ref([])
const friendListLoading = ref(false)

const addingFriendId = ref(null)
const processingRequestId = ref(null) // 用于跟踪正在处理的请求ID
const showFriendRequests = ref(false)
const friendRequests = ref([])

// WebSocket状态相关
const websocketStatus = ref('未连接')
const websocketConnecting = ref(false)
const currentUserId = ref(null)

console.log('FriendTestView component loaded')

// 搜索用户
const handleSearch = async () => {
  searchLoading.value = true
  try {
    const res = await searchUsers(searchForm.value.username)
    if (res.code === 0) {
      // 过滤掉当前用户自己
      searchResults.value = (res.data || []).filter(user => user.id !== currentUserId.value)
    } else {
      ElMessage.error('搜索用户失败: ' + (res.message || '未知错误'))
    }
  } catch (err) {
    ElMessage.error('搜索用户失败: ' + (err.message || '未知错误'))
    console.error(err)
  } finally {
    searchLoading.value = false
  }
}

// 添加好友
const addFriend = async (friendId) => {
  // 验证不能添加自己为好友
  if (friendId === currentUserId.value) {
    ElMessage.warning('不能添加自己为好友')
    return
  }
  
  addingFriendId.value = friendId
  try {
    const res = await addFriendRequest({ friendId })
    if (res.code === 0) {
      ElMessage.success('好友请求已发送')
    } else {
      ElMessage.error('发送好友请求失败: ' + (res.message || '未知错误'))
    }
  } catch (err) {
    ElMessage.error('发送好友请求失败: ' + (err.message || '未知错误'))
    console.error(err)
  } finally {
    addingFriendId.value = null
  }
}

// 加载好友列表
const loadFriendList = async () => {
  if (!currentUserId.value) {
    ElMessage.warning('用户信息未获取')
    return
  }
  
  friendListLoading.value = true
  try {
    const res = await getFriendList()
    if (res.code === 0) {
      friendList.value = res.data || []
    } else {
      ElMessage.error('加载好友列表失败: ' + (res.message || '未知错误'))
    }
  } catch (err) {
    ElMessage.error('加载好友列表失败: ' + (err.message || '未知错误'))
    console.error(err)
  } finally {
    friendListLoading.value = false
  }
}

// 处理好友请求
const handleFriendRequestFunc = async (friendId, status) => {
 processingRequestId.value = friendId
  try {
    const res = await handleFriendRequest({ friendId, status })
    if (res.code === 0) {
      ElMessage.success(status === 1 ? '已同意好友请求' : '已拒绝好友请求')
      // 重新加载好友列表
      await loadFriendList()
      // 更新请求列表
      friendRequests.value = friendRequests.value.filter(req => req.fromUserId !== friendId)
    } else {
      ElMessage.error('处理好友请求失败: ' + (res.message || '未知错误'))
    }
  } catch (err) {
    ElMessage.error('处理好友请求失败: ' + (err.message || '未知错误'))
    console.error(err)
  } finally {
    processingRequestId.value = null
  }
}

// 删除好友
const deleteFriendFunc = (friendId) => {
  ElMessageBox.confirm('确定要删除该好友吗?', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      const res = await deleteFriend({ friendId })
      if (res.code === 0) {
        ElMessage.success('删除成功')
        // 重新加载好友列表
        await loadFriendList()
      } else {
        ElMessage.error('删除好友失败: ' + (res.message || '未知错误'))
      }
    } catch (err) {
      ElMessage.error('删除好友失败: ' + (err.message || '未知错误'))
      console.error(err)
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 获取好友请求数量
const getFriendRequestCountFunc = async () => {
  try {
    const res = await getFriendRequestCount()
    if (res.code === 0) {
      // 如果有未处理的请求，显示通知
      if (res.data > 0) {
        ElMessage.info(`您有 ${res.data} 条好友请求`)
      }
      return res.data
    }
  } catch (err) {
    console.error('获取好友请求数量失败:', err)
  }
  return 0
}

// WebSocket事件处理
const handleFriendRequestMessage = (data) => {
   console.log('收到好友请求消息:', data);
  
  // 检查是否包含必要的用户信息
  if (data.fromUserId) {
    ElMessage.success('收到新的好友请求: ' + (data.fromUsername || '未知用户'));
    // 将请求添加到通知列表中
    friendRequests.value.push({
      id: data.fromUserId,  // 使用发送方ID作为请求标识
      fromUserId: data.fromUserId,
      username: data.fromUsername || '未知用户',
      message: data.message,
      type: data.type
    });
  } else {
    // 如果没有用户信息，显示通用消息
    ElMessage.success('收到新的好友请求，请查看好友请求列表');
    // 添加一个占位符请求
    friendRequests.value.push({
      id: Date.now(),
      message: data.message || '新的好友请求',
      type: data.type
    });
  }
}

const handleFriendResponseMessage = (data) => {
  console.log('收到好友响应消息:', data);
  if (data.status === 1) {
    ElMessage.success(`${data.username} 已同意您的好友请求`)
    // 重新加载好友列表
    loadFriendList()
  } else {
    ElMessage.info(`${data.username} 已拒绝您的好友请求`)
  }
}

const handleFriendRemovedMessage = (data) => {
  console.log('收到好友移除消息:', data);
  ElMessage.info('有好友关系被解除')
  // 重新加载好友列表
  loadFriendList()
}

// 更新WebSocket状态
const updateWebsocketStatus = () => {
  websocketStatus.value = websocketService.getConnectedStatus() ? '已连接' : '未连接'
}

// 重新连接WebSocket
const reconnectWebSocket = async () => {
  websocketConnecting.value = true
  try {
    if (currentUserId.value) {
      websocketService.disconnect()
      websocketService.connect(currentUserId.value)
      // 等待一小段时间后检查连接状态
      setTimeout(() => {
        updateWebsocketStatus()
        websocketConnecting.value = false
      }, 1000)
    } else {
      ElMessage.warning('用户ID未获取，请刷新页面重试')
      websocketConnecting.value = false
    }
  } catch (err) {
    ElMessage.error('重新连接失败: ' + (err.message || '未知错误'))
    websocketConnecting.value = false
  }
}

// 初始化WebSocket连接
const initWebSocket = async () => {
  try {
    // 获取当前用户信息
    console.log('Getting current user info...')
    const userInfo = await getCurrentUser()
    console.log('Current user info:', userInfo)
    
    if (userInfo.code === 0 && userInfo.data) {
      currentUserId.value = userInfo.data.id
      console.log('Current user ID:', currentUserId.value)
      
      // 连接WebSocket
      console.log('Connecting to WebSocket with user ID:', currentUserId.value)
      websocketService.connect(currentUserId.value)
      
      // 注册事件监听器
      websocketService.on('friendRequest', handleFriendRequestMessage)
      websocketService.on('friendResponse', handleFriendResponseMessage)
      websocketService.on('friendRemoved', handleFriendRemovedMessage)
      websocketService.on('connected', async () => {
        websocketStatus.value = '已连接'
        ElMessage.success('WebSocket连接成功')
        console.log('WebSocket connected for user:', currentUserId.value)
        
        // WebSocket连接成功后，检查是否有未读的好友请求
        await getFriendRequestCountFunc()
      })
      websocketService.on('disconnected', () => {
        websocketStatus.value = '已断开'
        ElMessage.warning('WebSocket连接已断开')
        console.log('WebSocket disconnected for user:', currentUserId.value)
      })
      websocketService.on('error', (error) => {
        websocketStatus.value = '连接错误'
        console.error('WebSocket error for user ' + currentUserId.value + ':', error)
        ElMessage.error('WebSocket连接错误')
      })
      
      // 初始化状态
      updateWebsocketStatus()
    } else {
      ElMessage.error('获取用户信息失败: ' + (userInfo.message || '未知错误'))
    }
  } catch (err) {
    console.error('初始化WebSocket失败', err)
    ElMessage.error('初始化WebSocket失败: ' + (err.message || '未知错误'))
  }
}

// 组件挂载时执行
onMounted(async () => {
  console.log('FriendTestView mounted')
  try {
    await initWebSocket()
    // 确保获取到用户ID后再加载好友列表
    if (currentUserId.value) {
      await loadFriendList()
    }
  } catch (err) {
    console.error('组件初始化失败', err)
    ElMessage.error('组件初始化失败: ' + (err.message || '未知错误'))
  }
})

// 组件卸载时清理
onUnmounted(() => {
  websocketService.disconnect()
})
</script>

<style scoped>
.add-friend-test {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-item, .friend-item {
  margin-bottom: 15px;
}

.user-info, .friend-info {
  display: flex;
  flex-direction: column;
}

.user-name, .friend-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.user-tags, .friend-tags {
  margin-top: 5px;
}

.request-card {
  margin-bottom: 15px;
}

.request-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.request-user {
  font-weight: bold;
}

.no-requests {
  text-align: center;
  padding: 20px;
}

.search-card, .results-card, .friend-list-card, .websocket-status-card {
  margin-bottom: 20px;
}
</style>