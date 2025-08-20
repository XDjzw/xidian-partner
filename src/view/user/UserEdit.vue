<template>
  <div class="user-edit">
    <form @submit.prevent="submit" v-if="formData" class="edit-form">
      <div class="form-header">
        <img
          v-if="formData.avatarUrl"
          :src="formData.avatarUrl"
          class="avatar"
          alt="头像"
        />
        <h1>编辑资料</h1>
      </div>
      <div class="form-group">
        <label>昵称</label>
        <input v-model="formData.username" required />
      </div>
      <div class="form-group">
        <label>星球编号</label>
        <input v-model="formData.planetCode" />
      </div>
      <div class="form-group">
        <label>性别</label>
        <select v-model.number="formData.gender">
          <option value="-1">请选择</option>
          <option value="0">男</option>
          <option value="1">女</option>
        </select>
      </div>
      <div class="form-group">
        <label>手机号</label>
        <input v-model="formData.phone" />
      </div>
      <div class="form-group">
        <label>邮箱</label>
        <input v-model="formData.email" />
      </div>
     
      <div class="form-group">
        <label>头像链接</label>
        <input v-model="formData.avatarUrl" placeholder="https://example.com/avatar.jpg" />
      </div>
      <div class="form-group">
        <label>兴趣标签</label>
        <div>
          <el-tag
            v-for="tag in tagsArr"
            :key="tag"
            closable
            @close="removeTag(tag)"
            style="margin-right: 8px;"
          >{{ tag }}</el-tag>
          <el-input
            v-model="inputTag"
            size="small"
            placeholder="回车添加"
           @keydown.enter.stop.prevent="addTag"
            style="width: 120px; margin-left: 8px;"
          />
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="save-btn">保存</button>
        <button type="button" class="cancel-btn" @click="$router.back()">取消</button>
      </div>
    </form>
    <div v-else class="loading">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserById, updateUser } from '@/api/user-api'
const inputTag = ref('')
const tagsArr = ref<string[]>([])
interface UserForm {
  id: number
  username: string
  planetCode?: string
  gender: number
  phone?: string
  email?: string
  tags?: string
  avatarUrl?: string
}

const route = useRoute()
const router = useRouter()

const userId = Number(route.query.id)
const formData = ref<UserForm | null>(null)

onMounted(async () => {
  const idStr = route.query.id as string | undefined

  if (!idStr || isNaN(Number(idStr))) {
    alert('参数错误：用户ID不能为空或非法')
    router.back()
    return
  }

  const userId = Number(idStr)

  try {
    const res = await getUserById(userId)
    const user = res.data
    formData.value = {
      id: user.id,
      username: user.username,
      planetCode: user.planetCode || '',
      gender: user.gender !== null ? user.gender : -1,
      phone: user.phone,
      email: user.email,
      tags: user.tags,
      avatarUrl: user.avatarUrl,
    }
  } catch (error) {
    console.error('加载用户失败:', error)
    alert('加载用户信息失败')
    router.back()
  }
})

watch(
  () => formData.value?.tags,
  (val) => {
    tagsArr.value = val ? val.split(',').filter(Boolean) : []
  },
  { immediate: true }
)

function addTag() {
  const tag = inputTag.value.trim()
  if (tag && !tagsArr.value.includes(tag)) {
    tagsArr.value.push(tag)
  }
  inputTag.value = ''
}
function removeTag(tag: string) {
  tagsArr.value = tagsArr.value.filter(t => t !== tag)
}

async function submit() {
  if (!formData.value) return

  // 只在保存时同步 tagsArr 到 formData.tags
  formData.value.tags = tagsArr.value.join(',')

  try {
    await updateUser(formData.value)
    alert('更新成功')
    router.back()
  } catch (error) {
    console.error('更新失败:', error)
    alert('更新失败')
  }
}
</script>

<style scoped>
.user-edit {
  display: flex;
  justify-content: center;
  align-items: flex-start;
    width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e0e7ff 0%, #fff 100%);
  
}
.edit-form {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  
  max-width: 480px;
 
  animation: fadeIn 0.7s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.form-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1.2rem;
}
.form-header .avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #7faaff;
  margin-right: 1.2rem;
  background: #f4f7fa;
  box-shadow: 0 2px 8px #e3eaff;
}
.form-header h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #232f3e;
  margin: 0;
}
.form-group {
  margin-bottom: 1.3rem;
}
label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #7faaff;
}
input,
select {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid #e0e7ff;
  border-radius: 6px;
  background: #f7faff;
  transition: border 0.2s;
  outline: none;
}
input:focus,
select:focus {
  border: 1.5px solid #7faaff;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  margin-top: 2rem;
}
.save-btn {
  background: linear-gradient(90deg, #0078ff 0%, #00c6ff 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.6rem;
  font-weight: 600;
  font-size: 1.08rem;
  box-shadow: 0 2px 8px #e3eaff;
  cursor: pointer;
  transition: background 0.2s;
}
.save-btn:hover {
  background: linear-gradient(90deg, #005ecc 0%, #00aaff 100%);
}
.cancel-btn {
  background: #f0f1f2;
  color: #232f3e;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.6rem;
  font-weight: 500;
  font-size: 1.08rem;
  cursor: pointer;
  transition: background 0.2s;
}
.cancel-btn:hover {
  background: #e0e7ff;
}
.loading {
  text-align: center;
  color: #aaa;
  font-size: 1.1rem;
  margin: 2rem 0;
}
</style>