// import { IncomingMessage, ServerResponse } from 'http';

// const ALLOWED_METHODS = ['post', 'get', 'patch', 'put', 'delete']
// const [POST, GET, PATCH, PUT, DELETE] = [...ALLOWED_METHODS];

// interface SObject {
//   [key: string]: string;
// }
// interface TestCondition {
//   (): boolean;
// }

// class Test {
//   private _url: string;
//   private _method: string = GET;
//   private _path?: string;
//   private _headers?: SObject;
//   private _query?: SObject;
//   private _testConditions?: TestCondition[];

//   constructor(url: string) {
//     this._url = url;
//   }

//   private _validateUrl() {
//     if (!this._url) {
//       throw new Error('RequestTest must have set the url');
//     }
//     return true;
//   }

//   public url(url: string) {
//     this._url = url;
//     return this
//   }

//   public path(path: string) {
//     this._path = path;
//     return this;
//   }

//   public method(method: string) {
//     this._method = method;
//     return this;
//   }

//   public headers(headers: SObject) {
//     this._headers = headers;
//     return this;
//   }

//   public query(query: SObject) {
//     this._query = query;
//     return this;
//   }

//   public listener() {
//     this._validateUrl();
//     return function testFn(req: IncomingMessage, res: ServerResponse) {
//       if (req.url && req.url === this._url)
//     }
//   }
// }

// export default Test;
