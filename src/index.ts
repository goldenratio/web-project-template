import { sum } from './utils/add';
import { loadResourceMap } from './utils/resource-loader';

declare const BASE_URL: string;

console.log(sum(40, 2));

const resourceMapPath = `${BASE_URL}/resources/resource-map.json`;

loadResourceMap(resourceMapPath).then(({ assets }) => {
	assets.forEach(url => {
		const image = new Image();
		image.src = url;
		document.body.appendChild(image);
	});
});
