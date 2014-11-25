var config = require('./config');

(function() {
  var stlog = require('./helpers/log');
  var _ = require('./lodash');

  var stLocales = {
    en: {
      general: {
        'delete':           'Delete?',
        'drop':             'Drag __block__ here',
        'paste':            'Or paste URL here',
        'upload':           '...or choose a file',
        'close':            'close',
        'position':         'Position',
        'wait':             'Please wait...',
        'link':             'Enter a link'
      },
      errors: {
        'title': "You have the following errors:",
        'validation_fail': "__type__ block is invalid",
        'block_empty': "__name__ must not be empty",
        'type_missing': "You must have a block of type __type__",
        'required_type_empty': "A required block type __type__ is empty",
        'load_fail': "There was a problem loading the contents of the document"
      },
      blocks: {
        text: {
          'title': "Text"
        },
        list: {
          'title': "List"
        },
        quote: {
          'title': "Quote",
          'credit_field': "Credit"
        },
        image: {
          'title': "Image",
          'upload_error': "There was a problem with your upload"
        },
        video: {
          'title': "Video"
        },
        tweet: {
          'title': "Tweet",
          'fetch_error': "There was a problem fetching your tweet"
        },
        embedly: {
          'title': "Embedly",
          'fetch_error': "There was a problem fetching your embed",
          'key_missing': "An Embedly API key must be present"
        },
        heading: {
          'title': "Heading"
        }
      }
    }
  };

  if (window.i18n === undefined || window.i18n.init === undefined) {
    // Minimal i18n stub that only reads the English strings
    stlog("Using i18n stub");
    window.i18n = {
      t: function(key, options) {
        var parts = key.split(':'), str, obj, part, i;

        obj = stLocales[config.language];

        for(i = 0; i < parts.length; i++) {
          part = parts[i];

          if(!_.isUndefined(obj[part])) {
            obj = obj[part];
          }
        }

        str = obj;

        if (!_.isString(str)) { return ""; }

        if (str.indexOf('__') >= 0) {
          Object.keys(options).forEach(function(opt) {
            str = str.replace('__' + opt + '__', options[opt]);
          });
        }

        return str;
      }
    };
  } else {
    stlog("Using i18next");
    // Only use i18next when the library has been loaded by the user, keeps
    // dependencies slim
    i18n.init({ resStore: stLocales, fallbackLng: config.language,
              ns: { namespaces: ['general', 'blocks'], defaultNs: 'general' }
    });
  }

  return stLocales;
})();
