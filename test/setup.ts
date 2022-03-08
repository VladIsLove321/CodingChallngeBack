process.env.ENV = "TEST";
process.env.SECRET = "mySecret";

afterEach(() => {
  jest.clearAllMocks();
});
