# 聊天应用程序

这是一个使用PHP构建的简单聊天应用程序。它允许用户注册、登录并在聊天室中交流，以及与ai进行互动。该应用程序旨在演示基本的Web开发概念，包括用户身份验证和实时消息传递。
- 演示网站[点击这里](http://120.55.57.217:11111/)
- 欢迎各位一起参与不断完善！共创联系QQ908756682
- 当前计划：新增允许用户自主发送图片，热门聊天室列表

## 功能
### 2024.10.13 版本1.0
- 用户注册和登录
- 多个聊天室
- 实时获取消息
- 用户管理
![](https://img2024.cnblogs.com/blog/3512200/202410/3512200-20241013222619125-543346096.png)
![](https://img2024.cnblogs.com/blog/3512200/202410/3512200-20241013222624022-1599108943.png)
![](https://img2024.cnblogs.com/blog/3512200/202410/3512200-20241013222625791-143968807.png)
![](https://img2024.cnblogs.com/blog/3512200/202410/3512200-20241013222628864-1906667558.png)
![](https://img2024.cnblogs.com/blog/3512200/202410/3512200-20241013222631752-445096669.png)
![](https://img2024.cnblogs.com/blog/3512200/202410/3512200-20241013222633596-381259984.png)
![](https://img2024.cnblogs.com/blog/3512200/202410/3512200-20241013222635662-2111792512.png)

### 2024.10.14 版本1.1
- 支持发送emoji表情包
![](https://img2024.cnblogs.com/blog/3512200/202410/3512200-20241015130136243-122483043.png)

### 2024.10.14 版本1.2
- 接入ai陪聊系统，优化emoji表情包选择框
- 在与ai进行互动时，需手动@ai 并在空格后输入你要交流的消息
![](https://img2024.cnblogs.com/blog/3512200/202410/3512200-20241028002619888-1361445853.png)

## 技术栈

- PHP
- MySQL
- HTML/CSS
- JavaScript

## 安装步骤

1. 克隆该仓库：
   ```bash
   git clone https://github.com/jackyoung01/chat.git

2.配置数据库文件
  db.php
  
3.导入数据库文件
  chatai.sql
  
4.配置相关的api密钥
  chatroom.js

## 特别鸣谢
- 在此感谢chatgpt4o的代码修正与贡献
- 感谢智谱清言ai大模型的免费开源，为本作者在ai接口调用方面的学习降低成本
