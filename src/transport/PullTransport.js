import promClient from 'prom-client';
import http from 'http';
import Transport from './Transport';

/**
 * @property {Logger} logger
 * @property {String} port
 */
class PullTransport extends Transport {
  constructor(logger, port) {
    super();
    if (!port) {
      throw new Error('Port must be provided');
    }

    this.logger = logger;
    this.port = port;
  }

  start() {
    const server = http.createServer((req, res) => {
      if (req.url !== '/metrics') {
        res.statusCode = 404;
        res.end('404');
        return;
      }

      res.end(promClient.register.metrics());
    });

    server.on('error', error => {
      this.logger.info('uMetrics error pullTransport', { error });
    });

    this.logger.info(`listen ${this.port}`);
    server.listen(this.port);
  }
}

export default PullTransport;
