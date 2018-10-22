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
});

