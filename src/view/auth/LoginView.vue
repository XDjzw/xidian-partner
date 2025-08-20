

<template>
 
 <el-form class="login-form" :model="loginData" label-position="top" @submit.prevent="handleLogin">
    <h3>用户登录</h3>

    <el-form-item label="账号">
      <el-input v-model="loginData.userAccount" placeholder="请输入账号" />
    </el-form-item>

    <el-form-item label="密码">
      <el-input v-model="loginData.userPassword" type="password" show-password placeholder="请输入密码" />
    </el-form-item>

    <el-button type="primary" native-type="submit" :loading="loadingstate" style="width: 100%">
      {{ loadingstate ? '登录中...' : '立即登录' }}
    </el-button>

    <p class="tip">
      没有账号？
      <router-link to="/auth/register">立即注册</router-link>
    </p>
  </el-form>
</template>





<script lang="ts" setup>
import {ref} from 'vue'
import axios from 'axios'
import {useRouter} from  'vue-router'
import request from '@/request/request.ts'
const router =useRouter()

const loginData=ref({
    userAccount: '',
    userPassword:''
})


const loadingstate=ref(false)

const handleLogin =async()=>{
    try{

        loadingstate.value=true
        const response = await request.post('/user/login', loginData.value)
//request.post('/user/login', loginData.value)
//axios.post('/api/user/login',loginData.value)
console.log(response)
console.log(response.data)
       if (response.data && Object.keys(response.data).length > 0) {
      alert('登录成功')
      router.push('/home')
    } else {
      alert('登录失败：账号或密码错误')
    }
    }catch(error){
        console.error('登录出错：', error)
    }finally {
    loadingstate.value = false; // 无论如何都要关闭 loading
  }
}

</script>

<style scoped>

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h3 {
  text-align: center;
  color: #333;
}

.tip {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.tip a {
  color: #42b983;
  text-decoration: underline;
}

</style>