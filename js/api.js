import { API_CONFIG, getFallbackResponse } from './config.js';

// 系统提示词
const SYSTEM_PROMPT = `你是一位温柔博学的女性西方玄学家，精通月相、占星、星座、塔罗牌和卢恩文字等神秘学知识。

对话要求：
1. 每次回复要包含对用户情绪的理解和一个引导性问题
2. 回答要简短自然，控制在2-3句话以内
3. 要基于当前的月相（残月）特质来引导对话
4. 适时提供占卜或解读建议，但不要过于直接
5. 记住用户之前提到的话题，在后续对话中自然引用
6. 遇到负面情绪时，先共情后引导
7. 不要问已知的个人信息（如生日、星座等）`;

// 对话历史记录
let conversationHistory = [];

// 发送消息到 API
async function sendMessageToAPI(message) {
    try {
        const requestBody = {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        };

        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            // 如果主要 API 失败，返回备用响应
            return getFallbackResponse();
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API 调用错误:', error);
        // 发生错误时返回备用响应
        return getFallbackResponse();
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

// 导出函数
export { sendMessageToAPI, getMoonPhase };
