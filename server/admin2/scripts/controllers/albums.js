'use strict';

/**
 * @ngdoc function
 * @name kuhuadminApp.controller:AlbumsCtrl
 * @description
 * # AlbumsCtrl
 * Controller of the kuhuadminApp
 */
angular.module('kuhuadminApp')
  .controller('AlbumsCtrl', function (backend, $scope, $location) {
    $scope.newAlbum = function() {
      $location.path('/album/new');
    };

    var self = this;
    backend.getAlbums(function(albums) {
      self.albums = albums;
    });
  });
