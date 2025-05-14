const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Analysis = require('../models/Analysis');

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Загрузка файла
exports.uploadFile = upload.single('file');

// Анализ через OpenRouter
exports.analyze = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Отправка на OpenRouter
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions ', {
      model: "deepseek/deepseek-chat",
      messages: [
        { role: "system", content: "Проанализируй судебное решение и оцени вероятность обжалования" },
        { role: "user", content: fileContent }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    // Сохранение результата
    const analysis = new Analysis({
      userId: req.user.id,
      fileId: req.file.filename,
      result: response.data.choices[0].message.content,
      probability: Math.floor(Math.random() * 40) + 50 // Симуляция
    });
    await analysis.save();

    res.json({
      probability: analysis.probability,
      result: analysis.result
    });
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
};
