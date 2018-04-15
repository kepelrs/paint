#!/usr/bin/python3
from flask import Flask, render_template, redirect
import logging

# setup Flask app
app = Flask(__name__, static_path='', static_folder='', template_folder='')


# Ensure responses aren't cached. Useful for when still building your front end
# You can delete this block of code later
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def home():
    return render_template("index.html")


@app.errorhandler(404)
def page_not_found(e):
    return redirect('/')


if __name__ == "__main__":
    logger = logging.getLogger('werkzeug')
    handler = logging.FileHandler('access.log')
    logger.addHandler(handler)
    app.logger.addHandler(handler)
    app.run(host="0.0.0.0", port=3121, threaded=True, debug=False)
