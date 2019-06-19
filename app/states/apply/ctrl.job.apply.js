"use strict";

/**
 * Created by Julius Alvarado on 4/22/2018.
 */
(function () {
  "use strict";

  var app = angular.module('edhubJobsApp');
  app.controller('ApplyToJobCtrl', ['$routeParams', ApplyToJobCtrlClass]);

  function ApplyToJobCtrlClass($routeParams) {
    var vm = this;
    vm.rParams = $routeParams;
  }
})();