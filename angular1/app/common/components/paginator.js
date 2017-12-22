(function() {
  angular.module('primeiraApp').component('paginator', {
   bindings: {
     url: '@',
     pages: '@',
   },
   controller: ['$location', function($location) {
     this.$onInit = function() {
        var pages = parseInt(this.pages) || 1;
        this.pagesArray = Array(pages).fill(0).map((e, i) => i + 1);
        this.current = parseInt($location.search().page) || 1;
        this.needPagination = this.pages > 1;
        this.hasPrev = this.current > 1;
        this.hasNext = this.current < this.pages;

        this.isCurrent = function(i) {
          return this.current == i
        }
     }

   }],
   template: `
      <ul ng-if="$ctrl.needPagination" class="pagination pagination-sm no-margin pull-right"
        class="pagination">
        <li ng-if="$ctrl.hasPrev">
          <a href="{{ $ctrl.url }}?page={{ $ctrl.current - 1}}">Anterior</a>
        </li>
        <li ng-class="{active: $ctrl.isCurrent(i)}"
          ng-repeat="i in $ctrl.pagesArray">
          <a href="{{ $ctrl.url }}?page={{i}}">{{i}}</a>
        </li>
        <li ng-if="$ctrl.hasNext">
          <a href="{{ $ctrl.url }}?page={{ $ctrl.current + 1}}">Próximo</a>
        </li>
      </ul>
   `
})
})()
