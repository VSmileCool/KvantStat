


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MULTIMIX/COPIERS'
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
σ_unknown_type            = Symbol.for 'unknown_type'
COPIERS                   = @
types                     = require './types'
{ isa
  type_of }               = types.export()


#===========================================================================================================
# RAW COPIERS
#-----------------------------------------------------------------------------------------------------------
@RAW = {}

#-----------------------------------------------------------------------------------------------------------
@RAW.object = ( x, seed ) ->
  ### shamelessly copied from https://github.com/nrn/universal-copy ###
  R = seed ? Object.create Object.getPrototypeOf x
  ### copy properties here or put the below into a `finalize` method ###
  if      Object.isFrozen     x then Object.freeze            R
  if      Object.isSealed     x then Object.seal              R
  unless  Object.isExtensible x then Object.preventExtensions R
  return R

#-----------------------------------------------------------------------------------------------------------
@RAW.by_constructor = ( x ) ->
  ### shamelessly copied from https://github.com/nrn/universal-copy ###
  R = new x.constructor x
  return R

#-----------------------------------------------------------------------------------------------------------
@RAW.id   = ( x ) -> x
@RAW.dont = ( x ) -> throw new Error "unable to copy value of type #{type_of x}"
# @RAW.list = ( x ) -> @object x, new Array x.length
@RAW.list = ( x ) -> []

#-----------------------------------------------------------------------------------------------------------
@RAW.set  = ( x ) ->
  R = new Set()
  x.forEach ( value ) -> R.add deep_copy x
  return R

#-----------------------------------------------------------------------------------------------------------
@RAW.map  = ( x ) ->
  R = new Map()
  x.forEach ( value, key ) -> R.set ( deep_copy key ), ( deep_copy value )
  return R


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
###
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
###

#-----------------------------------------------------------------------------------------------------------
do ->
  #.........................................................................................................
  copy_id             = ( x ) -> COPIERS.RAW.id             x
  copy_object         = ( x ) -> COPIERS.RAW.object         x
  copy_list           = ( x ) -> COPIERS.RAW.list           x
  copy_map            = ( x ) -> COPIERS.RAW.map            x
  copy_set            = ( x ) -> COPIERS.RAW.set            x
  copy_by_constructor = ( x ) -> COPIERS.RAW.by_constructor x
  dont_copy           = ( x ) -> COPIERS.RAW.dont           x
  #.........................................................................................................
  type_descriptions = [
    #.......................................................................................................
    { type: 'boolean',       has_fields: no,  copy: copy_id,                                              }
    { type: 'null',          has_fields: no,  copy: copy_id,                                              }
    { type: 'text',          has_fields: no,  copy: copy_id,                                              }
    { type: 'undefined',     has_fields: no,  copy: copy_id,                                              }
    { type: 'infinity',      has_fields: no,  copy: copy_id,                                              }
    { type: 'float',         has_fields: no,  copy: copy_id,                                              }
    { type: 'nan',           has_fields: no,  copy: copy_id,                                              }
    #.......................................................................................................
    { type: 'object',        has_fields: yes, copy: copy_object,                                          }
    { type: 'list',          has_fields: yes, copy: copy_list,                                            }
    { type: 'map',           has_fields: yes, copy: copy_map,                                             }
    { type: 'set',           has_fields: yes, copy: copy_set,                                             }
    #.......................................................................................................
    { type: 'date',          has_fields: yes, copy: copy_by_constructor,                                  }
    { type: 'regex',         has_fields: yes, copy: copy_by_constructor,                                  }
    #.......................................................................................................
    { type: 'buffer',        has_fields: yes, copy: dont_copy,                                            }
    { type: 'arraybuffer',   has_fields: yes, copy: dont_copy,                                            }
    { type: 'error',         has_fields: yes, copy: dont_copy,                                            }
    { type: 'function',      has_fields: yes, copy: dont_copy,                                            }
    { type: 'symbol',        has_fields: no,  copy: dont_copy,                                            }
    # These do not work at the time being:
    { type: 'weakmap',       has_fields: no,  copy: dont_copy,                                            }
    { type: 'generator',     has_fields: no,  copy: dont_copy,                                            }
    { type: 'arguments',     has_fields: no,  copy: dont_copy,                                            }
    { type: 'global',        has_fields: no,  copy: dont_copy,                                            }
    { type: σ_unknown_type,  has_fields: no,  copy: dont_copy,                                            }
    #.......................................................................................................
    ]
  #.........................................................................................................
  COPIERS.type_descriptions = {}
  COPIERS.type_descriptions[ d[ 'type' ] ] = d for d in type_descriptions


