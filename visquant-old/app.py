from flask import Flask

from .configurations import FlaskConfig

app = Flask(__name__)
app.config.from_object(FlaskConfig)

# Import after creating flask app to prevent circular dependency
from . import views
