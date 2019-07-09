# PTM VisQuant

PTM VisQuant is a simple web application designed for visualising post-translational modification sites alongside protein motif and family domain information.

https://visquant.cmri.org.au/

## Installing project dependencies

### Python dependencies

This project uses Python 3.7. Python dependencies are managed using [pipenv](https://docs.pipenv.org/en/latest/).

Clone this repository.

```
git clone https://github.com/ChildrensMedicalResearchInstitute/ptm-visquant.git
```

Then create a python3 environment with pipenv.

```
cd ptm-visquant
pipenv install
```

### Javascript dependencies

This project uses NPM to manage JavaScript dependencies in the frontend. Install [Node.js](https://nodejs.org/en/download/), which comes with the node package manager (npm).

Verify that npm has been installed successfully.

```
npm --version
```

All Javascript dependencies are listed in the `static/package.json` file. Navigate to the `static` directory and install all dependencies there.

```
cd static
npm install
```

## Launching the development server

Execute the run-script in the project's root directory.

```
# for MacOS and Linux systems
bash runserver.sh
# for Windows systems
runserver.bat
```

Navigate to http://127.0.0.1:5000/ in your browser.
