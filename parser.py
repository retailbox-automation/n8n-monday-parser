import json
from datetime import datetime

def parse_column_value(cv_value, cv_type):
    """
    Универсальный парсер для значений колонок Monday.com
    Возвращает структурированные данные на основе типа колонки
    """
    if not cv_value:
        return None
    
    try:
        # Попробуем распарсить JSON, если это строка
        if isinstance(cv_value, str):
            try:
                value_data = json.loads(cv_value)
            except:
                # Если не JSON, вернем как есть для простых типов
                return cv_value
        else:
            value_data = cv_value
            
        # Обработка по типам колонок
        if cv_type == "creation_log":
            return {
                "created_at": value_data.get("created_at"),
                "creator_id": value_data.get("creator_id")
            }
            
        elif cv_type == "status":
            # Status может быть как объектом, так и просто индексом
            if isinstance(value_data, dict):
                return {
                    "label": value_data.get("label"),
                    "index": value_data.get("index"),
                    "post_id": value_data.get("post_id"),
                    "changed_at": value_data.get("changed_at")
                }
            else:
                return value_data
                
        elif cv_type == "checkbox":
            if isinstance(value_data, dict):
                return {
                    "checked": value_data.get("checked") == "true",
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "long_text":
            if isinstance(value_data, dict):
                return {
                    "text": value_data.get("text", ""),
                    "changed_at": value_data.get("changed_at", "")
                }
            return {"text": str(value_data)}
            
        elif cv_type == "link":
            if isinstance(value_data, dict):
                return {
                    "url": value_data.get("url"),
                    "text": value_data.get("text"),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "date":
            if isinstance(value_data, dict):
                return {
                    "date": value_data.get("date"),
                    "time": value_data.get("time"),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "timeline":
            if isinstance(value_data, dict):
                return {
                    "from": value_data.get("from"),
                    "to": value_data.get("to"),
                    "changed_at": value_data.get("changed_at"),
                    "visualization_type": value_data.get("visualization_type")
                }
            return None
            
        elif cv_type == "people":
            if isinstance(value_data, dict):
                persons_teams = value_data.get("personsAndTeams", [])
                return {
                    "personsAndTeams": persons_teams,
                    "changed_at": value_data.get("changed_at"),
                    "persons_count": len([p for p in persons_teams if p.get("kind") == "person"]),
                    "teams_count": len([p for p in persons_teams if p.get("kind") == "team"])
                }
            return None
            
        elif cv_type == "dropdown":
            if isinstance(value_data, dict):
                return {
                    "ids": value_data.get("ids", []),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "tags":
            if isinstance(value_data, dict):
                return {
                    "tag_ids": value_data.get("tag_ids", []),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "email":
            if isinstance(value_data, dict):
                return {
                    "email": value_data.get("email"),
                    "text": value_data.get("text", value_data.get("email")),
                    "changed_at": value_data.get("changed_at")
                }
            return {"email": str(value_data), "text": str(value_data)}
            
        elif cv_type == "phone":
            if isinstance(value_data, dict):
                return {
                    "phone": value_data.get("phone"),
                    "countryShortName": value_data.get("countryShortName"),
                    "changed_at": value_data.get("changed_at")
                }
            return {"phone": str(value_data)}
            
        elif cv_type == "file":
            if isinstance(value_data, dict):
                return {
                    "files": value_data.get("files", []),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "board_relation":  # Connect boards
            if isinstance(value_data, dict):
                return {
                    "linkedPulseIds": value_data.get("linkedPulseIds", []),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "dependency":
            if isinstance(value_data, dict):
                return {
                    "linkedPulseIds": value_data.get("linkedPulseIds", []),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "mirror":
            if isinstance(value_data, dict):
                return {
                    "linkedPulseId": value_data.get("linkedPulseId"),
                    "linkedPulseColumnId": value_data.get("linkedPulseColumnId")
                }
            return None
            
        elif cv_type == "location":
            if isinstance(value_data, dict):
                return {
                    "address": value_data.get("address"),
                    "lat": value_data.get("lat"),
                    "lng": value_data.get("lng"),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "country":
            if isinstance(value_data, dict):
                return {
                    "countryCode": value_data.get("countryCode"),
                    "countryName": value_data.get("countryName"),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "rating":
            if isinstance(value_data, dict):
                return {
                    "rating": value_data.get("rating"),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "vote":
            if isinstance(value_data, dict):
                return {
                    "votes": value_data.get("votes", []),
                    "voters": value_data.get("voters", []),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "hour":
            if isinstance(value_data, dict):
                return {
                    "hour": value_data.get("hour"),
                    "minute": value_data.get("minute"),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "week":
            if isinstance(value_data, dict):
                return {
                    "week": value_data.get("week"),
                    "startDate": value_data.get("startDate"),
                    "endDate": value_data.get("endDate"),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "world_clock":
            if isinstance(value_data, dict):
                return {
                    "timezone": value_data.get("timezone"),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "time_tracking":
            if isinstance(value_data, dict):
                return {
                    "duration": value_data.get("duration"),
                    "startDate": value_data.get("startDate"),
                    "status": value_data.get("status"),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        elif cv_type == "formula":
            # Formula обычно возвращается как текст
            return value_data
            
        elif cv_type == "button":
            if isinstance(value_data, dict):
                return {
                    "label": value_data.get("label"),
                    "color": value_data.get("color"),
                    "url": value_data.get("url")
                }
            return None
            
        elif cv_type == "last_updated":
            if isinstance(value_data, dict):
                return {
                    "updatedAt": value_data.get("updatedAt"),
                    "updater": value_data.get("updater")
                }
            return None
            
        elif cv_type == "item_id":
            # Item ID - уникальный идентификатор
            return value_data
            
        elif cv_type == "doc":
            if isinstance(value_data, dict):
                return {
                    "file_id": value_data.get("file_id"),
                    "changed_at": value_data.get("changed_at")
                }
            return None
            
        # Для типов text и numbers
        elif cv_type in ["text", "numbers"]:
            return value_data
            
        # Специальная обработка для color колонки (может быть кастомным типом)
        elif cv_type == "color" or (cv_type and "color" in cv_type):
            if isinstance(value_data, dict):
                return {
                    "index": value_data.get("index"),
                    "post_id": value_data.get("post_id"),
                    "changed_at": value_data.get("changed_at", ""),
                    "label": value_data.get("label"),
                    "color": value_data.get("color", "#00c875")
                }
            return None
            
        # Для неизвестных типов возвращаем как есть
        else:
            return value_data
            
    except Exception as e:
        print(f"Error parsing column value of type {cv_type}: {str(e)}")
        return None


def get_mappable_value(cv, parsed_value):
    """
    Возвращает значение для mappable_column_values на основе типа колонки
    """
    cv_type = cv.get("type")
    cv_text = cv.get("text")
    
    if parsed_value is None:
        return None
        
    # Для простых типов возвращаем текстовое представление
    if cv_type in ["text", "numbers", "formula", "item_id"]:
        return cv_text or parsed_value
        
    # Для status возвращаем текст (label)
    elif cv_type == "status":
        return cv_text
        
    # Для checkbox возвращаем структуру с checked и text
    elif cv_type == "checkbox":
        if isinstance(parsed_value, dict):
            return {
                "checked": parsed_value.get("checked", False),
                "text": cv_text
            }
        return None
        
    # Для остальных типов возвращаем полную структуру с text полем
    else:
        if isinstance(parsed_value, dict):
            # Добавляем text поле если его нет
            if "text" not in parsed_value and cv_text:
                parsed_value["text"] = cv_text
            return parsed_value
        return parsed_value


def transform_monday_data(input_data):
    """
    Универсальная функция трансформации данных из Monday.com
    """
    result = []

    for item in input_data:
        transformed = {
            "id": item.get("id"),
            "name": item.get("name"),
            "created_at": item.get("created_at"),
            "state": item.get("state"),
            "email": f"retailbox-company_pulse_{item.get('id')}_c5fda29b3ac05c31753d__17719660@use1.mx.monday.com",
            "updated_at": datetime.utcnow().isoformat() + "Z",
            "board": {"id": "7992652551"},
            "group": {
                "id": "topics",
                "title": "Detected results",
                "deleted": False,
                "archived": False
            },
            "assets": [],
            "parent_item": None,
            "subitems": []
        }

        # Получаем column_values
        column_values = item.get("column_values", [])
        
        # Ищем creator_id из creation_log
        creation_log = next((cv for cv in column_values if cv.get("type") == "creation_log"), None)
        if creation_log and creation_log.get("value"):
            parsed_creation = parse_column_value(creation_log.get("value"), "creation_log")
            if parsed_creation:
                transformed["creator_id"] = parsed_creation.get("creator_id")
        else:
            transformed["creator_id"] = None

        # Обрабатываем column_values
        transformed_column_values = []
        mappable_column_values = {}

        for cv in column_values:
            cv_id = cv.get("id")
            cv_value = cv.get("value")
            cv_text = cv.get("text")
            cv_type = cv.get("type")
            cv_column = cv.get("column", {})
            cv_title = cv_column.get("title", "")
            
            # Базовая структура для transformed_column_values
            new_cv = {
                "id": cv_id,
                "value": cv_value,
                "text": cv_text,
                "title": cv_title
            }

            # Парсим значение колонки
            parsed_value = parse_column_value(cv_value, cv_type)
            
            # Добавляем additional_info для определенных типов
            if cv_type == "status" and parsed_value and isinstance(parsed_value, dict):
                additional_info = {
                    "label": cv_text or parsed_value.get("label"),
                    "color": "#00c875",  # Цвет может меняться в зависимости от индекса
                    "changed_at": parsed_value.get("changed_at", "")
                }
                new_cv["additional_info"] = json.dumps(additional_info)
                
            elif cv_type == "numbers":
                # Пытаемся получить unit из settings
                try:
                    settings = json.loads(cv_column.get("settings_str", "{}"))
                    if "unit" in settings:
                        new_cv["additional_info"] = json.dumps(settings["unit"])
                except:
                    pass
                    
            elif cv_id.startswith("color_") and parsed_value and isinstance(parsed_value, dict):
                # Специальная обработка для color колонок
                additional_info = {
                    "label": cv_text or parsed_value.get("label"),
                    "color": parsed_value.get("color", "#00c875"),
                    "changed_at": parsed_value.get("changed_at", "")
                }
                new_cv["additional_info"] = json.dumps(additional_info)

            transformed_column_values.append(new_cv)

            # Создаем mappable_column_values
            mappable_value = get_mappable_value(cv, parsed_value)
            if mappable_value is not None:
                mappable_column_values[cv_id] = mappable_value
            else:
                # Для пустых значений сохраняем None
                mappable_column_values[cv_id] = None

        transformed["column_values"] = transformed_column_values
        transformed["mappable_column_values"] = mappable_column_values
        result.append(transformed)

    return result


# ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====
if __name__ == "__main__":
    # Пример данных для тестирования
    sample_data = [
        {
            "id": "123456789",
            "name": "Тестовый элемент",
            "created_at": "2023-01-01T00:00:00Z",
            "state": "active",
            "column_values": [
                {
                    "id": "status",
                    "type": "status",
                    "value": '{"index": 1, "label": "В работе", "post_id": null, "changed_at": "2023-01-01T10:00:00Z"}',
                    "text": "В работе",
                    "column": {"title": "Статус"}
                }
            ]
        }
    ]
    
    # Тестируем трансформацию
    result = transform_monday_data(sample_data)
    print(json.dumps(result, indent=2, ensure_ascii=False))