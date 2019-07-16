import { expect } from 'chai';
import promClient from 'prom-client';

import UMetrics  from './UMetrics';
import Transport from './transport/Transport';

describe('UMetrics facade', () => {
	// Чтобы не ебалось при --watch
	afterEach(() => {
		promClient.register.clear();
	});
	
	it('Should throw error if transport is not provided', () => {
		const createUMetrics = () => {
			new UMetrics({ port: 1111 });
		};
		
		expect(createUMetrics).to.throw(/Transport must be provided and be instance of Transport/);
	});
	
	it('Can register metric', () => {
		const uMetrics = new UMetrics(new Transport(), { port: 1111 });
		const metric = uMetrics.register(uMetrics.Metrics.Gauge, 'testMetric');
		expect(metric).to.be.instanceOf(uMetrics.Metrics.Gauge);
	});
	
	it('Can use getters to get metrics by name', () => {
		const uMetrics = new UMetrics(new Transport(), { port: 1111 });
		const realMetric = uMetrics.register(uMetrics.Metrics.Gauge, 'testMetric');
		expect(uMetrics.testMetric).to.be.equals(realMetric);
	});
});
