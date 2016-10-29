# angular cheatsheet

October 2016

## Single page web apps with angularjs
Johns Hopkins University / coursera

## week 1: Introductionn to angular

### angular basics
- it will be helpful to use browsersync for development. Install it via npm and start a simple directory server via `browser-sync start --server --directory --files "**/*"`
- you can include angular direcly in your html, or why not load it with webpack via `var angular = require('angular') or the import statement. It is probably a good idea to automate bundling with gulp.
- angular is based on the `Model View ViewModel` pattern, but this can be easily overridden, e.g. by grabbing dom-elements directly from within a controller. Because of this flexibility, it is sometimes referred to as the `MV*` pattern.
- the viewmodel holds data that is then rendered by the view (in contrast to the model itself which holds the raw data, e.g. from a database). Datasharing between the viewmodel and the view works trhough the `$scope`. Note that angular exposes a number of variables starting with `$` that are sometimes refered to as `services`. The scope-service manages datatransfer to the view.
- As a basic example, say I want to print out a message to the screen. First thing to do would be to start an app in my `index.html`:
```
<!DOCTYPE html>
<html ng-app="Messenger">
<head>
  <script src="app.js"></script>
</head>
<body>
  ...
</body>
</html>
```
- This will allow angular to attach a module which holds the apps behavior. To specify a viewmodel, here called a controller, we have to specify one in our javascript, e.g. directly in `app.js`:
```
var angular = require('angular');

(function () {
  angular
    .module('Messenger', [])
    .controller('MessageController', MessageController);

  function MessageController ($scope) {
    $scope.message = 'Blue is the new green';
  }
})()
```
- This code does two things: it specifies the MessageController-function as part of the Messenger-app, and within that function it adds a message to the scope-service. This message will be available to the view, as would be any function we would add to the scope. We can use it like so:
```
<div ng-controller="MessageController">
  {{message}}
</div>
- We need some html-element to bind the controller to, then within that element `$scope` will be implicitely set so we can render out the message-value using mustache-templating syntax.
- Another possibility to make use of content bound to the scope is to associate an input element with a model of that name. For example, in the following code, changing the text inside the text-input would automatically change the data on the viewmodel - through the scope-service.
```
<div ng-controller="MessageController">
  <input type="text" ng-model="message">
</div>
```
- Instead of adding listeners via javascript, angular uses attributes to call functions bound to the scope like `<input type="text" ng-keyup="doSomething();" />`. `ng-keyup` is just one interaction type. `ng-blur` would be another and there are many more.
- The `$filter`-service allows us to process data and can be extended by custom filters, of course. There are a handful of preset-filters that we can use, e.g. to update content when an input-field looses focus. In `index.html`:
```
<input type="text" ng-model="content" ng-blur="upcaseContent();" />
```
- The corresponding controller might look like this:
```
function ContentController ($scope, $filter) {
  $scope.content = "abc";

  $scope.upcaseContent = function () {
    $scope.content = $filter('uppercase')($scope.content);
  }
}
```
- note that the order of the service-parameters does not matter! angular will parse it to find out which service to inject.
- here's a somewhat tricky problem: say I want to dynamically insert an image using angular:
```
<img src="images/{{imageName}}.png">
```
When the browser parses this line, it will of course not find the url because angular has not had a chance to interpolate the correct value. A solution for this is to insert the image with angular using
```
<img ng-src="images/{{imageName}}.png">
```


### dependency injection
- dependency injection is a design pattern that implements something called 'inversion of control' ("don't call us, we call you"). What is this? Say you call some code that has to interact with another module. This code could instantiate the module or class by itself but that would introduce tighter coupling than necessary. Instead, we could instantiate the module ourselves and then pass it into the code as an argument so the code can than simply interact with it. If at any point we want to exchange the module the code can remain untouched - given that the module replacement implements the same interface.
- In short: The client should not be responsible for instantiating the dependency, so it get's passed in.
- angular uses dependency injection to inject service objects like `$scope` or `$filter`. The service responsible for injection is named the `$injector`. It uses the method `$injector.annotate(MyController);` to parse the arguments and figure out which dependencies to inject.
- since the injector depends on the controller-parameters being named `$scope`, `$filter`, etc., minification could potentially break the program. To solve this, there are some strategies:
- 1. Explicitely tell angular which parameters the controller-function will expect:
```
angular
  .module('SomeApp', [])
  .controller('SomeController', ['$scope', '$filter', SomeController]);
```
- 2. Inform the injector about what to inject in which order. This can enhance readability even more:
```
angular
  .module('SomeApp', [])
  .controller('SomeController', SomeController);

SomeController.$inject = ['$scope', '$filter'];
```

## week 2: Filters, Digest Cycle and data binding

- angular provides the filter service to manipulate data. in order to use it, inject `$filter` into the controller and use it as for example in `var output = $filter('uppercase')(value);`.
- the service creates the filter-function that is called later.
- it is possible to use the filter directly in the html, even with custom arguments that some filters accept:
```
{{ "Hello" | uppercase }}
{{ "Hello" | currency : arg1 : arg2 }}
```
- angular comes with a couple of built-in filters:
```
filter, i.e. select
currency, formatting
number
date, display according to format-string
json, json-object to string
lowercase
uppercase
limitTo, shrink an array
orderBy, takes a comparator
```
- a `factory` is a design-pattern where some part of the code produces objects or functions. We can use this to add a place to create custom filter functions. To go through this process, first define the filter factory and then register it with the module:
```
function CustomFilterFactory() {
  return function (input) {
    // some computation

    return output;
  }
}

angular
  .module('app', [])
  .controller('ctrl', Ctrl)
  .filter('custom', CustomFilterFactory);

Ctrl.$inject = ['$scope', 'customFilter'];

function Ctrl($scope, customFilter) {
  var x = customFilter("abc");
};
```
- note that the name for the filter, here: 'custom', must be a valid identifier like a variable name, it cannot be any string. Also, the factory name is *not* the filter name! The . Also, the factory name is *not* the filter name! The filter name is the factory name plus 'Filter'.
- to use the custom filter inside the html, use the name for the factory, not for the filter itself:
```
{{ "Hello" | custom }}
{{ "Hello" | custom | uppercase }}
{{ "Hello" | custom : arg1 : arg2 | uppercase }}
```
- if we only want to use a filter from within the html, but not inside the controller-logic, it is not necessary to inject it into the controller, all we have to do is register it with the module.

### the digest-cycle
- the magic of which parts of the page get updated when is handled by angular's digest-cycle. For this to work, angular uses 'directives' like `ng-click` or `ng-keyup` to add events to the event-queue that it can track. These directives are events that get handled inside an angular context (the $scope). Angular sets up 'watchers' for some elements and if a directive executes it will call `$digest` which in turn will check all the watchers to see if anything has changed.
- the digest-loop performs 'dirty checking' on all the watchers. If nothing is changed, it simple ends, but if anything has changed, it goes through all the watchers again, and if anything has changed again, it checks all the watchers another time, until no changes are to be found. This ensures that complex dependencies among elements are respected.

