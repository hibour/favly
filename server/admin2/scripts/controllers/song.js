'use strict';

/**
 * @ngdoc function
 * @name kuhuadminApp.controller:SongCtrl
 * @description
 * # SongCtrl
 * Controller of the kuhuadminApp
 */
angular.module('kuhuadminApp')
  .controller('SongCtrl', function (backend, $scope, $location, $routeParams, $sce) {
    $scope.save = function(song) {
      backend.saveSong(song, function(success){
        // show loading spinner.
        // $location.path('/songs');
      });
    };
    
    $scope.activateAndSave = function(album) {
      album.is_active = true;
      $scope.save(album);
    };    

    var self = this;
    backend.getSong($routeParams.songid, function(song) {
      song.trustedAudio = $sce.trustAsResourceUrl(song.audio);
      self.song = song;
    });
    
    backend.getAlbums(function(albums) {
      self.albums = albums;
    });    
  });
