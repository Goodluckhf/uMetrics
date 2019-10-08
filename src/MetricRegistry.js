import Metric from './metric/Metric';

/**
 * @property {String} prefix
 * @property {Map.<String, Metric>} metrics
 * @property {Object.<string, string|Number>} defaultLabels
 */
class MetricRegistry {
  constructor({ labels = {}, prefix = null } = {}) {
    this.prefix = prefix;
    this.metrics = new Map();
    this.defaultLabels = labels;
  }

  /**
   * @param {String} name
   * @return Metric
   */
  getByName(name) {
    const metricName = this._formatMetricName(name);
    const metric = this.metrics.get(Metric.buildName(metricName));

    if (!metric) {
      throw new Error('Job should be registered before setting value');
    }

    return metric;
  }

  /**
   * @param {string} name
   * @return {string}
   * @private
   */
  _formatMetricName(name) {
    if (!this.prefix) {
      return name;
    }

    return `${this.prefix}_${name}`;
  }

  /**
   * @param {Metric} Constructor
   * @param {string} metricName
   * @param {Array.<{name: string, [ttl]: number, [labels]: Array.<string>}>} metricsData
   * @return {Metric}
   */
  register(Constructor, metricName, { labels = [], ttl } = {}) {
    if (!(Constructor.prototype instanceof Metric)) {
      throw new Error('Constructor should be instance of Metric');
    }

    const labelsHash = labels.reduce(
      (object, label) => ({ ...object, [label]: null }),
      {},
    );

    if (!labels) {
      labels = this.defaultLabels;
    } else {
      labels = { ...this.defaultLabels, ...labelsHash };
    }

    const name = this._formatMetricName(metricName);
    const metric = new Constructor(name, { labels, ttl });
    this.metrics.set(metric.getName(), metric);
    return metric;
  }
}

export default MetricRegistry;
