# Message App - Клиент-серверное приложение для отправки сообщений

Простое приложение для отправки и сохранения сообщений, построенное на React (клиент) и Express (сервер) с SQLite базой данных.

## Технологии

- **Клиент**: React, React Router, Tailwind CSS, Axios
- **Сервер**: Express.js, SQLite3, Express Validator
- **Контейнеризация**: Docker, Docker Compose

## Структура проекта

```
├── client/                 # React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── App.js         # Главный компонент
│   │   └── index.js       # Точка входа
│   └── package.json
├── server/                # Express сервер
│   ├── index.js          # Серверный код
│   └── package.json
├── docker-compose.yml     # Docker Compose конфигурация
└── Dockerfile            # Production Docker образ
```

## Способы запуска

### 1. Локальная разработка (рекомендуется для тестирования)

#### Установка зависимостей:

```bash
# Установка зависимостей для всего проекта
npm install

# Установка зависимостей для сервера
cd server
npm install

# Установка зависимостей для клиента
cd ../client
npm install
```

#### Запуск в режиме разработки:

```bash
# Из корневой директории - запуск клиента и сервера одновременно
npm run dev

# Или запуск по отдельности:
# Терминал 1 - Сервер (порт 5000)
cd server
npm run dev

# Терминал 2 - Клиент (порт 3000)
cd client
npm start
```

### 2. Docker (Production)

```bash
# Сборка и запуск production версии
docker-compose up --build

# Приложение будет доступно на http://localhost:5000
```

### 3. Docker (Development)

```bash
# Запуск в режиме разработки с hot reload
docker-compose --profile dev up --build

# Клиент: http://localhost:3000
# Сервер: http://localhost:5001
```

## Тестирование приложения

### 1. Проверка работы сервера

```bash
# Проверка health check
curl http://localhost:5000/api/health

# Ожидаемый ответ:
# {"status":"OK","timestamp":"2025-01-01T12:00:00.000Z"}
```

### 2. Тестирование API

```bash
# Отправка тестового сообщения
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Иванов",
    "phone": "+375291234567",
    "message": "Тестовое сообщение"
  }'

# Ожидаемый ответ при успехе:
# {"success":true,"message":"Сообщение успешно отправлено","id":1}
```

### 3. Тестирование валидации

```bash
# Тест с невалидными данными
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "А",
    "phone": "123",
    "message": "X"
  }'

# Ожидаемый ответ с ошибками валидации:
# {"success":false,"errors":[...]}
```

### 4. Тестирование клиентского интерфейса

1. Откройте браузер и перейдите на `http://localhost:3000` (разработка) или `http://localhost:5000` (production)
2. На странице приветствия нажмите "Далее"
3. Заполните форму и протестируйте валидацию:
   - **Имя**: минимум 2 символа
   - **Телефон**: белорусский формат (+375XXXXXXXXX или 80XXXXXXXXX)
   - **Сообщение**: минимум 2 символа
4. Отправьте форму и проверьте успешное сохранение

### 5. Проверка базы данных

```bash
# Если используете SQLite локально
cd server
sqlite3 messages.db

# В SQLite консоли:
.tables
SELECT * FROM messages;
.quit
```

## Функциональность

### Клиент (React)

- ✅ Страница приветствия с дружелюбным интерфейсом
- ✅ Форма с тремя полями (имя, телефон, сообщение)
- ✅ Валидация на клиенте с понятными сообщениями об ошибках
- ✅ Блокировка кнопки во время отправки
- ✅ Очистка формы после успешной отправки
- ✅ Обратная связь пользователю (успех/ошибка)

### Сервер (Express)

- ✅ POST /api/messages эндпоинт
- ✅ Валидация данных на сервере
- ✅ Сохранение в SQLite базу данных
- ✅ Обработка ошибок
- ✅ Health check эндпоинт

### Валидация

- ✅ **Имя**: минимум 2 символа
- ✅ **Телефон**: белорусский формат (+375XXXXXXXXX или 80XXXXXXXXX)
- ✅ **Сообщение**: минимум 2 символа
- ✅ Валидация на клиенте и сервере

### Docker

- ✅ Production Docker образ
- ✅ Docker Compose для полного стека
- ✅ Development профиль с hot reload
- ✅ Health checks

## Возможные проблемы и решения

### Порт уже используется

```bash
# Проверка занятых портов
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Остановка процессов (Windows)
taskkill /PID <PID> /F
```

### Проблемы с Docker

```bash
# Очистка Docker кэша
docker system prune -a

# Пересборка без кэша
docker-compose build --no-cache
```

### Проблемы с зависимостями

```bash
# Очистка node_modules
rm -rf node_modules package-lock.json
npm install
```
