import fetch from 'node-fetch';

import TestServer from '../lib/TestServer';

describe('TestServer class', () => {
  test('it should exist', () => {
    expect(TestServer).toBeDefined();
  });

  test('it should return something when instantiated', () => {
    expect(new TestServer()).toBeDefined();
  });

  test('it is instantiated with port configured to 3000 by default', () => {
    const testServer = new TestServer();
    expect(testServer.getPort()).toBe(3000);
  });

  test('it can be instantiated with a specific port number', () => {
    const testServer = new TestServer(2345);
    expect(testServer.getPort()).toBe(2345);
  });

  test('it can start an http server on the default port', async () => {
    const testServer = new TestServer();
    await testServer.listen();
    const { status } = await fetch('http://localhost:3000');
    expect(status).toBe(200);
    await testServer.close();
  });

  test('it can start an http server on a specified port', async () => {
    const testServer = new TestServer(9000);
    await testServer.listen();
    const { status } = await fetch('http://localhost:9000');
    expect(status).toBe(200);
    await testServer.close();
  });
});
