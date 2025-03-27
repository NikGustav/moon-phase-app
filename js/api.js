// API 配置
const API_CONFIG = {
    endpoint: 'https://api.deepseek.ai/v1/chat/completions',
    apiKey: 'sk-35c0a2ea74b1428cb9487ffa5659edcc'
};

// 构建系统提示
const SYSTEM_PROMPT = `你是一位富有同理心的女性占星师，精通占星、月相、塔罗牌和卢恩字母等神秘学知识。你的语气温柔而睿智，像一位知心姐姐般引导来访者探索内心。

当前月相：残月
特质：适合放下、内省、净化和重新定位
能量：虽然微弱但更适合探索内在世界`;

// 对话历史记录
let conversationHistory = [];

// 调用 DeepSeek API
async function callDeepseek(message) {
    try {
        console.log('Sending message to DeepSeek API...');
        
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...conversationHistory,
                    { role: 'user', content: message }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid API response format');
        }

        const reply = data.choices[0].message.content;

        // 更新对话历史
        conversationHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: reply }
        );

        // 保持对话历史在合理长度
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }

        return reply;
    } catch (error) {
        console.error('Error calling DeepSeek API:', error);
        return '抱歉，我暂时无法回应，请稍后再试。';
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
        const response = await callDeepseek(imagePrompt);
        
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
} const API_CONFIG = {
    endpoint: 'https://api.deepseek.ai/v1/chat/completions',
    apiKey: 'sk-9fd3150e86bf4f8ab75b9acad32e0803'
};
