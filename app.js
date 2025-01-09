// Frontend AngularJS Logic for Email App

const app = angular.module('emailApp', []);
app.controller('EmailController', function ($scope, $http) {
    $scope.user = {}; // Object to store user input
    $scope.feedback = ""; // Feedback message for the user

    $scope.saveUser = function () {
        console.log('Submitting user:', $scope.user);

        // Save User API Call
        $http.post('/api/saveUser', $scope.user)
            .then(response => {
                $scope.feedback = 'User saved: ' + response.data;
                console.log('Save user response:', response.data);

                // Send Email API Call
                return $http.post('/api/sendEmail', $scope.user);
            })
            .then(response => {
                $scope.feedback = 'Email sent: ' + response.data;
                console.log('Send email response:', response.data);
            })
            .catch(err => {
                $scope.feedback = 'An error occurred: ' + (err.data || err.message || 'Unknown error');
                console.error('Error occurred:', err);
            });
    };
});