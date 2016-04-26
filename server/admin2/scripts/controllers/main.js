'use strict';

/**
 * @ngdoc function
 * @name kuhuadminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kuhuadminApp
 */
angular.module('kuhuadminApp')
  .controller('MainCtrl', function (backend, $scope) {
    this.dataFile = '';
    var self = this;
    $scope.importData = function() {
        backend.importData(self.dataFile);
    }
  });
