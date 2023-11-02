import xml.etree.ElementTree as ET
import json

# Функция для извлечения данных из SVG и создания JSON
def extract_svg_data(svg_file, output_json_file):
    svg_data = []

    # Открываем SVG файл
    tree = ET.parse(svg_file)
    root = tree.getroot()

    # Итерируемся по элементам внутри SVG
    for element in root.iter():
        if 'd' in element.attrib and 'fill' in element.attrib:
            data = {
                "d": element.attrib["d"],
                "fill": element.attrib["fill"]
            }
            if 'id' in element.attrib:
                data["id"] = element.attrib["id"]
            svg_data.append(data)

    # Создаем JSON файл с извлеченными данными
    with open(output_json_file, 'w') as json_file:
        json.dump(svg_data, json_file, indent=2)

# Укажите путь к вашему SVG файлу и путь к JSON файлу для вывода
svg_file_path = 'example.svg'
output_json_file_path = 'output.json'

# Вызываем функцию для извлечения данных и создания JSON файла
extract_svg_data(svg_file_path, output_json_file_path)
