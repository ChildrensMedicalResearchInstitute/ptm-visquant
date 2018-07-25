from marshmallow import fields, Schema, validate

COLOUR_PATTERN = '^#?[0-9a-fA-F]{3,6}$'

def markup_object(mtype, coord):
    return {
        "type" : mtype,
        "start" : coord,
        "end" : coord,
        "lineColour" : 'black',
        "colour" : "#000000",
        "display" : True,
        "v_align" : "top",
        "metadata" : {
            "type" : mtype,
            "start" : coord,
            "end" : coord,
            "database" : "User defined",
        },
    }

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

def string_to_colour(s):
    h = hash(s)
    r = (h & 0xFF0000) >> 16
    g = (h & 0x00FF00) >> 8
    b = (h & 0x0000FF) >> 0
    return "#{:02X}{:02X}{:02X}".format(r, g, b)
