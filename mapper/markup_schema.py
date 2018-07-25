from marshmallow import fields, Schema, validate

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
    display = fields.Boolean()
    v_align = fields.String(validate=[
        validate.OneOf(['top', 'bottom']),
    ])
