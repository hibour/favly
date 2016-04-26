'use strict';

/**
 * @ngdoc directive
 * @name kuhuadminApp.directive:filemodel
 * @description
 * # filemodel
 */
angular.module('kuhuadminApp')
  .directive('fileModel', function ($parse) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });
      }
    };
  });