from flask import Flask

import configurations

app = Flask(__name__)
app.config.from_object(configurations.FlaskConfig)

# Import after creating flask app to prevent circular dependency
import views
