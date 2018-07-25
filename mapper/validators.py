import requests

from .markup_schema import MarkupSchema
from csv import DictReader
from wtforms import StringField, ValidationError

class ValidUniProtProtein():
    def __init__(self, message=None):
        self.ENDPOINT = 'http://www.uniprot.org/uniprot/{}.xml'
        self.message = 'Protein "{}" not found in UniProt database.'
        self.timeout_message = "UniProt server might be offline."

    def __call__(self, form, field):
        try:
            response = requests.get(
                self.ENDPOINT.format(field.data),
                timeout=5,
            )
        except requests.exceptions.Timeout:
            raise ValidationError(self.timeout_message)
        if response.status_code != 200:
            raise ValidationError(self.message.format(field.data))

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
