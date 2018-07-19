from app import app
from forms import PtmForm
from mapper import get_protein_domains

from flask import Flask, Markup
from flask import render_template, request
from markdown import markdown
from markdown.extensions.codehilite import CodeHiliteExtension
from markdown.extensions.extra import ExtraExtension

@app.route('/', methods=['GET', 'POST'])
def index():
    form = PtmForm(request.form)
    if request.method == 'POST' and form.validate():
        data = get_protein_domains(form.accession.data)
        # TODO: extract info from data
    return render_template('ptm_mapper.html', form=form)

@app.route('/about')
def about():
    try:
        content = read_markdown('about.md')
    except FileNotFoundError:
        content = "File unavailable."
    return render_template(
        'article.html',
        content=content,
    )

@app.route('/how-to')
def how_to():
    try:
        content = read_markdown('how_to.md')
    except FileNotFoundError:
        content = "File unavailable."
    return render_template(
        'article.html',
        content=content,
    )

def read_markdown(filename):
    try:
        with open(filename) as about_file:
            extras = ExtraExtension()
            content = Markup(markdown(
                about_file.read(),
                extensions=[extras],
            ))
    except FileNotFoundError as e:
        raise e
    return content
