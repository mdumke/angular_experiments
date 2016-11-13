# Angularjs cheatsheet

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
```html
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
```js
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
```html
<div ng-controller="MessageController">
  {{message}}
</div>
```
- We need some html-element to bind the controller to, then within that element `$scope` will be implicitely set so we can render out the message-value using mustache-templating syntax.
- Another possibility to make use of content bound to the scope is to associate an input element with a model of that name. For example, in the following code, changing the text inside the text-input would automatically change the data on the viewmodel - through the scope-service.
```html
<div ng-controller="MessageController">
  <input type="text" ng-model="message">
</div>
```
- Instead of adding listeners via javascript, angular uses attributes to call functions bound to the scope like `<input type="text" ng-keyup="doSomething();" />`. `ng-keyup` is just one interaction type. `ng-blur` would be another and there are many more.
- The `$filter`-service allows us to process data and can be extended by custom filters, of course. There are a handful of preset-filters that we can use, e.g. to update content when an input-field looses focus. In `index.html`:
```html
<input type="text" ng-model="content" ng-blur="upcaseContent();" />
```
- The corresponding controller might look like this:
```js
function ContentController ($scope, $filter) {
  $scope.content = "abc";

  $scope.upcaseContent = function () {
    $scope.content = $filter('uppercase')($scope.content);
  }
}
```
- note that the order of the service-parameters does not matter! angular will parse it to find out which service to inject.
- here's a somewhat tricky problem: say I want to dynamically insert an image using angular:
```html
<img src="images/{{imageName}}.png">
```
When the browser parses this line, it will of course not find the url because angular has not had a chance to interpolate the correct value. A solution for this is to insert the image with angular using
```html
<img ng-src="images/{{imageName}}.png">
```


### dependency injection
- dependency injection is a design pattern that implements something called 'inversion of control' ("don't call us, we call you"). What is this? Say you call some code that has to interact with another module. This code could instantiate the module or class by itself but that would introduce tighter coupling than necessary. Instead, we could instantiate the module ourselves and then pass it into the code as an argument so the code can than simply interact with it. If at any point we want to exchange the module the code can remain untouched - given that the module replacement implements the same interface.
- In short: The client should not be responsible for instantiating the dependency, so it get's passed in.
- angular uses dependency injection to inject service objects like `$scope` or `$filter`. The service responsible for injection is named the `$injector`. It uses the method `$injector.annotate(MyController);` to parse the arguments and figure out which dependencies to inject.
- since the injector depends on the controller-parameters being named `$scope`, `$filter`, etc., minification could potentially break the program. To solve this, there are some strategies:
- 1. Explicitely tell angular which parameters the controller-function will expect:
```js
angular
  .module('SomeApp', [])
  .controller('SomeController', ['$scope', '$filter', SomeController]);
```
- 2. Inform the injector about what to inject in which order. This can enhance readability even more:
```js
angular
  .module('SomeApp', [])
  .controller('SomeController', SomeController);

SomeController.$inject = ['$scope', '$filter'];
```

## week 2: Filters, Digest Cycle and data binding

- angular provides the filter service to manipulate data. in order to use it, inject `$filter` into the controller and use it as for example in `var output = $filter('uppercase')(value);`.
- the service creates the filter-function that is called later.
- it is possible to use the filter directly in the html, even with custom arguments that some filters accept:
```html
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
```js
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
```html
{{ "Hello" | custom }}
{{ "Hello" | custom | uppercase }}
{{ "Hello" | custom : arg1 : arg2 | uppercase }}
```
- if we only want to use a filter from within the html, but not inside the controller-logic, it is not necessary to inject it into the controller, all we have to do is register it with the module.

### the digest-cycle
- the magic of which parts of the page get updated when is handled by angular's digest-cycle. For this to work, angular uses 'directives' like `ng-click` or `ng-keyup` to add events to the event-queue that it can track. These directives are events that get handled inside an angular context (the $scope). Angular sets up 'watchers' for some elements and if a directive executes it will call `$digest` which in turn will check all the watchers to see if anything has changed.
- the digest-loop performs 'dirty checking' on all the watchers. If nothing is changed, it simple ends, but if anything has changed, it goes through all the watchers again, and if anything has changed again, it checks all the watchers another time, until no changes are to be found. This ensures that complex dependencies among elements are respected.
- automation of view-updates happens with 'watchers'. For starters, we can look behind the scenes and output the number of watchers at any time via `$scope.$$watchersCount;`. There are multiple ways to add watchers. First off the manual way: we can simply call the `$watch`-function on the scope and tell it which scope-attribute to watch and what to do when it changes:
```js
$scope.$watch('name', function (newValue, oldValue) {
  // ...
});
```
- this manual way is not recommended because angular has two mechanisms to automatically add watchers when needed:
```html
// 1. through expressions
{{ name }}

// 2. through 2-way bindings on inputs
ng-model="name"
```
- the digest-loop can be initialized manually calling the **$digest**-function via `$scope.$digest();`. This can be helpful if non-ng-events on the event-queue are supposed to have an effect on the UI-state. Simple example:
```js
$scope.incrementCounter = function () {
  setTimeout(function () {
    $scope.counter++;
    $scope.$digest();
  }, 2000);
}
```
- In this case, we have a timeout-event that fires independently of the angular context, hence angular does not know about it. To integrate it, call the digest-funtion. There is an even better way to do exactly the same task using the **$apply**-function:
```js
$scope.incrementCounter = function () {
  setTimeout(function () {
    $scope.$apply(function () {
      $scope.counter++;
    }
  }, 2000);
}
```
- this code has the same effect of performing the update inside the angular-context, but it has the additional benefit that in the case of error the error-messages willl be reported properly and angular will know something went wrong (instead of just not reaching the call to `$digest`.
- in the case of the current example, there is a way of generating the behavior with built-in angular methods using the **$timeout**-service that we can inject into the controller:
```js
function someController ($scope, $timeout) {
  $scope.incrementCounter = function () {
    $timeout(function () {
      $scope.counter++;
    }, 2000);
  }
}
```
- angular can employ different bindings and listeners:
```js
// 2-way-binding keeping input- and controller-state in sync:
ng-model="someAttribute"

// 1-way-binding keeping the view updated:
{{ someOtherAttribute }}

// 1-time-binding that will only be set once:
{{ :: thirdAttribute }}
```
- 1-time-bindings are useful because the browser doesn't have to maintain the watchers for them. As a *rule of thumb* a page should not have more than about 2000 active watchers. Angular will provide a watcher for the 1-time-binding, but it will remove it once the value has been initialized.


## week 2: Looping, Controller as syntax

- Angular offers ways to iterate over collections of elements and output them repeatedly using the `ng-repeat`-directive, e.g.:
```html
<ul>
  <li ng-repeat="str in listOfStrings">{{ str }}</li>
</ul>

<ul>
  <li ng-repeat="obj in listOfObjects">{{ obj.attr1 }}, {{ obj.attr2 }}</li>
</ul>
```
- Inside the loop, angular provides access to the current index:
```html
<ul>
  <li ng-repeat="item in collection">{{ $index + 1 }}: {{ item }}</li>
</ul>
```
- As is to be expected, angular will add watchers for all the list-items and the complete list itself, so that the view will be re-rendered when the list changes
- Angular also provides capabilities to filter lists on the fly using the `$filter.filter` service that has bindings both for html and javascript. For example, it is quite easy to implement basic searching behavior in a list of strings:
```html
<input type="text" ng-model="search" />

<ul>
  <li ng-repeat="item in list | filter : search">{{ item }}</li>
</ul>
```
- As a sidenote, there are angular-directives for displaying content conditioned on an expression: `ng-if`, `ng-show`, and `ng-hide`. The following are equivalent in that they all display an error message when it is set on the view-model, but ng-if actually removes the DOM-element whereas the other directives only add or remove the `ng-hide` class from the element:
```html
<div ng-if="list.errorMessage">{{ list.errorMessage }}</div>
<div ng-show="list.errorMessage">{{ list.errorMessage }}</div>
<div ng-hide="!list.errorMessage">{{ list.errorMessage }}</div>
```

### controller as syntax

- here's a quick reminder of what prototypal inheritance looks like in javascript:
```js
// create some parent object
var parent = {
  someProperty: "P",
  someObject: {
    key: "value"
  }
}

// set the parent as direct ancestor in the prototype-chain
var child = Object.create(parent);

// directly overwrite attributes on the child
child.someProperty = "C";

// prototypal inheritance with objects will change state on the parent!
child.someObject.key = "new value";
```
- another quick reminder: when using function contructors, 1. give the class a name starting with uppercase, 2. call it using `new`. Inside the constructor, `this` will now point to the newly created object. When just calling the constructor, `this` will reference the outermost scope. Here`s a simple example:
```js
function Dog (name) {
  this.name = name;
}

var lassy = new Dog('Lassy');
```
- it's not a good practice to have a single controller handle all tasks in a page. A better approach is to nest controllers that take care of the different parts of the application. When nesting controllers, the inner controllers will automatically inherit the outside-scope. This, however, can lead into problems if an inner controller would reuse a property defined on the outside-controller, thereby masking it. Angular has a way to work around these limitations while introducting some new pieces of syntax.
- The key idea is that scope-inheritance works with prototypal object-inheritance, not simply primitive inheritancewhere all a descendent controller could do would be to override a property. To achieve this, the controller-directive introduces the 'controller as'-syntax, and angular will add the specified name to the current scope:
```html
<!-- controller as syntax -->
<div ng-controller="Controller1 as ctrl1"></div>
<div ng-controller="Controller2 as ctrl2"></div>
```
```js
// makes instances of the controller-objects available on the scope
$scope.ctrl1;
$scope.ctrl2;
```
- with this setup, it is possible to refer to a current controller via `this`, removing the necessity of injecting `$scope` into the controller-function in the first place:
```js
function Controller1 () {
  // this = ctrl1, the name given in the html-directive
  this.name = "value";

  // also good practice to use a variable named as the shorthand from the directive:
  var ctrl1 = this;
  ctrl1.name = "value";
}
```
- finally, all these mechansims will lead to more concise syntax. In the html, we can now reference identically named attributes on different controllers, e.g.
```html
<p>{{ ctrl1.someProperty }}</p>
<p>{{ ctrl2.someProperty }}</p>
```


## week 2: creating and configuring custom services

- controllers' purpose is to set up the initial state of the `$scope` and add behavior to it, i.e. handling events and updating the view-data accordingly. Business logic of the application should be strictly kept out and should be delegated to dedicated components.
- Complex applications are going to consist of a number of controllers and some data sharing between those is inevitable. However, data sharing should be implemented, again, using dedicated components.
- Here's how to register a service with a controller using a contructor function:
```js
angular
  .module('app', [])
  .controller('ctrl', Ctrl)
  .service('CustomService', CustomService)
```
- The service that angular will create will be a singleton (Singleton Design Pattern), i.e. an object that will only ever have one instance, which means that multiple controllers can have access to that same instance.
- Services are lazily instantiated, i.e. if a component actually declares it as a dependency.
- Here's a exaple of a service that has an internal array to keep some data, a function to add data to the array and an accessor-method to retrieve the whole array. This service gets injected into different controllers, so one controller can add data to the service, and the other can immediately retrieve it:
```js
angular
  .module('app', [])
  .controller('ctrl1', Ctrl1)
  .controller('ctrl2', Ctrl2)
  .service('ItemListService', ItemListService);

// define controllers
Ctrl1.$inject = ['ItemListService'];
function Ctrl1(ItemListService) {
  // add or retrieve items
}

Ctrl2.$inject = ['ItemListService'];
function Ctrl2(ItemListService) {
  // add or retrieve items
}

// define the service
function ItemListService () {
  var service = this;

  var items = [];

  service.addItem = function (itemName) {
    item.push(itemName);
  };

  service.removeItem = function (index) {
    item.splice(index, 1);
  };

  service.getItems = function () {
    return items;
  };
}
```
- Note again that the service-function will treat the function passed into it as a contructor-function that it will instantiate so that `this` will point to the instance.
- Angular follows the *factory design pattern* in that it provides central places that produce new objects of functions. The `.service()`-function is such a factory that always produces the same kind of things - services. But these and many other objects can also be created with the more powerful and more general factory `.factory()`.
- If we have a contructor function that produces a service, say, `CustomService`, we can register the factory as in the following example:
```js
angular
  .module('app', [])
  .controller('ctrl', Ctrl)
  .factory('CustomService', CustomService);
```
- In contrast, the `service`-function would expect the function passed in to *be* the service, not *produce* it.
-Note that if we register a new service with the name 'CustomService', this is the name to be used when injecting the factory into other places.
- There are two common options for setting up a service. The first one is specifing a factory-function whose return value is the service-function:
```js
// defining the factory
function CustomService () {
  var factory = function () {
    return new SomeService();
  };

  return factory;
};

// using the factory inside the controller
var someService = CustomService();
```
- An alternative way would be to return an object literal that has the factory as a value:
```js
// defining the factory
function CustomService () {
  var factory = {
    getSomeService : function () {
      return new SomeService();
    }
  };

  return factory;
};

// using the factory
var someService = CustomService.getSomeService();
```
- Note that in both scenarios, the factory-function decides to create a new service when asked for one. This not only illustrates that the factory has complete control over what the service will be, but also that it could decide to make the service a singleton as the `service`-method would.
- A third and very flexible but verbose way to create services is through the `provider`-function. With this it is possible to to preconfigure a new factory before the application starts and use the custom-configured services throughout.
- Angular expects a provider-instance to expose a `$get`-method that has to be a factory-function. A provider can be defined along the following lines:
```js
function ServiceProvider () {
  var provider = this;

  provider.config = {
    prop: 'value'
  };

  provider.$get = function () {
    var service = new Service(provider.config.prop);
    return service;
  };
}
```
- The provider can be registered on the module with the name that will be used to inject it into other components later:
```js
angular
  .module('app', [])
  .controller('ctrl', Ctrl)
  .provider('ServiceName', ServiceProvider)
  .config(Config);

Ctrl.$inject = ['$scope', 'ServiceName'];

function Ctrl ($scope, ServiceName) {
  ServiceName.someMethod();
};
```
- The `config`-function is optional, but if provided, it is guaranteed to run before any other serices, factories or controllers are created. This way it is possible to configure services at bootstrap-time. The configuration is itself a function that gets injected with the service-provider. Note the naming-conventions: Config has to be injected with the registered service-name plus 'Provider' appended to it:
```js
Config.$inject = ['ServiceNameProvider'];

function Config (ServiceNameProvider) {
  ServiceNameProvider.config.prop = 'value';
};
```


## week 3.1: Asynchronous Behavior, Promises, and Ajax in Angular

- angular implements its own promise-API (the `$q`-service) that is very similar to the one specified in ES6
- as a reminder: a promise is an object that holds references to the outcomes of asynchronous behavior
- Here's a template for writing an asychronous function in angular, using the `$q`-service:
```js
function asyncFunction () {
  // create the async environment, including the promise object
  var deferred = $q.defer();

  if (...) {
    // wrap data for the promise in case of success
    deferred.resolve(result);
  } else {
    // mark unsuccessful completion
    deferred.reject(error);
  }

  // return the promise to the caller
  return deferred.promise;
}
```
- On the caller-side, there is a `then`-function available on the returned promise that takes as arguments two functions for success and error:
```js
var promise = asyncFuntion();

promise.then(function (result) {
  // do something with the result
},

function (error) {
  // do something with the error
});
```
- Multiple asynchronous functions can be executed in parallel like this:
```js
$q.all([promise1, promise2])
  .then(function (result) {
    // do something with result
  })
  .catch(function (error) {
    // handle error
  });
```
- For server-communication, angular uses the `$http`-service which is based on the `$q`-service. It takes as argument a configuration object to set up the request, and it returns a promise, hence a basic interaction could look like this:
```js
$http({
  method: "GET",
  url: "http://some-url", // required property
  params: { param1: "value1" }
})
.then(
  function (response) {
    // the success-function, response has the important response.data which
    // will be converted to a js-object if it's JSON
    // so we could write for example
    $scope.message = response.data;
  },
  function (error) {
    // 2nd argument is the error-function
  }
);
```
- It is of course often helpful to hide the actual server-interaction, for instance in some service, and return only the response-promise:
```js
service.getData = function () {
  var response = $http({
    method: 'GET',
    url: 'http://some-url.com/data'
  });

  return response;
};
```
- To define values that are available troughout the app, register a `constant` with the app and inject it into the modules where it is needed, e.g.
```js
angular
  .module('app', [])
  .constant('ApiBasePath', "http://some-url.com/");
```

## week 3: Introduction to custom directives
- From the documentation: "AngularJS lets you extend HTML vocabulary for your application". Directives heavily increases the flexibility of html, e.g. like here:
```html
<ol>
  <list-item ng-repeat="item in list.items"></list-item>
</ol>
```
- angular can identify new tags that you have registered and will compile them. A directive is a marker on a DOM element that angular can use to attach specified behavior to that element or change it. A marker can be an *attribute* or an *element name* or - much less common and not good pracice - a *comment* or a *CSS class*.
- To create a new directive
1. Register the directive with the module:
```js
angular
  .module('app', [])
  .directive('myTag', MyTag);
```
2. Define the Factory Function for the new tag:
```js
MyTag.$inject = [...];

function MyTag (...) {
  // define the DDO, the 'Directive Definition Object'
  var ddo = {
    // the template-property is just an example of many properties
    // that can be specified here
    template: 'Hello {{ name }}!'

    // alternatively, define a template in some html-file and point to it
    templateUrl: 'myTemplate.html'
  };

  return ddo;
}
```
3. Use the tag in a normalized way, e.g. `MyTag` will be the html-element `my-tag`. In the current example, where the ddo defines a template, the template-string will be inserted at every position instead of the directive. Interpolation still works because unless specified differently, the provided scope will be the same as the scope at the position where the template is inserted.
- We can specify where angular looks for a directive. By default, it will assume a directive can be either an attribute or an element, but we can specify this explicitely via the `restrict`-property:
```js
function MyDirective () {
  var ddo = {
    /*
    * A: attribute - best practice if your directive is extending the
    *    functionality of a existing element
    * E: element - best practivce to use an element if the directive is
    *    defining a component with an associated template
    */
    restrict: 'AE',
    ...
  };

  return ddo;
}
```
- In order to combine the 'controller as'-syntax with directives, it would be helpful if the directive didn't have to know the scope it is operating within. A more flexible way would be to pass value into it (e.g. the `$scope`). This can be achieved using the 'isolate scope' concept. The idea is to evaluate attribute-values in the parent-scope and pass them into the directive. Here's an example of this:
```js
function MyDirective () {
  var ddo = {
    scope: {
      // attribute name to use in the html template, myProp will be the
      // property available in the directive's local scope
      myProp: '=attributeName'
    }
  };

  return ddo;
}
```
- In the html the value can simply be set as in:
```html
<my-directive my-prop="outerProp"></my-directive>
```
- The example has `myProp: '=attributeName'` which is a bidirectional binding, meaning that the directive- and parent-value's changes will be synchronized. There are alternatives and further things to consider:
```js
// Assumes the attribute name will be 'my-prop' and the local
// property name is 'MyProp':
myProp: '='

// Tells angular that the attribute is optional:
myProp: '=?'

// A one-way binding that updates the directive-property if the parent-value
// changes but not the other way round. The following will track the value
// of 'my-attribute' on the element where the directive if defined:
myProp: '@myAttribute'

// One way binding. This will not setup watchers for property-changes inside
// the directive (saves resources). It's not good practice anyways to
// change properties here. However, because objects are passed by reference,
// the directive might change objects which can have effects outside the directive
myProp: '<'
```
- The difference between `@` and `<` is that `@` uses the *value* of the parent-attribute while `<` will try to evaluate the variable specified on the parent
- A directive can be more than a template holder if we add some behavior. One way to do this is to use a controller inside the directive like so:
```js
function MyDirective () {
  var ddo = {
    scope: {
      prop: '='
    },

    // standard controller that has the values of the isolate scope
    // available on it's $scope-service or the 'this'-variable
    controller: ControllerFunction,

    // to use 'controller as' syntax, tell angular to bind the scope-
    // properties directly to the controller-instance, not it's $scope
    bindToController: true,

    // declare the controller name to be used within the template
    controllerAs: 'myCtrl',

    templateUrl: 'template.html'
  };

  return ddo;
}
```
- note that the `ControllerFunction` here could be the name of an extra function we write or it could be the name with which we registered some controller-function on the module. In the latter case, the ddo would change to:
```js
var ddo = {
  // ...

  controller: 'ControllerFunction as myCtrl',
  bindToController: true,

  // ...
};
```


## week 3: Directive APIs, Manipulating the DOM, and transclude

- Sometimes a directive should be able to invoke methods on the parents and passing data around, e.g. information about which item in a list was clicked. Its important that the method be executed in the correct scope. In order to call a method in the parent-context, we need to specify a name to be used within the child-directive and pass in the method:
```js
function MyDirective () {
  var ddo = {
    scope: {
      localMethodName: '&parentMethod'
    }
  };

  return ddo;
}
```
- in the parent's template, we'll have to pass reference where `someMethod` is defined on the controller and the argument is a placeholder label for a value that will be passed in from the directive.
```html
<div ng-controller="Controller as Ctrl">
  <my-directive parentMethod="ctrl.someMethod(someArg)"></my-directive>
</div>
```
- finally, in the directive's template, we can call the method as defined on the isolate scope and pass in arguments as an object, using the labels as defined in the parent's template:
```html
<button ng-click="dirCtrl.localMethodName({someArg: 'value'});">
  click me!
</button>
```


