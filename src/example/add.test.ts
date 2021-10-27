import { sum } from './add';

describe('Add Test', () => {
	it('should add two numbers', () => {
		expect(sum(40, 2)).toBe(42);
	});
});
