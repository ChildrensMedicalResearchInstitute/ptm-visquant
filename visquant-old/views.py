import importlib.resources as pkg_resources

from flask import Flask, Markup
from flask import abort, render_template, request, send_from_directory
from mapper.utils import (
    add_markup_to_context,
    get_protein_domains,
    remove_all_markup,
    to_markup_list,
)
from markdown import markdown
from markdown.extensions.extra import ExtraExtension
from pathlib import Path
from werkzeug.utils import secure_filename

from .app import app
from .forms import PtmForm


def resolve_static_file(filepath):
    base_path = Path(__file__).parent
    return (base_path / 'static' / filepath).resolve()


def read_markdown(filepath):
    try:
        with open(resolve_static_file(filepath)) as f:
            return Markup(markdown(
                f.read(),
                extensions=[ExtraExtension()],
            ))
    except FileNotFoundError:
        abort(404, description="Missing markdown file.")


@app.route('/', methods=['GET', 'POST'])
def index():
    form = PtmForm()
    has_file_upload = False
    context = None
    if request.method == 'POST' and form.validate():
        context = get_protein_domains(form.accession_list)
        context = remove_all_markup(context)
        if form.has_file_upload:
            has_file_upload = True
            add_markup_to_context(form.markup_list, context)
    return render_template(
        'ptm-visquant.html',
        card_content=read_markdown('content/instruction_card.md'),
        form=form,
        has_file_upload=has_file_upload,
        context=context,
    )


@app.route('/example')
def example():
    """
    Skip external HTTP requests and load JSON from file.
    """
    form = PtmForm(request.form)
    form.accession.data = "tau_rat"
    import json
    with open(resolve_static_file('files/tau_rat.json')) as f:
        context = json.load(f)
        context = remove_all_markup(context)
    with open(resolve_static_file('files/tau_rat_example.csv')) as f:
        add_markup_to_context(to_markup_list(f), context)
    return render_template(
        'ptm-visquant.html',
        card_content=read_markdown('content/instruction_card.md'),
        form=form,
        has_file_upload=True,
        context=context,
    )


@app.route('/how-to', defaults={'path': ''})
@app.route('/how-to/<path:path>')
def how_to(path):
    if not path:
        filename = 'how_to.md'
    else:
        filename = f"how_to_{path.replace('-', '_')}.md"
    return render_template(
        'article.html',
        content=read_markdown(f'content/{secure_filename(filename)}'),
    )


@app.route('/contact-us')
def contact_us():
    return render_template(
        'article.html',
        content=read_markdown('content/contact_us.md'),
    )


@app.route('/license')
def license():
    return render_template(
        'article.html',
        content=read_markdown('../../LICENSE.md'),
    )


@app.route('/example-csv')
def example_csv():
    return send_from_directory(
        resolve_static_file('files'),
        filename='tau_rat_example.csv',
        as_attachment=True,
    )
