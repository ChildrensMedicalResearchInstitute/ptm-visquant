from .markup_schema import MarkupSchema
from .utils import make_requests, split_accessions
from csv import DictReader
from wtforms import StringField, ValidationError


class ValidUniProtProteins():
    def __init__(self, message=None):
        self.ENDPOINT = 'http://www.uniprot.org/uniprot/{}.xml'
        self.MESSAGE = 'Unable to fetch "{}" from UniProt database.'

    def __call__(self, form, field):
        accessions = split_accessions(field.data)
        urls = [self.ENDPOINT.format(a) for a in accessions]
        status = make_requests(urls, status_only=True)
        for i, stat in enumerate(status):
            if stat is None or stat != 200:
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
        f.seek(0)  # Return cursor to top of file for later parsing
        reader = DictReader(lines)
        for line_num, row in enumerate(reader, start=2):
            errors = schema.validate(row)
            if errors:
                raise ValidationError(self.message.format(line_num, errors))
