'use strict';

/**
 * @ngdoc service
 * @name kuhuadminApp.backend
 * @description
 * # backend
 * Service in the kuhuadminApp.
 */
angular.module('kuhuadminApp')
  .service('backend', function ($http, API_END_POINT) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var songs = {};
    songs.list = [];
    songs.dict = {};
    songs.album_dict = {};
    var addSongs = function(newSongs) {
      angular.forEach(newSongs, function(song) {
        if (!songs.dict[song.id]) {
          songs.dict[song.id] = song;
          songs.list.push(song);
          if (!songs.album_dict[song.album_id]) {
            songs.album_dict[song.album_id] = [];
          }
          songs.album_dict[song.album_id].push(song);
        }
      });
      console.log("Adding >> ", songs.list);
    };
    
    this.getSongs = function(callback) {
      // refresh!! 
      $http.get(API_END_POINT + '/restadmin/songs').success(function(d) {
        addSongs(d.songs);
        callback(songs.list);
      }).error(function() { callback(songs.list); });
    };
    
    this.getSong = function(id, callback) {
      
      if (id == 'new') {
        callback({}); // User is trying to add a new song. return empty object.
        return;
      }
      
      if (!songs.dict[id]) {
        $http.get(API_END_POINT + '/restadmin/song/'+id).success(function(d){
          addSongs([d.song]);
          callback(songs.dict[id]);
        }).error(function() {callback(null);});
      } else {
        callback(songs.dict[id]);
      }
    };
    
    this.saveSong = function(song, callback) {
        $http.post(API_END_POINT + '/restadmin/songs', {songs: [song]}).success(function(d){
          addSongs([d.songs]);
          callback(true);
        }).error(function() {callback(false);});      
    }

    var albums = {};
    albums.list = [];
    albums.dict = {};
    var addAlbums = function(newAlbums) {
      angular.forEach(newAlbums, function(album) {
        if (!albums.dict[album.id]) {
          albums.dict[album.id] = album;
          albums.list.push(album);
        }
      });
      console.log("Adding Album >> ", albums.list);
    };
    
    this.getAlbums = function(callback) {
      // refresh!! 
      $http.get(API_END_POINT + '/restadmin/albums').success(function(d) {
        addAlbums(d.albums);
        addSongs(d.songs);
        callback(albums.list);
      }).error(function() { callback(albums.list); });
    };
    
    this.getAlbum = function(id, callback) {
      if (id == 'new') {
        callback({}); // User is trying to add a new song. return empty object.
        return;
      }
      
      if (!albums.dict[id]) {
        $http.get(API_END_POINT + '/restadmin/album/'+id).success(function(d){
          addAlbums([d.album]);
          addSongs(d.songs);
          callback(albums.dict[id], songs.album_dict[id]);
        }).error(function() {callback(null);});
      } else {
        callback(albums.dict[id], songs.album_dict[id]);
      }
    }; 
    
    this.saveAlbum = function(album, callback) {
        $http.post(API_END_POINT + '/restadmin/albums', {albums: [album]}).success(function(d){
          addAlbums([d.albums]);
          callback(true);
        }).error(function() {callback(false);});      
    }
        
     this.importData = function(dataToImport) {
        var formData = new FormData();
        formData.append('file', dataToImport);
        $http.post(API_END_POINT + '/restadmin/import', formData, 
          {transformRequest: angular.identity, headers: {'Content-Type': undefined}})
        .then(function(response) {
          addSongs(response.data);
        }, function() {
          // Failed
        });                 
     }   
  });
