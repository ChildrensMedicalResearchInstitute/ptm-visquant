import json
import re
import requests

from .markup_schema import MarkupSchema
from bs4 import BeautifulSoup
from csv import DictReader
from multiprocessing.dummy import Pool as ThreadPool

PFAM_DATA_PATTERN = "(?<=({pre})).*(?=({post}))".format(
    pre=re.escape("var layout = ["),
    post=re.escape("];"),
)


def __request_status(url):
    try:
        return requests.head(
            url,
            allow_redirects=True,
            timeout=5,
        ).status_code
    except requests.exceptions.Timeout:
        return None


def __request_response(url):
    try:
        return requests.get(url, timeout=5)
    except requests.exceptions.Timeout:
        return None


def __condense_heatmap_attr(dictionary):
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


def __extract_heatmap_labels(fields):
    heatmap_labels = []
    for field in fields:
        if field.startswith('heatmap_'):
            heatmap_labels.append(field[8:])
    return heatmap_labels


def split_accessions(ids):
    return [s.strip() for s in ids.split(',')]


def make_requests(urls, status_only=False):
    num_threads = len(urls)
    pool = ThreadPool(num_threads)
    request_method = __request_response
    if status_only:
        request_method = __request_status
    return pool.map(request_method, urls)


def get_protein_domains(accessions):
    """
    accessions: a list of protein assessions
    Returns a list of JSON data.
    """
    URL = 'http://pfam.xfam.org/protein/{}'
    urls = [URL.format(a) for a in accessions]
    responses = make_requests(urls)
    protein_data = []
    for i, r in enumerate(responses):
        if r is None or r.status_code != 200:
            r.raise_for_status()
        soup = BeautifulSoup(r.text, 'lxml')
        for script in soup.find_all('script'):
            result = re.search(PFAM_DATA_PATTERN, script.text)
            if result:
                protein_data.append(json.loads(result.group()))
    return protein_data


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
    heatmap_fields = __extract_heatmap_labels(reader.fieldnames)
    for row in reader:
        start = row.get('start')
        end = row.get('end')
        data = schema.dump(__condense_heatmap_attr(row))
        data['heatmap_labels'] = heatmap_fields
        if (start, end) not in coordinates:
            coordinates.add((start, end))
            markup.append(data)
    return markup


def add_markup_to_context(markup, context):
    for protein in context:
        protein_accession = protein['metadata']['accession'].upper()
        protein_identifier = protein['metadata']['identifier'].upper()
        protein['markups'] += [
            m for m in markup
            if m['accession'].upper() == protein_accession
            or m['accession'].upper() == protein_identifier
        ]
    return context
