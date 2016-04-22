'use strict';

describe('Directive: song', function () {

  // load the directive's module
  beforeEach(module('kuhuadminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<song></song>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the song directive');
  }));
});
