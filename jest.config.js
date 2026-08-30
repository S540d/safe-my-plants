/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],

  // Ohne collectCoverageFrom misst Jest nur Dateien, die ein Test berührt.
  // Der Threshold unten wäre damit wirkungslos: er würde von der einen
  // getesteten Datei erfüllt, egal wie viel ungetesteter Code dazukommt
  // (Issue #138 – gemeldet wurden 84 %, real waren es 2,6 %).
  collectCoverageFrom: ['app/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}', '!**/*.test.{ts,tsx}', '!**/*.d.ts'],

  // Ehrlicher Startwert auf Basis des tatsächlichen Stands. Bewusst niedrig
  // angesetzt, damit die Schwelle real greift statt symbolisch dazustehen –
  // schrittweise anheben, wenn Tests dazukommen.
  coverageThreshold: {
    global: {
      statements: 5,
      branches: 5,
      functions: 3,
      lines: 4,
    },
  },
}
