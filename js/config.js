// API 配置
const API_CONFIG = {
    endpoint: 'https://api.moonphase-ai.com/v1/chat',
    apiKey: 'sk-decd1e2a3d674f8facddbb62efc99706'
};

// 备用响应
const FALLBACK_RESPONSES = [
    "在这个残月的夜晚，我感受到了你的困扰。残月时期特别适合放下和内省，也许我们可以聊聊你最近的感受？",
    "残月的光芒虽然微弱，但却给了我们更多思考的空间。你最近有什么想要放下的事情吗？",
    "这个时节的月光特别适合静下心来，聊一聊内心的想法。你愿意和我分享吗？",
    "残月时期总是让人特别容易陷入思考。最近有什么事情一直萦绕在你心头吗？"
];

// 获取随机备用响应
function getFallbackResponse() {
    const index = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
    return FALLBACK_RESPONSES[index];
}

export { API_CONFIG, getFallbackResponse }; 