import json
import re
import requests

from bs4 import BeautifulSoup
from csv import DictReader

MARKUP_LINE_COLOUR = {
    'phosphorylation': '#FE4EDA',
}

def markup_object(mtype, coord):
    return {
        "type" : mtype,
        "start" : coord,
        "end" : coord,
        "lineColour" : MARKUP_LINE_COLOUR.get(mtype, 'black'),
        "colour" : "#000000",
        "display" : True,
        "v_align" : "top",
        "metadata" : {
            "type" : mtype,
            "start" : coord,
            "end" : coord,
            "database" : "User defined",
        },
    }

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
    coords = set()
    reader = DictReader(ptm_file, fieldnames=['type', 'coord'])
    for row in reader:
        if row['coord'] not in coords:
            coords.add(row['coord'])
            markup.append(markup_object(row['type'], row['coord']))
    return markup
