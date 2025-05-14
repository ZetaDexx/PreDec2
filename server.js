// server.js
const express = require('express');
const path = require('path');

const app = express();

// Сервируем статические файлы из корня
app.use(express.static(path.join(__dirname)));

// Обработка всех маршрутов — показываем index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
