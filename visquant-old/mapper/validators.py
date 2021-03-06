from .markup_schema import MarkupSchema
from .utils import make_requests, split_accessions
from csv import DictReader
from wtforms import StringField, ValidationError


class ValidUniProtProteins():
    def __init__(self, message=None):
        self.ENDPOINT = 'http://www.uniprot.org/uniprot/{}.xml'

    def __call__(self, form, field):
        accessions = split_accessions(field.data)
        urls = [self.ENDPOINT.format(a) for a in accessions]
        status = make_requests(urls, status_only=True)
        for i, stat in enumerate(status):
            if stat is None:
                raise ValidationError(
                    "Unable to connect to {}:"
                    " UniProt is taking too long to respond."
                    .format(self.ENDPOINT.format(accessions[i]))
                )
            if stat != 200:
                raise ValidationError(
                    "Uniprot does not recognise the protein '{}'."
                    .format(accessions[i])
                )


class ValidMarkupFile():
    def __init__(self, message=None):
        if not message:
            message = 'Error in CSV file on line {}: {}'
        self.message = message

    def __call__(self, form, field):
        if not form.has_file_upload:
            return
        schema = MarkupSchema()
        reader = DictReader(form.file_lines)
        for line_num, row in enumerate(reader, start=2):
            errors = schema.validate(row)
            if errors:
                raise ValidationError(self.message.format(line_num, errors))
