
/**
 * Module dependencies.
 */

var repl = require('repl')
  , Fiber = require('fibers')
  , Future = require('fibers/future');

/**
 * Expose `console`.
 */

module.exports = console;

/**
 * Start a new interactive repl.
 */

function console(options){
  options || (options = {});
  options.env || (options.env = 'development');

  function evaluate(cmd, ctx, filename, fn) {
    Fiber(function(){
      try {
        fn(null, eval.call(ctx, cmd));
      } catch (err) {
        fn(err);
      }
    }).run();
  }

  var context = repl.start({
      prompt: 'tower> '
      // XXX: use http://nodejs.org/api/vm.html
    , useGlobal: true
    , eval: evaluate
  }).context;

  context.exit = function(){
    process.exit(0);
  };

  process.nextTick(function(){
    context.Future = Future;
    context.Fiber  = Fiber;
    // XXX: replace this with just `require('tower')` soon.
    context.model = require('tower-model');
    context.query = require('tower-query');
    context.adapter = require('tower-adapter');
    context.text = require('tower-inflector');
  });
}