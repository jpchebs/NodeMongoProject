(function() {
  angular.module('primeiraApp').controller('billingCycleCtrl', [
    '$http',
    'msgs',
    'tabs',
    billingCycleCtrl
  ])

  function billingCycleCtrl($http, msgs, tabs) {
    const vm = this
    const url = 'http://localhost:3003/api/billingCycle'

    vm.refresh = function() {
      $http.get(url).then(function(response) {
        vm.billingCycle = {}
        vm.billingCycles = response.data
        tabs.show(vm, {tabList: true, tabCreate: true})
      })
    }

    vm.create = function() {
      $http.post(url, vm.billingCycle).then(function(response) {
            vm.refresh()
            msgs.addSuccess('Operação realizada com Sucesso!')
         }).catch(function(response) {
            msgs.addError(response.data.errors)
         })
    }

    vm.showTabUpdate = function(billingCycle) {
      vm.billingCycle = billingCycle
      tabs.show(vm, {tabUpdate: true})
    }

    // Função para atualizar objeto
    vm.update = function() {
      // Definindo a url ja criada acima e concatenando com a url do objeto requerido
      const updateUrl = `${url}/${vm.billingCycle._id}`
      // Acionando o service HTTP passando o método put
      // Passa a url ja definida e o objeto 'billingCycle' 'set' em showTabUpdate
      $http.put(updateUrl, vm.billingCycle).then(function(response) {
        // Zera os objetos e retorna para lista de objetos
        vm.refresh()
        // Exibindo mensagem de sucesso
        msgs.addSuccess('Operação realizada com Sucesso!')
        // Exibindo mensagem de erro(s) caso nao seja sucesso
      }).catch(function(response) {
        msgs.addError(response.data.error)
      })
    }

    vm.showTabDelete = function(billingCycle) {
      vm.billingCycle = billingCycle
      tabs.show(vm, {tabDelete: true})
    }

    vm.delete = function() {
      const deleteUrl = `${url}/${vm.billingCycle._id}`
      $http.delete(deleteUrl, vm.billingCycle).then(function(response) {
        vm.refresh()
        msgs.addSuccess('Operação realizada com Sucesso!')
      }).catch(function(response) {
         msgs.addError(response.data.errors)
      })
    }

    vm.refresh()
  }
})()
