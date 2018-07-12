from wtforms import Form, FileField, StringField, validators

class PtmForm(Form):
    accession = StringField(
        'Protein Family Accession / ID',
        [validators.InputRequired()]
    )
    ptm = FileField(
        'Post-translational modifications file',
        [validators.InputRequired()]
    )
