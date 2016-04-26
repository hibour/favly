'use strict';

describe('Directive: filemodel', function () {

  // load the directive's module
  beforeEach(module('kuhuadminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<filemodel></filemodel>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the filemodel directive');
  }));
});
