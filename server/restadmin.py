"""`admin` is the top level module for your Flask Admin application."""

# Import the Flask Framework
from flask import Flask, jsonify, abort, request, make_response, url_for
from models.song import Song
from models.album import Album

import json
import string

app = Flask(__name__)

@app.route('/restadmin/songs', methods = ['GET'])
def get_tasks():
    songs = Song.queryRecentSongs()
    songDictArray = [];
    for song in songs:
        songDictArray.append(song.to_dict())
    return jsonify({'songs': songDictArray})

@app.route('/restadmin/song', methods = ['POST'])
def save_songs():
    modifiedSongs = request.json['songs']
    print modifiedSongs
    for modifiedSong in modifiedSongs:
        song = Song.get_by_id(modifiedSong['id']);
        song.title = modifiedSong['title']
        song.tags = modifiedSong['tags']
        song.put()
    return 'true'

@app.route('/restadmin/import', methods = ['POST'])
def import_tasks():
    file = request.files['file']
    newsongs = []
    if file:
        filestream = file.read()
        jsonData = json.loads(filestream);
        for jsonSong in jsonData['songs']:
            jsonSong['lyrics'] = jsonSong['lyrics'].replace('https://shining-fire-6281.firebaseapp.com', '/public').encode('ascii', 'ignore');
            jsonSong['thumbnail'] = jsonSong['thumbnail'].replace('https://shining-fire-6281.firebaseapp.com', '/public').encode('ascii', 'ignore');
            jsonSong['track'] = jsonSong['track'].replace('https://shining-fire-6281.firebaseapp.com', '/public').encode('ascii', 'ignore');

            album = jsonSong['album'].encode('ascii', 'ignore').translate(None, string.whitespace).translate(None, string.punctuation).lower()
            title = jsonSong['title'].encode('ascii', 'ignore').translate(None, string.whitespace).translate(None, string.punctuation).lower()
            id = album + '~' + title

            song = Song(id=id,title=jsonSong['title'],album=jsonSong['album'],track=jsonSong['track'],lyrics=jsonSong['lyrics'],version=int(jsonSong['version']),year=int(jsonSong['year']),thumbnail=jsonSong['thumbnail'])
            song.put()
            newsongs.append(song.to_dict())

    return jsonify({'songs': newsongs})

@app.route('/restadmin/upload', methods = ['POST'])
def upload_song():
    file = request.files['file']
    song = request.json['song']
    if file:
        filestream = file.read()
        song = Song.get_by_id(modifiedSong['id']);
        # ToDo upload to gcs. and put that file name here.
        song.track = song.track;
        song.put()

    return 'true'

@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.', 404


@app.errorhandler(500)
def application_error(e):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(e), 500
