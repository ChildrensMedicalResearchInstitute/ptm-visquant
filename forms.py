from mapper import validators
from mapper.utils import split_accessions, to_markup_list

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
    csv_file_contents = None

    @property
    def accession_list(self):
        return split_accessions(self.accession.data)

    @property
    def has_file_upload(self):
        return bool(self.csv_file.data)

    @property
    def file_lines(self):
        if self.has_file_upload and self.csv_file_contents is None:
            self.csv_file_contents = [
                line.decode() for line in self.csv_file.data.readlines()
            ]
        return self.csv_file_contents

    @property
    def markup_list(self):
        return to_markup_list(self.file_lines)
