"""`admin` is the top level module for your Flask Admin application."""

# Import the Flask Framework
from flask import Flask, jsonify, abort, request, make_response, url_for
from models.song import Song
from models.album import Album

from google.appengine.ext import ndb
import json
import string

app = Flask(__name__)

def convert_name_to_id(name):
    return name.encode('ascii', 'ignore').translate(None, string.whitespace).translate(None, string.punctuation).lower()

@app.route('/restadmin/songs', methods = ['GET'])
def get_songs():
    songs = Song.queryAdminSongs()
    songDictArray = [];
    for song in songs:
        songDictArray.append(song.to_full_dict_and_lyrics())
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
            song.lyrics_synced = modifiedSong['lyrics_synced']
            song.lyrics_unsynced = modifiedSong['lyrics_unsynced']
        else:
            song = Song(album_key=album_key, 
            title=modifiedSong['title'], 
            tags=modifiedSong['tags'], 
            lyrics_synced=modifiedSong['lyrics_synced'], 
            lyrics_unsynced=modifiedSong['lyrics_unsynced'])        
        song.put()
        songDictArray.append(song.to_full_dict_and_lyrics())
    return jsonify({'songs': songDictArray})

@app.route('/restadmin/albums', methods = ['GET'])
def get_albums():
    albums = Album.queryAdminAlbums()
    albumDictArray = []
    songDictArray = []    
    for album in albums:
        albumDictArray.append(album.to_dict())
        songs = Song.queryAlbum(album.key)        
        for song in songs:
            songDictArray.append(song.to_full_dict_and_lyrics2(album))
    return jsonify({'albums': albumDictArray, 'songs': songDictArray})

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
        return jsonify({'song': song.to_full_dict_and_lyrics()})
    else:
        return jsonify({'song': None})

@app.route('/restadmin/album/<albumid>', methods = ['GET'])
def get_album(albumid=''):
    key = ndb.Key(urlsafe=albumid)
    album = key.get()
    if album != None:
        songs = Song.queryAlbum(key)
        songDictArray = [];
        for song in songs:
            songDictArray.append(song.to_full_dict_and_lyrics2(album))        
        return jsonify({'album': album.to_dict(), 'songs': songDictArray})
    else:
        return jsonify({'album': None})

@app.route('/restadmin/import2', methods = ['POST'])
def import_songs():
    file = request.files['file']
    newsongs = []
    if file:
        filestream = file.read()
        jsonData = json.loads(filestream);
        albums = {};
        for jsonSong in jsonData['songs']:
            album = convert_name_to_id(jsonSong['album'])
            title = convert_name_to_id(jsonSong['title'])
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
            newsongs.append(song.to_full_dict_and_lyrics())

        for key, album in albums.iteritems():
            album.put()
        
    return jsonify({'songs': newsongs})

@app.route('/restadmin/import', methods = ['POST'])
def import_albums():
    file = request.files['file']
    if file:
        filestream = file.read()
        jsonData = json.loads(filestream);
        for jsonAlbum in jsonData:
            id = convert_name_to_id(jsonAlbum['name'])
            album_path = "https://storage.googleapis.com/kuhumedia/" + id + "/"
            name = jsonAlbum['name']
            title = jsonAlbum['title']
            thumbnail = album_path + "thumbnail.jpg"
            year = jsonAlbum['year']
            album = Album(id=id, name=name, title=title, thumbnail=thumbnail, year=year)
            album.put()
            for jsonSong in jsonAlbum['songs']:
                songid = convert_name_to_id(jsonSong['name'])
                path = album_path + songid + "/"
                songname = jsonSong['name']
                songtitle = jsonSong['title']
                audio = path + "audio.mp3"
                if jsonSong.has_key('karaoke_audio'):
                    karaoke_audio = path + "karaoke_audio.mp3"
                else:
                    karaoke_audio = None
                song = Song(id=songid, name=songname, title=songtitle, album_key=album.key, audio=audio, karaoke_audio=karaoke_audio, lyrics_synced={}, lyrics_unsynced={})
                song.put()
    return jsonify({'songs': []})

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