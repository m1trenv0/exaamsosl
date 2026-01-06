# Новые типы вопросов Canvas LMS

## Обзор

Добавлены новые типы вопросов с дизайном, максимально похожим на Canvas LMS:

1. **Multiple Choice** - вопрос с одним правильным ответом
2. **Multiple Select** - вопрос с несколькими правильными ответами
3. **True/False** - вопрос с вариантами True/False
4. **Categorization** - вопрос с перетаскиванием элементов по категориям
5. **Text Input** - короткий текстовый ответ
6. **Essay** - длинный текстовый ответ
7. **Essay (Rich Text)** - эссе с форматированием (жирный, курсив, списки, ссылки)
8. **Code** - ввод кода с моноширинным шрифтом

## Использование

### Через визуальный конструктор (рекомендуется)

1. Откройте админ панель: `/admin/dashboard`
2. Перейдите на вкладку "Questions"
3. Нажмите кнопку **"Create Question"**
4. Выберите тип вопроса из выпадающего списка
5. Заполните поля в зависимости от типа вопроса
6. Нажмите **"Save Question"**

### Через JSON импорт

В админке на вкладке "JSON Import/Export" вы можете импортировать вопросы в формате JSON.

#### Примеры JSON для каждого типа:

**Multiple Choice:**
```json
{
  "order_index": 0,
  "question_text": "What is the capital of France?",
  "question_type": "multiple_choice",
  "options": {
    "options": ["London", "Paris", "Berlin", "Madrid"],
    "correct": 1
  }
}
```

**Multiple Select:**
```json
{
  "order_index": 1,
  "question_text": "Select all programming languages:",
  "question_type": "multiple_select",
  "options": {
    "options": ["JavaScript", "HTML", "Python", "CSS", "Java"],
    "correct": [0, 2, 4]
  }
}
```

**True/False:**
```json
{
  "order_index": 2,
  "question_text": "JavaScript is a compiled language.",
  "question_type": "true_false",
  "options": {
    "correct": 1
  }
}
```
_Note: 0 = True, 1 = False_

**Categorization:**
```json
{
  "order_index": 3,
  "question_text": "Match colors with shapes:",
  "question_type": "categorization",
  "options": {
    "categories": [
      { "name": "Colors", "items": ["Red", "Blue"] },
      { "name": "Shapes", "items": ["Square", "Circle"] }
    ],
    "possibleAnswers": ["Red", "Blue", "Square", "Circle", "Green"]
  }
}
```

**Text Input:**
```json
{
  "order_index": 4,
  "question_text": "What is 2+2?",
  "question_type": "text"
}
```

**Essay:**
```json
{
  "order_index": 5,
  "question_text": "Describe your experience with React.",
  "question_type": "essay"
}
```

**Essay (Rich Text):**
```json
{
  "order_index": 6,
  "question_text": "Write an essay about climate change.",
  "question_type": "essay_rich",
  "options": {
    "wordLimit": { "min": 100, "max": 150 }
  }
}
```

**Code:**
```json
{
  "order_index": 7,
  "question_text": "Write a function to reverse a string.",
  "question_type": "code"
}
```

## Готовый пример

В корне проекта есть файл `sample-questions-canvas.json` с примерами всех типов вопросов. Скопируйте его содержимое и вставьте в поле JSON Import в админке.

## Возможности Rich Text редактора

Rich Text редактор включает:
- **Форматирование текста**: жирный, курсив, подчеркнутый
- **Заголовки и параграфы**
- **Списки**: маркированные и нумерованные
- **Ссылки**: вставка URL
- **Изображения**: вставка по URL
- **Отмена/Повтор**: Ctrl+Z / Ctrl+Y
- **Подсчет слов** с визуальным индикатором лимита

## Categorization (Перетаскивание)

Для вопросов типа "Categorization":
- **categories**: массив категорий с правильными элементами для каждой
- **possibleAnswers**: все возможные варианты ответов (включая отвлекающие элементы)

Студент перетаскивает элементы из "Uncategorized Answers" в соответствующие категории.

## Хранение ответов

Ответы сохраняются в следующих форматах:

- **Multiple Choice**: строка с выбранным вариантом
- **Multiple Select**: строка с индексами через запятую, например: "0,2,4"
- **True/False**: "True" или "False"
- **Categorization**: JSON объект с категориями и элементами
- **Text**: простая строка
- **Essay**: простая строка с переносами строк
- **Essay Rich**: HTML строка с форматированием
- **Code**: строка с кодом

## Стилизация

Все компоненты стилизованы в соответствии с дизайном Canvas LMS:
- Светло-серый фон для полей ввода
- Темные номера вопросов
- Плавные переходы при hover
- Точная типографика и отступы

## Техническая информация

### Новые файлы:
- `components/exam/question-types/TrueFalseQuestion.tsx`
- `components/exam/question-types/MultipleSelectQuestion.tsx`
- `components/exam/question-types/CategorizationQuestion.tsx`
- `components/exam/question-types/EssayRichQuestion.tsx`
- `components/admin/QuestionBuilder.tsx`

### Обновленные файлы:
- `lib/schemas.ts` - добавлены новые типы вопросов
- `components/exam/QuestionCard.tsx` - интегрированы новые типы
- `components/admin/QuestionsManager.tsx` - добавлен визуальный конструктор
- `app/canvas.css` - добавлены стили для rich text editor

## Проверка работы

1. Запустите проект: `npm run dev`
2. Войдите в админку: `/admin/dashboard`
3. Импортируйте `sample-questions-canvas.json`
4. Откройте экзамен как студент
5. Протестируйте все типы вопросов

Все типы вопросов полностью функциональны и готовы к использованию!
