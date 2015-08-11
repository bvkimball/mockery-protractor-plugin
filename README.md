## mockery-protractor-plugin

A protractor plugin for mocking server responses when not using angular $http service. This use the [mockery](https://github.com/bvkimball/mockery) project to mock out endpoints. Documentation for using mockery are available [here](https://github.com/bvkimball/mockery).

Should work for:

* JQuery
* XMLHttpRequest
* Custom XHR Objects

### Installation

Install with npm.

```shell
npm install mockery-protractor-plugin --save-dev
```

Add the following to your `protractor.conf.js` file.

```js
    plugins: [{
         package: 'mockery-protractor-plugin',
		 files: [
			 '../../test/mock/state.js',
			 '../../test/mock/routes.js'
		 ]
	}],
```

### How does it work?

The plugin will inject a script into your app at startup that will replace your configured XHR object. You must tell the plugin where your mock files are to inject. The files should contain your state object definitions and all the routes that should be mocked.

For Example: 

```js
Mockery.imitate('/login', 'POST', function (req, res) {
    res.type('application/json');
    if( state.me.email == req.body.username ){
        res.statusCode(200);
        res.json(state.me);   
    } else {
        res.statusCode(404);
        res.json({
            "status": "not found"
        });
    } 
});
```

### How can i replace my XHR object?

In the plugin configuration the variable to inject the MockHttpRequest into can be specified with the `xhr` property.

```js
plugins: [{
     package: 'mockery-protractor-plugin',
     xhr: 'XMLHttpRequest'
     ...
}],
```
