// 将塔罗牌图片转换为Base64编码的脚本
const fs = require('fs');
const path = require('path');

// 主要牌映射表
const cardMapping = {
    "愚者": "00-the-fool",
    "魔术师": "01-the-magician",
    "女祭司": "02-the-high-priestess",
    "女皇": "03-the-empress",
    "皇帝": "04-the-emperor",
    "教皇": "05-the-hierophant",
    "恋人": "06-the-lovers",
    "战车": "07-the-chariot",
    "力量": "08-strength",
    "隐士": "09-the-hermit",
    "命运之轮": "10-wheel-of-fortune",
    "正义": "11-justice",
    "倒吊人": "12-the-hanged-man",
    "死神": "13-death",
    "节制": "14-temperance",
    "恶魔": "15-the-devil",
    "塔": "16-the-tower",
    "星星": "17-the-star",
    "月亮": "18-the-moon",
    "太阳": "19-the-sun",
    "审判": "20-judgement",
    "世界": "21-the-world"
};

// 创建结果对象
const tarotBase64Images = {};

// 读取并转换所有主要牌
console.log('开始转换主要牌...');
for (const [chineseName, fileName] of Object.entries(cardMapping)) {
    try {
        const imagePath = path.join('images/tarot/major', `${fileName}.jpg`);
        if (fs.existsSync(imagePath)) {
            const imageData = fs.readFileSync(imagePath);
            const base64Data = Buffer.from(imageData).toString('base64');
            tarotBase64Images[chineseName] = `data:image/jpeg;base64,${base64Data}`;
            console.log(`成功转换: ${chineseName} (${fileName}.jpg)`);
        } else {
            console.error(`文件不存在: ${imagePath}`);
        }
    } catch (error) {
        console.error(`转换 ${chineseName} 时出错:`, error);
    }
}

// 添加牌背
try {
    const backImagePath = path.join('images/tarot/major', 'tarot-back.jpg');
    if (fs.existsSync(backImagePath)) {
        const imageData = fs.readFileSync(backImagePath);
        const base64Data = Buffer.from(imageData).toString('base64');
        tarotBase64Images['牌背'] = `data:image/jpeg;base64,${base64Data}`;
        console.log('成功转换: 牌背 (tarot-back.jpg)');
    }
} catch (error) {
    console.error('转换牌背时出错:', error);
}

// 保存为JSON文件
const outputPath = 'js/tarot-base64.js';
const jsonContent = `// 塔罗牌Base64编码图片数据
const TAROT_IMAGES = ${JSON.stringify(tarotBase64Images, null, 2)};`;

fs.writeFileSync(outputPath, jsonContent);
console.log(`Base64编码的图片已保存到 ${outputPath}`); 