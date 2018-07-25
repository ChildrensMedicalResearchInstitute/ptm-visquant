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

def parse_ptm_file(ptm_file):
    markup = []
    schema = MarkupSchema()
    reader = DictReader(ptm_file)
    coordinates = set()
    for row in reader:
        start = row.get('start')
        end = row.get('end')
        data = schema.dump(row)
        print(data, type(data))
        if (start, end) not in coordinates:
            coordinates.add((start, end))
            markup.append(data)
    return markup
