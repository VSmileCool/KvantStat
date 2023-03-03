

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MULTIMIX'
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
{ join }                  = require 'path'
#...........................................................................................................
σ_new_state               = Symbol.for 'new_state'
σ_reject                  = Symbol.for 'reject'
σ_finalize                = Symbol.for 'finalize'
σ_unknown_type            = Symbol.for 'unknown_type'
#...........................................................................................................
MULTIMIX                  = {}
MULTIMIX.TOOLS            = require './tools'
MULTIMIX.RECIPES          = require './recipes'
MULTIMIX.COPIERS          = require './copiers'
types                     = require './types'
{ isa
  type_of }               = types.export()



#-----------------------------------------------------------------------------------------------------------
MULTIMIX._get_seed = ( S, seed ) ->
  type          = type_of seed
  description   = MULTIMIX.COPIERS.type_descriptions[ type ]
  description  ?= MULTIMIX.COPIERS.type_descriptions[ σ_unknown_type ]
  { has_fields
    copy      } = description
  return copy.call MULTIMIX, S, seed

#-----------------------------------------------------------------------------------------------------------
MULTIMIX.mix = ( mixins, recipe, root = null, selector = [] ) ->
  #.........................................................................................................
  return null if mixins.length is 0
  [ mixin_seed
    mixin_tail... ]   = mixins
  S                   = MULTIMIX.RECIPES[ σ_new_state ] recipe, mixins
  seed                = MULTIMIX._get_seed S, mixin_seed
  S.seed              = seed
  root               ?= seed
  # ### !!! experimental !!! ###
  # for mixin, mixin_idx in mixins
  #   mixins[ mixin_idx ] = { '': mixin, }
  #.........................................................................................................
  ### TAINT this part needs to be rewritten ###
  ### Deal with nested recipe first: ###
  if ( fields = S.recipe[ 'fields' ] )?
    for field_key, field_value of fields
      continue unless isa.object field_value
      selector.push field_key
      partial_mixins = ( mixin[ field_key ] for mixin in mixins when mixin[ field_key ] )
      # partial_mixins = []
      # for mixin in mixins
      #   partial_mixin = mixin[ field_key ]
      #   partial_mixins.push partial_mixin if partial_mixin?
      if partial_mixins.length > 0
        # debug '30211', selector, field_value, partial_mixins
        S.seed[ field_key ] = MULTIMIX.mix partial_mixins, field_value, root, selector
      S.recipe[ field_key ] = 'skip'
      selector.pop field_key
  #.........................................................................................................
  ### Process unnested recipe: ###
  for mixin in mixins
    # urge '33415', mixin
    for mx_key, mx_value of mixin
      S.path          = join selector..., mx_key
      S.root          = root
      S.current       = S.seed
      S.recipe_name   = S.recipe[ 'fields' ]?[ mx_key ] ? S.recipe_fallback
      continue if isa.object S.recipe_name
      continue if MULTIMIX.RECIPES[ σ_reject ] S, mx_key, mx_value
      unless ( recipe = MULTIMIX.RECIPES[ S.recipe_name ] )?
        throw new Error "unknown recipe #{rpr S.recipe_name}"
      recipe.call MULTIMIX.RECIPES, S, mx_key, mx_value
  #.........................................................................................................
  MULTIMIX.RECIPES[ σ_finalize ] S
  #.........................................................................................................
  if ( hook = S.recipe?[ 'after' ] )?
    unless ( type = type_of hook ) is 'function'
      throw new Error "expected function for 'after' hook, got a #{type}"
    hook S
  #.........................................................................................................
  # S.path    = null
  # S.root    = null
  # S.current = null
  # debug '30221', S
  return S.seed


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
MULTIMIX.use = ( recipes... ) ->
  recipes.splice 0, 0, { 'fallback': 'assign', }
  recipe              = MULTIMIX.mix recipes
  R                   = ( mixins... ) -> MULTIMIX.mix mixins, recipe
  R.use               = MULTIMIX.use
  # R.TOOLS             = MULTIMIX.TOOLS
  # R.RECIPES           = MULTIMIX.RECIPES
  # R.COPIERS           = MULTIMIX.COPIERS
  # R.type_descriptions = MULTIMIX.type_descriptions
  # R._get_seed         = MULTIMIX._get_seed
  # R.deep_copy         = ( x ) -> CND.deep_copy x
  return R

#-----------------------------------------------------------------------------------------------------------
module.exports = { mix: MULTIMIX.use(), }








