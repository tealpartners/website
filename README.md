Teal website
===========
Contents
--------

* [Get Started](#get-started)


Get Started
-----------

# Prequesits 
## Install C++ build tools
Please install [C++ build tools](https://wiki.python.org/moin/WindowsCompilers#Microsoft_Visual_C.2B-.2B-_14.2_standalone:_Build_Tools_for_Visual_Studio_2019_.28x86.2C_x64.2C_ARM.2C_ARM64.29)

## Python 3
Please install [python 3](https://www.python.org/downloads/), don't forgot to add python to the path variables.
### Virtualenv (optional)
Install virtualenv with following command:

    python -m pip install --user virtualenv

And create the virtualenv in the repo:

    python -m virtualenv venv

Now activate the virtualenv:

    .\venv\Scripts\activate

## Packages
Install the required packages using pip:

     pip install -r .\requirements.txt

# Building
You can build the site using following command:
    
    python make_site.py

# Testing
For viewing the site local run following command:

    python -m http.server --directory _site
