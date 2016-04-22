'use strict';

/**
 * @ngdoc function
 * @name kuhuadminApp.controller:SongsCtrl
 * @description
 * # SongsCtrl
 * Controller of the kuhuadminApp
 */
angular.module('kuhuadminApp')
  .controller('SongsCtrl', function (backend) {
    this.songs = [];
    var self = this;
    backend.getSongs(function(songs) {
      self.songs = songs;
    });
  });