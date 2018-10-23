import { expect } from 'chai';
import promClient from 'prom-client';

import MetricRegistry from './MetricRegistry';
import Metric         from './metric/Metric';
import GaugeMetric    from './metric/GaugeMetric';

describe('MetricRegistry', () => {
	// Чтобы не ебалось при --watch
	afterEach(() => {
		promClient.register.clear();
	});
	
	it('Should throw error if try set value for unregister job', () => {
		const metricRegistry = new MetricRegistry({ port: 9300 });
		const setValue = () => {
			metricRegistry.getByName('jobTestMetric').set(10);
		};
		
		expect(setValue).to.throw(/registered before/);
	});
	
	it('Should throw error if try to call "register" with Constructor not instance of Metric', () => {
		const metricRegistry = new MetricRegistry({ port: 9300 });
		const testClass = class{};
		const register = () => {
			metricRegistry.register(testClass, 'jobTestMetric')
		};
		
		expect(register).to.throw(/instance of Metric/);
	});
	
	it('Can register metric', () => {
		const metricRegistry = new MetricRegistry({ port: 9300 });
		metricRegistry.register(GaugeMetric, 'jobTestMetric');
		
		const realMetric = metricRegistry.getByName('jobTestMetric');
		expect(realMetric).to.be.instanceOf(Metric);
		expect(realMetric.getName()).to.be.equal(Metric.buildName('jobTestMetric'));
	});
	
	it('Should register job with default label', () => {
		const metricRegistry = new MetricRegistry({ port: 9300, labels: { pm_id: 10 }});
		metricRegistry.register(GaugeMetric, 'jobTestMetric');
		const realMetric = metricRegistry.getByName('jobTestMetric');
		expect(realMetric._labels).to.have.property('pm_id');
	});
	
	it('Should register job with extra label', () => {
		const metricRegistry = new MetricRegistry({ port: 9300, labels: { pm_id: 10 }});
		metricRegistry.register(GaugeMetric, 'jobTestMetric', {
			labels: ['testLabel']
		});
		const realMetric = metricRegistry.getByName('jobTestMetric');
		expect(realMetric._labels).to.have.property('testLabel');
		expect(realMetric._labels).to.have.property('pm_id');
	});
	
	it('Should set label value from default label', () => {
		const metricRegistry = new MetricRegistry({ port: 9300, labels: { pm_id: 10 }});
		
		metricRegistry.register(GaugeMetric, 'jobTestMetric');
		
		metricRegistry.getByName('jobTestMetric').set(121);
		const realMetric       = metricRegistry.getByName('jobTestMetric').promMetric.get();
		const realMetricLabels = realMetric.values[0].labels;
		
		expect(realMetricLabels).to.have.deep.property('pm_id', 10);
	});
	
	it('Should add prefix to metric name from config', () => {
		const prefix     = 'prefix';
		const metricName = 'jobTestMetric';
		const metricRegistry = new MetricRegistry({ port: 9300, prefix });
		
		metricRegistry.register(GaugeMetric, metricName);
		
		const realMetricName = Metric.buildName(`${prefix}_${metricName}`);
		const realMetric = metricRegistry.getByName(metricName).promMetric.get();
		expect(realMetric.name).to.be.equal(realMetricName);
	});
});
