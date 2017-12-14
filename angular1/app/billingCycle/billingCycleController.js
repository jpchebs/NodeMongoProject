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

    // Função para manter os objeto atualizados na tela
    vm.refresh = function() {
      $http.get(url).then(function(response) {
        vm.billingCycle = {credits: [{}], debts: [{}]}
        vm.billingCycles = response.data
        tabs.show(vm, {tabList: true, tabCreate: true})
      })
    }

    // Função para persistir um novo objeto
    vm.create = function() {
      // Acionando o service HTTP passando o método put
      // Passa a url ja definida e o objeto 'billingCycle' 'set' em showTabUpdate
      $http.post(url, vm.billingCycle).then(function(response) {
            // Zera os objetos e retorna para lista de objetos
            vm.refresh()
            // Exibindo mensagem de sucesso
            msgs.addSuccess('Operação realizada com Sucesso!')
            // Exibindo mensagem de erro(s) caso nao seja sucesso
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
        msgs.addError(response.data.errors)
      })
    }

    vm.showTabDelete = function(billingCycle) {
      vm.billingCycle = billingCycle
      tabs.show(vm, {tabDelete: true})
    }

    // Função para deletar objeto
    vm.delete = function() {
      // Definindo a url ja criada acima e concatenando com a url do objeto requerido
      const deleteUrl = `${url}/${vm.billingCycle._id}`
      // Acionando o service HTTP passando o método put
      // Passa a url ja definida e o objeto 'billingCycle' 'set' em showTabUpdate
      $http.delete(deleteUrl, vm.billingCycle).then(function(response) {
        // Zera os objetos e retorna para lista de objetos
        vm.refresh()
        // Exibindo mensagem de sucesso
        msgs.addSuccess('Operação realizada com Sucesso!')
        // Exibindo mensagem de erro(s) caso nao seja sucesso
      }).catch(function(response) {
         msgs.addError(response.data.errors)
      })
    }

    // Método referenciado pelo controller, para ser visivel externamente
    // Passando o index como parâmetro
    vm.addCredit = function(index) {
      // método splice altera o array atual, passando o indice, o núm. de elementos
       // para remover e a lista de itens a ser adicionada
      vm.billingCycle.credits.splice(index + 1, 0, {}) // Passando objeto vazio {}
    }

    // Passando index no parâmetro, nome e valor estão como obj
    vm.cloneCredit = function(index, {name, value}) {
      vm.billingCycle.credits.splice(index + 1, 0, {name, value})
    }

    vm.deleteCredit = function(index) {
      // Por regra da aplicação, deve haver pelo menos um elemento
      // O tamanho do array (lista) de creditos deve ser maior que 1
      if (vm.billingCycle.credits.lenght > 1) {
        // Passando o indice e a quantidade de elementos a serem excluidos
        vm.billingCycle.credits.splice(index, 1)
      }
    }

    vm.addDebt = function(index) {
      vm.billingCycle.debts.splice(index + 1, 0, {})
    }

    vm.cloneDebt = function(index, {name, value, status}) {
      vm.billingCycle.debts.splice(index + 1, 0, {name, value, status})
    }

    vm.deleteDebt = function(index) {
      if (vm.billingCycle.debts.lenght > 1) {
        vm.billingCycle.debts.splice(index, 1)
      }
    }

    vm.refresh()
  }
})()
