(function() {
  //###########################################################################################################
  var CND, Multimix, alert, badge, debug, dec, decG, echo, help, hex, hexG, info, isa, log, name, nameO, nameOG, rpr, type_of, types, urge, validate, warn, whisper;

  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'NCR';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  urge = CND.get_logger('urge', badge);

  whisper = CND.get_logger('whisper', badge);

  help = CND.get_logger('help', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  this._input_default = 'plain';

  // @_input_default           = 'ncr'
  // @_input_default           = 'xncr'
  //...........................................................................................................
  Multimix = require('multimix006modern');

  this.cloak = (require('./cloak')).new();

  this._aggregate = null;

  this._ISL = require('interskiplist');

  this.unicode_isl = (() => {
    var R, i, interval, len, ref;
    R = this._ISL.new();
    this._ISL.add_index(R, 'rsg');
    this._ISL.add_index(R, 'tag');
    ref = require('../data/unicode-9.0.0-intervals.json');
    for (i = 0, len = ref.length; i < len; i++) {
      interval = ref[i];
      this._ISL.add(R, interval);
    }
    this._aggregate = this._ISL.aggregate.use(R);
    return R;
  })();

  types = require('./types');

  ({isa, validate, type_of} = types.export());

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this._copy_library = function(input_default = 'plain') {
    /* TAINT makeshift method until we have something better; refer to
     `tests[ "(v2) create derivatives of NCR (2)" ]` for example usage */
    var R, mix, reducers;
    reducers = {
      fallback: 'assign',
      fields: {
        unicode_isl: (values) => {
          return this._ISL.copy(this.unicode_isl);
        }
      }
    };
    //.........................................................................................................
    mix = (require('multimix006modern')).mix.use(reducers);
    R = mix(this, {
      _input_default: input_default
    });
    R._aggregate = R._ISL.aggregate.use(R.unicode_isl);
    //.........................................................................................................
    return R;
  };

  //===========================================================================================================
  // CLOAK
  //-----------------------------------------------------------------------------------------------------------
  this._XXX_escape_chrs = (text) => {
    return this.cloak.backslashed.hide(this.cloak.hide(text));
  };

  this._XXX_unescape_escape_chrs = (text) => {
    return this.cloak.reveal(this.cloak.backslashed.reveal(text));
  };

  this._XXX_remove_escaping_backslashes = (text) => {
    return this.cloak.backslashed.remove(text);
  };

  //===========================================================================================================
  // SPLIT TEXT INTO CHARACTERS
  //-----------------------------------------------------------------------------------------------------------
  this.chrs_from_esc_text = function(text, settings) {
    var R, chrs, i, is_escaped, len, part, parts;
    R = [];
    parts = text.split(/\\([^.])/);
    is_escaped = true;
    for (i = 0, len = parts.length; i < len; i++) {
      part = parts[i];
      if (is_escaped = !is_escaped) {
        /* almost */
        R.push(part);
        continue;
      }
      chrs = this.chrs_from_text(part, settings);
      if (chrs[chrs.length - 1] === '\\') {
        chrs.pop();
      }
      R.splice(R.length, 0, ...chrs);
    }
    //.........................................................................................................
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.chrs_from_text = function(text, settings) {
    var input_mode, ref, splitter;
    if (text.length === 0) {
      return [];
    }
    //.........................................................................................................
    switch (input_mode = (ref = settings != null ? settings['input'] : void 0) != null ? ref : this._input_default) {
      case 'plain':
        splitter = this._plain_splitter;
        break;
      case 'ncr':
        splitter = this._ncr_splitter;
        break;
      case 'xncr':
        splitter = this._xncr_splitter;
        break;
      default:
        throw new Error(`unknown input mode: ${rpr(input_mode)}`);
    }
    //.........................................................................................................
    return (text.split(splitter)).filter(function(element, idx) {
      return element.length !== 0;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._new_chunk = function(csg, rsg, chrs) {
    var R;
    R = {
      '~isa': 'NCR/chunk',
      'csg': csg,
      'rsg': rsg,
      // 'chrs':     chrs
      'text': chrs.join('')
    };
    //.........................................................................................................
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.chunks_from_text = function(text, settings) {
    /* Given a `text` and `settings` (of which `csg` is irrelevant here), return a list of `NCR/chunk`
     objects (as returned by `NCR._new_chunk`) that describes stretches of characters with codepoints in the
     same 'range' (Unicode block).
     */
    var R, chr, chrs, csg, description, i, last_csg, last_rsg, len, output_mode, ref, ref1, rsg, transform_output;
    R = [];
    if (text.length === 0) {
      return R;
    }
    last_csg = 'u';
    last_rsg = null;
    chrs = [];
    //.........................................................................................................
    switch (output_mode = (ref = settings != null ? settings['output'] : void 0) != null ? ref : this._input_default) {
      case 'plain':
        transform_output = function(chr) {
          return chr;
        };
        break;
      case 'html':
        transform_output = function(chr) {
          switch (chr) {
            case '&':
              return '&amp;';
            case '<':
              return '&lt;';
            case '>':
              return '&gt;';
            default:
              return chr;
          }
        };
        break;
      default:
        throw new Error(`unknown output mode: ${rpr(output_mode)}`);
    }
    ref1 = this.chrs_from_text(text, settings);
    //.........................................................................................................
    for (i = 0, len = ref1.length; i < len; i++) {
      chr = ref1[i];
      description = this.analyze(chr, settings);
      ({csg, rsg} = description);
      chr = description[csg === 'u' ? 'chr' : 'ncr'];
      if (rsg !== last_rsg) {
        if (chrs.length > 0) {
          R.push(this._new_chunk(last_csg, last_rsg, chrs));
        }
        last_csg = csg;
        last_rsg = rsg;
        chrs = [];
      }
      //.......................................................................................................
      chrs.push(transform_output(chr));
    }
    if (chrs.length > 0) {
      //.........................................................................................................
      R.push(this._new_chunk(last_csg, last_rsg, chrs));
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.html_from_text = function(text, settings) {
    var R, chunk, chunks, i, input_mode, len, ref, ref1;
    R = [];
    //.........................................................................................................
    input_mode = (ref = settings != null ? settings['input'] : void 0) != null ? ref : this._input_default;
    chunks = this.chunks_from_text(text, {
      input: input_mode,
      output: 'html'
    });
    for (i = 0, len = chunks.length; i < len; i++) {
      chunk = chunks[i];
      R.push(`<span class="${(ref1 = chunk['rsg']) != null ? ref1 : chunk['csg']}">${chunk['text']}</span>`);
    }
    //.........................................................................................................
    return R.join('');
  };

  //===========================================================================================================
  // CONVERTING TO CID
  //-----------------------------------------------------------------------------------------------------------
  this.cid_from_chr = function(chr, settings) {
    var input_mode, ref;
    input_mode = (ref = settings != null ? settings['input'] : void 0) != null ? ref : this._input_default;
    return (this._chr_csg_cid_from_chr(chr, input_mode))[2];
  };

  //-----------------------------------------------------------------------------------------------------------
  this.csg_cid_from_chr = function(chr, settings) {
    var input_mode, ref;
    input_mode = (ref = settings != null ? settings['input'] : void 0) != null ? ref : this._input_default;
    return (this._chr_csg_cid_from_chr(chr, input_mode)).slice(1);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._chr_csg_cid_from_chr = function(chr, input_mode) {
    /* thx to http://perldoc.perl.org/Encode/Unicode.html */
    var cid, cid_dec, cid_hex, csg, first_chr, hi, lo, match, matcher;
    if (chr.length === 0) {
      /* Given a text with one or more characters, return the first character, its CSG, and its CID (as a
       non-negative integer). Additionally, an input mode may be given as either `plain`, `ncr`, or `xncr`.
       */
      //.........................................................................................................
      throw new Error("unable to obtain CID from empty string");
    }
    //.........................................................................................................
    if (input_mode == null) {
      input_mode = 'plain';
    }
    switch (input_mode) {
      case 'plain':
        matcher = this._first_chr_matcher_plain;
        break;
      case 'ncr':
        matcher = this._first_chr_matcher_ncr;
        break;
      case 'xncr':
        matcher = this._first_chr_matcher_xncr;
        break;
      default:
        throw new Error(`unknown input mode: ${rpr(input_mode)}`);
    }
    //.........................................................................................................
    match = chr.match(matcher);
    if (match == null) {
      throw new Error(`illegal character sequence in ${rpr(chr)}`);
    }
    first_chr = match[0];
    //.........................................................................................................
    switch (first_chr.length) {
      //.......................................................................................................
      case 1:
        return [first_chr, 'u', first_chr.charCodeAt(0)];
      //.......................................................................................................
      case 2:
        hi = first_chr.charCodeAt(0);
        lo = first_chr.charCodeAt(1);
        cid = (hi - 0xD800) * 0x400 + (lo - 0xDC00) + 0x10000;
        return [first_chr, 'u', cid];
      default:
        //.......................................................................................................
        [chr, csg, cid_hex, cid_dec] = match;
        cid = cid_hex != null ? parseInt(cid_hex, 16) : parseInt(cid_dec, 10);
        if (csg.length === 0) {
          csg = 'u';
        }
        return [first_chr, csg, cid];
    }
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @cid_from_ncr = ( ) ->

  // #-----------------------------------------------------------------------------------------------------------
  // @cid_from_xncr = ( ) ->

  // #-----------------------------------------------------------------------------------------------------------
  // @cid_from_fncr = ( ) ->

  //===========================================================================================================
  // CONVERTING FROM CID &c
  //-----------------------------------------------------------------------------------------------------------
  this.as_csg = function(cid_hint, O) {
    return (this._csg_cid_from_hint(cid_hint, O))[0];
  };

  this.as_cid = function(cid_hint, O) {
    return (this._csg_cid_from_hint(cid_hint, O))[1];
  };

  //...........................................................................................................
  this.as_chr = function(cid_hint, O) {
    return this._as_chr.apply(this, this._csg_cid_from_hint(cid_hint, O));
  };

  this.as_uchr = function(cid_hint, O) {
    return this._as_uchr.apply(this, this._csg_cid_from_hint(cid_hint, O));
  };

  this.as_fncr = function(cid_hint, O) {
    return this._as_fncr.apply(this, this._csg_cid_from_hint(cid_hint, O));
  };

  this.as_sfncr = function(cid_hint, O) {
    return this._as_sfncr.apply(this, this._csg_cid_from_hint(cid_hint, O));
  };

  this.as_xncr = function(cid_hint, O) {
    return this._as_xncr.apply(this, this._csg_cid_from_hint(cid_hint, O));
  };

  this.as_ncr = function(cid_hint, O) {
    return this._as_xncr.apply(this, this._csg_cid_from_hint(cid_hint, O));
  };

  this.as_rsg = function(cid_hint, O) {
    return this._as_rsg.apply(this, this._csg_cid_from_hint(cid_hint, O));
  };

  this.as_range_name = function(cid_hint, O) {
    return this._as_range_name.apply(this, this._csg_cid_from_hint(cid_hint, O));
  };

  //...........................................................................................................
  this.analyze = function(cid_hint, O) {
    return this._analyze.apply(this, this._csg_cid_from_hint(cid_hint, O));
  };

  //-----------------------------------------------------------------------------------------------------------
  this._analyze = function(csg, cid) {
    var R, chr, ncr, xncr;
    if (csg === 'u') {
      chr = this._unicode_chr_from_cid(cid);
      ncr = xncr = this._as_xncr(csg, cid);
    } else {
      chr = this._as_xncr(csg, cid);
      xncr = this._as_xncr(csg, cid);
      ncr = this._as_xncr('u', cid);
    }
    //.........................................................................................................
    R = {
      '~isa': 'NCR/info',
      'chr': chr,
      'uchr': this._unicode_chr_from_cid(cid),
      'csg': csg,
      'cid': cid,
      'fncr': this._as_fncr(csg, cid),
      'sfncr': this._as_sfncr(csg, cid),
      'ncr': ncr,
      'xncr': xncr,
      'rsg': this._as_rsg(csg, cid)
    };
    //.........................................................................................................
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._as_chr = function(csg, cid) {
    if (csg === 'u') {
      return this._unicode_chr_from_cid(cid);
    }
    return (this._analyze(csg, cid))['chr'];
  };

  //-----------------------------------------------------------------------------------------------------------
  this._as_uchr = function(csg, cid) {
    return this._unicode_chr_from_cid(cid);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._unicode_chr_from_cid = function(cid) {
    if (!((0x000000 <= cid && cid <= 0x10ffff))) {
      return null;
    }
    return String.fromCodePoint(cid);
  };

  // ### thx to http://perldoc.perl.org/Encode/Unicode.html ###
  // hi = ( Math.floor ( cid - 0x10000 ) / 0x400 ) + 0xD800
  // lo =              ( cid - 0x10000 ) % 0x400   + 0xDC00
  // return ( String.fromCharCode hi ) + ( String.fromCharCode lo )

  //-----------------------------------------------------------------------------------------------------------
  this._as_fncr = function(csg, cid) {
    var ref, rsg;
    rsg = (ref = this._as_rsg(csg, cid)) != null ? ref : csg;
    return `${rsg}-${cid.toString(16)}`;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._as_sfncr = function(csg, cid) {
    return `${csg}-${cid.toString(16)}`;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._as_xncr = function(csg, cid) {
    if (csg === 'u' || (csg == null)) {
      csg = '';
    }
    return `&${csg}#x${cid.toString(16)};`;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._as_rsg = function(csg, cid) {
    var ref;
    if (csg !== 'u') {
      return csg;
    }
    return (ref = (this._aggregate(cid))['rsg']) != null ? ref : csg;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._as_range_name = function(csg, cid) {
    var ref;
    if (csg !== 'u') {
      return this._as_rsg(csg, cid);
    }
    return (ref = (this._aggregate(cid))['block']) != null ? ref : this._as_rsg(csg, cid);
  };

  //===========================================================================================================
  // ANALYZE ARGUMENTS
  //-----------------------------------------------------------------------------------------------------------
  this._csg_cid_from_hint = function(cid_hint, settings) {
    var cid, csg, csg_of_cid_hint, csg_of_options, input_mode, type;
    /* This helper is used to derive the correct CSG and CID from arguments as accepted by the `as_*` family
    of methods, such as `NCR.as_fncr`, `NCR.as_rsg` and so on; its output may be directly applied to the
    respective namesake private method (`NCR._as_fncr`, `NCR._as_rsg` and so on). The method arguments should
    obey the following rules:

    * Methods may be called with one or two arguments; the first is known as the 'CID hint', the second as
      'settings'.

    * The CID hint may be a number or a text; if it is a number, it is understood as a CID; if it
      is a text, its interpretation is subject to the `settings[ 'input' ]` setting.

    * Options must be an object with the optional members `input` and `csg`.

    * `settings[ 'input' ]` is *only* observed if the CID hint is a text; it governs which kinds of character
      references are recognized in the text. `input` may be one of `plain`, `ncr`, or `xncr`; it defaults to
      `plain` (no character references will be recognized).

    * `settings[ 'csg' ]` sets the character set sigil. If `csg` is set in the settings, then it will override
      whatever the outcome of `NCR.csg_cid_from_chr` w.r.t. CSG is—in other words, if you call
      `NCR.as_sfncr '&jzr#xe100', input: 'xncr', csg: 'u'`, you will get `u-e100`, with the numerically
      equivalent codepoint from the `u` (Unicode) character set.

    * Before CSG and CID are returned, they will be validated for plausibility.

     */
    //.........................................................................................................
    switch (type = type_of(settings)) {
      case 'null':
      case 'undefined':
        csg_of_options = null;
        input_mode = null;
        break;
      case 'object':
        csg_of_options = settings['csg'];
        input_mode = settings['input'];
        break;
      default:
        throw new Error(`expected an object as second argument, got a ${type}`);
    }
    //.........................................................................................................
    switch (type = type_of(cid_hint)) {
      case 'float':
        csg_of_cid_hint = null;
        cid = cid_hint;
        break;
      case 'text':
        [csg_of_cid_hint, cid] = this.csg_cid_from_chr(cid_hint, {
          input: input_mode
        });
        break;
      default:
        throw new Error(`expected a text or a number as first argument, got a ${type}`);
    }
    //.........................................................................................................
    if (csg_of_options != null) {
      csg = csg_of_options;
    } else if (csg_of_cid_hint != null) {
      csg = csg_of_cid_hint;
    } else {
      csg = 'u';
    }
    //.........................................................................................................
    // @validate_is_csg csg
    this.validate_cid(csg, cid);
    return [csg, cid];
  };

  //===========================================================================================================
  // PATTERNS
  //-----------------------------------------------------------------------------------------------------------
  // G: grouped
  // O: optional
  name = /(?:[a-z][a-z0-9]*)/.source;

  // nameG                     = ( /// (   (?: [a-z][a-z0-9]* ) | ) /// ).source
  nameO = /(?:(?:[a-z][a-z0-9]*)|)/.source;

  nameOG = /((?:[a-z][a-z0-9]*)|)/.source;

  hex = /(?:x[a-fA-F0-9]+)/.source;

  hexG = /(?:x([a-fA-F0-9]+))/.source;

  dec = /(?:[0-9]+)/.source;

  decG = /(?:([0-9]+))/.source;

  //...........................................................................................................
  this._csg_matcher = RegExp(`^${name}$`);

  this._ncr_matcher = RegExp(`(?:&\\#(?:${hex}|${dec});)`);

  this._xncr_matcher = RegExp(`(?:&${nameO}\\#(?:${hex}|${dec});)`);

  this._ncr_csg_cid_matcher = RegExp(`(?:&()\\#(?:${hexG}|${decG});)`);

  this._xncr_csg_cid_matcher = RegExp(`(?:&${nameOG}\\#(?:${hexG}|${decG});)`);

  //...........................................................................................................
  /* Matchers for surrogate sequences and non-surrogate, 'ordinary' characters: */
  this._surrogate_matcher = /(?:[\ud800-\udbff][\udc00-\udfff])/;

  this._nonsurrogate_matcher = /[^\ud800-\udbff\udc00-\udfff]/;

  //...........................................................................................................
  /* Matchers for the first character of a string, in three modes (`plain`, `ncr`, `xncr`): */
  this._first_chr_matcher_plain = RegExp(`^(?:${this._surrogate_matcher.source}|${this._nonsurrogate_matcher.source})`);

  this._first_chr_matcher_ncr = RegExp(`^(?:${this._surrogate_matcher.source}|${this._ncr_csg_cid_matcher.source}|${this._nonsurrogate_matcher.source})`);

  this._first_chr_matcher_xncr = RegExp(`^(?:${this._surrogate_matcher.source}|${this._xncr_csg_cid_matcher.source}|${this._nonsurrogate_matcher.source})`);

  //...........................................................................................................
  this._plain_splitter = RegExp(`(${this._surrogate_matcher.source}|${this._nonsurrogate_matcher.source})`);

  this._ncr_splitter = RegExp(`(${this._ncr_matcher.source}|${this._surrogate_matcher.source}|${this._nonsurrogate_matcher.source})`);

  this._xncr_splitter = RegExp(`(${this._xncr_matcher.source}|${this._surrogate_matcher.source}|${this._nonsurrogate_matcher.source})`);

  // #-----------------------------------------------------------------------------------------------------------
  // @cid_range_from_rsg = ( rsg ) ->
  //   # [ csg, ... ] = rsg.split '-'
  //   unless ( R = @_ranges_by_rsg[ rsg ] )?
  //     throw new Error "unknown RSG: #{rpr rsg}"
  //   return R

  // #-----------------------------------------------------------------------------------------------------------
  // @validate_is_csg = ( x ) ->
  //   validate.text x
  //   throw new Error "not a valid CSG: #{rpr x}" unless ( x.match @_csg_matcher )?
  //   throw new Error "unknown CSG: #{rpr x}"     unless @_names_and_ranges_by_csg[ x ]?
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  this.validate_cid = function(csg, cid) {
    validate.float(cid);
    if (cid !== Math.floor(cid)) {
      throw new Error(`expected an integer, got ${cid}`);
    }
    if (!(cid >= 0)) {
      throw new Error(`expected a positive integer, got ${cid}`);
    }
    if ((csg === 'u') && !((0x000000 <= cid && cid <= 0x10ffff))) {
      throw new Error(`expected an integer between 0x000000 and 0x10ffff, got 0x${cid.toString(16)}`);
    }
    return null;
  };

  // #===========================================================================================================
// class @XXX_Ncr extends Multimix
//   @include  @,  { overwrite: true, } # instance methods
//   # @include  @,  { overwrite: false, } # instance methods
//   # @extend   @,  { overwrite: false, } # class methods

  //   #---------------------------------------------------------------------------------------------------------
//   constructor: ( input_default = 'plain' ) ->
//     super()
//     debug '^44443^', ( k for k of @ )
//     return undefined

}).call(this);

//# sourceMappingURL=main.js.map