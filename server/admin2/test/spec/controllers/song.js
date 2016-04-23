'use strict';

describe('Controller: SongCtrl', function () {

  // load the controller's module
  beforeEach(module('kuhuadminApp'));

  var SongCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SongCtrl = $controller('SongCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SongCtrl.awesomeThings.length).toBe(3);
  });
});
