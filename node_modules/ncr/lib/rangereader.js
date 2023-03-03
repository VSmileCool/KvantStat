(function() {
  //###########################################################################################################
  // njs_util                  = require 'util'
  var $, $async, CND, D, FS, PATH, RR, add_comments_to_intervals, alert, append_tag, badge, debug, echo, extras_range_pattern, help, info, interval_from_block_name, interval_from_range_match, interval_from_rsg, isa, log, resolve, resolve_extras, resolve_ucd, rpr, step, type_of, types, ucd_range_pattern, urge, validate, warn, whisper;

  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'NCR/RANGEREADER';

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
  D = require('pipedreams');

  ({$, $async} = D);

  require('pipedreams/lib/plugin-tsv');

  // require 'pipedreams/lib/plugin-tabulate'
  //...........................................................................................................
  ({step} = require('coffeenode-suspend'));

  types = require('./types');

  ({isa, validate, type_of} = types.export());

  //===========================================================================================================
  // PATTERNS
  //-----------------------------------------------------------------------------------------------------------
  ucd_range_pattern = /^([0-9a-f]{4,6})\.\.([0-9a-f]{4,6});[\x20\t]+(.+)$/i; // Start of line
  // ... hexadecimal number with 4 to 6 digits
  // ... range marker: two full stops
  // ... hexadecimal number with 4 to 6 digits
  // ... semicolon
  // ... mandatory whitespace
  // ... anything (text content)
  // ... end of line

  //-----------------------------------------------------------------------------------------------------------
  extras_range_pattern = /^\^([0-9a-f]{1,6})(?:\.\.([0-9a-f]{1,6}))?$/i; // Start of line
  // ... a caret
  // ... hexadecimal number with 1 to 6 digits
  // (start optional)
  // ... range marker: two full stops
  // ... hexadecimal number with 1 to 6 digits
  // (end optional)
  // ... end of line

  //===========================================================================================================
  // HELPERS
  //-----------------------------------------------------------------------------------------------------------
  resolve = function(path) {
    return PATH.resolve(__dirname, '..', path);
  };

  resolve_ucd = function(path) {
    return resolve(PATH.join('../ncr-unicode-data-ucd-9.0.0', path));
  };

  resolve_extras = function(path) {
    return resolve(PATH.join('data', path));
  };

  //-----------------------------------------------------------------------------------------------------------
  interval_from_block_name = function(S, rsg, block_name) {
    var R;
    if ((R = S.interval_by_names[block_name]) == null) {
      throw new Error(`RSG ${rsg}: unknown Unicode block ${rpr(block_name)}`);
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  interval_from_rsg = function(S, rsg) {
    var R;
    if ((R = S.interval_by_rsgs[rsg]) == null) {
      // debug '4020', S.interval_by_rsgs
      throw new Error(`unknown RSG ${rpr(rsg)}`);
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  add_comments_to_intervals = function(S) {
    var comment, hex, hi, i, interval, len, lo, ref, ref1;
    hex = function(n) {
      return 'U+' + n.toString(16);
    };
    ref = S.intervals;
    for (i = 0, len = ref.length; i < len; i++) {
      interval = ref[i];
      ({lo, hi} = interval);
      comment = (ref1 = interval['comment']) != null ? ref1 : '';
      interval['comment'] = `(${hex(lo)}..${hex(hi)}) ${comment}`.trim();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  interval_from_range_match = function(S, match) {
    var _, hi, hi_hex, lo, lo_hex;
    [_, lo_hex, hi_hex] = match;
    lo = parseInt(lo_hex, 16);
    hi = ((hi_hex != null) && hi_hex.length > 0) ? parseInt(hi_hex, 16) : lo;
    return {lo, hi};
  };

  //-----------------------------------------------------------------------------------------------------------
  append_tag = function(S, interval, tag) {
    var target;
    if ((target = interval['tag']) != null) {
      if (isa.list(target)) {
        target.push(tag);
      } else {
        interval['tag'] = [target, tag];
      }
    } else {
      interval['tag'] = [tag];
    }
    return null;
  };

  //===========================================================================================================
  // HELPER TRANSFORMS
  //-----------------------------------------------------------------------------------------------------------
  this.$show = (S) => {
    return $((x) => {
      return urge(JSON.stringify(x));
    });
  };

  this.$split_multi_blank_sv = function(S) {
    return D.$split_tsv({
      splitter: /\t{1,}|[\x20\t]{2,}/g
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.read_block_names = function(S, handler) {
    var input, path, type;
    path = resolve_ucd('Blocks.txt');
    input = D.new_stream({path});
    type = 'block';
    S.interval_by_names = {};
    //.........................................................................................................
    // .pipe D.$sample 1 / 10, seed: 872
    input.pipe(D.$split_tsv()).pipe(this.$block_interval_from_line(S)).pipe($((interval) => {
      var name;
      ({
        [`${type}`]: name
      } = interval);
      S.interval_by_names[name] = interval;
      return S.intervals.push(interval);
    // .pipe @$show S
    })).pipe($('finish', handler));
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$block_interval_from_line = (S) => {
    var type;
    type = 'block';
    return $(([line], send) => {
      var _, hi, hi_hex, lo, lo_hex, match, name, short_name;
      match = line.match(ucd_range_pattern);
      if (match == null) {
        return send.error(new Error(`not a valid line: ${rpr(line)}`));
      }
      [_, lo_hex, hi_hex, short_name] = match;
      lo = parseInt(lo_hex, 16);
      hi = parseInt(hi_hex, 16);
      name = `${type}:${short_name}`;
      return send({
        lo,
        hi,
        name,
        type: type,
        [`${type}`]: short_name
      });
    });
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.read_assigned_codepoints = function(S, handler) {
    var input, path;
    path = resolve_ucd('UnicodeData.txt');
    input = D.new_stream({path});
    //.........................................................................................................
    input.pipe(D.$split_tsv({
      splitter: ';'
    })).pipe($((fields, send) => {
      return send([fields[0], fields[1]]);
    })).pipe($(([cid_hex, name], send) => {
      return send([parseInt(cid_hex, 16), name]);
    })).pipe(this.$collect_intervals(S)).pipe($(({lo, hi}, send) => {
      return send({
        lo,
        hi,
        tag: 'assigned'
      });
    // .pipe $ ( { lo, hi, }, send ) => send { lo, hi, tag: '-unassigned assigned', }
    // .pipe $ 'start', ( send ) => send { lo: 0x000000, hi: 0x10ffff, tag: 'unassigned', }
    })).pipe($((interval) => {
      return S.intervals.push(interval);
    // .pipe $ 'finish', handler
    })).pipe($('finish', () => {
      return handler();
    }));
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$collect_intervals = function(S) {
    var last_cid, last_hi, last_interval_start, last_lo;
    last_interval_start = null;
    last_cid = null;
    last_lo = null;
    last_hi = null;
    return $('null', (entry, send) => {
      var cid, hi, lo, name;
      //.......................................................................................................
      if (entry != null) {
        [cid, name] = entry;
        //.....................................................................................................
        if ((name !== '<control>') && (name.startsWith('<'))) {
          /* Explicit ranges are marked by `<XXXXX, First>` for the first and `<XXXXX, Last>` for the last
                 CID; these can be dealt with in a simplified manner: */
          //...................................................................................................
          if (name.endsWith('First>')) {
            if (last_interval_start != null) {
              return send.error(new Error(`unexpected start of range ${rpr(name)}`));
            }
            last_interval_start = cid;
          //...................................................................................................
          } else if (name.endsWith('Last>')) {
            if (last_interval_start == null) {
              return send.error(new Error(`unexpected end of range ${rpr(name)}`));
            }
            lo = last_interval_start;
            last_interval_start = null;
            hi = cid;
            send({lo, hi});
          } else {
            /* Any entry whose name starts with a `<` (less-than sign) should either have the symbolic
                     name of '<control>' or else demarcate a range boundary; everything else is an error: */
            //...................................................................................................
            return send.error(new Error(`unexpected name ${rpr(name)}`));
          }
        } else {
          /* Single point entries */
          /* TAINT Code duplication with `INTERVALSKIPLIST.intervals_from_points` */
          //...................................................................................................
          //.....................................................................................................
          if (last_lo == null) {
            last_lo = cid;
            last_hi = cid;
            last_cid = cid;
            return null;
          }
          //...................................................................................................
          if (cid === last_cid + 1) {
            last_hi = cid;
            last_cid = cid;
            return null;
          }
          //...................................................................................................
          send({
            lo: last_lo,
            hi: last_hi
          });
          last_lo = cid;
          last_hi = cid;
          last_cid = cid;
        }
      } else {
        if ((last_lo != null) && (last_hi != null)) {
          //.......................................................................................................
          send({
            lo: last_lo,
            hi: last_hi
          });
        }
        send(null);
      }
      //.......................................................................................................
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.read_planes_and_areas = function(S, handler) {
    var input, path;
    path = resolve_extras('planes-and-areas.txt');
    input = D.new_stream({path});
    //.........................................................................................................
    input.pipe(this.$split_multi_blank_sv(S)).pipe(this.$read_target_interval(S)).pipe($(([{lo, hi}, type, short_name]) => {
      var interval, name;
      name = `${type}:${short_name}`;
      interval = {
        lo,
        hi,
        name,
        type: type,
        [`${type}`]: short_name
      };
      return S.intervals.push(interval);
    })).pipe($('finish', handler));
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$read_target_interval = (S) => {
    return $(([range, type, name], send) => {
      var interval, match;
      if ((match = range.match(extras_range_pattern)) == null) {
        return send.error(new Error(`illegal line format; expected range, found ${rpr(range)}`));
      }
      interval = interval_from_range_match(S, match);
      return send([interval, type, name]);
    });
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.read_rsgs_and_block_names = function(S, handler) {
    var input, path;
    path = resolve_extras('rsgs.txt');
    input = D.new_stream({path});
    S.interval_by_rsgs = {};
    //.........................................................................................................
    // .pipe D.$sample 1 / 40, seed: 872
    input.pipe(this.$split_multi_blank_sv(S)).pipe($(([rsg, block_name]) => {
      var interval;
      interval = interval_from_block_name(S, rsg, block_name);
      interval['rsg'] = rsg;
      return S.interval_by_rsgs[rsg] = interval;
    })).pipe($('finish', handler));
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.read_tags = function(S, handler) {
    var input, path;
    path = resolve_extras('tags.txt');
    input = D.new_stream({path});
    //.........................................................................................................
    input.pipe(this.$split_multi_blank_sv(S)).pipe(this.$read_rsg_or_range(S)).pipe($('finish', handler));
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.$read_rsg_or_range = (S) => {
    if (S.recycle_intervals) {
      /* When recycling intervals, tags for those intervals that are identified symbolically are added to the
         existing interval objects. When not recycling intervals, a new interval object is created for each line
         in the tagging source. This may influence how tags are resolved by `INTERVALSKIPLIST.aggregate`. */
      return $(([rsg_or_range, tag], send) => {
        var interval, match;
        if ((match = rsg_or_range.match(extras_range_pattern)) != null) {
          interval = interval_from_range_match(S, match);
          interval['tag'] = tag;
          S.intervals.push(interval);
        } else {
          interval = interval_from_rsg(S, rsg_or_range);
          append_tag(S, interval, tag);
        }
        //.....................................................................................................
        return null;
      });
    }
    //.........................................................................................................
    return $(([rsg_or_range, tag], send) => {
      var comment, hi, interval, lo, match, name, rsg;
      if ((match = rsg_or_range.match(extras_range_pattern)) != null) {
        interval = interval_from_range_match(S, match);
        interval['tag'] = tag;
      } else {
        ({
          lo,
          hi,
          rsg,
          block: name
        } = interval_from_rsg(S, rsg_or_range));
        comment = `References RSG ${rsg} (${name}).`;
        interval = {lo, hi, comment, tag};
      }
      // interval                      = { lo, hi, tag, }
      S.intervals.push(interval);
      //.....................................................................................................
      return null;
    });
  };

  //===========================================================================================================
  // MAIN
  //-----------------------------------------------------------------------------------------------------------
  this.read = function(handler) {
    var S, intervals, self;
    //.........................................................................................................
    intervals = [];
    S = {intervals};
    self = this;
    //.........................................................................................................
    step(function*(resume) {
      yield self.read_assigned_codepoints(S, resume);
      yield self.read_planes_and_areas(S, resume);
      yield self.read_block_names(S, resume);
      yield self.read_rsgs_and_block_names(S, resume);
      yield self.read_tags(S, resume);
      add_comments_to_intervals(S);
      return handler(null, S);
    });
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (module.parent == null) {
    RR = this;
    // #-----------------------------------------------------------------------------------------------------------
    // @read = ( handler ) ->
    //   @READER.read ( error, S ) =>
    //     return handler error if error?
    //     handler null, S

    // #-----------------------------------------------------------------------------------------------------------
    // @read_intervals = ( handler ) ->
    //   @read ( error, S ) =>
    //     return handler error if error?
    //     handler null, S.intervals
    RR.read((error, S) => {
      var i, interval, len, ref, results;
      if (error != null) {
        throw error;
      }
      ref = S.intervals;
      // delete S.intervals
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        interval = ref[i];
        results.push(debug('39087', interval));
      }
      return results;
    });
  }

}).call(this);

//# sourceMappingURL=rangereader.js.map