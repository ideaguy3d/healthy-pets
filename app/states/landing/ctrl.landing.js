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
        let allPetsFood;
        let catFood;
        let dogFood;

        vm.catFood = [];
        vm.dogFood = [];
        vm.presentState = 'all';
        vm.petFood = [
            {   // HARD CODED INDEXES
                prodName: 2, catFlavor: 4, catCurrent: 5, subGender: 6,
                subHasDied: 7, subHonorary: 8, price: 10, prodDes: 14
            }
        ];
        vm.categories = [
            {category: 'food_flavor', value: 'chicken'},
            {category: 'food_flavor', value: 'beef'},
            {category: 'food_flavor', value: 'salmon'},
            {category: 'is_current', value: 'YES'},
            {category: 'is_current', value: 'NO'}
        ];

        vm.subcats = [
            {
                subcat: 'gender',
                value: 'MALE'
            },{
                subcat: 'gender',
                value: 'FEMALE'
            },{
                subcat: 'has_died',
                value: 'YES'
            },{
                subcat: 'has_died',
                value: 'NO'
            },{
                subcat: 'honorary',
                value: 'Full'
            },{
                subcat: 'honorary',
                value: 'Honorary'
            },{
                subcat: 'honorary',
                value: 'Academy'
            },{
                subcat: 'honorary',
                value: 'Probationary'
            }
        ];

        // update the data presentation state
        vm.changePresentState = function (newState) {
            vm.presentState = newState;

            if (!catFood || !dogFood) {
                let dataSet = vm.petFood[1];
                let fieldTitle = vm.petFood[0];
                let rec, catCount = 0, dogCount = 0;

                // TODO: Separate data on server with a firebase db query
                //  (though, a PHP/SQL api/db server would be the best solution eventually)

                // separate cat and dog data
                for (let i = 0; i < dataSet.length; i++) {
                    rec = dataSet[i];
                    if (rec[fieldTitle.prodName].indexOf('Cat') > 0) {
                        vm.catFood[catCount] = rec;
                        catCount++;
                    }
                    else if (rec[fieldTitle.prodName].indexOf('Dog') > 0) {
                        vm.dogFood[dogCount] = rec;
                        dogCount++;
                    }
                }

                if (newState === 'cat') {
                    catFood = vm.catFood;
                    vm.petFood[1] = catFood;
                }
                else if (newState === 'dog') {
                    dogFood = vm.dogFood;
                    vm.petFood[1] = dogFood;
                }
            }
            else if (newState === 'cat') {
                vm.petFood[1] = catFood;
            }
            else if (newState === 'dog') {
                vm.petFood[1] = dogFood;
            }
            else if (newState === 'all') {
                vm.petFood[1] = allPetsFood;
            }

        };

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

        vm.scroll2recentJobs = function () {
            var elem = document.getElementById("edhub-recent-jobs-landing-title");
            smoothScroll(elem);
        };

        activate();

        function activate() {
            console.log("__>> Wired up and ready to rock and roll.");
            let allPetFood = MockPetFoodSer.allPetFood;
            vm.petFood.push(allPetFood);
            console.log(vm.petFood);
            allPetsFood = vm.petFood[1];

            allPetFood.$loaded().then(function (response) {
                console.log('The promise has been fulfilled with response: ', response);
                let fieldTitle = vm.petFood[0];
                // add additional info to data for better categorizing
                for (let i = 0; i < vm.petFood[1].length; i++) {
                    let rec = vm.petFood[1][i];

                    vm.petFood[1][i][rec.length] = [
                        {
                            category: 'is_current',
                            value: rec[fieldTitle.catCurrent]
                        }, {
                            category: 'food_flavor',
                            value: rec[fieldTitle.catFlavor]
                        }, {
                            subcat: 'gender',
                            value: rec[fieldTitle.subGender]
                        }, {
                            subcat: 'has_died',
                            value: rec[fieldTitle.subHasDied]
                        }, {
                            subcat: 'honorary',
                            value: rec[fieldTitle.subHonorary]
                        }
                    ];

                    let b = 'point';
                } // end of for-loop to add category objects to each record

                console.log('done adding category objects');
            })
        }
    }

}());