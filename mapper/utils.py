import json
import re
import requests

from .markup_schema import MarkupSchema
from bs4 import BeautifulSoup
from csv import DictReader


def request_soup(url, parser='lxml'):
    response = requests.get(url)
    if response.status_code == 200:
        return BeautifulSoup(response.text, parser)
    response.raise_for_status()


def get_protein_domains(id):
    URL = 'http://pfam.xfam.org/protein/{}'
    soup = request_soup(URL.format(id))
    pattern = "(?<=({pre})).*(?=({post}))".format(
        pre=re.escape("var layout = ["),
        post=re.escape("];"),
    )
    for script in soup.find_all('script'):
        result = re.search(pattern, script.text)
        if result:
            return json.loads(result.group())


def condense_heatmap_attr(dictionary):
    keys_to_remove = []
    heatmap_values = []
    for key, value in dictionary.items():
        if key.startswith('heatmap_'):
            heatmap_values.append(value)
            keys_to_remove.append(key)
    for key in keys_to_remove:
        dictionary.pop(key)
    dictionary['heatmap_values'] = heatmap_values
    return dictionary


def extract_heatmap_labels(fields):
    heatmap_labels = []
    for field in fields:
        if field.startswith('heatmap_'):
            heatmap_labels.append(field[8:])
    return heatmap_labels


def to_markup_list(csv_file):
    """
    csv_file: an iterable whose elements describe a markup object.
    Returns a list of dictionaries describing a markup object. If there
    exist more than one markup with the same start and end positions,
    later instances are ignored.
    """
    markup = []
    schema = MarkupSchema()
    reader = DictReader(csv_file)
    coordinates = set()
    heatmap_fields = extract_heatmap_labels(reader.fieldnames)
    for row in reader:
        start = row.get('start')
        end = row.get('end')
        data = schema.dump(condense_heatmap_attr(row))
        data['heatmap_labels'] = heatmap_fields
        if (start, end) not in coordinates:
            coordinates.add((start, end))
            markup.append(data)
    return markup
