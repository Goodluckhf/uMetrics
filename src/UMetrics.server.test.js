import { expect } from 'chai';
import promClient from 'prom-client';

import UMetrics from './UMetrics';
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

    expect(createUMetrics).to.throw(
      /Transport must be provided and be instance of Transport/,
    );
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

  it('Should have defaultMetrics disabled by default', () => {
    const uMetrics = new UMetrics(new Transport(), { port: 1111 });
    expect(uMetrics.nodejsMetricsEnabled).to.be.false;
  });

  it('Should have metricsPrefix options null by default', () => {
    const uMetrics = new UMetrics(new Transport(), { port: 1111 });
    expect(uMetrics.prefix).to.be.null;
  });

  it('Should change metricsPrefix options', () => {
    const uMetrics = new UMetrics(new Transport(), {
      port: 1111,
      prefix: 'test',
    });
    expect(uMetrics.prefix).to.be.equals('test');
  });

  it('Should have defaultMetricsInterval as 7000 ms by default', () => {
    const uMetrics = new UMetrics(new Transport(), {
      port: 1111,
    });
    expect(uMetrics.nodejsMetricsInterval).to.be.equals(7000);
  });

  it('Should enable default metrics exports if option provided', () => {
    let calledCount = 0;
    const uMetrics = new UMetrics(new Transport(), {
      port: 1111,
      nodejsMetricsEnabled: true,
    });

    uMetrics.enableExportingDefaultMetrics = () => {
      calledCount += 1;
    };

    uMetrics.start();
    expect(calledCount).to.be.equals(1);
  });

  it('Should not enable default metrics exports if option is not provided', () => {
    let calledCount = 0;
    const uMetrics = new UMetrics(new Transport(), {
      port: 1111,
      nodejsMetricsEnabled: false,
    });

    uMetrics.enableExportingDefaultMetrics = () => {
      calledCount += 1;
    };

    uMetrics.start();
    expect(calledCount).to.be.equals(0);
  });

  it('Should add _ if prefix option provided', () => {
    let expectedPrefix = null;
    const uMetrics = new UMetrics(new Transport(), {
      port: 1111,
      nodejsMetricsEnabled: true,
      prefix: 'test',
    });

    uMetrics.enableExportingDefaultMetrics = prefix => {
      expectedPrefix = prefix;
    };

    uMetrics.start();
    expect(expectedPrefix).to.be.equals('test_');
  });

  it('Should call enableExportMetrics without parameters if prefix is not provided', () => {
    let expectedPrefix = 0;
    const uMetrics = new UMetrics(new Transport(), {
      port: 1111,
      nodejsMetricsEnabled: true,
    });

    uMetrics.enableExportingDefaultMetrics = prefix => {
      expectedPrefix = prefix;
    };

    uMetrics.start();
    expect(expectedPrefix).to.be.null;
  });
});
