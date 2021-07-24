const ts = new TestServer(3000);
ts.addTest(RequestTest()
  .post('/abc')
  .body({ foo: 'bar' })
  .query({})
  .headers({})
  .assert((req) => { req === req})
  .reply({})
)

ts.done()
ts.close