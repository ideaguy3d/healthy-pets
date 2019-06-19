/**
 ** Created by Julius Alvarado on 9/4/2017.
 */

(function () {
    'use strict';

    angular.module('edhubJobsApp').controller('LandingCtrl', [
        'edhubJobPostService', '$location', 'smoothScroll', '$rootScope',
        'MockPetFoodSer', '$scope', LandingClass
    ]);

    function LandingClass(edhubJobPostService, $location, smoothScroll, $rootScope, MockPetFoodSer, $scope) {
        const vm = this;
        vm.catFood = [];
        vm.dogFood = [];
        vm.jobPostBg = "images/chalkboard3dArt1.png";
        vm.showVid = true;
        vm.ycombinatorMessage = "Talent Opportunities at Y Combinator";
        vm.presentState = 'all';

        vm.changePresentState = function (newState) {
            vm.presentState = newState;
        };

        vm.petFood = [
            {   // HARD CODED INDEXES
                prodName: 2, catFlavor: 4, catCurrent: 5, subGender: 6,
                subHasDied: 7, subCat: 8, price: 10, prodDes: 14
            }
        ];

        $scope.sizes = [
            "small (12-inch)",
            "medium (14-inch)",
            "large (16-inch)",
            "insane (42-inch)"
        ];

        $scope.toppings = [
            {category: 'meat', name: 'Pepperoni'},
            {category: 'meat', name: 'Sausage'},
            {category: 'meat', name: 'Ground Beef'},
            {category: 'meat', name: 'Bacon'},
            {category: 'veg', name: 'Mushrooms'},
            {category: 'veg', name: 'Onion'},
            {category: 'veg', name: 'Green Pepper'},
            {category: 'veg', name: 'Green Olives'}
        ];

        $scope.selectedToppings = [];
        $scope.printSelectedToppings = function printSelectedToppings() {
            var numberOfToppings = this.selectedToppings.length;

            // If there is more than one topping, we add an 'and'
            // to be gramatically correct. If there are 3+ toppings
            // we also add an oxford comma.
            if (numberOfToppings > 1) {
                var needsOxfordComma = numberOfToppings > 2;
                var lastToppingConjunction = (needsOxfordComma ? ',' : '') + ' and ';
                var lastTopping = lastToppingConjunction +
                    this.selectedToppings[this.selectedToppings.length - 1];
                return this.selectedToppings.slice(0, -1).join(', ') + lastTopping;
            }

            return this.selectedToppings.join('');
        };

        vm.apply2job = function (organizationName, postId) {
            $location.url('/apply/' + postId + '/' + organizationName);
        };

        vm.apply2org = function (orgInfo) {
            if ($rootScope.rootEdhubAuthUser) {
                $location.url('/apply/' + orgInfo.orgId + '/' + orgInfo.orgName);
            }
            else {
                $location.url('/view-job/' + orgInfo.orgId + '/' + orgInfo.orgName)
            }
        };

        vm.scroll2recentJobs = function () {
            var elem = document.getElementById("edhub-recent-jobs-landing-title");
            smoothScroll(elem);
        };

        activate();

        function activate() {
            console.log("__>> Wired up and ready to rock and roll.");
            vm.petFood.push(MockPetFoodSer.allPetFood);
            console.log(vm.petFood);
            let dataSet = vm.petFood[1];
            let fieldTitle = vm.petFood[0];
            let rec, catCount = 0, dogCount = 0;

            // TODO: Seperate data on server with a firebase db query
            // separate cat and dog data
            for (let i = 0; i < dataSet.length; i++) {
                rec = dataSet[i];
                if (dataSet[fieldTitle.prodName].indexOf('Cat') > 0) {
                    vm.catFood[catCount] = rec;
                    catCount++;
                }
                else if (dataSet[fieldTitle.prodName].indexOf('Dog') > 0) {
                    vm.dogFood[dogCount] = rec;
                    dogCount++;
                }
            }

            let dogFood;
            MockPetFoodSer.dogFood().$loaded().then(function (res) {
                dogFood = res.data;
                console.log('dog food = ', dogFood);
            });

            let catFood;
            MockPetFoodSer.catFood().$loaded().then(function (res) {
                catFood = res.data;
                console.log('cat food = ', catFood);
            });

            console.log('end of ops');
        }
    }

}());