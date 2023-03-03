(function() {
  //###########################################################################################################
  var CND, TOOLS, alert, badge, debug, echo, help, info, isa, log, rpr, type_of, types, urge, warn, whisper, σ_finalize, σ_new_state, σ_reject,
    indexOf = [].indexOf;

  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MULTIMIX/RECIPES';

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
  TOOLS = require('./tools');

  //...........................................................................................................
  σ_new_state = Symbol.for('new_state');

  σ_reject = Symbol.for('reject');

  σ_finalize = Symbol.for('finalize');

  types = require('./types');

  ({isa, type_of} = types.export());

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this[σ_new_state] = function(recipe, mixins) {
    var S, fields, key, reducer, ref;
    S = {};
    S.recipe = recipe != null ? CND.deep_copy(recipe) : {};
    S.mixins = mixins;
    S.recipe_fallback = (ref = S.recipe['fallback']) != null ? ref : 'assign';
    //.........................................................................................................
    S.cache = {};
    S.averages = {};
    S.tag_keys = [];
    // S.skip              = new Set()
    S.functions = {};
    S.path = null;
    S.root = null;
    S.current = null;
    S.seen = new Map();
    //.........................................................................................................
    if ((fields = S.recipe['fields']) != null) {
      for (key in fields) {
        reducer = fields[key];
        if (reducer === 'include') {
          fields[key] = S.recipe_fallback;
          continue;
        }
        if (reducer === 'tag') {
          S.tag_keys.push(key);
          continue;
        }
        if (isa.function(reducer)) {
          S.functions[key] = reducer;
          fields[key] = 'function';
        }
      }
    }
    //.........................................................................................................
    return S;
  };

  //-----------------------------------------------------------------------------------------------------------
  this[σ_finalize] = function(S) {
    var count, key, method, ref, ref1, ref2, sum, value, values;
    ref = S.current;
    /* tags */
    for (key in ref) {
      value = ref[key];
      if (indexOf.call(S.tag_keys, key) < 0) {
        continue;
      }
      S.current[key] = TOOLS.reduce_tag(S.current[key]);
    }
    ref1 = S.averages;
    //.........................................................................................................
    /* averages */
    for (key in ref1) {
      [sum, count] = ref1[key];
      S.current[key] = sum / count;
    }
    ref2 = S.cache;
    //.........................................................................................................
    /* functions */
    for (key in ref2) {
      values = ref2[key];
      if (!isa.function((method = S.functions[key]))) {
        throw new Error(`not a function for key ${rpr(key)}: ${rpr(method)}`);
      }
      S.current[key] = method(values, S);
    }
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this[σ_reject] = function(S, key, value) {
    // return ( S.skip.has key ) or ( value is undefined and S.recipe_name isnt 'assign' )
    return value === void 0 && S.recipe_name !== 'assign';
  };

  //===========================================================================================================
  // RECIPES
  //-----------------------------------------------------------------------------------------------------------
  this.assign = function(S, key, value) {
    if (value === void 0) {
      delete S.current[key];
    } else {
      S.current[key] = value;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.skip = function(S, key, value) {
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.merge = function(S, key, value) {
    var base, sub_key, sub_value, target;
    if (!isa.object(value)) {
      throw new Error(`expected a POD, got a ${type_of(value)}`);
    }
    target = ((base = S.current)[key] != null ? base[key] : base[key] = {});
    for (sub_key in value) {
      sub_value = value[sub_key];
      target[sub_key] = sub_value;
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.append = function(S, key, value) {
    /* TAINT consider to use `Symbol.isConcatSpreadable` in the future */
    var base, target;
    target = ((base = S.current)[key] != null ? base[key] : base[key] = []);
    if (isa.list) {
      target.splice(target.length, 0, ...value);
    } else {
      target.push(value);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.list = function(S, key, value) {
    var base;
    ((base = S.current)[key] != null ? base[key] : base[key] = []).push(value);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.add = function(S, key, value) {
    var ref;
    S.current[key] = ((ref = S.current[key]) != null ? ref : 0) + value;
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.average = function(S, key, value) {
    var base, target;
    target = (base = S.averages)[key] != null ? base[key] : base[key] = [0, 0];
    target[0] = target[0] + value;
    target[1] = target[1] + 1;
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.tag = function(S, key, value) {
    var base, target;
    TOOLS.meld((target = (base = S.current)[key] != null ? base[key] : base[key] = []), value);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.function = function(S, key, value) {
    var base;
    /* Cache current value for later processing by `σ_finalize`: */
    ((base = S.cache)[key] != null ? base[key] : base[key] = []).push(value);
    return null;
  };

}).call(this);

//# sourceMappingURL=recipes.js.map