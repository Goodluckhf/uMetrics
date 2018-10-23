import MetricRegistry from './MetricRegistry';
import GaugeMetric    from './metric/GaugeMetric';
import Transport      from './transport/Transport';

/**
 * @property {Transport} transport
 * @property {MetricRegistry} registry
 */
class UMetrics {
	constructor(transport, { prefix, labels } = {}) {
		if (!transport || !(transport instanceof Transport)) {
			throw new Error('Transport must be provided and be instance of Transport');
		}
		
		this.transport = transport;
		this.registry  = new MetricRegistry({
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
		this.transport.start();
		return this;
	}
}

// Конструкторы метрик, как внешний интерфейс
UMetrics.prototype.Metrics = {
	Gauge: GaugeMetric,
};

export default UMetrics;
