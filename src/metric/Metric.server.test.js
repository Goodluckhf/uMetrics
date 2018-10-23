import { expect }  from 'chai';
import promClient  from 'prom-client';
import Metric      from './Metric';
import GaugeMetric from './GaugeMetric';

/**
 * @description Для доступа в кишки пром клинта
 * @param {string} metricName
 * @return {number}
 */
const getMetricValue = (metricName) => {
	return promClient.register.getSingleMetric(metricName).get().values[0].value;
};

describe('Metric', function () {
	this.timeout(10000);
	
	// Чтобы не ебалось при --watch
	afterEach(() => {
		promClient.register.clear();
	});
	
	it('Should throw error if name not provided', () => {
		const createMetric = () => {
			new Metric();
		};
		
		expect(createMetric).to.throw();
	});
	
	it('Should parse name to snakeCases', () => {
		const metric = new Metric('jobTestMetric');
		
		expect(metric.name).to.be.equals('job_test_metric');
	});
	
	it('Should set interval', () => {
		const ttl = 10;
		const metric = new Metric('test', { ttl });
		expect(metric.interval).to.exist;
	});

	it('Should clear interval', () => {
		const ttl = 10;
		const metric = new Metric('test', { ttl });
		metric.clearInterval();
		expect(metric.interval).to.be.null;
	});
	
	it('Should reset value in ttl ms', (cb) => {
		const metricName    = 'test';
		const expectedValue = 10;
		const ttl           = 2000;
		
		const metric = new GaugeMetric(metricName, { ttl });
		metric.set(expectedValue);
		expect(getMetricValue(metricName)).to.be.equals(expectedValue);
		setTimeout(() => {
			expect(getMetricValue(metricName)).to.be.equal(0);
			cb();
		}, ttl + 10);
	});
});
