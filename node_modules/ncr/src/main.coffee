



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr.bind CND
badge                     = 'NCR'
log                       = CND.get_logger 'plain',   badge
info                      = CND.get_logger 'info',    badge
alert                     = CND.get_logger 'alert',   badge
debug                     = CND.get_logger 'debug',   badge
warn                      = CND.get_logger 'warn',    badge
urge                      = CND.get_logger 'urge',    badge
whisper                   = CND.get_logger 'whisper', badge
help                      = CND.get_logger 'help',    badge
echo                      = CND.echo.bind CND
#...........................................................................................................
@_input_default           = 'plain'
# @_input_default           = 'ncr'
# @_input_default           = 'xncr'
#...........................................................................................................
Multimix                  = require 'multimix006modern'
@cloak                    = ( require './cloak' ).new()
@_aggregate               = null
@_ISL                     = require 'interskiplist'
@unicode_isl              = do =>
  R = @_ISL.new()
  @_ISL.add_index R, 'rsg'
  @_ISL.add_index R, 'tag'
  @_ISL.add R, interval for interval in require '../data/unicode-9.0.0-intervals.json'
  @_aggregate = @_ISL.aggregate.use R
  return R
types                     = require './types'
{ isa
  validate
  type_of }               = types.export()


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@_copy_library = ( input_default = 'plain' ) ->
  ### TAINT makeshift method until we have something better; refer to
  `tests[ "(v2) create derivatives of NCR (2)" ]` for example usage ###
  reducers =
    fallback:    'assign'
    fields:
      unicode_isl: ( values ) => @_ISL.copy @unicode_isl
  #.........................................................................................................
  mix             = ( require 'multimix006modern' ).mix.use reducers
  R               = mix @, { _input_default: input_default, }
  R._aggregate    = R._ISL.aggregate.use R.unicode_isl
  #.........................................................................................................
  return R


#===========================================================================================================
# CLOAK
#-----------------------------------------------------------------------------------------------------------
@_XXX_escape_chrs                 = ( text ) => @cloak.backslashed.hide  @cloak.hide               text
@_XXX_unescape_escape_chrs        = ( text ) => @cloak.reveal            @cloak.backslashed.reveal text
@_XXX_remove_escaping_backslashes = ( text ) => @cloak.backslashed.remove text


#===========================================================================================================
# SPLIT TEXT INTO CHARACTERS
#-----------------------------------------------------------------------------------------------------------
@chrs_from_esc_text = ( text, settings ) ->
  R           = []
  parts       = text.split /// \\ ( [ ^ . ] ) ///
  is_escaped  = true
  for part in parts
    if is_escaped = not is_escaped
      ### almost ###
      R.push part
      continue
    chrs = @chrs_from_text part, settings
    chrs.pop() if chrs[ chrs.length - 1 ] is '\\'
    R.splice R.length, 0, chrs...
  #.........................................................................................................
  return R

#-----------------------------------------------------------------------------------------------------------
@chrs_from_text = ( text, settings ) ->
  return [] if text.length is 0
  #.........................................................................................................
  switch input_mode = settings?[ 'input' ] ? @_input_default
    when 'plain'  then splitter = @_plain_splitter
    when 'ncr'    then splitter = @_ncr_splitter
    when 'xncr'   then splitter = @_xncr_splitter
    else throw new Error "unknown input mode: #{rpr input_mode}"
  #.........................................................................................................
  return ( text.split splitter ).filter ( element, idx ) -> return element.length isnt 0

#-----------------------------------------------------------------------------------------------------------
@_new_chunk = ( csg, rsg, chrs ) ->
  R =
    '~isa':     'NCR/chunk'
    'csg':      csg
    'rsg':      rsg
    # 'chrs':     chrs
    'text':     chrs.join ''
  #.........................................................................................................
  return R

#-----------------------------------------------------------------------------------------------------------
@chunks_from_text = ( text, settings ) ->
  ### Given a `text` and `settings` (of which `csg` is irrelevant here), return a list of `NCR/chunk`
  objects (as returned by `NCR._new_chunk`) that describes stretches of characters with codepoints in the
  same 'range' (Unicode block).
  ###
  R           = []
  return R if text.length is 0
  last_csg    = 'u'
  last_rsg    = null
  chrs        = []
  #.........................................................................................................
  switch output_mode = settings?[ 'output' ] ? @_input_default
    when 'plain'
      transform_output = ( chr ) ->
        return chr
    when 'html'
      transform_output = ( chr ) ->
        return switch chr
          when '&' then '&amp;'
          when '<' then '&lt;'
          when '>' then '&gt;'
          else chr
    else
      throw new Error "unknown output mode: #{rpr output_mode}"
  #.........................................................................................................
  for chr in @chrs_from_text text, settings
    description = @analyze chr, settings
    { csg
      rsg }     = description
    chr         = description[ if csg is 'u' then 'chr' else 'ncr' ]
    if rsg isnt last_rsg
      R.push @_new_chunk last_csg, last_rsg, chrs if chrs.length > 0
      last_csg    = csg
      last_rsg    = rsg
      chrs        = []
    #.......................................................................................................
    chrs.push transform_output chr
  #.........................................................................................................
  R.push @_new_chunk last_csg, last_rsg, chrs if chrs.length > 0
  return R

#-----------------------------------------------------------------------------------------------------------
@html_from_text = ( text, settings ) ->
  R = []
  #.........................................................................................................
  input_mode  = settings?[ 'input' ] ? @_input_default
  chunks      = @chunks_from_text text, input: input_mode, output: 'html'
  for chunk in chunks
    R.push """<span class="#{chunk[ 'rsg' ] ? chunk[ 'csg' ]}">#{chunk[ 'text' ]}</span>"""
  #.........................................................................................................
  return R.join ''

#===========================================================================================================
# CONVERTING TO CID
#-----------------------------------------------------------------------------------------------------------
@cid_from_chr = ( chr, settings ) ->
  input_mode = settings?[ 'input' ] ? @_input_default
  return ( @_chr_csg_cid_from_chr chr, input_mode )[ 2 ]

#-----------------------------------------------------------------------------------------------------------
@csg_cid_from_chr = ( chr, settings ) ->
  input_mode = settings?[ 'input' ] ? @_input_default
  return ( @_chr_csg_cid_from_chr chr, input_mode )[ 1 .. ]

#-----------------------------------------------------------------------------------------------------------
@_chr_csg_cid_from_chr = ( chr, input_mode ) ->
  ### Given a text with one or more characters, return the first character, its CSG, and its CID (as a
  non-negative integer). Additionally, an input mode may be given as either `plain`, `ncr`, or `xncr`.
  ###
  #.........................................................................................................
  throw new Error "unable to obtain CID from empty string" if chr.length is 0
  #.........................................................................................................
  input_mode ?= 'plain'
  switch input_mode
    when 'plain'  then matcher = @_first_chr_matcher_plain
    when 'ncr'    then matcher = @_first_chr_matcher_ncr
    when 'xncr'   then matcher = @_first_chr_matcher_xncr
    else throw new Error "unknown input mode: #{rpr input_mode}"
  #.........................................................................................................
  match     = chr.match matcher
  throw new Error "illegal character sequence in #{rpr chr}" unless match?
  first_chr = match[ 0 ]
  #.........................................................................................................
  switch first_chr.length
    #.......................................................................................................
    when 1
      return [ first_chr, 'u', first_chr.charCodeAt 0 ]
    #.......................................................................................................
    when 2
      ### thx to http://perldoc.perl.org/Encode/Unicode.html ###
      hi  = first_chr.charCodeAt 0
      lo  = first_chr.charCodeAt 1
      cid = ( hi - 0xD800 ) * 0x400 + ( lo - 0xDC00 ) + 0x10000
      return [ first_chr, 'u', cid ]
    #.......................................................................................................
    else
      [ chr
        csg
        cid_hex
        cid_dec ] = match
      cid = if cid_hex? then parseInt cid_hex, 16 else parseInt cid_dec, 10
      csg = 'u' if csg.length is 0
      return [ first_chr, csg, cid ]


# #-----------------------------------------------------------------------------------------------------------
# @cid_from_ncr = ( ) ->

# #-----------------------------------------------------------------------------------------------------------
# @cid_from_xncr = ( ) ->

# #-----------------------------------------------------------------------------------------------------------
# @cid_from_fncr = ( ) ->


#===========================================================================================================
# CONVERTING FROM CID &c
#-----------------------------------------------------------------------------------------------------------
@as_csg         = ( cid_hint, O ) -> return ( @_csg_cid_from_hint cid_hint, O )[ 0 ]
@as_cid         = ( cid_hint, O ) -> return ( @_csg_cid_from_hint cid_hint, O )[ 1 ]
#...........................................................................................................
@as_chr         = ( cid_hint, O ) -> return @_as_chr.apply        @, @_csg_cid_from_hint cid_hint, O
@as_uchr        = ( cid_hint, O ) -> return @_as_uchr.apply       @, @_csg_cid_from_hint cid_hint, O
@as_fncr        = ( cid_hint, O ) -> return @_as_fncr.apply       @, @_csg_cid_from_hint cid_hint, O
@as_sfncr       = ( cid_hint, O ) -> return @_as_sfncr.apply      @, @_csg_cid_from_hint cid_hint, O
@as_xncr        = ( cid_hint, O ) -> return @_as_xncr.apply       @, @_csg_cid_from_hint cid_hint, O
@as_ncr         = ( cid_hint, O ) -> return @_as_xncr.apply       @, @_csg_cid_from_hint cid_hint, O
@as_rsg         = ( cid_hint, O ) -> return @_as_rsg.apply        @, @_csg_cid_from_hint cid_hint, O
@as_range_name  = ( cid_hint, O ) -> return @_as_range_name.apply @, @_csg_cid_from_hint cid_hint, O
#...........................................................................................................
@analyze        = ( cid_hint, O ) -> return @_analyze.apply       @, @_csg_cid_from_hint cid_hint, O

#-----------------------------------------------------------------------------------------------------------
@_analyze = ( csg, cid ) ->
  if csg is 'u'
    chr         = @_unicode_chr_from_cid cid
    ncr = xncr  = @_as_xncr csg, cid
  else
    chr         = @_as_xncr csg, cid
    xncr        = @_as_xncr csg, cid
    ncr         = @_as_xncr 'u', cid
  #.........................................................................................................
  R =
    '~isa':     'NCR/info'
    'chr':      chr
    'uchr':     @_unicode_chr_from_cid cid
    'csg':      csg
    'cid':      cid
    'fncr':     @_as_fncr  csg, cid
    'sfncr':    @_as_sfncr csg, cid
    'ncr':      ncr
    'xncr':     xncr
    'rsg':      @_as_rsg   csg, cid
  #.........................................................................................................
  return R

#-----------------------------------------------------------------------------------------------------------
@_as_chr = ( csg, cid ) ->
  return @_unicode_chr_from_cid cid if csg is 'u'
  return ( @_analyze csg, cid )[ 'chr' ]

#-----------------------------------------------------------------------------------------------------------
@_as_uchr = ( csg, cid ) ->
  return @_unicode_chr_from_cid cid

#-----------------------------------------------------------------------------------------------------------
@_unicode_chr_from_cid = ( cid ) ->
  return null unless 0x000000 <= cid <= 0x10ffff
  return String.fromCodePoint cid
  # ### thx to http://perldoc.perl.org/Encode/Unicode.html ###
  # hi = ( Math.floor ( cid - 0x10000 ) / 0x400 ) + 0xD800
  # lo =              ( cid - 0x10000 ) % 0x400   + 0xDC00
  # return ( String.fromCharCode hi ) + ( String.fromCharCode lo )

#-----------------------------------------------------------------------------------------------------------
@_as_fncr = ( csg, cid ) ->
  rsg = ( @_as_rsg csg, cid ) ? csg
  return "#{rsg}-#{cid.toString 16}"

#-----------------------------------------------------------------------------------------------------------
@_as_sfncr = ( csg, cid ) ->
  return "#{csg}-#{cid.toString 16}"

#-----------------------------------------------------------------------------------------------------------
@_as_xncr = ( csg, cid ) ->
  csg = '' if csg is 'u' or not csg?
  return "&#{csg}#x#{cid.toString 16};"

#-----------------------------------------------------------------------------------------------------------
@_as_rsg = ( csg, cid ) ->
  return csg unless csg is 'u'
  return ( @_aggregate cid )[ 'rsg' ] ? csg

#-----------------------------------------------------------------------------------------------------------
@_as_range_name = ( csg, cid ) ->
  return @_as_rsg csg, cid unless csg is 'u'
  return ( @_aggregate cid )[ 'block' ] ? ( @_as_rsg csg, cid )


#===========================================================================================================
# ANALYZE ARGUMENTS
#-----------------------------------------------------------------------------------------------------------
@_csg_cid_from_hint = ( cid_hint, settings ) ->
  ### This helper is used to derive the correct CSG and CID from arguments as accepted by the `as_*` family
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

  ###
  #.........................................................................................................
  switch type = type_of settings
    when 'null', 'undefined'
      csg_of_options  = null
      input_mode      = null
    when 'object'
      csg_of_options  = settings[ 'csg' ]
      input_mode      = settings[ 'input' ]
    else
      throw new Error "expected an object as second argument, got a #{type}"
  #.........................................................................................................
  switch type = type_of cid_hint
    when 'float'
      csg_of_cid_hint = null
      cid             = cid_hint
    when 'text'
      [ csg_of_cid_hint
        cid             ] = @csg_cid_from_chr cid_hint, input: input_mode
    else
      throw new Error "expected a text or a number as first argument, got a #{type}"
  #.........................................................................................................
  if csg_of_options?
    csg = csg_of_options
  else if csg_of_cid_hint?
    csg = csg_of_cid_hint
  else
    csg = 'u'
  #.........................................................................................................
  # @validate_is_csg csg
  @validate_cid csg, cid
  return [ csg, cid, ]


#===========================================================================================================
# PATTERNS
#-----------------------------------------------------------------------------------------------------------
# G: grouped
# O: optional
name                      = ( /// (?:     [a-z][a-z0-9]*     ) /// ).source
# nameG                     = ( /// (   (?: [a-z][a-z0-9]* ) | ) /// ).source
nameO                     = ( /// (?: (?: [a-z][a-z0-9]* ) | ) /// ).source
nameOG                    = ( /// (   (?: [a-z][a-z0-9]* ) | ) /// ).source
hex                       = ( /// (?: x   [a-fA-F0-9]+       ) /// ).source
hexG                      = ( /// (?: x  ([a-fA-F0-9]+)      ) /// ).source
dec                       = ( /// (?:     [      0-9]+       ) /// ).source
decG                      = ( /// (?:    ([      0-9]+)      ) /// ).source
#...........................................................................................................
@_csg_matcher             = /// ^ #{name} $ ///
@_ncr_matcher             = /// (?: &           \# (?: #{hex}  | #{dec}  ) ; ) ///
@_xncr_matcher            = /// (?: & #{nameO}  \# (?: #{hex}  | #{dec}  ) ; ) ///
@_ncr_csg_cid_matcher     = /// (?: & ()        \# (?: #{hexG} | #{decG} ) ; ) ///
@_xncr_csg_cid_matcher    = /// (?: & #{nameOG} \# (?: #{hexG} | #{decG} ) ; ) ///
#...........................................................................................................
### Matchers for surrogate sequences and non-surrogate, 'ordinary' characters: ###
@_surrogate_matcher       = /// (?: [  \ud800-\udbff ] [ \udc00-\udfff ] ) ///
@_nonsurrogate_matcher    = ///     [^ \ud800-\udbff     \udc00-\udfff ]   ///
#...........................................................................................................
### Matchers for the first character of a string, in three modes (`plain`, `ncr`, `xncr`): ###
@_first_chr_matcher_plain = /// ^ (?: #{@_surrogate_matcher.source}     |
                                      #{@_nonsurrogate_matcher.source}    ) ///
@_first_chr_matcher_ncr   = /// ^ (?: #{@_surrogate_matcher.source}     |
                                      #{@_ncr_csg_cid_matcher.source}   |
                                      #{@_nonsurrogate_matcher.source}    ) ///
@_first_chr_matcher_xncr  = /// ^ (?: #{@_surrogate_matcher.source}     |
                                      #{@_xncr_csg_cid_matcher.source}  |
                                      #{@_nonsurrogate_matcher.source}    ) ///
#...........................................................................................................
@_plain_splitter          = /// ( #{@_surrogate_matcher.source}     |
                                  #{@_nonsurrogate_matcher.source}    ) ///
@_ncr_splitter            = /// ( #{@_ncr_matcher.source}           |
                                  #{@_surrogate_matcher.source}     |
                                  #{@_nonsurrogate_matcher.source}    ) ///
@_xncr_splitter           = /// ( #{@_xncr_matcher.source}          |
                                  #{@_surrogate_matcher.source}     |
                                  #{@_nonsurrogate_matcher.source}    ) ///


# #-----------------------------------------------------------------------------------------------------------
# @cid_range_from_rsg = ( rsg ) ->
#   # [ csg, ... ] = rsg.split '-'
#   unless ( R = @_ranges_by_rsg[ rsg ] )?
#     throw new Error "unknown RSG: #{rpr rsg}"
#   return R

# #-----------------------------------------------------------------------------------------------------------
# @validate_is_csg = ( x ) ->
#   validate.text x
#   throw new Error "not a valid CSG: #{rpr x}" unless ( x.match @_csg_matcher )?
#   throw new Error "unknown CSG: #{rpr x}"     unless @_names_and_ranges_by_csg[ x ]?
#   return null

#-----------------------------------------------------------------------------------------------------------
@validate_cid = ( csg, cid ) ->
  validate.float cid
  throw new Error "expected an integer, got #{cid}" unless cid is Math.floor cid
  throw new Error "expected a positive integer, got #{cid}" unless cid >= 0
  if ( csg is 'u' ) and not ( 0x000000 <= cid <= 0x10ffff )
    throw new Error "expected an integer between 0x000000 and 0x10ffff, got 0x#{cid.toString 16}"
  return null


# #===========================================================================================================
# class @XXX_Ncr extends Multimix
#   @include  @,  { overwrite: true, } # instance methods
#   # @include  @,  { overwrite: false, } # instance methods
#   # @extend   @,  { overwrite: false, } # class methods

#   #---------------------------------------------------------------------------------------------------------
#   constructor: ( input_default = 'plain' ) ->
#     super()
#     debug '^44443^', ( k for k of @ )
#     return undefined
