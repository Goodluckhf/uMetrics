# uMetrics
![Travis](https://img.shields.io/travis/Goodluckhf/uMetrics/master.svg?style=flat-square)
![Coveralls github branch](https://img.shields.io/coveralls/github/Goodluckhf/uMetrics/master.svg?style=flat-square)
![node](https://img.shields.io/node/v/uMetrics.svg?style=flat-square)
![npm](https://img.shields.io/npm/v/uMetrics.svg?style=flat-square)

![GitHub top language](https://img.shields.io/github/languages/top/Goodluckhf/uMetrics.svg?style=flat-square)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Goodluckhf/uMetrics.svg?style=flat-square)
![David](https://img.shields.io/david/Goodluckhf/uMetrics.svg?style=flat-square)
![David](https://img.shields.io/david/dev/Goodluckhf/uMetrics.svg?style=flat-square)

![license](https://img.shields.io/github/license/Goodluckhf/uMetrics.svg?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/Goodluckhf/uMetrics.svg?style=flat-square)
![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)

Convenient wrapper for prom-client to expose product's metrics to prometheus

You just have to initialize `Facade` class and use it as a `Singletone`:
```javascript
const { UMetrics, PullTransport } = require('umetrics');

// Any logger with this interface
const logger = {
	info(msg) {
		console.log(msg);
	},
	warn(msg) {
		console.log(msg);
	},
	error(msg) {
		console.log(msg);
	},
};

// And just initialize Singletone once
const uMetrics = new UMetrics(new PullTransport(logger, 3000), {
	prefix: 'test',
});

uMetrics.start();
````
Then in your code you have to register new metric name:
```javascript
uMetrics.register(uMetrics.Metrics.Gauge, 'someMetricName', {
	ttl   : 60 * 1000, // each time this metric will be reset
	labels: ['some_label'],
});
```

And use it to collect metrics:
```javascript
try {
	// Yes, you can write the name of metric here
	// Inside it' realised with proxy, so you can use it like this
	uMetrics.someMetricName.inc(1, { some_label: 'label_value' });
} catch (error) {
	// here just logging error
}
```
Best practise to wrap with try/catch to secure from uncaught exceptions


You cant inject another transport. Out of the box you have `PullTransport` and `PushTransport`
```javascript
// You need push transport for scripts which run for not long period
// For example cron
new PushTransport(logger, {
	url: 'pushgatewayurl',
	interval: 2000, //ms
});
```
See https://prometheus.io/docs/practices/pushing/

Now we have only one Metric type `GaugeMetric`. Welcome for contribution!

