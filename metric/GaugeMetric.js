import promClient from 'prom-client';

import Metric from './Metric';

class GaugeMetric extends Metric {
	constructor(...args) {
		super(...args);
		this.promMetric = new promClient.Gauge({
			name      : this.name,
			labelNames: Object.keys(this._labels),
			
			// @TODO: Когда поймем, что это за параметр - сделаем по нормальному
			help: `${this.name}_help`,
		});
	}
	
	/**
	 * @param {string} action
	 * @param {number} value
	 * @param {Object.<string, string | number>} [_labels]
	 * @return {GaugeMetric}
	 * @private
	 */
	_proxyCall(action, value, _labels) {
		const labels = { ...this._labels, ..._labels };
		if (! labels) {
			this.promMetric[action](value);
			return this;
		}
		
		this.promMetric[action](labels, value);
		return this;
	}
	
	/**
	 * @param {number} value
	 * @param {Object.<string, string | number>} [labels]
	 * @return {GaugeMetric}
	 */
	set(value, labels) {
		return this._proxyCall('set', value, labels);
	}
	
	/**
	 * @param {number} [value=1]
	 * @param {Object.<string, string | number>} [labels]
	 * @return {GaugeMetric}
	 */
	inc(value = 1, labels) {
		return this._proxyCall('inc', value, labels);
	}
	
	/**
	 * @param {number} [value=1]
	 * @param {Object.<string, string | number>} [labels]
	 * @return {GaugeMetric}
	 */
	dec(value = 1, labels) {
		return this._proxyCall('dec', value, labels);
	}
}

export default GaugeMetric;
