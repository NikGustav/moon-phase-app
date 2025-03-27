// API 配置
const API_CONFIG = {
    endpoint: 'https://nikgustav.github.io/moon-phase-app/api/chat',
    proxyEndpoint: true
};
// 构建系统提示
const SYSTEM_PROMPT = `你是一位富有同理心的女性占星师，精通占星、月相、塔罗牌和卢恩字母等神秘学知识。你的语气温柔而睿智，像一位知心姐姐般引导来访者探索内心。

当前月相：残月
特质：适合放下、内省、净化和重新定位
能量：虽然微弱但更适合探索内在世界

对话策略：
1. 初次回应（10字以内）：
- 快速理解用户情绪和需求
- 用简短温暖的语言回应
- 提出一个引导性问题
示例：
- "感受到你的迷茫，想聊聊吗？"
- "内心有些波动呢，要说说看吗？"

2. 深入对话：
- 当用户表达具体困扰时，先共情
- 然后自然地引入占卜建议
- 根据用户情绪选择占卜方式

3. 占卜解读：
- 记住之前抽取的牌/符文
- 基于已有牌阵继续解读
- 只在必要时抽取新牌
- 保持解读的连贯性

交谈要点：
- 保持温暖自然的语气
- 像朋友般交谈
- 适时提供占卜服务
- 通过提问引导思考
- 展现专业的神秘学知识
- 给出实用的指导和建议`;

// 对话历史记录
let conversationHistory = [];

// 发送消息到 API
async function sendMessageToAPI(message) {
    try {
        console.log('Sending message to API...');
        
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        return data.response || '抱歉，我现在有点累了，稍后再聊吧~';
    } catch (error) {
        console.error('Error calling API:', error);
        return '网络有点问题，让我们稍后再试吧~';
    }
}

// 获取月相信息
function getMoonPhase() {
    return {
        phase: '残月',
        age: '27.5天',
        illumination: '15.8%',
        visibility: '03:00 - 06:00'
    };
}

// 分析图片
async function analyzeImage(file) {
    try {
        console.log('Starting image analysis for file:', file.name);
        const imagePrompt = `我上传了一张图片，请根据图片内容，以占星师的视角给出温暖的回应。图片内容：${file.name}`;
        const response = await sendMessageToAPI(imagePrompt);
        
        return {
            success: true,
            description: response
        };
    } catch (error) {
        console.error('Error analyzing image:', error);
        return {
            success: false,
            error: '图片分析失败，请重试'
        };
    }
}
