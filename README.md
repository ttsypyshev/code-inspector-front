# Проверка кода студентов — Frontend

Этот репозиторий содержит фронтенд-проект для проверки кода студентов. Он предоставляет удобный пользовательский интерфейс для загрузки, анализа и рецензирования кода, а также интеграцию с сервером для проверки решений.

## Репозитории
- **[Frontend (вы здесь)](https://github.com/ttsypyshev/code-inspector-front)** – клиентская часть проекта
- **[Backend](https://github.com/ttsypyshev/code-inspector-back)** – серверная часть проекта

## Ветки
- **[SPA](https://github.com/ttsypyshev/code-inspector-front/tree/spa)** – разработка базового `SPA` на React
- **[Redux](https://github.com/ttsypyshev/code-inspector-front/tree/redux)** – добавление менеджера состояний `Redux Toolkit`
- **[Pwa](https://github.com/ttsypyshev/code-inspector-front/tree/pwa)** – добавление возможности работы в режиме `PWA` + `GitHub Pages`
- **[Tauri](https://github.com/ttsypyshev/code-inspector-front/tree/tauri)** – Создание простого нативного приложения на Tauri
- **[Student interface](https://github.com/ttsypyshev/code-inspector-front/tree/sender-interface)** – Завершение интерфейса `пользователя` в `React`
- **[Moderator interface](https://github.com/ttsypyshev/code-inspector-front/tree/moder-interface)** – Завершение интерфейса `модератора` в `React`
- **[Android studio ](https://github.com/ttsypyshev/code-inspector-front/tree/android-studio)** – Создание приложения на `Android` и подключение к веб-сервису

## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/ttsypyshev/code-inspector-front
cd code-inspector-front
```

### 2. Установка зависимостей
```bash
npm install
```
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  },

### 3. Запуск проекта
```bash
cargo tauri android dev
```

## Основные возможности
- Загрузка кода студентов
- Анализ и рецензирование решений
- Интеграция с серверной частью для проверки кода
- Удобный интерфейс для взаимодействия

