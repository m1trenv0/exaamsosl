# Формат загрузки вопросов

## Общая структура

Вопросы загружаются в формате JSON со следующей структурой:

```json
{
  "questions": [
    {
      "order_index": 0,
      "question_text": "Текст вопроса",
      "question_type": "тип_вопроса",
      "options": {},
      "metadata": {}
    }
  ]
}
```

## Поля вопроса

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `order_index` | number | Да | Порядковый номер вопроса (начинается с 0) |
| `question_text` | string | Да | Текст вопроса |
| `question_type` | string | Да | Тип вопроса (см. ниже) |
| `options` | object | Нет | Опции вопроса (зависит от типа) |
| `metadata` | object | Нет | Дополнительные метаданные |

## Типы вопросов

### 1. Text Input (`text`)

Простой текстовый ввод.

```json
{
  "order_index": 0,
  "question_text": "What is 2+2?",
  "question_type": "text"
}
```

### 2. Multiple Choice (`multiple_choice`)

Выбор одного варианта из нескольких.

```json
{
  "order_index": 1,
  "question_text": "Выберите правильный ответ:",
  "question_type": "multiple_choice",
  "options": {
    "options": ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
    "correct": 0
  }
}
```

**Поля options:**
- `options` (array) - массив вариантов ответа
- `correct` (number) - индекс правильного ответа (начинается с 0)

### 3. Multiple Select (`multiple_select`)

Выбор нескольких вариантов из списка.

```json
{
  "order_index": 2,
  "question_text": "Выберите все языки программирования:",
  "question_type": "multiple_select",
  "options": {
    "options": ["JavaScript", "HTML", "Python", "CSS", "Java"],
    "correct": [0, 2, 4]
  }
}
```

**Поля options:**
- `options` (array) - массив вариантов ответа
- `correct` (array) - массив индексов правильных ответов

### 4. True/False (`true_false`)

Вопрос с двумя вариантами: Правда/Ложь.

```json
{
  "order_index": 3,
  "question_text": "JavaScript является языком программирования",
  "question_type": "true_false",
  "options": {
    "correct": 0
  }
}
```

**Поля options:**
- `correct` (number) - 0 для True (Правда), 1 для False (Ложь)

### 5. Categorization (`categorization`)

Распределение элементов по категориям методом drag-and-drop.

```json
{
  "order_index": 4,
  "question_text": "Распределите элементы по категориям:",
  "question_type": "categorization",
  "options": {
    "categories": [
      { "name": "Цвета", "items": ["Синий", "Красный"] },
      { "name": "Фигуры", "items": ["Квадрат", "Круг"] }
    ],
    "possibleAnswers": ["Синий", "Красный", "Квадрат", "Круг", "Зеленый"]
  }
}
```

**Поля options:**
- `categories` (array) - массив категорий
  - `name` (string) - название категории
  - `items` (array) - правильные элементы для этой категории
- `possibleAnswers` (array) - все возможные варианты (включая дистракторы)

### 6. Essay (`essay`)

Простой текстовый ответ (эссе).

```json
{
  "order_index": 5,
  "question_text": "Опишите ваше мнение:",
  "question_type": "essay"
}
```

### 7. Essay Rich Text (`essay_rich`)

Расширенный текстовый редактор с форматированием.

```json
{
  "order_index": 6,
  "question_text": "Напишите развернутый ответ:",
  "question_type": "essay_rich",
  "options": {
    "wordLimit": {
      "min": 100,
      "max": 500
    }
  }
}
```

**Поля options:**
- `wordLimit` (object) - лимит слов (опционально)
  - `min` (number) - минимальное количество слов
  - `max` (number) - максимальное количество слов

### 8. Code (`code`)

Ввод кода.

```json
{
  "order_index": 7,
  "question_text": "Напишите функцию для сортировки массива:",
  "question_type": "code"
}
```

## Полный пример

```json
{
  "questions": [
    {
      "order_index": 0,
      "question_text": "What is 2+2?",
      "question_type": "text"
    },
    {
      "order_index": 1,
      "question_text": "Выберите столицу России:",
      "question_type": "multiple_choice",
      "options": {
        "options": ["Санкт-Петербург", "Москва", "Казань", "Новосибирск"],
        "correct": 1
      }
    },
    {
      "order_index": 2,
      "question_text": "Выберите все четные числа:",
      "question_type": "multiple_select",
      "options": {
        "options": ["1", "2", "3", "4", "5", "6"],
        "correct": [1, 3, 5]
      }
    },
    {
      "order_index": 3,
      "question_text": "Земля круглая",
      "question_type": "true_false",
      "options": {
        "correct": 0
      }
    }
  ]
}
```

## Как загрузить вопросы

1. Откройте **Admin Dashboard**
2. Перейдите на вкладку **Questions (JSON)**
3. Вставьте JSON в текстовое поле
4. Нажмите кнопку **Upload** для загрузки вопросов

## Как выгрузить текущие вопросы

1. Откройте **Admin Dashboard**
2. Перейдите на вкладку **Questions (JSON)**
3. Нажмите кнопку **Edit** - текущие вопросы загрузятся в текстовое поле
4. Скопируйте JSON для дальнейшего использования

## Важные замечания

- ⚠️ Индексация начинается с 0
- ⚠️ При загрузке новых вопросов все существующие вопросы будут заменены
- ⚠️ Убедитесь в правильности JSON-синтаксиса перед загрузкой
- ⚠️ Все поля `options` зависят от типа вопроса
- ✅ Можно использовать кнопку **Edit** для просмотра текущего формата
- ✅ Используйте online JSON validator для проверки синтаксиса

## Специальный вопрос: Chat

Чат настраивается отдельно через вкладку **Exam Settings**:
- Укажите номер вопроса, на котором будет чат
- Введите текст вопроса, который будет отображаться рядом с чатом
- Чат доступен только когда громкость установлена в диапазоне 45-55
