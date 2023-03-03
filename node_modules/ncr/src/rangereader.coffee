

############################################################################################################
# njs_util                  = require 'util'
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'NCR/RANGEREADER'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
D                         = require 'pipedreams'
{ $, $async, }            = D
require 'pipedreams/lib/plugin-tsv'
# require 'pipedreams/lib/plugin-tabulate'
#...........................................................................................................
{ step }                  = require 'coffeenode-suspend'
types                     = require './types'
{ isa
  validate
  type_of }               = types.export()


#===========================================================================================================
# PATTERNS
#-----------------------------------------------------------------------------------------------------------
ucd_range_pattern     = ///
  ^                           # Start of line
  ( [ 0-9 a-f ]{ 4, 6 } )     # ... hexadecimal number with 4 to 6 digits
  \.\.                        # ... range marker: two full stops
  ( [ 0-9 a-f ]{ 4, 6 })      # ... hexadecimal number with 4 to 6 digits
  ;                           # ... semicolon
  [ \x20 \t ]+                # ... mandatory whitespace
  ( .+ )                      # ... anything (text content)
  $                           # ... end of line
  ///i

#-----------------------------------------------------------------------------------------------------------
extras_range_pattern = ///
  ^                           # Start of line
  \^                          # ... a caret
  ( [ 0-9 a-f ]{ 1, 6 } )     # ... hexadecimal number with 1 to 6 digits
  (?:                         # (start optional)
    \.\.                        # ... range marker: two full stops
    ( [ 0-9 a-f ]{ 1, 6 } )     # ... hexadecimal number with 1 to 6 digits
    )?                          # (end optional)
  $                           # ... end of line
  ///i


#===========================================================================================================
# HELPERS
#-----------------------------------------------------------------------------------------------------------
resolve         = ( path ) -> PATH.resolve __dirname, '..',                         path
resolve_ucd     = ( path ) -> resolve PATH.join '../ncr-unicode-data-ucd-9.0.0',    path
resolve_extras  = ( path ) -> resolve PATH.join 'data',                             path

#-----------------------------------------------------------------------------------------------------------
interval_from_block_name = ( S, rsg, block_name ) ->
  unless ( R = S.interval_by_names[ block_name ] )?
    throw new Error "RSG #{rsg}: unknown Unicode block #{rpr block_name}"
  return R

#-----------------------------------------------------------------------------------------------------------
interval_from_rsg = ( S, rsg ) ->
  unless ( R = S.interval_by_rsgs[ rsg ] )?
    # debug '4020', S.interval_by_rsgs
    throw new Error "unknown RSG #{rpr rsg}"
  return R

#-----------------------------------------------------------------------------------------------------------
add_comments_to_intervals = ( S ) ->
  hex = ( n ) -> 'U+' + n.toString 16
  for interval in S.intervals
    { lo, hi, }             = interval
    comment                 = interval[ 'comment' ] ? ''
    interval[ 'comment' ]   = "(#{hex lo}..#{hex hi}) #{comment}".trim()
  return null

#-----------------------------------------------------------------------------------------------------------
interval_from_range_match = ( S, match ) ->
  [ _, lo_hex, hi_hex, ]  = match
  lo                      = parseInt lo_hex, 16
  hi                      = if ( hi_hex? and hi_hex.length > 0 ) then ( parseInt hi_hex, 16 ) else lo
  return { lo, hi, }

#-----------------------------------------------------------------------------------------------------------
append_tag = ( S, interval, tag ) ->
  if ( target = interval[ 'tag' ] )?
    if isa.list target
      target.push tag
    else
      interval[ 'tag' ] = [ target, tag, ]
  else
    interval[ 'tag' ] = [ tag, ]
  return null


#===========================================================================================================
# HELPER TRANSFORMS
#-----------------------------------------------------------------------------------------------------------
@$show                  = ( S ) => $ ( x ) => urge JSON.stringify x
@$split_multi_blank_sv  = ( S ) -> D.$split_tsv splitter: /\t{1,}|[\x20\t]{2,}/g


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@read_block_names = ( S, handler ) ->
  path                = resolve_ucd 'Blocks.txt'
  input               = D.new_stream { path, }
  type                = 'block'
  S.interval_by_names = {}
  #.........................................................................................................
  input
    .pipe D.$split_tsv()
    # .pipe D.$sample 1 / 10, seed: 872
    .pipe @$block_interval_from_line S
    .pipe $ ( interval ) =>
      { "#{type}": name, }        = interval
      S.interval_by_names[ name ] = interval
      S.intervals.push interval
    # .pipe @$show S
    .pipe $ 'finish', handler
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@$block_interval_from_line = ( S ) =>
  type    = 'block'
  return $ ( [ line, ], send ) =>
    match = line.match ucd_range_pattern
    return send.error new Error "not a valid line: #{rpr line}" unless match?
    [ _, lo_hex, hi_hex, short_name, ] = match
    lo    = parseInt lo_hex, 16
    hi    = parseInt hi_hex, 16
    name  = "#{type}:#{short_name}"
    send { lo, hi, name, type: type, "#{type}": short_name, }
  #.........................................................................................................
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@read_assigned_codepoints = ( S, handler ) ->
  path                = resolve_ucd 'UnicodeData.txt'
  input               = D.new_stream { path, }
  #.........................................................................................................
  input
    .pipe D.$split_tsv splitter: ';'
    .pipe $ ( fields,             send ) => send [ fields[ 0 ], fields[ 1 ], ]
    .pipe $ ( [ cid_hex, name, ], send ) => send [ ( parseInt cid_hex, 16 ), name, ]
    .pipe @$collect_intervals S
    .pipe $ ( { lo, hi, }, send ) => send { lo, hi, tag: 'assigned', }
    # .pipe $ ( { lo, hi, }, send ) => send { lo, hi, tag: '-unassigned assigned', }
    # .pipe $ 'start', ( send ) => send { lo: 0x000000, hi: 0x10ffff, tag: 'unassigned', }
    .pipe $ ( interval ) => S.intervals.push interval
    # .pipe $ 'finish', handler
    .pipe $ 'finish', =>
      handler()
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@$collect_intervals = ( S ) ->
  last_interval_start = null
  last_cid          = null
  last_lo             = null
  last_hi             = null
  return $ 'null', ( entry, send ) =>
    #.......................................................................................................
    if entry?
      [ cid, name, ] = entry
      #.....................................................................................................
      if ( name isnt '<control>' ) and ( name.startsWith '<' )
        ### Explicit ranges are marked by `<XXXXX, First>` for the first and `<XXXXX, Last>` for the last
        CID; these can be dealt with in a simplified manner: ###
        #...................................................................................................
        if name.endsWith 'First>'
          if last_interval_start?
            return send.error new Error "unexpected start of range #{rpr name}"
          last_interval_start = cid
        #...................................................................................................
        else if name.endsWith 'Last>'
          unless last_interval_start?
            return send.error new Error "unexpected end of range #{rpr name}"
          lo                  = last_interval_start
          last_interval_start = null
          hi                  = cid
          send { lo, hi, }
        #...................................................................................................
        else
          ### Any entry whose name starts with a `<` (less-than sign) should either have the symbolic
          name of '<control>' or else demarcate a range boundary; everything else is an error: ###
          return send.error new Error "unexpected name #{rpr name}"
      #.....................................................................................................
      else
        ### Single point entries ###
        ### TAINT Code duplication with `INTERVALSKIPLIST.intervals_from_points` ###
        #...................................................................................................
        unless last_lo?
          last_lo     = cid
          last_hi     = cid
          last_cid    = cid
          return null
        #...................................................................................................
        if cid is last_cid + 1
          last_hi     = cid
          last_cid    = cid
          return null
        #...................................................................................................
        send { lo: last_lo, hi: last_hi, }
        last_lo     = cid
        last_hi     = cid
        last_cid    = cid
    #.......................................................................................................
    else
      send { lo: last_lo, hi: last_hi, } if last_lo? and last_hi?
      send null
    #.......................................................................................................
    return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@read_planes_and_areas = ( S, handler ) ->
  path                = resolve_extras 'planes-and-areas.txt'
  input               = D.new_stream { path, }
  #.........................................................................................................
  input
    .pipe @$split_multi_blank_sv  S
    .pipe @$read_target_interval  S
    .pipe $ ( [ { lo, hi, }, type, short_name, ] ) =>
      name      = "#{type}:#{short_name}"
      interval  = { lo, hi, name, type: type, "#{type}": short_name, }
      S.intervals.push interval
    .pipe $ 'finish', handler
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@$read_target_interval = ( S ) =>
  return $ ( [ range, type, name, ], send ) =>
    unless ( match = range.match extras_range_pattern )?
      return send.error new Error "illegal line format; expected range, found #{rpr range}"
    interval = interval_from_range_match S, match
    send [ interval, type, name, ]
  #.........................................................................................................
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@read_rsgs_and_block_names = ( S, handler ) ->
  path                = resolve_extras 'rsgs.txt'
  input               = D.new_stream { path, }
  S.interval_by_rsgs  = {}
  #.........................................................................................................
  input
    .pipe @$split_multi_blank_sv S
    # .pipe D.$sample 1 / 40, seed: 872
    .pipe $ ( [ rsg, block_name, ] ) =>
      interval                  = interval_from_block_name S, rsg, block_name
      interval[ 'rsg' ]         = rsg
      S.interval_by_rsgs[ rsg ] = interval
    .pipe $ 'finish', handler
  #.........................................................................................................
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@read_tags = ( S, handler ) ->
  path                = resolve_extras 'tags.txt'
  input               = D.new_stream { path, }
  #.........................................................................................................
  input
    .pipe @$split_multi_blank_sv  S
    .pipe @$read_rsg_or_range     S
    .pipe $ 'finish', handler
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@$read_rsg_or_range = ( S ) =>
  if S.recycle_intervals
    ### When recycling intervals, tags for those intervals that are identified symbolically are added to the
    existing interval objects. When not recycling intervals, a new interval object is created for each line
    in the tagging source. This may influence how tags are resolved by `INTERVALSKIPLIST.aggregate`. ###
    return $ ( [ rsg_or_range, tag, ], send ) =>
      if ( match = rsg_or_range.match extras_range_pattern )?
        interval          = interval_from_range_match S, match
        interval[ 'tag' ] = tag
        S.intervals.push interval
      else
        interval = interval_from_rsg S, rsg_or_range
        append_tag S, interval, tag
      #.....................................................................................................
      return null
  #.........................................................................................................
  return $ ( [ rsg_or_range, tag, ], send ) =>
    if ( match = rsg_or_range.match extras_range_pattern )?
      interval          = interval_from_range_match S, match
      interval[ 'tag' ] = tag
    else
      { lo, hi, rsg, block: name, } = interval_from_rsg S, rsg_or_range
      comment                       = "References RSG #{rsg} (#{name})."
      interval                      = { lo, hi, comment, tag, }
      # interval                      = { lo, hi, tag, }
    S.intervals.push interval
    #.....................................................................................................
    return null


#===========================================================================================================
# MAIN
#-----------------------------------------------------------------------------------------------------------
@read = ( handler ) ->
  #.........................................................................................................
  intervals = []
  S         = { intervals, }
  self      = @
  #.........................................................................................................
  step ( resume ) ->
    yield self.read_assigned_codepoints   S, resume
    yield self.read_planes_and_areas      S, resume
    yield self.read_block_names           S, resume
    yield self.read_rsgs_and_block_names  S, resume
    yield self.read_tags                  S, resume
    add_comments_to_intervals S
    handler null, S
  #.........................................................................................................
  return null


############################################################################################################
unless module.parent?
  RR = @

  # #-----------------------------------------------------------------------------------------------------------
  # @read = ( handler ) ->
  #   @READER.read ( error, S ) =>
  #     return handler error if error?
  #     handler null, S

  # #-----------------------------------------------------------------------------------------------------------
  # @read_intervals = ( handler ) ->
  #   @read ( error, S ) =>
  #     return handler error if error?
  #     handler null, S.intervals

  RR.read ( error, S ) =>
    throw error if error?
    # delete S.intervals
    for interval in S.intervals
      debug '39087', interval

