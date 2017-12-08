(function() {
  angular.module('primeiraApp').controller('billingCycleCtrl', [
    '$http',
    billingCycleCtrl
  ])

  function billingCycleCtrl($http) {
    const vm = this
    vm.create = function() {
      const url = 'http://localhost:3003/api/billingCycles'
      $http.post(url, vm.billingCycle).then(function(response) {
        vm.billingCycle = {}
        console.log('Sucesso!');
      })
    }
  }
})()
