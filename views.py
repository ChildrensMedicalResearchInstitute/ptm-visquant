from app import app
from forms import PtmForm
from mapper.utils import (
    add_markup_to_context,
    get_protein_domains,
    remove_all_markup,
    split_accessions,
    to_markup_list,
)

from flask import Flask, Markup
from flask import render_template, request, send_from_directory
from markdown import markdown
from markdown.extensions.extra import ExtraExtension


@app.route('/', methods=['GET', 'POST'])
def index():
    form = PtmForm()
    hasFileUpload = False
    context = None
    if request.method == 'POST' and form.validate():
        context = get_protein_domains(split_accessions(form.accession.data))
        context = remove_all_markup(context)
        f = form.csv_file.data
        if f:
            hasFileUpload = True
            lines = [line.decode() for line in f.readlines()]
            add_markup_to_context(to_markup_list(lines), context)
    return render_template(
        'ptm-visquant.html',
        card_content=read_markdown('static/content/instruction_card.md'),
        form=form,
        hasFileUpload=hasFileUpload,
        context=context,
    )


@app.route('/example')
def example():
    """
    Skip external HTTP requests and load JSON from file.
    """
    form = PtmForm(request.form)
    form.accession.data = "BSN_RAT"
    import json
    with open('static/files/BSN_RAT.json') as f:
        context = json.load(f)
        context = remove_all_markup(context)
    with open('static/files/BSN_RAT_EXAMPLE.csv') as f:
        add_markup_to_context(to_markup_list(f), context)
    return render_template(
        'ptm-visquant.html',
        card_content=read_markdown('static/content/instruction_card.md'),
        form=form,
        hasFileUpload=True,
        context=context,
    )


@app.route('/how-to')
def how_to():
    return render_template(
        'article.html',
        content=read_markdown('static/content/how_to.md'),
    )


@app.route('/example-csv')
def example_csv():
    return send_from_directory(
        'static/files',
        filename='BSN_RAT_EXAMPLE.csv',
        as_attachment=True,
    )


def read_markdown(filename):
    try:
        with open(filename) as about_file:
            extras = [ExtraExtension(), ]
            content = Markup(markdown(
                about_file.read(),
                extensions=extras,
            ))
    except FileNotFoundError as e:
        raise e
    return content
