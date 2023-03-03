(function() {
  //###########################################################################################################
  var CND, COPIERS, alert, badge, debug, echo, help, info, isa, log, rpr, type_of, types, urge, warn, whisper, σ_unknown_type;

  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MULTIMIX/COPIERS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  σ_unknown_type = Symbol.for('unknown_type');

  COPIERS = this;

  types = require('./types');

  ({isa, type_of} = types.export());

  //===========================================================================================================
  // RAW COPIERS
  //-----------------------------------------------------------------------------------------------------------
  this.RAW = {};

  //-----------------------------------------------------------------------------------------------------------
  this.RAW.object = function(x, seed) {
    /* shamelessly copied from https://github.com/nrn/universal-copy */
    var R;
    R = seed != null ? seed : Object.create(Object.getPrototypeOf(x));
    /* copy properties here or put the below into a `finalize` method */
    if (Object.isFrozen(x)) {
      Object.freeze(R);
    }
    if (Object.isSealed(x)) {
      Object.seal(R);
    }
    if (!Object.isExtensible(x)) {
      Object.preventExtensions(R);
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.RAW.by_constructor = function(x) {
    /* shamelessly copied from https://github.com/nrn/universal-copy */
    var R;
    R = new x.constructor(x);
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.RAW.id = function(x) {
    return x;
  };

  this.RAW.dont = function(x) {
    throw new Error(`unable to copy value of type ${type_of(x)}`);
  };

  // @RAW.list = ( x ) -> @object x, new Array x.length
  this.RAW.list = function(x) {
    return [];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.RAW.set = function(x) {
    var R;
    R = new Set();
    x.forEach(function(value) {
      return R.add(deep_copy(x));
    });
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.RAW.map = function(x) {
    var R;
    R = new Map();
    x.forEach(function(value, key) {
      return R.set(deep_copy(key), deep_copy(value));
    });
    return R;
  };

  (function() {    //===========================================================================================================

    //-----------------------------------------------------------------------------------------------------------
    /*
      '[object Object]': copyObject,
      '[object Array]': copyArray,
      '[object Error]': justDont,
      '[object Map]': copyMap,
      '[object Set]': copySet,

      '[object Promise]': justDont,
      '[object XMLHttpRequest]': justDont,
      '[object NodeList]': copyArray,
      '[object ArrayBuffer]': copySlice,
      '[object Int8Array]': copyConstructor,
      '[object Uint8Array]': copyConstructor,
      '[object Uint8ClampedArray]': copyConstructor,
      '[object Int16Array]': copyConstructor,
      '[object Uint16Array]': copyConstructor,
      '[object Int32Array]': copyConstructor,
      '[object Uint32Array]': copyConstructor,
      '[object Float32Array]': copyConstructor,
      '[object Float64Array]': copyConstructor
    */
    //-----------------------------------------------------------------------------------------------------------
    var copy_by_constructor, copy_id, copy_list, copy_map, copy_object, copy_set, d, dont_copy, i, len, results, type_descriptions;
    //.........................................................................................................
    copy_id = function(x) {
      return COPIERS.RAW.id(x);
    };
    copy_object = function(x) {
      return COPIERS.RAW.object(x);
    };
    copy_list = function(x) {
      return COPIERS.RAW.list(x);
    };
    copy_map = function(x) {
      return COPIERS.RAW.map(x);
    };
    copy_set = function(x) {
      return COPIERS.RAW.set(x);
    };
    copy_by_constructor = function(x) {
      return COPIERS.RAW.by_constructor(x);
    };
    dont_copy = function(x) {
      return COPIERS.RAW.dont(x);
    };
    //.........................................................................................................
    type_descriptions = [
      {
        //.......................................................................................................
        type: 'boolean',
        has_fields: false,
        copy: copy_id
      },
      {
        type: 'null',
        has_fields: false,
        copy: copy_id
      },
      {
        type: 'text',
        has_fields: false,
        copy: copy_id
      },
      {
        type: 'undefined',
        has_fields: false,
        copy: copy_id
      },
      {
        type: 'infinity',
        has_fields: false,
        copy: copy_id
      },
      {
        type: 'float',
        has_fields: false,
        copy: copy_id
      },
      {
        type: 'nan',
        has_fields: false,
        copy: copy_id
      },
      {
        //.......................................................................................................
        type: 'object',
        has_fields: true,
        copy: copy_object
      },
      {
        type: 'list',
        has_fields: true,
        copy: copy_list
      },
      {
        type: 'map',
        has_fields: true,
        copy: copy_map
      },
      {
        type: 'set',
        has_fields: true,
        copy: copy_set
      },
      {
        //.......................................................................................................
        type: 'date',
        has_fields: true,
        copy: copy_by_constructor
      },
      {
        type: 'regex',
        has_fields: true,
        copy: copy_by_constructor
      },
      {
        //.......................................................................................................
        type: 'buffer',
        has_fields: true,
        copy: dont_copy
      },
      {
        type: 'arraybuffer',
        has_fields: true,
        copy: dont_copy
      },
      {
        type: 'error',
        has_fields: true,
        copy: dont_copy
      },
      {
        type: 'function',
        has_fields: true,
        copy: dont_copy
      },
      {
        type: 'symbol',
        has_fields: false,
        copy: dont_copy
      },
      {
        // These do not work at the time being:
        type: 'weakmap',
        has_fields: false,
        copy: dont_copy
      },
      {
        type: 'generator',
        has_fields: false,
        copy: dont_copy
      },
      {
        type: 'arguments',
        has_fields: false,
        copy: dont_copy
      },
      {
        type: 'global',
        has_fields: false,
        copy: dont_copy
      },
      {
        type: σ_unknown_type,
        has_fields: false,
        copy: dont_copy
      }
    ];
    //.........................................................................................................
    //.......................................................................................................
    COPIERS.type_descriptions = {};
    results = [];
    for (i = 0, len = type_descriptions.length; i < len; i++) {
      d = type_descriptions[i];
      results.push(COPIERS.type_descriptions[d['type']] = d);
    }
    return results;
  })();

}).call(this);

//# sourceMappingURL=copiers.js.map