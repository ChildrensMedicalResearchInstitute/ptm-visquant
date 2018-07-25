from marshmallow import fields, pre_dump, Schema, validate

COLOUR_PATTERN = '^#?[0-9a-fA-F]{3,6}$'


class MarkupSchema(Schema):
    type = fields.String(
        required=True,
        validate=[validate.Length(min=1, error="Type cannot be empty")],
    )
    colour = fields.String(
        validate=[validate.Regexp(COLOUR_PATTERN)],
    )
    lineColour = fields.String(
        validate=[validate.Regexp(COLOUR_PATTERN)],
    )
    start = fields.Integer(
        required=True,
        validate=[validate.Range(min=0)],
    )
    end = fields.Integer(
        validate=[validate.Range(min=0)],
        default=None,
    )
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
