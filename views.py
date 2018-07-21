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
    context = None
    if request.method == 'POST' and form.validate():
        context = get_protein_domains(form.accession.data)
    return render_template(
        'ptm_mapper.html', 
        form=form,
        context=context,
    )

@app.route('/default')
def default():
    """
    For debugging only. 
    Skip external HTTP requests and load JSON from file.
    """
    form = PtmForm(request.form)
    import json
    with open('static/O88778.json') as f:
        context = json.load(f)
    return render_template(
        'ptm_mapper.html',
        form=form,
        context=context,
    )

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
