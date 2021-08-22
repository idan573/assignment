module.exports = {
  setupFiles: ['./config/jest.config.run.js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  modulePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    'src(.*)$': '<rootDir>/src/$1',
    'core/(.*)$': '<rootDir>/src/core/$1',
    'globalstyles(.*)$': '<rootDir>/src/globalstyles/$1',
    'globaltypes(.*)$': '<rootDir>/src/globaltypes/$1'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};
