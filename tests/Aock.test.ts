import Aock from '../lib/Aock';

describe('Aock Class', () => {
  test('it should exist', () => {
    expect(Aock).toBeDefined();
  });

  test('it should return something when instantiated', () => {
    expect(new Aock()).toBeDefined();
  });
});