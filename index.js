
/**
 * Module dependencies.
 */

var repl = require('repl')
  , Fiber = require('fibers')
  , Future = require('fibers/future');

/**
 * Expose `shell`.
 */

module.exports = shell;

/**
 * Start a new interactive repl.
 */

function shell(options){
  options || (options = {});
  options.env || (options.env = 'development');

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
    context.route = require('tower-route');
  });
}

/**
 * Evaluate stdin synchronously.
 */

function evaluate(cmd, ctx, filename, fn) {
  Fiber(function(){
    try {
      fn(null, eval.call(ctx, cmd));
    } catch (err) {
      fn(err);
    }
  }).run();
}