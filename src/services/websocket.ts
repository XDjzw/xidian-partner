// WebSocket服务用于处理好友相关的实时通信
interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

class FriendWebSocketService {
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectInterval: number = 3000;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private listeners: { [event: string]: Function[] } = {};
  private userId: number | string | null = null;
  
  // 连接到WebSocket服务器
  connect(userId: number | string): void {
    if (!userId) {
      console.error('用户ID不能为空');
      return;
    }

    // 保存用户ID用于重连
    this.userId = userId;

    // 注意：在实际部署时需要根据环境调整地址
    const wsUrl = `ws://localhost:8080/api/ws/friend?userId=${userId}`;
    
    // 如果已达到最大重连次数，停止重连
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('已达到最大重连次数，停止重连');
      return;
    }
    
    try {
      console.log(`尝试连接WebSocket: ${wsUrl}`);
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket连接已建立');
        this.isConnected = true;
        this.reconnectAttempts = 0; // 重置重连次数
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('收到WebSocket消息:', data);
          this.handleMessage(data);
        } catch (error) {
          console.error('解析WebSocket消息失败:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket连接已关闭');
        this.isConnected = false;
        this.emit('disconnected');
        // 自动重连
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('WebSocket连接失败:', error);
    }
  }

  // 处理接收到的消息
  private handleMessage(data: WebSocketMessage): void {
    switch (data.type) {
      case 'friend_request':
        this.emit('friendRequest', data);
        break;
      case 'friend_response':
        this.emit('friendResponse', data);
        break;
      case 'friend_removed':
        this.emit('friendRemoved', data);
        break;
      default:
        console.log('未知消息类型:', data.type);
    }
  }

  // 发送消息（如果需要双向通信）
  sendMessage(message: object): void {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket未连接，无法发送消息');
    }
  }

  // 事件监听
  on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // 触发事件
  private emit(event: string, data?: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // 自动重连
  private reconnect(): void {
    // 增加重连次数
    this.reconnectAttempts++;
    
    // 使用指数退避策略增加重连间隔
    const timeout = this.reconnectInterval * this.reconnectAttempts;
    
    console.log(`尝试重新连接WebSocket... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.userId) {
        this.connect(this.userId);
      }
    }, timeout);
  }

  // 关闭连接
  disconnect(): void {
    if (this.ws) {
      // 清除重连尝试次数
      this.reconnectAttempts = 0;
      this.ws.close();
    }
  }
  
  // 获取连接状态
  getConnectedStatus(): boolean {
    return this.isConnected;
  }
}

// 导出单例实例
export default new FriendWebSocketService();