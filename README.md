# PTM Mapper

Post-translational modification mapper (PTM Mapper) is a simple web application designed for visualising post-translational modification sites alongside protein motif and family domain information.

## Installing project dependencies

1. Install Python3.7 from [Conda](https://www.anaconda.com/download/#linux) or [MiniConda](https://conda.io/miniconda.html) (light-weight Conda installation). Verify that conda has installed successfully.
   ```
   conda --version
   ```
2. Clone this repository, then change to the project directory.
   ```
   git clone https://bitbucket.cmri.com.au/scm/bioinf/ptm-mapper.git
   ```
3. Create a python3 environment from the `environments.yml` file.
   ```
   conda create env -f ptm-mapper/environment.yml
   ```

## Launching the development server

1. Change to the project directory and execute the run-script.

   ```
   # for MacOS and Linux
   cd ptm-mapper
   bash runserver.sh

   # for Windows
   dir ptm-mapper
   runserver.bat
   ```

2. Navigate to http://127.0.0.1:5000/ in your browser.
