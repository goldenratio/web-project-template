import { interval } from 'rxjs';
import { sum } from './add';
import { HelloWorld } from './hello-world';

const ob$ = interval(1000);
ob$.subscribe(val => {
  console.log(val);
});

console.log(new HelloWorld());
console.log(sum(40, 2));
