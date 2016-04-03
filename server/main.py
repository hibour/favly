"""`main` is the top level module for your Flask application."""

# Import the Flask Framework
from flask import Flask, jsonify, abort, request, make_response, url_for

app = Flask(__name__)

@app.route('/')
def index():
    songs = Song.queryRecentSongs()
    songDictArray = [];
    for song in songs:
        songDictArray.append(song.to_dict())
    print songDictArray
    return jsonify({'songs': songDictArray})

@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.', 404


@app.errorhandler(500)
def application_error(e):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(e), 500
