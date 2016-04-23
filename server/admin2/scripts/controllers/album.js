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
    
    var self = this;
    backend.getAlbum($routeParams.albumid, function(album) {
      self.album = album;
    });
  });