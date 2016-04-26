'use strict';

/**
 * @ngdoc function
 * @name kuhuadminApp.controller:AlbumCtrl
 * @description
 * # AlbumCtrl
 * Controller of the kuhuadminApp
 */
angular.module('kuhuadminApp')
  .controller('AlbumCtrl', function (backend, $scope, $location, $routeParams) {
    $scope.save = function(album) {
      backend.saveAlbum(album, function(success){
        // show loading spinner.
        // $location.path('/albums');
      });
    };

    $scope.activateAndSave = function(album) {
      album.is_active = true;
      $scope.save(album);
    };
    
    var self = this;
    backend.getAlbum($routeParams.albumid, function(album, songs) {
      self.album = album;
      self.songs = songs;
    });
  });