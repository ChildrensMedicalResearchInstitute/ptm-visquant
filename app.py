from flask import Flask

app = Flask(__name__)
app.config['SECRET_KEY'] = '52175BCE823AFFACA76C5E9E2994A'

import views
