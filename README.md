# web-project-template

- Template for web projects. Do not use it for libraries.
- It uses html as deployable configuration concept, https://immutablewebapps.org/#indexhtml-is-deployable-configuration
- Generated version folder name inside `dist` is from artifact version. Artifact version can be configured as env variable - `process.env.ARTIFACT_VERSION`. By default, it takes artifact version from `package.json`
- Compile time const `BASE_URL` is available. Any ajax request to files inside `resources` should have `BASE_URL` as prefix url. Example:
```js
fetch(BASE_URL + '/resources/assets.json');
// when compiled url will be 'v1.0.0/resources/assets.json'
```
- File contents inside `resources` folder with token `${baseUrl}` is also replaced with correct base url. Tokens are updated only for .json, .css files.
