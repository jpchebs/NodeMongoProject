(function() {
  angular.module('primeiraApp').controller('billingCycleCtrl', [
    '$http',
    '$location',
    'msgs',
    'tabs',
    billingCycleCtrl
  ])

  function billingCycleCtrl($http, $location, msgs, tabs) {
    const vm = this
    const url = 'http://localhost:3003/api/billingCycle'

    // Função para manter os objeto atualizados na tela
    vm.refresh = function() {
      const page = parseInt($location.search().page) || 1
      $http.get(`${url}?skip=${(page - 1) * 10}&limit=10`).then(function(response) {
        vm.billingCycle = {credits: [{}], debts: [{}]}
        vm.billingCycles = response.data
        vm.calculateValues()
        tabs.show(vm, {tabList: true, tabCreate: true})

        // Retorna a quantiade de registros que existem na 'collection'
        $http.get(`${url}/count`).then(function(response) {
          vm.pages = Math.ceil(response.value / 10)
          // console.log('pages =', vm.pages) -> retornando NaN* (deveria retornar o valor de quantidade)
        })
      })
    }

// ======================================*CRUD========================================================

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

    // Habilitando a aba de Alterar elemento, quando necessária
    vm.showTabUpdate = function(billingCycle) {
      vm.billingCycle = billingCycle
      vm.calculateValues()
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

    // Habilitando a aba de Excluir elemento, quando necessária
    vm.showTabDelete = function(billingCycle) {
      vm.billingCycle = billingCycle
      vm.calculateValues()
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

// ===================================*bCycle===========================================================

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
      vm.calculateValues()
    }

    vm.deleteCredit = function(index) {
      // Por regra da aplicação, deve haver pelo menos um elemento
      // O tamanho do array (lista) de creditos deve ser maior que 1
      if (vm.billingCycle.credits.length > 1) {
        // Passando o indice e a quantidade de elementos a serem excluidos
        vm.billingCycle.credits.splice(index, 1)
        vm.calculateValues()
      }
    }

    // Método referenciado pelo controller, para ser visivel externamente
    // Passando o index como parâmetro
    vm.addDebt = function(index) {
      // método splice altera o array atual, passando o indice, o núm. de elementos
       // para remover e a lista de itens a ser adicionada
      vm.billingCycle.debts.splice(index + 1, 0, {}) // Passando objeto vazio {}
    }

    // Passando index no parâmetro, nome e valor estão como obj
    vm.cloneDebt = function(index, {name, value, status}) {
      vm.billingCycle.debts.splice(index + 1, 0, {name, value, status})
      vm.calculateValues()
    }

    vm.deleteDebt = function(index) {
      // Por regra da aplicação, deve haver pelo menos um elemento
      // O tamanho do array (lista) de creditos deve ser maior que 1
      if (vm.billingCycle.debts.length > 1) {
        // Passando o indice e a quantidade de elementos a serem excluidos
        vm.billingCycle.debts.splice(index, 1)
        vm.calculateValues()
      }
    }

    // Função para calcular e mostrar os valores de créditos e débitos na tela de novo ciclo
    vm.calculateValues = function() {
      vm.credit = 0
      vm.debt = 0

      // Verificar se o valor atribuido é válido
      if (vm.billingCycle) {
        // Passando por todos os elementos de Créditos
        vm.billingCycle.credits.forEach(function({value}) {
          // Atribuição aditiva, se o valor(value) não existir ou for Not a Number(NaN), retorna 0 como padrão
          // Se o valor existir e é um número, usa parseDouble e coloca na variavel
          vm.credit += !value || isNaN(value) ? 0 : parseFloat(value)
        })
        vm.billingCycle.debts.forEach(function({value}) {
          vm.debt += !value || isNaN(value) ? 0 : parseFloat(value)
        })
      }

      // Atribuindo a variavel 'total' a subtração de 'créditos' e 'débitos'
      // Os 3 valores são usados para preencher o 'value-box'
      vm.total = vm.credit - vm.debt
    }

    vm.refresh()
  }
})()
