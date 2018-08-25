from .markup_schema import MarkupSchema
from .utils import make_requests, split_accessions
from csv import DictReader
from wtforms import StringField, ValidationError


class ValidProteins():
    def __init__(self, message=None):
        self.ENDPOINT = 'http://pfam.xfam.org/protein/{}/graphic'

    def __call__(self, form, field):
        accessions = split_accessions(field.data)
        urls = [self.ENDPOINT.format(a) for a in accessions]
        responses = make_requests(urls)
        for i, r in enumerate(responses):
            if r is None:
                raise ValidationError("Unable to connect to PFAM.")
            try:
                r.json()
            except:
                raise ValidationError(
                    f"Unable to fetch '{accessions[i]}' from PFAM."
                )


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
