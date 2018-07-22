import requests
from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileField
from wtforms import StringField, validators, ValidationError

class ValidUniProtProtein(object):
    def __init__(self, message=None):
        if not message:
            message = 'Protein "{}" not found in UniProt database.'
        self.message = message

    def __call__(self, form, field):
        ENDPOINT = 'http://www.uniprot.org/uniprot/{}.xml'
        response = requests.get(ENDPOINT.format(field.data))
        if response.status_code != 200:
            raise ValidationError(self.message.format(field.data))

class PtmForm(FlaskForm):
    accession = StringField(
        'Protein Entry Name or Accession',
        [validators.InputRequired(), ValidUniProtProtein()]
    )
    csv_file = FileField(
        'Post-translational modifications file',
        [FileAllowed(['csv'], 'File must be in CSV format.')]
    )
