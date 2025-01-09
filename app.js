//Frontend AngularJS Logic for Email App

const app = angular.module('emailApp', []);
app.controller('EmailController', function ($scope, $http) {
    $scope.user = {};
    $scope.feedback = "";

    $scope.saveUser = function () {
        // Save User API Call
        $http.post('/api/saveUser', $scope.user)
            .then(response => {
                $scope.feedback = 'User saved: ' + response.data;
                // Send Email API Call
                return $http.post('/api/sendEmail', $scope.user);
            })
            .then(response => {
                $scope.feedback = 'Email sent: ' + response.data;
            })
            .catch(err => {
                console.error('Error occurred:', err);
                $scope.feedback = 'An error occurred: ' + (err.data || err.message || 'Unknown error');
            });
    };
});