/**
 * @fileoverview Configuração global do ambiente de testes Jest.
 * Resolve limitações do JSDOM para APIs modernas da Web (Fetch, Response, Storage).
 */

// 1. Adiciona os matchers do DOM (como toBeInTheDocument) ao Jest
import '@testing-library/jest-dom';

// 2. Polyfill para a Fetch API e classes relacionadas (Necessário para testes de API e Login)
import 'whatwg-fetch';

// Garante que fetch, Response, Request e Headers estejam disponíveis no escopo global do Node
global.fetch = fetch;
global.Response = Response;
global.Request = Request;
global.Headers = Headers;

// 3. Polyfill para TextEncoder e TextDecoder
// Essencial para testes que envolvem manipulação de strings, tokens JWT ou codificação Base64
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

/**
 * 4. Correção para o erro de Matcher nos Spies do LocalStorage/SessionStorage.
 * O JSDOM às vezes protege essas funções, impedindo o jest.spyOn de funcionar.
 * Redefinimos as propriedades para garantir que sejam "mockáveis".
 */
const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0,
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// Sobrescreve as propriedades globais com versões amigáveis ao Jest
Object.defineProperty(window, 'localStorage', {
  value: createStorageMock(),
  configurable: true,
  writable: true
});

Object.defineProperty(window, 'sessionStorage', {
  value: createStorageMock(),
  configurable: true,
  writable: true
});

// 5. Mock para o IntersectionObserver (comum em componentes de dashboard/gráficos)
// O "as any" evita o erro de compatibilidade com scrollMargin
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly scrollMargin: string = ''; // Adicionado para satisfazer versões novas do TS
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
} as any;