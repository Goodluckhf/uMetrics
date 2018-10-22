import promClient from  'prom-client';
import Transport  from './Transport';

/**
 * @property {Logger} logger
 * @property {String} url
 * @property {Number} interval
 * @property {String} jobName
 * @property {Pushgateway} gateway
 */
class PushTransport extends Transport {
	constructor(logger, { url, interval, jobName } = {}) {
		super();
		if (! url) {
			throw new Error('Url is not provided');
		}
		
		this.logger   = logger;
		this.url      = url;
		this.jobName  = jobName;
		this.interval = interval;
		
		this.gateway = new promClient.Pushgateway(url);
	}
	
	start() {
		setInterval(() => {
			this.gateway.pushAdd({ jobName: this.jobName }, (error) => {
				if (error) {
					this.logger.error({ error });
				}
			});
		}, this.interval);
	}
}

export default PushTransport;
