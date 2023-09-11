/* eslint-disable */

export default {
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  displayName: 'user-gate',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
};
