import grequests

from .markup_schema import MarkupSchema
from csv import DictReader
from wtforms import StringField, ValidationError


class ValidUniProtProteins():
    def __init__(self, message=None):
        self.ENDPOINT = 'http://www.uniprot.org/uniprot/{}.xml'
        self.MESSAGE = 'Unable to fetch "{}" from UniProt database.'

    def __call__(self, form, field):
        accessions = [s.strip() for s in field.data.split(',')]
        urls = [self.ENDPOINT.format(a) for a in accessions]
        request_list = (grequests.head(u, timeout=5) for u in urls)
        response_list = grequests.map(request_list)
        for i, r in enumerate(response_list):
            if r is None or r.status_code != 200:
                raise ValidationError(self.MESSAGE.format(accessions[i]))


class ValidMarkupFile():
    def __init__(self, message=None):
        if not message:
            message = 'Error in CSV file on line {}: {}'
        self.message = message

    def __call__(self, form, field):
        f = form.csv_file.data
        if f is None:
            return
        schema = MarkupSchema()
        lines = [line.decode() for line in f.readlines()]
        reader = DictReader(lines)
        for line_num, row in enumerate(reader):
            errors = schema.validate(row)
            if errors:
                raise ValidationError(self.message.format(line_num, errors))
