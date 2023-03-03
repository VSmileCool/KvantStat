

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MULTIMIX/RECIPES'
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
TOOLS                     = require './tools'
#...........................................................................................................
σ_new_state               = Symbol.for 'new_state'
σ_reject                  = Symbol.for 'reject'
σ_finalize                = Symbol.for 'finalize'
types                     = require './types'
{ isa
  type_of }               = types.export()


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@[ σ_new_state ] = ( recipe, mixins ) ->
  S                   = {}
  S.recipe            = if recipe? then ( CND.deep_copy recipe ) else {}
  S.mixins            = mixins
  S.recipe_fallback   = S.recipe[ 'fallback' ] ? 'assign'
  #.........................................................................................................
  S.cache             = {}
  S.averages          = {}
  S.tag_keys          = []
  # S.skip              = new Set()
  S.functions         = {}
  S.path              = null
  S.root              = null
  S.current           = null
  S.seen              = new Map()
  #.........................................................................................................
  if ( fields = S.recipe[ 'fields' ] )?
    for key, reducer of fields
      if reducer is 'include'
        fields[ key ] = S.recipe_fallback
        continue
      if reducer is 'tag'
        S.tag_keys.push key
        continue
      if isa.function reducer
        S.functions[  key ] = reducer
        fields[       key ] = 'function'
  #.........................................................................................................
  return S

#-----------------------------------------------------------------------------------------------------------
@[ σ_finalize ] = ( S ) ->
  ### tags ###
  for key, value of S.current
    continue unless key in S.tag_keys
    S.current[ key ] = TOOLS.reduce_tag S.current[ key ]
  #.........................................................................................................
  ### averages ###
  for key, [ sum, count, ] of S.averages
    S.current[ key ] = sum / count
  #.........................................................................................................
  ### functions ###
  for key, values of S.cache
    unless isa.function ( method = S.functions[ key ] )
      throw new Error "not a function for key #{rpr key}: #{rpr method}"
    S.current[ key ] = method values, S
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ σ_reject ] = ( S, key, value ) ->
  # return ( S.skip.has key ) or ( value is undefined and S.recipe_name isnt 'assign' )
  return value is undefined and S.recipe_name isnt 'assign'


#===========================================================================================================
# RECIPES
#-----------------------------------------------------------------------------------------------------------
@assign = ( S, key, value ) ->
  if value is undefined then delete S.current[ key ]
  else                              S.current[ key ] = value
  return null

#-----------------------------------------------------------------------------------------------------------
@skip = ( S, key, value ) -> null

#-----------------------------------------------------------------------------------------------------------
@merge = ( S, key, value ) ->
  throw new Error "expected a POD, got a #{type_of value}" unless isa.object value
  target = ( S.current[ key ] ?= {} )
  target[ sub_key ] = sub_value for sub_key, sub_value of value
  return null

#-----------------------------------------------------------------------------------------------------------
@append = ( S, key, value ) ->
  ### TAINT consider to use `Symbol.isConcatSpreadable` in the future ###
  target = ( S.current[ key ] ?= [] )
  if isa.list then  target.splice target.length, 0, value...
  else                  target.push                     value
  return null

#-----------------------------------------------------------------------------------------------------------
@list = ( S, key, value ) ->
  ( S.current[ key ] ?= [] ).push value
  return null

#-----------------------------------------------------------------------------------------------------------
@add = ( S, key, value ) ->
  S.current[ key ] = ( S.current[ key ] ? 0 ) + value
  return null

#-----------------------------------------------------------------------------------------------------------
@average = ( S, key, value ) ->
  target      = S.averages[ key ] ?= [ 0, 0, ]
  target[ 0 ] = target[ 0 ] + value
  target[ 1 ] = target[ 1 ] + 1
  return null

#-----------------------------------------------------------------------------------------------------------
@tag = ( S, key, value ) ->
  TOOLS.meld ( target = S.current[ key ] ?= [] ), value
  return null

#-----------------------------------------------------------------------------------------------------------
@function = ( S, key, value ) ->
  ### Cache current value for later processing by `σ_finalize`: ###
  ( S.cache[ key ] ?= [] ).push value
  return null

