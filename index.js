
/**
 * Module dependencies.
 */

var repl = require('repl')
  , Fiber = require('fibers')
  , Future = require('fibers/future');

/**
 * Expose console.
 */

module.exports = function(options){
  options = options || {};
  options.env = options.env || 'development';

  // Tower.ModelCursor.include Tower.ModelCursorSync if @program.synchronous
  // app = Tower.Application.instance()
  // app.isConsole = true
  // app.initialize()
  // app.stack()
  // app.watch() if Tower.watch
  // app.initializeConsoleHooks()

  function evaluate(cmd, context, filename, fn) {
    Fiber(function(){
      try {
        fn(null, eval.call(context, cmd));
      } catch (err) {
        fn(err);
      }
    }).run();
  }

  var context = repl.start({
      prompt: 'tower> '
    , context: this
    , eval: evaluate
  }).context;

  //context.Tower  = Tower;
  context.Future = Future;
  context.Fiber  = Fiber;

  context.reload = function(){
    // context[Tower.namespace()] = app;
  };

  context.exit = function(){
    process.exit(0);
  };

  process.nextTick(context.reload);
}