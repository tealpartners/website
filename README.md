Teal website
===========


Contents
--------

* [Get Started](#get-started)


Get Started
-----------

# Prequesits 
## Python 3
Please install [python 3](https://www.python.org/downloads/)
### Virtualenv (optional)
Install virtualenv with following command:

    python -m pip install --user virtualenv

And create the virtualenv in the repo:

    virtualenv venv

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