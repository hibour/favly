'use strict';

/**
 * @ngdoc directive
 * @name kuhuadminApp.directive:song
 * @description
 * # song
 */
angular.module('kuhuadminApp')
  .directive('song', function () {
    return {
      templateUrl: 'views/song.html',
      restrict: 'E',
      // link: function postLink(scope, element, attrs) {
      //   element.text('this is the song directive');
      // }
    };
  });
