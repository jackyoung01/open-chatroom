document.addEventListener('DOMContentLoaded', function () {
    // 获取 DOM 元素
    const emojiButton = document.getElementById('emojiButton');
    const emojiPickerContainer = document.getElementById('emojiPicker');
    const messageInput = document.getElementById('messageInput');
    const messageForm = document.getElementById('messageForm');
    const chatbox = document.getElementById('chatbox');

    // AI 相关配置
    const apiKey = "56bb819254e025346a500068f2f8dddf.rJLyLghELuGTVH9S";
    const apiUrl = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
    const model = "glm-4-flash";

    // 初始化对话消息
    let messages = [
        {
            "role": "system",
            "content": "你现在是@聊天搭子，请作为一个聊天搭子尽情的与用户进行聊天吧！。"
        }
    ];

    // 点击 Emoji 按钮时动态加载 emoji.html 并显示/隐藏 emoji 选择器
    emojiButton.addEventListener('click', () => {
        if (emojiPickerContainer.innerHTML === '') {
            // 使用 fetch 动态加载 emoji.html
            fetch('src/emoji.html') // 确保路径正确
                .then(response => response.text())
                .then(data => {
                    emojiPickerContainer.innerHTML = data;
                    bindEmojiClickEvent(); // 绑定表情点击事件
                    emojiPickerContainer.style.display = 'block'; // 显示选择器
                })
                .catch(error => console.error('Error loading emojis:', error));
        } else {
            // 切换显示/隐藏
            emojiPickerContainer.style.display = emojiPickerContainer.style.display === 'none' ? 'block' : 'none';
        }
    });

    // 绑定点击 Emoji 时的事件
    function bindEmojiClickEvent() {
        const emojis = emojiPickerContainer.querySelectorAll('.emoji');
        emojis.forEach(emoji => {
            emoji.addEventListener('click', function () {
                const emoji = this.textContent;
                messageInput.value += emoji; // 将表情插入到输入框中
                emojiPickerContainer.style.display = 'none'; // 选择完表情后隐藏选择器
            });
        });
    }

    // 处理发送消息
    messageForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // 阻止表单默认提交行为

        const message = messageInput.value.trim(); // 获取输入的消息并去除空格

        // 检查消息内容是否为空
        if (!message) {
            console.error("不能发送空消息！");
            return;
        }

        // 显示用户输入的消息
        addMessageToChatbox("你", message);

        // 发送消息到服务器
        const response = await fetch('send_message.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `message=${encodeURIComponent(message)}&room_id=${encodeURIComponent(roomId)}`
        });

        const data = await response.json();

        // 清空输入框
        messageInput.value = '';

        // 检查响应状态
        if (data.status === 'success') {
            // 检查是否需要触发 AI
            if (data.ai_triggered) {
                // 调用 AI 接口获取回复
                const aiResponse = await callGLMAPI(message);
                const assistantReply = aiResponse.choices[0]?.message?.content || "AI没有回复，请稍后再试。";

                // 显示AI的回复
                addMessageToChatbox("AI", assistantReply);

                // 保存AI的回复到数据库，以便后续显示
                saveAIMessage(assistantReply);
            }

            // 手动刷新消息列表
            fetchMessages();
        } else {
            console.error('Error:', data.message);
        }
    });

    // 将消息添加到聊天框中
    function addMessageToChatbox(sender, message) {
        const messageElement = document.createElement('p');
        messageElement.innerHTML = `<strong>${sender}：</strong>${message}`;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight; // 自动滚动到底部
    }

    // 调用GLM-4-Flash模型的API函数
    async function callGLMAPI(userMessage) {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        ...messages,
                        { "role": "user", "content": userMessage }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });
            return await response.json();
        } catch (error) {
            console.error('调用AI接口时出错:', error);
            return { choices: [{ message: { content: "调用AI接口时出错，请稍后再试。" } }] };
        }
    }

    // 保存 AI 消息到数据库的函数
    async function saveAIMessage(message) {
        try {
            const response = await fetch('send_message.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `message=${encodeURIComponent(message)}&room_id=${encodeURIComponent(roomId)}&is_ai=1`
            });

            const data = await response.json();
            if (data.status !== 'success') {
                console.error('保存AI消息时出错:', data.message);
            }
        } catch (error) {
            console.error('保存AI消息时出错:', error);
        }
    }

    // 自动加载最新消息的函数
function fetchMessages() {
    fetch(`fetch_messages.php?room_id=${encodeURIComponent(roomId)}`)
        .then(response => response.json())
        .then(data => {
            chatbox.innerHTML = ''; // 清空现有消息

            // 循环遍历每条消息并插入到 chatbox 中
            data.forEach(message => {
                // 判断 is_ai 是否为 1 或 true
                const sender = message.is_ai === 1 || message.is_ai === '1' || message.is_ai === true ? 'AI' : message.username;
                const p = document.createElement('p');
                p.innerHTML = `<strong>${sender}:</strong> ${message.message} <em>(${message.created_at})</em>`;
                chatbox.appendChild(p);
            });

            // 自动滚动到底部
            chatbox.scrollTop = chatbox.scrollHeight;
        })
        .catch(error => console.error('Error fetching messages:', error));
}


    // 定时每2秒获取一次新消息
    setInterval(fetchMessages, 2000);

    // 初始加载消息
    fetchMessages();
});
