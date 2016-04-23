'use strict';

/**
 * @ngdoc function
 * @name kuhuadminApp.controller:SongCtrl
 * @description
 * # SongCtrl
 * Controller of the kuhuadminApp
 */
angular.module('kuhuadminApp')
  .controller('SongCtrl', function (backend, $scope, $location, $routeParams) {
    $scope.save = function(song) {
      backend.saveSong(song, function(success){
        // show loading spinner.
        // $location.path('/songs');
      });
    };

    var self = this;
    backend.getSong($routeParams.songid, function(song) {
      self.song = song;
    });
    
    backend.getAlbums(function(albums) {
      self.albums = albums;
    });    
  });
