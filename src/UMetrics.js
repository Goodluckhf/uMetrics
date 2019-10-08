import promClient from 'prom-client';
import MetricRegistry from './MetricRegistry';
import GaugeMetric from './metric/GaugeMetric';
import Transport from './transport/Transport';

/**
 * @property {Transport} transport
 * @property {MetricRegistry} registry
 */
class UMetrics {
  constructor(
    transport,
    {
      prefix = null,
      labels,
      nodejsMetricsEnabled = false,
      nodejsMetricsInterval = 7000,
    } = {},
  ) {
    if (!transport || !(transport instanceof Transport)) {
      throw new Error(
        'Transport must be provided and be instance of Transport',
      );
    }

    this.nodejsMetricsEnabled = nodejsMetricsEnabled;
    this.nodejsMetricsInterval = nodejsMetricsInterval;
    this.prefix = prefix;
    this.transport = transport;
    this.registry = new MetricRegistry({
      prefix,
      labels,
    });

    return new Proxy(this, {
      get(target, prop) {
        if (typeof target[prop] !== 'undefined') {
          return target[prop];
        }

        return target.registry.getByName(prop);
      },
    });
  }

  /**
   * @description проксирует вызов на registry
   * @param {...*} args
   * @return Metric
   */
  register(...args) {
    return this.registry.register(...args);
  }

  /**
   * @description проксирует вызов на транспорт
   * @return UMetrics
   */
  start() {
    if (this.nodejsMetricsEnabled) {
      this.enableExportingDefaultMetrics(this.prefix && `${this.prefix}_`);
    }
    this.transport.start();
    return this;
  }

  /**
   * @param {String} prefix
   * @private
   */
  enableExportingDefaultMetrics(prefix) {
    const options = {
      timeout: this.nodejsMetricsInterval,
    };

    if (prefix) {
      options.prefix = prefix;
    }

    promClient.collectDefaultMetrics(options);
  }
}

// Конструкторы метрик, как внешний интерфейс
UMetrics.prototype.Metrics = {
  Gauge: GaugeMetric,
};

export default UMetrics;
