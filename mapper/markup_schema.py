from marshmallow import fields, pre_dump, Schema, validate


class MarkupSchema(Schema):
    accession = fields.String(required=True)
    type_ = fields.String(
        attribute='type',
        data_key='type',
        required=True,
        validate=[validate.Regexp(r"\w+(\W\w+)*")],
    )
    colour = fields.String()
    line_colour = fields.String(
        attribute='lineColour',
        data_key='lineColour',
    )
    site = fields.String(
        required=True,
        validate=[validate.Regexp(r"\d+(\D\d+)*", error='Invalid site data')],
    )
    display = fields.Boolean(default=True)
    peptide_type_sequence = fields.String()
    peptide_coordinate_sequence = fields.String()
    intensity_labels = fields.List(fields.String())
    intensity_values = fields.List(fields.Float())

    @staticmethod
    def string_to_colour(s):
        h = hash(s)
        r = (h & 0xFF0000) >> 16
        g = (h & 0x00FF00) >> 8
        b = (h & 0x0000FF) >> 0
        return f"#{r:02X}{g:02X}{b:02X}"

    @pre_dump
    def generate_line_colour(self, item, **kwargs):
        """Generate line_colour attribute if not specified."""
        if 'lineColour' not in item:
            item['lineColour'] = self.string_to_colour(item['type'])

    @pre_dump
    def delimit_site_string(self, item, **kwargs):
        item['site'] = item['site'].replace(';', '+')
