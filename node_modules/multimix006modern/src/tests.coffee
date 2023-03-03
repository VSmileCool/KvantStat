

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MULTIMIX/TESTS'
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
test                      = require 'guy-test'
#...........................................................................................................
# MULTIMIX                  = require './main'
{ mix }                   = require './main'
types                     = require './types'
{ isa
  type_of }               = types.export()


#===========================================================================================================
# HELPERS
#-----------------------------------------------------------------------------------------------------------
s = ( x ) -> JSON.stringify x, null, '  '
t = ( x ) -> JSON.stringify x

#-----------------------------------------------------------------------------------------------------------
@_prune = ->
  for name, value of @
    continue if name.startsWith '_'
    delete @[ name ] unless name in include
  return null

#-----------------------------------------------------------------------------------------------------------
@_main = ->
  test @, 'timeout': 3000

#-----------------------------------------------------------------------------------------------------------
# type             value                   equal value             non-equal value                 takes attributes
sample_values_by_types =
  boolean:     [ ( true               ), ( true               ), ( false                        ), no,  ]
  null:        [ ( null               ), ( null               ), ( undefined                    ), no,  ]
  text:        [ ( 'helo'             ), ( 'helo'             ), ( 'helo!!'                     ), no,  ]
  undefined:   [ ( undefined          ), ( undefined          ), ( null                         ), no,  ]
  infinity:    [ ( 1 / 0              ), ( 1 / 0              ), ( -Infinity                    ), no,  ]
  number:      [ ( 12345              ), ( 12345              ), ( 12345.3                      ), no,  ]
  #.........................................................................................................
  map:         [ ( new Map()          ), ( new Map()          ), ( new Map [ [ 'foo', 42, ], ]  ), yes, ]
  set:         [ ( new Set()          ), ( new Set()          ), ( new Set Array.from 'abcd'    ), yes, ]
  date:        [ ( new Date()         ), ( new Date()         ), ( new Date '1972-01-01'        ), yes, ]
  list:        [ ( [ 97, 98, 99, ]    ), ( [ 97, 98, 99, ]    ), ( [ 97, 98, 100, ]             ), yes, ]
  regex:       [ ( /^xxx$/g           ), ( /^xxx$/g           ), ( /^xxx$/                      ), yes, ]
  pod:         [ ( {}                 ), ( {}                 ), ( { x: 42, }                   ), yes, ]
  buffer:      [ ( new Buffer 'helo'  ), ( new Buffer 'helo'  ), ( new Buffer 'helo!!'          ), yes, ]
  arraybuffer: [ ( new ArrayBuffer 42 ), ( new ArrayBuffer 42 ), ( new ArrayBuffer 43           ), yes, ]
  #.........................................................................................................
  error:       [ ( new Error()        ), ( new Error()        ), ( new Error 'what!'            ), yes, ]
  function:    [ ( ( -> )             ), ( ( -> )             ), ( ( -> )                       ), yes, ]
  symbol:      [ ( Symbol.for 'xxx'   ), ( Symbol.for 'xxx'   ), ( Symbol.for 'XXX'             ), no,  ]
  #.........................................................................................................
  nan:         [ ( NaN                ), ( NaN                ), ( NaN                          ), no,  ]
  #.........................................................................................................
###
These do not work at the time being:
  weakmap:     [ ( new WeakMap()      ), ( new WeakMap()      ), ( new WeakMap()          ), no, ]
  generator:   [ ( ( -> yield 123 )() ), ( ( -> yield 123 )() ), ( ( -> yield 123 )()     ), no, ]
  arguments:   [ ( arguments          ), ( arguments          ), ( arguments              ), no, ]
  global:      [ ( global             ), ( global             ), ( global                 ), no, ]
###


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "demo (1)" ] = ( T ) ->
  #.........................................................................................................
  a =
    id:           'a'
    primes:       [ 2, 3, 5, 7, ]
    report:       -> t { @id, @primes, }
  #.........................................................................................................
  b =
    id:           'b'
    primes:       [ 13, 17, 23, ]
  #.........................................................................................................
  c = ( mix.use fields: { primes: 'append' } ) a, b
  #.........................................................................................................
  T.eq a[ 'primes' ], [2,3,5,7]
  T.eq c[ 'primes' ], [2,3,5,7,13,17,23]
  T.eq a.report(), '{"id":"a","primes":[2,3,5,7]}'
  T.eq c.report(), '{"id":"b","primes":[2,3,5,7,13,17,23]}'
  # debug '70200', JSON.stringify a
  # debug '70200', JSON.stringify c
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "options example (1)" ] = ( T ) ->
  #.........................................................................................................
  options_base =
    zoom:       '125%'
    paths:
      app:      '~/sample'
      fonts:    '~/.fonts'
    fonts:
      files:
        'Arial':  'HelveticaNeue.ttf'
      sizes:
        unit:   'pt'
        steps:  [ 8, 10, 11, 12, 14, 16, 18, 24, ]
  #.........................................................................................................
  options_user =
    zoom:       '85%'
    fonts:
      files:
        'ComicSans':  'MSComicSans.ttf'
  #.........................................................................................................
  options = mix options_base, options_user
  #.........................................................................................................
  T.ok options[ 'paths' ] is options_base[ 'paths' ]
  T.ok options[ 'fonts' ] is options_user[ 'fonts' ]
  T.eq options[ 'zoom' ], options_user[ 'zoom' ]
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "options example (2)" ] = ( T ) ->
  #.........................................................................................................
  options_base =
    primes:     [ 2, 3, 5, ]
    zoom:       '125%'
    paths:
      app:      '~/sample'
      fonts:    '~/.fonts'
    fonts:
      files:
        'Arial':  'HelveticaNeue.ttf'
      sizes:
        unit:   'pt'
        steps:  [ 8, 10, 11, 12, 14, 16, 18, 24, ]
    words:
      foo:      3
      bar:      3
    speed:      100
    weight:     456
    foo:
      bar:
        tags:       [ 'alpha', 'beta', 'gamma', 'delta', ]
    fruit:      'banana'
  #.........................................................................................................
  options_user =
    primes:           [ 7, 11, 13, ]
    zoom:             '85%'
    'only-here':      yes
    'to-be-skipped':  yes
    fonts:
      files:
        'ComicSans':  'MSComicSans.ttf'
    words:
      supercalifragilistic: 20
    speed:            50
    weight:           123
    foo:
      bar:
        tags:             [ '-alpha', 'beta', 'epsilon', ]
    fruit:            'pineapple'
  #.........................................................................................................
  recipe =
    fields:
      primes:           'append'
      words:            'merge'
      speed:            'average'
      weight:           'add'
      'to-be-skipped':  'skip'
      foo:
        bar:
          tags:             'tag'
      fruit:            'list'
      zoom:             ( zoom_percentages ) ->
        R = 1
        for percentage in zoom_percentages
          R *= ( parseFloat percentage ) / 100
        return "#{( R * 100 ).toFixed 2}%"
  #.........................................................................................................
  mix_options = mix.use recipe
  options     = mix_options options_base, options_user
  # urge '5543', options
  T.ok options[ 'paths'         ] is options_base[ 'paths' ]
  T.ok options[ 'fonts'         ] is options_user[ 'fonts' ]
  T.eq options[ 'primes'        ], [ 2, 3, 5, 7, 11, 13, ]
  T.eq options[ 'zoom'          ], '106.25%'
  T.eq options[ 'words'         ], { foo: 3, bar: 3, supercalifragilistic: 20 }
  T.eq options[ 'speed'         ], 75
  T.eq options[ 'weight'        ], 579
  T.eq options[ 'only-here'     ], yes
  T.eq options[ 'to-be-skipped' ], undefined
  T.eq options[ 'fruit'         ], [ 'banana', 'pineapple', ]
  debug '30200', options_base[ 'foo' ][ 'bar' ][ 'tags' ]
  debug '30200', options_user[ 'foo' ][ 'bar' ][ 'tags' ]
  debug '30200', options[      'foo' ][ 'bar' ][ 'tags' ]
  T.eq options[ 'foo' ][ 'bar' ][ 'tags' ], [ 'delta', 'beta', 'gamma', 'epsilon', ]
  #.........................................................................................................
  return null

###
#-----------------------------------------------------------------------------------------------------------
@[ "options example (3)" ] = ( T ) ->
  #.........................................................................................................
  options_base =
    paths:
      app:      '~/sample'
      fonts:    '~/.fonts'
    fonts:
      files:
        'Arial':  'HelveticaNeue.ttf'
  #.........................................................................................................
  options_user =
    fonts:
      files:
        'ComicSans':  'MSComicSans.ttf'
  #.........................................................................................................
  outer_reducers = null
  fonts_reducers =
    files:            'merge'
  #.........................................................................................................
  options_user_copy             = Object.assign {}, options_user
  options_user_copy[ 'fonts' ]  = ( mix.use fonts_reducers ) options_base[ 'fonts' ], options_user_copy[ 'fonts' ]
  options                       = ( mix.use outer_reducers ) options_base, options_user_copy
  # urge '7631', t options
  # T.eq options[ 'fonts' ], {"fonts":{"files":{"Arial":"HelveticaNeue.ttf","ComicSans":"MSComicSans.ttf"}}}
  T.eq options, {"paths":{"app":"~/sample","fonts":"~/.fonts"},"fonts":{"files":{"Arial":"HelveticaNeue.ttf","ComicSans":"MSComicSans.ttf"}}}
  #.........................................................................................................
  return null
###

#-----------------------------------------------------------------------------------------------------------
@[ "options example with nested recipe" ] = ( T ) ->
  #.........................................................................................................
  options_base =
    paths:
      app:      '~/sample'
      fonts:    '~/.fonts'
    fonts:
      files:
        'Arial':  'HelveticaNeue.ttf'
    foo:
      bar:
        baz:      42
  #.........................................................................................................
  options_user =
    fonts:
      files:
        'ComicSans':  'MSComicSans.ttf'
    alpha:
      beta:
        gamma:    108
  #.........................................................................................................
  recipe =
    fields:
      fonts:
        files:      'merge'
      foo:
        bar:
          baz:      ( values, S ) -> S.path
      alpha:
        beta:
          gamma:    ( values, S ) -> S.path
  #.........................................................................................................
  options = ( mix.use recipe ) options_base, options_user
  # urge '7631', t options
  T.eq options, {"fonts":{"files":{"Arial":"HelveticaNeue.ttf","ComicSans":"MSComicSans.ttf"}},"foo":{"bar":{"baz":"foo/bar/baz"}},"alpha":{"beta":{"gamma":"alpha/beta/gamma"}},"paths":{"app":"~/sample","fonts":"~/.fonts"}}
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "unused recipe must not cause entry" ] = ( T ) ->
  #.........................................................................................................
  options_base =
    foo:
      bar:
        baz:      42
  #.........................................................................................................
  options_user =
    fonts:
      files:
        'ComicSans':  'MSComicSans.ttf'
  #.........................................................................................................
  recipe =
    foo:
      bar:
        baz:      ( values, S ) -> S.path
    alpha:
      beta:
        gamma:    ( values, S ) -> S.path
    delta:        'list'
    qplah:
      gagh:       'append'
  #.........................................................................................................
  options = ( mix.use recipe ) options_base, options_user
  # urge '7631', t options
  T.eq options, {"foo":{"bar":{"baz":"foo/bar/baz"}},"fonts":{"files":{"ComicSans":"MSComicSans.ttf"}}}
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "`mix` leaves functions as-is" ] = ( T ) ->
  #.........................................................................................................
  options_original =
    paths:
      app:      '~/sample'
      fonts:    '~/.fonts'
    fonts:
      files:
        'Arial':  'HelveticaNeue.ttf'
    frobulate:
      plain:    ( x ) -> "*#{rpr x}*"
  #.........................................................................................................
  options_copy = mix options_original
  urge '7631-0', options_original
  urge '7631-1', options_copy
  T.eq options_original, options_copy
  T.ok options_original[ 'paths' ] isnt options_copy[ 'paths' ]
  T.ok options_original[ 'frobulate' ][ 'plain' ] is options_copy[ 'frobulate' ][ 'plain' ]
  #.........................................................................................................
  my_mix = mix.use { foo: ( -> 42 ), }
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "`mix.deep_copy` invariances and identities" ] = ( T ) ->
  σ_common        = Symbol.for 'common'
  Σ_private       = Symbol.for 'multimix'
  my_list         = Array.from '357'
  my_list[ 'a' ]  = [ 'Aha!', ]
  #.........................................................................................................
  library_module = ->
    @x = [ 108, [ 42, ], ]
    @y = my_list
    @f = -> @x
    @[ σ_common   ] = { foo: 'bar', }
    @[ Σ_private  ] = [ 'a', 'b', 'c', ]
  #.........................................................................................................
  library_module.apply L1 = {}
  L2 = mix.deep_copy L1
  #.........................................................................................................
  debug '1', L1, L1[ σ_common ]
  # L2 = mix mix.deep_copy L1
  L2 = mix.deep_copy L1
  debug '2', L2, L2[ σ_common ]
  T.ok CND.equals L1,     L2
  T.ok            L1 isnt L2
  T.ok CND.equals L1[ σ_common  ],      L2[ σ_common  ]
  T.ok            L1[ σ_common  ] isnt  L2[ σ_common  ]
  T.ok CND.equals L1[ Σ_private ],      L2[ Σ_private ]
  T.ok            L1[ Σ_private ] isnt  L2[ Σ_private ]
  T.ok CND.equals L1.x,                 L2.x
  T.ok            L1.x            isnt  L2.x
  T.ok CND.equals L1.y,                 L2.y
  T.ok            L1.y            isnt  L2.y
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "test copying samples" ] = ( T ) ->
  #.........................................................................................................
  for type, [ value, eq_value, ne_value, takes_attributes, ] of sample_values_by_types
    # debug '7170', type, [ value, eq_value, ne_value, is_primitive, ]
    try
      Object.keys value
      has_keys = CND.truth true
    catch
      has_keys = CND.truth false
    # debug type, ( CND.blue type_of value ), ( CND.yellow type_of mix.deep_copy value ), has_keys
    copied_value = mix.deep_copy value
    T.eq ( type_of value ), ( type_of copied_value )
    # debug '2010', type, ( CND.truth is_primitive ), ( CND.truth value is copied_value ), ( CND.truth is_primitive is ( value is copied_value ) )
  #   if is_primitive
  #     T.ok value is copied_value
  #   else
  #     T.ok value isnt copied_value
  # #.........................................................................................................
  # d_1   = /f/g
  # d_1.x = [ 'foo', ]
  # d_2   = mix.deep_copy d_1
  # T.eq d_1,         d_2
  # T.ok d_1    isnt  d_2
  # T.eq d_1.x,       d_2.x
  # T.ok d_1.x  isnt  d_2.x
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "copying primitive values" ] = ( T ) ->
  my_mix = mix.use fields: { '': ( ( P... ) -> debug P ), }
  # info mix 'a', 'b', 'c'
  info my_mix { '': 'a', }, { '': 'b', }, { '': 'c', }
  info ( my_mix { '': 'a', }, { '': 'b', }, { '': 'c', } )[ '' ]
  #.........................................................................................................
  # T.eq mix(), null
  # T.eq ( mix null               ), null
  # T.eq ( mix undefined          ), undefined
  # T.eq ( mix undefined, null    ), null
  # T.eq ( mix 'a', 'b', 'c'      ), 'c'
  # T.eq ( mix 22                 ), 22
  # T.eq ( mix true               ), true
  # T.eq ( mix -Infinity          ), -Infinity
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "simple copying" ] = ( T ) ->
  #.........................................................................................................
  data_og_0 =
    primes:   [ 2, 3, 5, 7, ]
  #.........................................................................................................
  data_og_1 =
    primes:   [ 5, 7, 11, 13, ]
  #.........................................................................................................
  my_seed = new Set()
  #.........................................................................................................
  recipe =
    # seed:     -> d = new Set()
    seed:     my_seed
    # before:   ( P... ) -> debug '33262-before', P
    after:    ( S ) ->
      S.seed.add x for x in S.seed[ 'primes' ]
      delete S.seed[ 'primes' ]
    fields:
      # '':       ( P... ) -> debug P
      primes:   'append'
  #.........................................................................................................
  debug '39302', data_ng = ( mix.use recipe ) data_og_0, data_og_1
  T.ok data_ng is my_seed
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "raw copying" ] = ( T ) ->
  σ_unknown_type  = Symbol.for 'unknown_type'
  L               = require './copiers'
  #.........................................................................................................
  raw_copy = ( x ) ->
    type          = type_of x
    description   = L.type_descriptions[ type ] ? L.type_descriptions[ σ_unknown_type ]
    { has_fields
      copy      } = description
    return copy.call L, x
  #.........................................................................................................
  primitive_value_probes = [
    null
    undefined
    true
    false
    123
    +Infinity
    -Infinity
    'abcdef'
    # Symbol.for 'key'
    ]
  #.........................................................................................................
  constructor_probes = [
    /^xa*$/g
    new Date '1983-06-01'
    ]
  #.........................................................................................................
  object_probes = [
    [ 1, 2, 3, ]
    { a: 123, b: 456, }
    ]
  #.........................................................................................................
  for probe in primitive_value_probes
    # debug ( rpr probe ), rpr raw_copy probe
    T.ok probe is raw_copy probe
  #.........................................................................................................
  for probe in constructor_probes
    result = raw_copy probe
    debug ( rpr probe ), rpr result
    T.eq probe,     result
    T.ok probe isnt result
  #.........................................................................................................
  for probe in object_probes
    result = raw_copy probe
    debug ( rpr probe ), rpr result
    debug ( rpr probe ), rpr result
    # T.eq probe,     result
    # T.ok probe isnt result
  #.........................................................................................................
  return null


############################################################################################################
unless module.parent?
  # debug '0980', JSON.stringify ( Object.keys @ ), null, '  '
  include = [
    "demo (1)"
    "options example (1)"
    "options example (2)"
    "options example (3)"
    "options example with nested recipe"
    "unused recipe must not cause entry"
    "`mix` leaves functions as-is"
    "`mix.deep_copy` invariances and identities"
    "test copying samples"
    "copying primitive values"
    "simple copying"
    "raw copying"
    ]
  @_prune()
  @_main()

  # debug Object.keys MULTIMIX
  # debug Object.keys mix
  # debug Object.keys mix.tools

  ###
  σ_x = Symbol.for 'x'
  y   = 'x234'
  # d = { x: 42, "#{y}": 108, "#{σ_x}": 123456, }
  `
  d = { x: 42, [y]: 108, [σ_x]: 123456, }
  `
  debug d
  debug Object.keys d
  debug ( k for k of d )
  debug d[ σ_x ]
  ###







