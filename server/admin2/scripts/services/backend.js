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
            
    var addSongs = function(newSongs) {
      angular.forEach(newSongs, function(song) {
        if (!songs.dict[song.id]) {
          songs.dict[song.id] = song;
          songs.list.push(song);
        }
      });
    };
    
    this.getSongs = function(callback) {
      // refresh!! 
      $http.get(API_END_POINT + '/restadmin/songs').success(function(d) {
        addSongs(d.songs);
        callback(songs.list);
      }).error(function() { callback(songs.list); });
    };
    
    this.getSong = function(id, callback) {
      if (!songs.dict[id]) {
        $http.get(API_END_POINT + '/restadmin/song/'+id).success(function(d){
          addSongs([d.song]);
          callback(songs.dict[id]);
        }).error(function() {callback(null);});
      } else {
        callback(songs.dict[id]);
      }
    };

    return;        
  });
