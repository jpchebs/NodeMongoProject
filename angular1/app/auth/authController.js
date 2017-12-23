(function() {

  angular.module('primeiraApp').controller('AuthCtrl', [
    '$location',
    'msgs',
    AuthController
  ])

  function AuthController($location, msgs) {
    const vm = this
    vm.getUser = () => ({ name: 'João Pedro', email: 'joaocher@gmail.com' })
    vm.logout = () => {
      console.log('Logout...')
    }
  }

})()
