import EventEmitter from 'events';

import TestServer from './TestServer';

interface Emitter {
  name: string;
  event: EventEmitter;
  evaluate: () => boolean;
}

class Aock {
  private _emitters: Emitter[] = [];
  private _testServer: TestServer;

  constructor() {
    this._testServer = new TestServer();
  }

  public createTest(name: string, testFn: () => boolean): void {
    const emitter = new EventEmitter();
    this._emitters.push({ name, event: emitter, evaluate: testFn });
    // this._testServer.addListener()
  }

  public deleteEvent(name: string): void {
    const emitterIdx = this._emitters.findIndex(emitter => emitter.name === name);
    // const emitter = this._emitters[emitterIdx];
    this._emitters.splice(emitterIdx, 1);
  }

  public start(): void {
    this._testServer.listen();
  }
}

export default Aock;
