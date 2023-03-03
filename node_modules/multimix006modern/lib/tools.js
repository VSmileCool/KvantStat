(function() {
  //###########################################################################################################
  var CND, alert, badge, debug, echo, help, info, isa, log, rpr, type_of, types, urge, warn, whisper;

  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MULTIMIX/TOOLS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  types = require('./types');

  ({isa, type_of} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  this.normalize_tag = function(tag) {
    var R, i, len, t;
    if (!isa.list(tag)) {
      /* Given a single string or a list of strings, return a new list that contains all whitespace-delimited
       words in the strings */
      return this.normalize_tag([tag]);
    }
    R = [];
    for (i = 0, len = tag.length; i < len; i++) {
      t = tag[i];
      if (t.length === 0) {
        continue;
      }
      R.splice(R.length, 0, ...(t.split(/\s+/)));
    }
    /* TAINT consider to return `@unique R` instead */
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.unique = function(list) {
    /* Return a copy of `list´ that only contains the last occurrence of each value */
    /* TAINT consider to modify, not copy `list` */
    var R, element, i, idx, ref, seen;
    seen = new Set();
    R = [];
    for (idx = i = ref = list.length - 1; i >= 0; idx = i += -1) {
      element = list[idx];
      if (seen.has(element)) {
        continue;
      }
      seen.add(element);
      R.unshift(element);
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.append = function(a, b) {
    /* Append elements of list `b` to list `a` */
    /* TAINT JS has `[]::concat` */
    a.splice(a.length, 0, ...b);
    return a;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.meld = function(list, value) {
    /* When `value` is a list, `@append` it to `list`; else, `push` `value` to `list` */
    if (isa.list(value)) {
      this.append(list, value);
    } else {
      list.push(value);
    }
    return list;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.fuse = function(list) {
    /* Flatten `list`, then apply `@unique` to it. Does not copy `list` but modifies it */
    var R, element, i, len;
    R = [];
    for (i = 0, len = list.length; i < len; i++) {
      element = list[i];
      this.meld(R, element);
    }
    R = this.unique(R);
    list.splice(0, list.length, ...R);
    return list;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.reduce_tag = function(raw) {
    var R, exclude, i, idx, ref, source, tag;
    source = this.fuse(raw);
    R = [];
    exclude = null;
//.........................................................................................................
    for (idx = i = ref = source.length - 1; i >= 0; idx = i += -1) {
      tag = source[idx];
      if ((exclude != null) && exclude.has(tag)) {
        continue;
      }
      if (tag.startsWith('-')) {
        if (tag === '-*') {
          break;
        }
        (exclude != null ? exclude : exclude = new Set()).add(tag.slice(1));
        continue;
      }
      R.unshift(tag);
    }
    //.........................................................................................................
    return R;
  };

}).call(this);

//# sourceMappingURL=tools.js.map