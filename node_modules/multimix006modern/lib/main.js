(function() {
  //###########################################################################################################
  var CND, MULTIMIX, alert, badge, debug, echo, help, info, isa, join, log, rpr, type_of, types, urge, warn, whisper, σ_finalize, σ_new_state, σ_reject, σ_unknown_type;

  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MULTIMIX';

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
  ({join} = require('path'));

  //...........................................................................................................
  σ_new_state = Symbol.for('new_state');

  σ_reject = Symbol.for('reject');

  σ_finalize = Symbol.for('finalize');

  σ_unknown_type = Symbol.for('unknown_type');

  //...........................................................................................................
  MULTIMIX = {};

  MULTIMIX.TOOLS = require('./tools');

  MULTIMIX.RECIPES = require('./recipes');

  MULTIMIX.COPIERS = require('./copiers');

  types = require('./types');

  ({isa, type_of} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  MULTIMIX._get_seed = function(S, seed) {
    var copy, description, has_fields, type;
    type = type_of(seed);
    description = MULTIMIX.COPIERS.type_descriptions[type];
    if (description == null) {
      description = MULTIMIX.COPIERS.type_descriptions[σ_unknown_type];
    }
    ({has_fields, copy} = description);
    return copy.call(MULTIMIX, S, seed);
  };

  //-----------------------------------------------------------------------------------------------------------
  MULTIMIX.mix = function(mixins, recipe, root = null, selector = []) {
    var S, field_key, field_value, fields, hook, i, len, mixin, mixin_seed, mixin_tail, mx_key, mx_value, partial_mixins, ref, ref1, ref2, seed, type;
    if (mixins.length === 0) {
      //.........................................................................................................
      return null;
    }
    [mixin_seed, ...mixin_tail] = mixins;
    S = MULTIMIX.RECIPES[σ_new_state](recipe, mixins);
    seed = MULTIMIX._get_seed(S, mixin_seed);
    S.seed = seed;
    if (root == null) {
      root = seed;
    }
    // ### !!! experimental !!! ###
    // for mixin, mixin_idx in mixins
    //   mixins[ mixin_idx ] = { '': mixin, }
    //.........................................................................................................
    /* TAINT this part needs to be rewritten */
    /* Deal with nested recipe first: */
    if ((fields = S.recipe['fields']) != null) {
      for (field_key in fields) {
        field_value = fields[field_key];
        if (!isa.object(field_value)) {
          continue;
        }
        selector.push(field_key);
        partial_mixins = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = mixins.length; i < len; i++) {
            mixin = mixins[i];
            if (mixin[field_key]) {
              results.push(mixin[field_key]);
            }
          }
          return results;
        })();
        // partial_mixins = []
        // for mixin in mixins
        //   partial_mixin = mixin[ field_key ]
        //   partial_mixins.push partial_mixin if partial_mixin?
        if (partial_mixins.length > 0) {
          // debug '30211', selector, field_value, partial_mixins
          S.seed[field_key] = MULTIMIX.mix(partial_mixins, field_value, root, selector);
        }
        S.recipe[field_key] = 'skip';
        selector.pop(field_key);
      }
    }
//.........................................................................................................
/* Process unnested recipe: */
    for (i = 0, len = mixins.length; i < len; i++) {
      mixin = mixins[i];
// urge '33415', mixin
      for (mx_key in mixin) {
        mx_value = mixin[mx_key];
        S.path = join(...selector, mx_key);
        S.root = root;
        S.current = S.seed;
        S.recipe_name = (ref = (ref1 = S.recipe['fields']) != null ? ref1[mx_key] : void 0) != null ? ref : S.recipe_fallback;
        if (isa.object(S.recipe_name)) {
          continue;
        }
        if (MULTIMIX.RECIPES[σ_reject](S, mx_key, mx_value)) {
          continue;
        }
        if ((recipe = MULTIMIX.RECIPES[S.recipe_name]) == null) {
          throw new Error(`unknown recipe ${rpr(S.recipe_name)}`);
        }
        recipe.call(MULTIMIX.RECIPES, S, mx_key, mx_value);
      }
    }
    //.........................................................................................................
    MULTIMIX.RECIPES[σ_finalize](S);
    //.........................................................................................................
    if ((hook = (ref2 = S.recipe) != null ? ref2['after'] : void 0) != null) {
      if ((type = type_of(hook)) !== 'function') {
        throw new Error(`expected function for 'after' hook, got a ${type}`);
      }
      hook(S);
    }
    //.........................................................................................................
    // S.path    = null
    // S.root    = null
    // S.current = null
    // debug '30221', S
    return S.seed;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  MULTIMIX.use = function(...recipes) {
    var R, recipe;
    recipes.splice(0, 0, {
      'fallback': 'assign'
    });
    recipe = MULTIMIX.mix(recipes);
    R = function(...mixins) {
      return MULTIMIX.mix(mixins, recipe);
    };
    R.use = MULTIMIX.use;
    // R.TOOLS             = MULTIMIX.TOOLS
    // R.RECIPES           = MULTIMIX.RECIPES
    // R.COPIERS           = MULTIMIX.COPIERS
    // R.type_descriptions = MULTIMIX.type_descriptions
    // R._get_seed         = MULTIMIX._get_seed
    // R.deep_copy         = ( x ) -> CND.deep_copy x
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  module.exports = {
    mix: MULTIMIX.use()
  };

}).call(this);

//# sourceMappingURL=main.js.map