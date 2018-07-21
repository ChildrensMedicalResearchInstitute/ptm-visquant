import requests
from wtforms import Form, FileField, StringField, validators, ValidationError

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

class PtmForm(Form):
    accession = StringField(
        'Protein Entry Name  Accession',
        [validators.InputRequired(), ValidUniProtProtein()]
    )
    ptm = FileField(
        'Post-translational modifications file',
    )
