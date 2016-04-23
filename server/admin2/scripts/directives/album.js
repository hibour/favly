'use strict';

/**
 * @ngdoc directive
 * @name kuhuadminApp.directive:album
 * @description
 * # album
 */
angular.module('kuhuadminApp')
  .directive('album', function (CDN_END_POINT) {
    return {
      templateUrl: 'views/album_directive.html',
      scope: {model: "="},      
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.cdn = CDN_END_POINT;
      }
    };
  });