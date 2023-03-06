module.exports = {
  rootDir: '.',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json'
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testMatch: ['<rootDir>/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js'],
};
