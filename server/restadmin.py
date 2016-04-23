"""`admin` is the top level module for your Flask Admin application."""

# Import the Flask Framework
from flask import Flask, jsonify, abort, request, make_response, url_for
from models.song import Song
from models.album import Album

from google.appengine.ext import ndb
import json
import string

app = Flask(__name__)

@app.route('/restadmin/songs', methods = ['GET'])
def get_songs():
    songs = Song.queryRecentSongs()
    songDictArray = [];
    for song in songs:
        songDictArray.append(song.to_full_dict())
    return jsonify({'songs': songDictArray})

@app.route('/restadmin/songs', methods = ['POST'])
def save_songs():
    modifiedSongs = request.json['songs']
    print modifiedSongs
    songDictArray = [];
    for modifiedSong in modifiedSongs:
        song = None
        if modifiedSong.has_key('id'):
            song = ndb.Key(urlsafe=modifiedSong['id']).get()
        if not modifiedSong.has_key('tags'):
            modifiedSong['tags'] = []
         
        album_key = ndb.Key(urlsafe=modifiedSong['album_id'])
        if song != None:
            song.title = modifiedSong['title']
            song.tags = modifiedSong['tags']        
        else:
            song = Song(album_key=album_key, title=modifiedSong['title'], tags=modifiedSong['tags'])        
        song.put()
        songDictArray.append(song.to_full_dict())
    return jsonify({'songs': songDictArray})

@app.route('/restadmin/albums', methods = ['GET'])
def get_albums():
    albums = Album.queryRecentAlbums()
    albumDictArray = [];
    for album in albums:
        albumDictArray.append(album.to_dict())
    print albumDictArray
    return jsonify({'albums': albumDictArray})

@app.route('/restadmin/albums', methods = ['POST'])
def save_albums():
    modifiedAlbums = request.json['albums']
    print modifiedAlbums
    albumDictArray = [];
    for modifiedAlbum in modifiedAlbums:
        album = None
        if modifiedAlbum.has_key('id'):
            album = ndb.Key(urlsafe=modifiedAlbum['id']).get()
        if not modifiedAlbum.has_key('thumbnail'):
            modifiedAlbum['thumbnail'] = 'none'
        if album != None:
            album.title = modifiedAlbum['title']
            album.thumbnail = modifiedAlbum['thumbnail']
            album.year = int(modifiedAlbum['year'])        
        else:
            album = Album(title=modifiedAlbum['title'], thumbnail=modifiedAlbum['thumbnail'], year=int(modifiedAlbum['year']))
        album.put()
        albumDictArray.append(album.to_dict())
    return jsonify({'albums': albumDictArray})

@app.route('/restadmin/song/<songid>', methods = ['GET'])
def get_song(songid=''):
    key = ndb.Key(urlsafe=songid)
    song = key.get()
    if song != None:
        return jsonify({'song': song.to_full_dict()})
    else:
        return jsonify({'song': None})

@app.route('/restadmin/album/<albumid>', methods = ['GET'])
def get_album(albumid=''):
    key = ndb.Key(urlsafe=albumid)
    album = key.get()
    if album != None:
        return jsonify({'album': album.to_dict()})
    else:
        return jsonify({'album': None})

@app.route('/restadmin/import', methods = ['POST'])
def import_tasks():
    file = request.files['file']
    newsongs = []
    if file:
        filestream = file.read()
        jsonData = json.loads(filestream);
        albums = {};
        for jsonSong in jsonData['songs']:
            album = jsonSong['album'].encode('ascii', 'ignore').translate(None, string.whitespace).translate(None, string.punctuation).lower()
            title = jsonSong['title'].encode('ascii', 'ignore').translate(None, string.whitespace).translate(None, string.punctuation).lower()
            id = album + '~' + title
            thumbnail = jsonSong['thumbnail'].replace('https://shining-fire-6281.firebaseapp.com', '/public').encode('ascii', 'ignore')
            year = int(jsonSong['year'])
            version = int(jsonSong['version'])
            lyrics = jsonSong['lyrics'].replace('https://shining-fire-6281.firebaseapp.com', '/public').encode('ascii', 'ignore');
            track = jsonSong['track'].replace('https://shining-fire-6281.firebaseapp.com', '/public').encode('ascii', 'ignore');
            
            if not albums.has_key(album):
                albums[album] = Album(title=jsonSong['album'], thumbnail=thumbnail, year=year)
                albums[album].put() 

            song = Song(title=jsonSong['title'],album_key=albums[album].key,track=track,lyrics=lyrics,version=version)
            song.put()
            newsongs.append(song.to_full_dict())

        for key, album in albums.iteritems():
            album.put()
        
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

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS')
    return response