# n8n-nodes-monday-parser

Кастомная нода n8n для парсинга и структурирования данных Monday.com

## Описание

Эта нода позволяет парсить сложные данные колонок Monday.com и преобразовывать их в структурированный формат. Поддерживает все основные типы колонок Monday.com.

## Установка

```bash
npm install n8n-nodes-monday-parser
```

## Использование

1. Добавьте ноду "Monday Parser" в workflow
2. Подключите данные Monday.com
3. Настройте Board ID и Group Title

## Поддерживаемые типы колонок

- status, checkbox, text, numbers
- people, date, timeline, email, phone
- file, link, location, rating
- dropdown, tags, board_relation
- И многие другие...

## Лицензия

MIT 