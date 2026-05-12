import '@testing-library/jest-dom';

if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => 'test-id-' + Math.random().toString(16).slice(2),
    },
  });
}

if (!globalThis.crypto.randomUUID) {
  Object.defineProperty(globalThis.crypto, 'randomUUID', {
    value: () => 'test-id-' + Math.random().toString(16).slice(2),
  });
}
