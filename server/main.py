"""`main` is the top level module for your Flask application."""

# Import the Flask Framework
from flask import Flask, jsonify, abort, request, make_response, url_for
from models.song import Song
from models.album import Album

app = Flask(__name__)

@app.route('/rest/first', methods = ['GET'])
def first_page():
    songs = Song.queryRecentSongs()
    albums = Album.queryRecentAlbums()
    songDictArray = [];
    for song in songs:
        songDictArray.append(song.to_full_dict())
    albumDictArray = [];
    for album in albums:
        albumDictArray.append(album.to_dict())

    return jsonify({'songs': songDictArray, 'albums': albumDictArray})

@app.route('/rest/album/<albumid>', methods = ['GET'])
def get_album(albumid=''):
    album = Album.query(id=albumid)
    songs = Song.queryAlbum(album.key)
    songDictArray = [];
    for song in songs:
        songDictArray.append(song.to_full_dict())
    return jsonify({'songs': songDictArray, 'album': album.to_dict()})

@app.route('/rest/song/<songid>', methods = ['GET'])
def get_song(songid=''):
    album = Album.query(id=albumid)
    song = Song.query(id=songid)
    return jsonify({'song': song.to_full_dict_and_lyrics()})

@app.route('/rest/songs/<offset>', methods = ['GET'])
def get_songs(offset=''):
    songs = Song.queryRecentSongs(offset)
    songDictArray = [];
    for song in songs:
        songDictArray.append(song.to_full_dict())
    return jsonify({'songs': songDictArray})

@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.', 404


@app.errorhandler(500)
def application_error(e):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(e), 500
