const express = require('express');
const path = require('path');
const app = express();

// 静态文件服务
app.use(express.static(__dirname));

// 所有路由都返回index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 5501;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 