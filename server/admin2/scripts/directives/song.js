'use strict';

/**
 * @ngdoc directive
 * @name kuhuadminApp.directive:song
 * @description
 * # song
 */
angular.module('kuhuadminApp')
  .directive('song', function (CDN_END_POINT) {
    return {
      templateUrl: 'views/song_directive.html',
      scope: {model: "="},
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.cdn = CDN_END_POINT;
      }
    };
  });
