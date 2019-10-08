/**
 * @property {String} name
 * @property {Array.<String>} labels
 * @property {Object} promMetric
 * @property {Number} [ttl]
 */
class Metric {
  /**
   * @param {string} name
   * @param {number} ttl (ms)
   * @param {Object.<string, string|Number>}labels
   */
  constructor(name, { ttl, labels = {} } = {}) {
    if (!name) {
      throw new Error('Name not provided');
    }
    this.name = Metric.buildName(name);

    if (ttl) {
      this.setInterval(ttl);
    }

    this._labels = labels;
    this.promMetric = null;
  }

  /**
   * @param {String} name
   * @return {String}
   */
  static buildName(name) {
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
  }

  /**
   * @return {String}
   */
  getName() {
    return this.name;
  }

  /**
   * @param {number} ttl
   * @private
   */
  setInterval(ttl) {
    this.interval = setInterval(() => {
      this.promMetric && this.promMetric.reset();
    }, ttl);
  }

  /**
   * @private
   */
  clearInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default Metric;
