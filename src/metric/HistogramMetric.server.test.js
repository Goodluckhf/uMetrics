import { expect } from 'chai';
import promClient from 'prom-client';
import HistogramMetric from './HistogramMetric';

/**
 * @param {string} metricName
 * @return {number}
 */
const getMetricValues = metricName =>
  promClient.register.getSingleMetric(metricName).get().values;

/**
 * @param {string} metricName
 * @param {string} labelName
 * @return {string|number}
 */
const getLabelValue = (metricName, labelName) =>
  promClient.register.getSingleMetric(metricName).get().values[0].labels[
    labelName
  ];

describe('HistogramMetric', () => {
  // Чтобы не ебалось при --watch
  afterEach(() => {
    promClient.register.clear();
  });

  it('Can observe value without labels', () => {
    const metricName = 'test';

    const metric = new HistogramMetric(metricName, [5, 100, 1000]);

    metric.observe(5);
    metric.observe(50);
    metric.observe(100);
    metric.observe(1001);

    const metricValues = getMetricValues(metricName);

    expect(metricValues[0].labels.le).to.be.equal(5);
    expect(metricValues[0].value).to.be.equal(1);
    expect(metricValues[0].metricName).to.be.equal(`${metricName}_bucket`);

    expect(metricValues[1].labels.le).to.be.equal(100);
    expect(metricValues[1].value).to.be.equal(3);

    expect(metricValues[2].labels.le).to.be.equal(1000);
    expect(metricValues[2].value).to.be.equal(3);

    expect(metricValues[3].labels.le).to.be.equal('+Inf');
    expect(metricValues[3].value).to.be.equal(4);

    expect(metricValues[4].value).to.be.equal(1156);
    expect(metricValues[4].metricName).to.be.equal(`${metricName}_sum`);
  });

  it('Can observe value with labels', () => {
    const metricName = 'test';
    const labelName = 'testLabel';

    const metric = new HistogramMetric(metricName, [100], {
      labels: { testLabel: null },
    });

    metric.observe(50, { [labelName]: 'testLabel' });
    metric.observe(150, { [labelName]: 'testLabel' });

    const labelValue = getLabelValue(metricName, labelName);
    expect(labelValue).to.be.equal(labelName);

    const metricValues = getMetricValues(metricName);
    expect(metricValues[0].labels.le).to.be.equal(100);
    expect(metricValues[0].value).to.be.equal(1);
    expect(metricValues[0].metricName).to.be.equal(`${metricName}_bucket`);

    expect(metricValues[1].labels.le).to.be.equal('+Inf');
    expect(metricValues[1].value).to.be.equal(2);

    expect(metricValues[2].value).to.be.equal(200);
    expect(metricValues[2].metricName).to.be.equal(`${metricName}_sum`);
  });

  it('Can observe value without buckets', () => {
    const metricName = 'test';

    const metric = new HistogramMetric(metricName);

    metric.observe(50);
    metric.observe(150);

    const metricValues = getMetricValues(metricName);

    expect(metricValues[0].labels.le).to.be.equal('+Inf');
    expect(metricValues[0].value).to.be.equal(2);

    expect(metricValues[1].value).to.be.equal(200);
    expect(metricValues[1].metricName).to.be.equal(`${metricName}_sum`);
  });
});
