'use strict';

describe('Controller: AlbumCtrl', function () {

  // load the controller's module
  beforeEach(module('kuhuadminApp'));

  var AlbumCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AlbumCtrl = $controller('AlbumCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AlbumCtrl.awesomeThings.length).toBe(3);
  });
});
