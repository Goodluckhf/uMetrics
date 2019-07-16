import { expect }    from 'chai';
import PushTransport from './PushTransport';

describe('PushTransport', () => {
	it('Should throw error if pushgateway url is not provided', () => {
		const createPushTransport = () => {
			new PushTransport();
		};
		
		expect(createPushTransport).to.throw(/Url is not provided/);
	});
	
	it('Should have method "start"', () => {
		const pushTransport = new PushTransport({}, { url: 'test.com' });
		expect(pushTransport).to.have.property('start');
	});
	
	it('Should push metrics with an interval', (cb) => {
		const pushTransport = new PushTransport({}, { url: 'test.com', interval: 500 });
		let pushTimes = 0;
		pushTransport.gateway = {
			pushAdd() {
				pushTimes += 1;
			},
		};
		pushTransport.start();
		setTimeout(() => {
			expect(pushTimes).to.be.equals(2);
			cb();
		}, 1100).unref();
	});
});
