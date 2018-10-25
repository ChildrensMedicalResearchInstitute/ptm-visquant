from marshmallow import fields, pre_dump, Schema, validate


class MarkupSchema(Schema):
    accession = fields.String(
        required=True,
    )
    type = fields.String(
        required=True,
        validate=[
            validate.Regexp(r"\w+(\W\w+)*"),
        ],
    )
    colour = fields.String()
    lineColour = fields.String()
    site = fields.String(
        required=True,
        validate=[
            validate.Regexp(r"\d+(\D\d+)*", error="Invalid site data"),
        ],
    )
    display = fields.Boolean(default=True)
    peptide_type_sequence = fields.String()
    peptide_coordinate_sequence = fields.String()
    intensity_labels = fields.List(fields.String())
    intensity_values = fields.List(fields.Float())

    @pre_dump
    def generate_line_colour(self, item):
        """Generate lineColour if attribute is not specified."""
        if item.get('lineColour') is None:
            item['lineColour'] = string_to_colour(item['type'])


def string_to_colour(s):
    h = hash(s)
    r = (h & 0xFF0000) >> 16
    g = (h & 0x00FF00) >> 8
    b = (h & 0x0000FF) >> 0
    return "#{:02X}{:02X}{:02X}".format(r, g, b)
