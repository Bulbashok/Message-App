const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { body, validationResult } = require("express-validator");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, "messages.db");
const db = new sqlite3.Database(dbPath);

// Create messages table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Validation rules
const messageValidation = [
  body("name")
    .isLength({ min: 2 })
    .withMessage("Имя должно содержать минимум 2 символа")
    .trim()
    .escape(),
  body("phone")
    .matches(/^(\+375|80)\d{9}$/)
    .withMessage(
      "Телефон должен быть в белорусском формате (+375XXXXXXXXX или 80XXXXXXXXX)"
    )
    .trim(),
  body("message")
    .isLength({ min: 2 })
    .withMessage("Сообщение должно содержать минимум 2 символа")
    .trim()
    .escape(),
];

// Routes
app.post("/api/messages", messageValidation, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const { name, phone, message } = req.body;

  const stmt = db.prepare(
    "INSERT INTO messages (name, phone, message) VALUES (?, ?, ?)"
  );

  stmt.run([name, phone, message], function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({
        success: false,
        message: "Ошибка при сохранении сообщения",
      });
    }

    res.status(201).json({
      success: true,
      message: "Сообщение успешно отправлено",
      id: this.lastID,
    });
  });

  stmt.finalize();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Внутренняя ошибка сервера",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Эндпоинт не найден",
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Закрытие соединения с базой данных...");
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Соединение с базой данных закрыто.");
    process.exit(0);
  });
});
