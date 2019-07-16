import { expect }  from 'chai';
import promClient  from 'prom-client';
import GaugeMetric from './GaugeMetric';

/**
 * @param {string} metricName
 * @return {number}
 */
const getMetricValue = metricName =>
	promClient.register.getSingleMetric(metricName).get().values[0].value;

/**
 * @param {string} metricName
 * @param {string} labelName
 * @return {string|number}
 */
const getLabelValue = (metricName, labelName) =>
	promClient.register.getSingleMetric(metricName).get().values[0].labels[labelName];

describe('GaugeMetric', () => {
	// Чтобы не ебалось при --watch
	afterEach(() => {
		promClient.register.clear();
	});
	
	it('Can set value without labels', () => {
		const metricName    = 'test';
		const expectedValue = 10;
		
		const metric = new GaugeMetric(metricName);
		metric.set(expectedValue);
		// Ну да жесть, позже поправим
		const realValue = getMetricValue(metricName);
		expect(realValue).to.be.equal(expectedValue);
	});
	
	it('Can set value with labels', () => {
		const metricName    = 'test';
		const expectedValue = 10;
		const labelName     = 'testLabel';
		
		const metric = new GaugeMetric(metricName, {
			labels: { testLabel: null },
		});
		
		metric.set(expectedValue, { [labelName]: 'testLabel' });
		// Ну да жесть, позже поправим
		const labelValue = getLabelValue(metricName, labelName);
		expect(labelValue).to.be.equal(labelName);
	});
	
	
	it('Should increment value', () => {
		const metricName    = 'test';
		const metric = new GaugeMetric(metricName);
		metric.inc();
		
		const realValue = getMetricValue(metricName);
		expect(realValue).to.be.equal(1);
	});
	
	it('Should decrement value', () => {
		const metricName    = 'test';
		const metric = new GaugeMetric(metricName);
		metric.dec();
		
		const realValue = getMetricValue(metricName);
		expect(realValue).to.be.equal(-1);
	});
});
