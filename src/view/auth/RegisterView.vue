

<template>
 
<el-form class="login-form" :model="registerData" label-position="top" @submit.prevent="handleregister">
    <h3>用户注册</h3>

    <el-form-item label="账号">
      <el-input v-model="registerData.userAccount" placeholder="请输入账号" />
    </el-form-item>

    <el-form-item label="密码">
      <el-input v-model="registerData.userPassword" type="password" show-password placeholder="请输入密码" />
    </el-form-item>


     <el-form-item label="确认密码">
      <el-input v-model="registerData.checkPassword" type="password" show-password placeholder="请确认密码" />
    </el-form-item>


    <el-button type="primary" native-type="submit" :loading="loadingstate" style="width: 100%">
      {{ loadingstate ? '注册中...' : '立即注册' }}
    </el-button>

    <p class="tip">
      <router-link to="/auth/login">返回登录</router-link>
    </p>
  </el-form>
</template>





<script lang="ts" setup>
import {ref} from 'vue'
import axios from 'axios'
import {useRouter} from  'vue-router'
import request from '@/request/request.ts'
const router =useRouter()

const registerData=ref({
    checkPassword:'',
    userAccount: '',
    userPassword:''

})

const loadingstate=ref(false)

const handleregister =async()=>{
    try{

        loadingstate.value=true
        const response = await request.post('/user/register', registerData.value)
//request.post('/user/register', loginData.value)
//axios.post('/api/user/register',loginData.value)
console.log(response)
console.log(response.data)
       if (response.data) {
      alert('注册成功')
      router.push('/auth/login')
    } else {
      alert('注册失败:'+response.description)
    }
    }catch(error){
        console.error('注册出错：', error)
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