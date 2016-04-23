'use strict';

/**
 * @ngdoc overview
 * @name kuhuadminApp
 * @description
 * # kuhuadminApp
 *
 * Main module of the application.
 */
angular
  .module('kuhuadminApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/songs', {
        templateUrl: 'views/songs.html',
        controller: 'SongsCtrl',
        controllerAs: 'songs'
      })      
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/song/:songid', {
        templateUrl: 'views/song.html',
        controller: 'SongCtrl',
        controllerAs: 'song'
      })
      .when('/albums', {
        templateUrl: 'views/albums.html',
        controller: 'AlbumsCtrl',
        controllerAs: 'albums'
      })
      .when('/album/:albumid', {
        templateUrl: 'views/album.html',
        controller: 'AlbumCtrl',
        controllerAs: 'album'
      })
      .otherwise({
        redirectTo: '/songs'
      });
  });
