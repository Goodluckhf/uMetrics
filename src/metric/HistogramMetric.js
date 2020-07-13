import promClient from 'prom-client';
import Metric from './Metric';

class HistogramMetric extends Metric {
  constructor(name, buckets = [], options = {}) {
    super(name, options);

    this.promMetric = new promClient.Histogram({
      name: this.name,
      help: options.help || `${this.name}_help`,
      labelNames: Object.keys(this._labels),
      buckets,
    });
  }

  /**
   * @param {string} action
   * @param {number} value
   * @param {Object.<string, string | number>} [_labels]
   * @return {HistogramMetric}
   * @private
   */
  _proxyCall(action, value, _labels) {
    const labels = { ...this._labels, ..._labels };
    if (!labels) {
      this.promMetric[action](value);
      return this;
    }

    this.promMetric[action](labels, value);
    return this;
  }

  /**
   * @param {number} value
   * @param {Object.<string, string | number>} [labels]
   * @returns {HistogramMetric}
   */
  observe(value, labels) {
    return this._proxyCall('observe', value, labels);
  }

  /**
   * Start a timer where the value in seconds will observed
   * @param labels Object with label keys and values
   * @return Function to invoke when timer should be stopped
   */
  startTimer(labels) {
    return this.promMetric.startTimer(labels);
  }

  /**
   * Reset histogram values
   */
  reset() {
    this.promMetric.reset();
  }
}

export default HistogramMetric;
