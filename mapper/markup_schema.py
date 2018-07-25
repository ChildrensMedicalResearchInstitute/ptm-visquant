from marshmallow import fields, pre_dump, Schema, validate

COLOUR_PATTERN = '^#?[0-9a-fA-F]{3,6}$'

class MarkupSchema(Schema):
    markup_type = fields.String(
        required=True,
        data_key='type',
    )
    colour = fields.String(validate=[
        validate.Regexp(COLOUR_PATTERN),
    ])
    line_colour = fields.String(
        validate=[validate.Regexp(COLOUR_PATTERN)],
        data_key='lineColour',
    )
    start = fields.Integer(
        validate=[validate.Range(min=0)],
        required=True,
    )
    end = fields.Integer(validate=[
        validate.Range(min=0),
    ])
    display = fields.Boolean(default=True)
    v_align = fields.String(
        validate=[validate.OneOf(['top', 'bottom'])],
        default='top',
    )

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
