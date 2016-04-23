'use strict';

describe('Controller: AlbumsCtrl', function () {

  // load the controller's module
  beforeEach(module('kuhuadminApp'));

  var AlbumsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AlbumsCtrl = $controller('AlbumsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AlbumsCtrl.awesomeThings.length).toBe(3);
  });
});
