export function loadResourceMap(resourceMapPath: string): Promise<{ readonly assets: ReadonlyArray<string> }> {
  return new Promise((resolve, reject) => {
    fetch(resourceMapPath)
      .then(data => {
        const { ok } = data;
        if (!ok) {
          throw new Error('error');
        }
        data
          .json()
          .then(jsonData => resolve(jsonData))
          .catch(() => {
            throw new Error('error');
          });
      })
      .catch(() => reject(`error loading resource map: ${resourceMapPath}`));
  });
}
