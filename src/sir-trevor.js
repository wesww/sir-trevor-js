var $ = require('jquery');
var _ = require('./lodash');

require('./helpers/event'); // extends jQuery itself
require('./vendor/array-includes'); // shims ES7 Array.prototype.includes

var SirTrevor = {
  config: require('./config'),
};

SirTrevor.BlockMixins = require('./block_mixins');

SirTrevor.Blocks = {};
SirTrevor.Formatters = {};

SirTrevor.log = require('./helpers/log');
SirTrevor.Locales = require('./locales');

// Extensions
SirTrevor.editorStore = require('./extensions/sir-trevor.editor-store');
SirTrevor.Submittable = require('./extensions/sir-trevor.submittable');
SirTrevor.fileUploader = require('./extensions/sir-trevor.uploader');

SirTrevor.BlockPositioner = require('./block.positioner');
SirTrevor.BlockReorder = require('./block.reorder');
SirTrevor.BlockDeletion = require('./block.deletion');
SirTrevor.BlockValidations = require('./block.validations');
SirTrevor.BlockStore = require('./block.store');

SirTrevor.SimpleBlock = require('./simple-block');
SirTrevor.Block = require('./block');
SirTrevor.Formatter = require('./formatter');
SirTrevor.Formatters = require('./formatters');

SirTrevor.Blocks = require('./blocks');

SirTrevor.BlockControl = require('./block-control');
SirTrevor.BlockControls = require('./block-controls');
SirTrevor.FloatingBlockControls = require('./floating-block-controls');

SirTrevor.FormatBar = require('./format-bar');
SirTrevor.Editor = require('./sir-trevor-editor');

/* We need a form handler here to handle all the form submits */
SirTrevor.setDefaults = function(options) {
  config.defaults = Object.assign(config.defaults, options || {});
};

var formBound = false; // Flag to tell us once we've bound our submit event
SirTrevor.bindFormSubmit = function(form) {
  if (!formBound) {
    new SirTrevor.Submittable(form);
    form.on('submit.sirtrevor', this.onFormSubmit);
    formBound = true;
  }
};

SirTrevor.onBeforeSubmit = function(should_validate) {
  // Loop through all of our instances and do our form submits on them
  var errors = 0;
  SirTrevor.config.instances.forEach(function(inst, i) {
    errors += inst.onFormSubmit(should_validate);
  });
  SirTrevor.log("Total errors: " + errors);

  return errors;
};

SirTrevor.onFormSubmit = function(ev) {
  var errors = SirTrevor.onBeforeSubmit();

  if(errors > 0) {
    eventBus.trigger("onError");
    ev.preventDefault();
  }
};

SirTrevor.getInstance = function(identifier) {
  if (_.isUndefined(identifier)) {
    return this.config.instances[0];
  }

  if (_.isString(identifier)) {
    return this.config.instances.find(function(editor) {
      return editor.ID === identifier;
    });
  }

  return this.config.instances[identifier];
};

SirTrevor.setBlockOptions = function(type, options) {
  var block = SirTrevor.Blocks[type];

  if (_.isUndefined(block)) {
    return;
  }

  Object.assign(block.prototype, options || {});
};

SirTrevor.runOnAllInstances = function(method) {
  if (SirTrevor.Editor.prototype.hasOwnProperty(method)) {
    var methodArgs = Array.prototype.slice.call(arguments, 1);
    Array.prototype.forEach.call(SirTrevor.config.instances, function(i) {
      i[method].apply(null, methodArgs)
    });
  } else {
    SirTrevor.log("method doesn't exist");
  }
};

module.exports = SirTrevor;
