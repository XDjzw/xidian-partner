<template>


<div class="auth-layout">

    <div class="auth-container">
        <!--Logi/标题-->
        <div class="auth-header">
            <h2>游戏搭子平台</h2>
            <p> 欢迎使用蒋智伟的游戏搭子平台系统</p>
 
        </div>

        <div class="auth-content">

            <router-view/>
        </div>
    </div>


</div>
</template>

<script>


</script>




<style scoped>
.auth-layout {
      display: flex;
      justify-content: center;
      align-items:center;
      height:100vh;
      background: #f5f5fb;
 
}

.auth-container {
  width: 400px;
  padding: 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 20px;
}

.auth-header h2 {
  color: #333;
  font-size: 24px;
}

.auth-header p {
  color: #666;
  font-size: 14px;
}
</style>