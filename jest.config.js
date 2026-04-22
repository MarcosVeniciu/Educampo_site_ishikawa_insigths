module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  
  // Ensina o Jest a entender o atalho "@/" do TypeScript
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.css$': 'identity-obj-proxy',
  },
  
  // Limpa os mocks automaticamente entre um teste e outro
  clearMocks: true,
  
  // Diz ao Jest para usar o ts-jest para compilar os arquivos TypeScript/React
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
};