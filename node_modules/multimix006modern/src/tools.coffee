

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MULTIMIX/TOOLS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
types                     = require './types'
{ isa
  type_of }               = types.export()



#-----------------------------------------------------------------------------------------------------------
@normalize_tag = ( tag ) ->
  ### Given a single string or a list of strings, return a new list that contains all whitespace-delimited
  words in the strings ###
  return @normalize_tag [ tag, ] unless isa.list tag
  R = []
  for t in tag
    continue if t.length is 0
    R.splice R.length, 0, ( t.split /\s+/ )...
  ### TAINT consider to return `@unique R` instead ###
  return R

#-----------------------------------------------------------------------------------------------------------
@unique = ( list ) ->
  ### Return a copy of `list´ that only contains the last occurrence of each value ###
  ### TAINT consider to modify, not copy `list` ###
  seen  = new Set()
  R     = []
  for idx in [ list.length - 1 .. 0 ] by -1
    element = list[ idx ]
    continue if seen.has element
    seen.add element
    R.unshift element
  return R

#-----------------------------------------------------------------------------------------------------------
@append = ( a, b ) ->
  ### Append elements of list `b` to list `a` ###
  ### TAINT JS has `[]::concat` ###
  a.splice a.length, 0, b...
  return a

#-----------------------------------------------------------------------------------------------------------
@meld = ( list, value ) ->
  ### When `value` is a list, `@append` it to `list`; else, `push` `value` to `list` ###
  if isa.list value then  @append list, value
  else                        list.push value
  return list

#-----------------------------------------------------------------------------------------------------------
@fuse = ( list ) ->
  ### Flatten `list`, then apply `@unique` to it. Does not copy `list` but modifies it ###
  R = []
  @meld R, element for element in list
  R = @unique R
  list.splice 0, list.length, R...
  return list

#-----------------------------------------------------------------------------------------------------------
@reduce_tag = ( raw ) ->
  source  = @fuse raw
  R       = []
  exclude = null
  #.........................................................................................................
  for idx in [ source.length - 1 .. 0 ] by -1
    tag = source[ idx ]
    continue if exclude? and exclude.has tag
    if tag.startsWith '-'
      break if tag is '-*'
      ( exclude ?= new Set() ).add tag[ 1 .. ]
      continue
    R.unshift tag
  #.........................................................................................................
  return R


