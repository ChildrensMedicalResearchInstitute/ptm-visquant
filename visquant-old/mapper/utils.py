import json
import re
import requests

from .markup_schema import MarkupSchema
from bs4 import BeautifulSoup
from copy import deepcopy
from csv import DictReader
from itertools import cycle
from multiprocessing.dummy import Pool as ThreadPool

PFAM_DATA_PATTERN = r"(?<=({pre}))[\s\S]*?(?=({post}))".format(
    pre=re.escape("var layout = ["),
    post=r"\][\s]*;",
)


def _request_status(url):
    try:
        return requests.head(
            url,
            allow_redirects=True,
            timeout=10,
        ).status_code
    except requests.exceptions.Timeout:
        return None


def _request_response(url):
    try:
        return requests.get(url, timeout=10)
    except requests.exceptions.Timeout:
        return None


def _condense_intensity_attr(dictionary):
    dictionary = deepcopy(dictionary)
    keys_to_remove = []
    intensity_values = []
    for key, value in dictionary.items():
        if key is not None and key.startswith('intensity_'):
            intensity_values.append(value if value else None)
            keys_to_remove.append(key)
    for key in keys_to_remove:
        dictionary.pop(key)
    dictionary['intensity_values'] = intensity_values
    return dictionary


def _extract_intensity_labels(fields):
    intensity_labels = []
    for field in fields:
        if field.startswith('intensity_'):
            intensity_labels.append(field[10:])
    return intensity_labels


def split_accessions(ids):
    return [s.strip() for s in ids.split(',') if s.strip()]


def make_requests(urls, status_only=False):
    num_threads = len(urls)
    pool = ThreadPool(num_threads)
    request_method = _request_response
    if status_only:
        request_method = _request_status
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
        if r is None:
            continue
        elif r.status_code != 200:
            r.raise_for_status()
        soup = BeautifulSoup(r.text, 'lxml')
        for script in soup.find_all('script'):
            result = re.search(PFAM_DATA_PATTERN, script.text)
            if result:
                protein_data.append(json.loads(result.group()))
    return protein_data


def _split_type_string(s):
    return re.split(r'\W+', s)


def _split_coordinate_string(s):
    return map(int, re.split(r'\D+', s))


def _split_colour_string(s):
    return re.split(r'[^\w#]+', s)


def count_experimental_trials(csv_file):
    reader = DictReader(csv_file)
    trials = [x for x in reader.fieldnames if x.startswith('intensity_')]
    return len(trials)


def to_markup_list(csv_file):
    """
    csv_file: an iterable whose elements describe a markup object.
    Returns a list of dictionaries describing a markup object.
    """
    markup = []
    schema = MarkupSchema()
    reader = DictReader(csv_file)
    intensity_labels = _extract_intensity_labels(reader.fieldnames)
    for row in reader:
        row = _condense_intensity_attr(row)
        coordinates = _split_coordinate_string(row.get('site'))
        types = _split_type_string(row.get('type'))
        colours = _split_colour_string(
            row.get('lineColour')) if row.get('lineColour') else [None]
        site_sets = enumerate(zip(coordinates, cycle(types), cycle(colours)))
        for index, (coord, type_, colour) in site_sets:
            data = schema.dump(row)
            data['type'] = type_
            data['start'] = coord
            if colour is not None:
                data['lineColour'] = colour
            # avoid displaying duplicate markup; only one per row
            data['display'] = True if index == 0 else False
            data['peptide_type_sequence'] = data['type']
            data['peptide_coordinate_sequence'] = data['site']
            data['intensity_labels'] = intensity_labels
            markup.append(data)
    return markup


def remove_all_markup(context):
    for protein in context:
        protein['markups'] = []
    return context


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
