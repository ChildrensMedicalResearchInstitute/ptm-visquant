import requests
from bs4 import BeautifulSoup

def parse_response_to_soup(response, parser='lxml'):
    if response.status_code == 200:
        return BeautifulSoup(response.text, parser)

def get_pfam_protein(id):
    URL = 'http://pfam.xfam.org/protein/{}?output=xml'
    return parse_response_to_soup(requests.get(URL.format(id)))

def get_pfam_family(id):
    URL = 'https://pfam.xfam.org/family/{}?output=xml'
    return parse_response_to_soup(requests.get(URL.format(id)))

def parse_ptm_file(ptm_file):
    pass
