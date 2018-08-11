from mapper import validators

from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileField
from wtforms import StringField
from wtforms.validators import InputRequired


class PtmForm(FlaskForm):
    accession = StringField('Protein Entry Name or Accession', [
        InputRequired(),
        validators.ValidUniProtProteins(),
    ])
    csv_file = FileField('Post-translational modifications file', [
        FileAllowed(['csv'], 'File must be in CSV format.'),
        validators.ValidMarkupFile(),
    ])
