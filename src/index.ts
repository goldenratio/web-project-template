import { interval } from 'rxjs';

import { sum } from './example/add';
import { HelloWorld } from './example/hello-world';

const ob$ = interval(1000);
ob$.subscribe(val => {
	console.log(val);
});

console.log(new HelloWorld());
console.log(sum(40, 2));
