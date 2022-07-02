global.console = {
  warn: jest.fn(),
  debug: console.debug,
  trace: console.trace,
  log:console.log
  // map other methods that you want to use like console.table
}