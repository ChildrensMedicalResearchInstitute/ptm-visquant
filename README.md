# PTM VisQuant

PTM VisQuant is a simple web application designed for visualising post-translational modification sites alongside protein motif and family domain information.

## Installing project dependencies

### Python dependencies

This project uses Python 3.7 for the backend and Conda to manage required Python packages. You can install Python3.7 from [Conda](https://www.anaconda.com/download/#linux) or [MiniConda](https://conda.io/miniconda.html) (light-weight Conda installation). Verify that Conda has installed successfully.

```
conda --version
```

Clone this repository.

```
git clone https://github.com/ChildrensMedicalResearchInstitute/ptm-visquant.git
```

Then create a python3 environment with Python package dependencies as defined by the `environment.yml` file.

```
conda env create -f ptm-visquant/environment.yml
```

Verify the environment has been successfully created.

```
source activate ptm-visquant
```

### Javascript dependencies

This project uses npm to manage JavaScript dependencies in the frontend. Install [Node.js](https://nodejs.org/en/download/), which comes with the node package manager (npm).

Verify that npm has been installed successfully.

```
npm --version
```

All Javascript dependencies are listed in the `static/package.json` file. Navigate to the `static` directory and install all dependencies there.

```
cd ptm-visquant/static
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
