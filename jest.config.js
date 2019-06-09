module.exports = {
  'testPathIgnorePatterns': [
    '/node_modules/',
    'dist'
  ],
  'transform': {
    '^.+\\.tsx?$': 'ts-jest'
  },
  'testRegex': '(/tests/.*|\\.(test|spec))\\.tsx?$',
  'testEnvironment': 'jsdom',
  'moduleFileExtensions': [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  'moduleNameMapper': {},
  'collectCoverage': false,
  'collectCoverageFrom': [
    'src/**/*.ts',
    '!src/**/index.ts',
    '!src/**/*.config.ts',
    '!src/**/*.mock.ts'
  ]
};
