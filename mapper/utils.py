import grequests
import json
import re

from .markup_schema import MarkupSchema
from bs4 import BeautifulSoup
from csv import DictReader

PFAM_DATA_PATTERN = "(?<=({pre})).*(?=({post}))".format(
    pre=re.escape("var layout = ["),
    post=re.escape("];"),
)


def get_protein_domains(ids):
    """
    ids: a comma separated string of protein entry names or accessions.
    Returns a list of JSON data.
    """
    URL = 'http://pfam.xfam.org/protein/{}'
    accessions = [s.strip() for s in ids.split(',')]
    urls = [URL.format(a) for a in accessions]
    request_list = (grequests.get(u, timeout=5) for u in urls)
    response_list = grequests.map(request_list)
    protein_data = []
    for i, r in enumerate(response_list):
        if r is None or r.status_code != 200:
            r.raise_for_status()
        soup = BeautifulSoup(r.text, 'lxml')
        for script in soup.find_all('script'):
            result = re.search(PFAM_DATA_PATTERN, script.text)
            if result:
                protein_data.append(json.loads(result.group()))
    return protein_data


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
