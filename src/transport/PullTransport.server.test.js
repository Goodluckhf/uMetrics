import { expect }    from 'chai';
import PullTransport from './PullTransport';

describe('PullTransport', () => {
	it('Should throw error if port not provided', () => {
		const createUMetrics = () => {
			new PullTransport();
		};
		
		expect(createUMetrics).to.throw(/Port must be provided/);
	});
	
	it('Should have method "start"', () => {
		const pullTransport = new PullTransport({}, 3000);
		expect(pullTransport).to.have.property('start');
	});
});

