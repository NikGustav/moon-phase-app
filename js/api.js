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
async function sendMessageToAPI(message, imageData = null) {
    try {
        // 如果启用了备用响应或API配置无效，直接返回备用响应
        if (!API_CONFIG.apiKey || API_CONFIG.apiKey === 'YOUR-API-KEY-HERE') {
            console.log('API key not configured, using fallback response');
            return getFallbackResponse();
        }

        let messageContent = message;
        if (imageData) {
            messageContent = {
                type: 'image',
                image: imageData,
                text: message
            };
        }

        const requestBody = {
            model: API_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                ...conversationHistory,
                {
                    role: "user",
                    content: messageContent
                }
            ],
            temperature: API_CONFIG.temperature,
            max_tokens: API_CONFIG.max_tokens
        };

        console.log('Sending request to API:', API_CONFIG.endpoint);
        
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            console.error('API response not ok:', response.status);
            return getFallbackResponse();
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        // 保存对话历史
        conversationHistory.push(
            { role: "user", content: messageContent },
            { role: "assistant", content: aiResponse }
        );
        
        // 保持对话历史在合理范围内
        if (conversationHistory.length > 10) {
            conversationHistory = conversationHistory.slice(-10);
        }

        return aiResponse;
    } catch (error) {
        console.error('API 调用错误:', error);
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
        if (!file || !file.type.startsWith('image/')) {
            throw new Error('请上传有效的图片文件');
        }

        // 检查文件大小
        if (file.size > 10 * 1024 * 1024) { // 10MB限制
            throw new Error('图片大小不能超过10MB');
        }

        // 读取图片文件
        const reader = new FileReader();
        const imageData = await new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('图片读取失败'));
            reader.readAsDataURL(file);
        });

        // 构建提示词
        const imagePrompt = `请以占星师的视角解读这张图片，关注其中的符号、色彩和构图，并联系当前的月相（残月）给出温暖的回应。`;
        
        // 发送到API进行分析
        const response = await sendMessageToAPI(imagePrompt, imageData);
        
        return {
            success: true,
            description: response,
            preview: imageData
        };
    } catch (error) {
        console.error('图片分析错误:', error);
        return {
            success: false,
            error: error.message || '图片分析失败，请重试'
        };
    }
}

// 导出函数
export { sendMessageToAPI, getMoonPhase, analyzeImage };
