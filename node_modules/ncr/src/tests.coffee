


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'NCR/tests'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
test                      = require 'guy-test'
NCR                       = require './main'
types                     = require './types'
{ isa
  validate
  type_of }               = types.export()


#===========================================================================================================
# HELPERS
#-----------------------------------------------------------------------------------------------------------
hex = ( n ) -> '0x' + n.toString 16


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "test # 1" ] = ( T ) ->
  T.eq ( ( '&#123;helo'.match     NCR._first_chr_matcher_ncr )[ 1 .. 3 ] ), [ '', undefined, '123' ]

@[ "test # 2" ] = ( T ) ->
  T.eq ( ( '&#x123;helo'.match    NCR._first_chr_matcher_ncr )[ 1 .. 3 ] ), [ '', '123', undefined ]

@[ "test # 3" ] = ( T ) ->
  T.eq ( ( '&#x123;helo'.match    NCR._first_chr_matcher_xncr )[ 1 .. 3 ] ),[ '', '123', undefined ]

@[ "test # 4" ] = ( T ) ->
  T.eq ( ( '&jzr#123;helo'.match  NCR._first_chr_matcher_xncr )[ 1 .. 3 ] ),[ 'jzr', undefined, '123' ]

@[ "test # 5" ] = ( T ) ->
  T.eq ( ( '&jzr#x123;helo'.match NCR._first_chr_matcher_xncr )[ 1 .. 3 ] ),[ 'jzr', '123', undefined ]

@[ "test # 6" ] = ( T ) ->
  T.eq ( ( '𤕣'[ 0 ] + 'x' ).match NCR._first_chr_matcher_plain ), null

@[ "test # 7" ] = ( T ) ->
  T.eq ( NCR._chr_csg_cid_from_chr '&#97;abc', 'ncr' ),                    [ '&#97;', 'u', 97 ]

@[ "test # 8" ] = ( T ) ->
  T.eq ( NCR._chr_csg_cid_from_chr '&#97;abc', 'plain' ),                  [ '&', 'u', 38 ]

@[ "test # 9" ] = ( T ) ->
  T.eq ( NCR._chr_csg_cid_from_chr '&#97;abc', 'xncr' ),                   [ '&#97;', 'u', 97 ]

@[ "test # 10" ] = ( T ) ->
  T.eq ( NCR._chr_csg_cid_from_chr '&#x61;abc' ),                          [ '&', 'u', 38 ]

@[ "test # 11" ] = ( T ) ->
  T.eq ( NCR._chr_csg_cid_from_chr '&#x61;abc', 'ncr' ),                   [ '&#x61;', 'u', 97 ]

@[ "test # 12" ] = ( T ) ->
  T.eq ( NCR._chr_csg_cid_from_chr '&#x61;abc', 'plain' ),                 [ '&', 'u', 38 ]

@[ "test # 13" ] = ( T ) ->
  T.eq ( NCR._chr_csg_cid_from_chr '&#x61;abc', 'xncr' ),                  [ '&#x61;', 'u', 97 ]

@[ "test # 14" ] = ( T ) ->
  T.eq ( NCR._chr_csg_cid_from_chr 'abc', 'ncr' ),                         [ 'a', 'u', 97 ]

@[ "test # 15" ] = ( T ) ->
  T.eq ( NCR._chr_csg_cid_from_chr 'abc', 'plain' ),                       [ 'a', 'u', 97 ]

@[ "test # 16" ] = ( T ) ->
  T.eq ( NCR._chr_csg_cid_from_chr 'abc', 'xncr' ),                        [ 'a', 'u', 97 ]

@[ "test # 17" ] = ( T ) ->
  T.eq ( NCR.analyze '&#x24563;'                   ), {'~isa':     'NCR/info',"uchr":"&","chr":"&","csg":"u","cid":38,"fncr":"u-latn-26","sfncr":"u-26","ncr":"&#x26;","xncr":"&#x26;","rsg":"u-latn"}

@[ "test # 18" ] = ( T ) ->
  T.eq ( NCR.analyze '&#x24563;', input: 'ncr'      ), {'~isa':     'NCR/info',"uchr":"𤕣","chr":"𤕣","csg":"u","cid":148835,"fncr":"u-cjk-xb-24563","sfncr":"u-24563","ncr":"&#x24563;","xncr":"&#x24563;","rsg":"u-cjk-xb"}

@[ "test # 19" ] = ( T ) ->
  T.eq ( NCR.analyze '&#x24563;', input: 'xncr'     ), {'~isa':     'NCR/info',"uchr":"𤕣","chr":"𤕣","csg":"u","cid":148835,"fncr":"u-cjk-xb-24563","sfncr":"u-24563","ncr":"&#x24563;","xncr":"&#x24563;","rsg":"u-cjk-xb"}

@[ "test # 23" ] = ( T ) ->
  T.eq ( NCR.analyze 'helo world' ), {'~isa':     'NCR/info',"uchr":"h","chr":"h","csg":"u","cid":104,"fncr":"u-latn-68","sfncr":"u-68","ncr":"&#x68;","xncr":"&#x68;","rsg":"u-latn"}

@[ "test # 24" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text ''                   ), []

@[ "test # 25" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '',                  input: 'ncr'  ), []

@[ "test # 26" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '',                  input: 'xncr' ), []

@[ "test # 27" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text 'abc'                ), [ 'a', 'b', 'c' ]

@[ "test # 28" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text 'abc',               input: 'ncr'  ), [ 'a', 'b', 'c' ]

@[ "test # 29" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text 'abc',               input: 'xncr' ), [ 'a', 'b', 'c' ]

@[ "test # 30" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣a&#123;b𤕣c'        ), [ '𤕣', 'a', '&', '#', '1', '2', '3', ';', 'b', '𤕣', 'c' ]

@[ "test # 31" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣a&#123;b𤕣c',       input: 'ncr'  ), [ '𤕣', 'a', '&#123;', 'b', '𤕣', 'c' ]

@[ "test # 32" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣a&#123;b𤕣c',       input: 'xncr' ), [ '𤕣', 'a', '&#123;', 'b', '𤕣', 'c' ]

@[ "test # 33" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣a&#x123ab;b𤕣c'     ), [ '𤕣', 'a', '&', '#', 'x', '1', '2', '3', 'a', 'b', ';', 'b', '𤕣', 'c' ]

@[ "test # 34" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣a&#x123ab;b𤕣c',    input: 'ncr'  ), [ '𤕣', 'a', '&#x123ab;', 'b', '𤕣', 'c' ]

@[ "test # 35" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣a&#x123ab;b𤕣c',    input: 'xncr' ), [ '𤕣', 'a', '&#x123ab;', 'b', '𤕣', 'c' ]

@[ "test # 36" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣a&jzr#123;b𤕣c'     ), [ '𤕣', 'a', '&', 'j', 'z', 'r', '#', '1', '2', '3', ';', 'b', '𤕣', 'c' ]

@[ "test # 37" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣a&jzr#x123ab;b𤕣c'  ), [ '𤕣', 'a', '&', 'j', 'z', 'r', '#', 'x', '1', '2', '3', 'a', 'b', ';', 'b', '𤕣', 'c' ]

@[ "test # 38" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣a&jzr#x123ab;b𤕣c', input: 'ncr'  ), [ '𤕣', 'a', '&', 'j', 'z', 'r', '#', 'x', '1', '2', '3', 'a', 'b', ';', 'b', '𤕣', 'c' ]

@[ "test # 39" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣a&jzr#x123ab;b𤕣c', input: 'xncr' ), [ '𤕣', 'a', '&jzr#x123ab;', 'b', '𤕣', 'c' ]

@[ "test # 40" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣abc'               ), [ '𤕣', 'a', 'b', 'c' ]

@[ "test # 41" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣abc',              input: 'ncr'  ), [ '𤕣', 'a', 'b', 'c' ]

@[ "test # 42" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣abc',              input: 'xncr' ), [ '𤕣', 'a', 'b', 'c' ]

@[ "test # 43" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣ab𤕣c'              ), [ '𤕣', 'a', 'b', '𤕣', 'c' ]

@[ "test # 44" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣ab𤕣c',             input: 'ncr'  ), [ '𤕣', 'a', 'b', '𤕣', 'c' ]

@[ "test # 45" ] = ( T ) ->
  T.eq ( NCR.chrs_from_text '𤕣ab𤕣c',             input: 'xncr' ), [ '𤕣', 'a', 'b', '𤕣', 'c' ]

@[ "test # 46" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text '1 < 2', output: 'html'                          ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"1 &lt; 2"}]

@[ "test # 47" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text '2 > 1', output: 'html'                          ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"2 &gt; 1"}]

@[ "test # 48" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text 'ab&#x63;d'                                      ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"ab&#x63;d"}]

@[ "test # 49" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text 'ab&#x63;d', input: 'ncr'                        ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"abcd"}]

@[ "test # 50" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text 'ab&#x63;d', input: 'xncr'                       ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"abcd"}]

@[ "test # 51" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text 'ab&jzr#xe063;d'                                 ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"ab&jzr#xe063;d"}]

@[ "test # 52" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text 'ab&jzr#xe063;d', input: 'ncr'                   ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"ab&jzr#xe063;d"}]

@[ "test # 55" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text 'helo wörld'                                     ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"helo w"},{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn-1","text":"ö"},{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"rld"}]

@[ "test # 56" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text 'helo wörld', output: 'html'                     ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"helo w"},{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn-1","text":"ö"},{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"rld"}]

@[ "test # 57" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text 'me & you', output: 'html'                       ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"me &amp; you"}]

@[ "test # 58" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text 'me &amp; you', output: 'html'                   ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"me &amp;amp; you"}]

@[ "test # 59" ] = ( T ) ->
  T.eq ( NCR.chunks_from_text '種果〇𤕣カタカナ'                                       ), [{"~isa":"NCR/chunk","csg":"u","rsg":"u-cjk","text":"種果"},{"~isa":"NCR/chunk","csg":"u","rsg":"u-cjk-sym","text":"〇"},{"~isa":"NCR/chunk","csg":"u","rsg":"u-cjk-xb","text":"𤕣"},{"~isa":"NCR/chunk","csg":"u","rsg":"u-cjk-kata","text":"カタカナ"}]

@[ "test # 60" ] = ( T ) ->
  T.eq ( NCR.csg_cid_from_chr '&#x24563;' ),                               [ 'u', 38 ]

@[ "test # 61" ] = ( T ) ->
  T.eq ( NCR.csg_cid_from_chr '&#x24563;', input: 'ncr' ),                        [ 'u', 148835 ]

@[ "test # 62" ] = ( T ) ->
  T.eq ( NCR.csg_cid_from_chr '&#x24563;', input: 'plain' ),                      [ 'u', 38 ]

@[ "test # 63" ] = ( T ) ->
  T.eq ( NCR.csg_cid_from_chr '&#x24563;', input: 'xncr' ),                       [ 'u', 148835 ]

@[ "test # 64" ] = ( T ) ->
  T.eq ( NCR.csg_cid_from_chr '𤕣' ),                                       [ 'u', 148835 ]

@[ "test # 65" ] = ( T ) ->
  T.eq ( NCR.csg_cid_from_chr '𤕣', input: 'ncr' ),                                [ 'u', 148835 ]

@[ "test # 66" ] = ( T ) ->
  T.eq ( NCR.csg_cid_from_chr '𤕣', input: 'plain' ),                              [ 'u', 148835 ]

@[ "test # 67" ] = ( T ) ->
  T.eq ( NCR.csg_cid_from_chr '𤕣', input: 'xncr' ),                               [ 'u', 148835 ]

@[ "test # 68" ] = ( T ) ->
  T.eq ( NCR._as_sfncr 'jzr', 0x12abc ), 'jzr-12abc'

@[ "test # 69" ] = ( T ) ->
  T.eq ( NCR._as_sfncr 'u', 0x12abc   ), 'u-12abc'

@[ "test # 70" ] = ( T ) ->
  T.eq ( NCR._as_xncr 'jzr', 0x12abc ), '&jzr#x12abc;'

@[ "test # 71" ] = ( T ) ->
  T.eq ( NCR._as_xncr 'u', 0x12abc     ), '&#x12abc;'

@[ "test # 72" ] = ( T ) ->
  T.eq ( NCR._as_xncr 'u', 0x12abc   ), '&#x12abc;'

@[ "test # 73" ] = ( T ) ->
  T.eq ( NCR.as_cid      '&jzr#xe100;',  input:  'xncr', csg: 'u'   ), 0xe100

@[ "test # 74" ] = ( T ) ->
  T.eq ( NCR.as_cid      '&jzr#xe100;',  input: 'xncr'              ), 0xe100

@[ "test # 75" ] = ( T ) ->
  T.eq ( NCR.as_cid      '𤕣',           input:  'xncr'              ), 0x24563

@[ "test # 76" ] = ( T ) ->
  T.eq ( NCR.as_csg      '&jzr#xe100;',  input:  'xncr', csg: 'u'   ), 'u'

@[ "test # 77" ] = ( T ) ->
  T.eq ( NCR.as_csg      '&jzr#xe100;',  input: 'xncr'              ), 'jzr'

@[ "test # 78" ] = ( T ) ->
  T.eq ( NCR.as_csg      '𤕣',           input:  'xncr'              ), 'u'

@[ "test # 81" ] = ( T ) ->
  T.eq ( NCR.as_fncr     '𤕣',           input:  'xncr'             ), 'u-cjk-xb-24563'

@[ "test # 82" ] = ( T ) ->
  T.eq ( NCR.as_ncr 0x12abc        ), '&#x12abc;'

@[ "test # 91" ] = ( T ) ->
  T.eq ( NCR.as_rsg        '&#xe100;',     input: 'ncr' ), 'u-pua'

@[ "test # 92" ] = ( T ) ->
  T.eq ( NCR.as_rsg        '&#xe100;',     input: 'plain' ), 'u-latn'

@[ "test # 93" ] = ( T ) ->
  T.eq ( NCR.as_rsg        '&#xe100;',     input: 'xncr' ), 'u-pua'

@[ "test # 94" ] = ( T ) ->
  T.eq ( NCR.as_rsg        '&jzr#xe100;',  input: 'ncr' ), 'u-latn'

@[ "test # 95" ] = ( T ) ->
  T.eq ( NCR.as_rsg        '&jzr#xe100;',  input: 'plain' ), 'u-latn'

@[ "test # 99" ] = ( T ) ->
  T.eq ( NCR.as_rsg      '&#xe100;',     input:  'xncr', csg: 'u'   ), 'u-pua'

@[ "test # 100" ] = ( T ) ->
  T.eq ( NCR.as_rsg      '&jzr#xe100;',  input:  'xncr', csg: 'u'   ), 'u-pua'

@[ "test # 101" ] = ( T ) ->
  T.eq ( NCR.as_rsg 'a'        ), 'u-latn'

@[ "test # 102" ] = ( T ) ->
  T.eq ( NCR.as_rsg '𤕣'        ), 'u-cjk-xb'

@[ "test # 103" ] = ( T ) ->
  T.eq ( NCR.as_sfncr 'a'      ), 'u-61'

@[ "test # 104" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&#678;'            ), 38

@[ "test # 105" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&#678;',     input: 'ncr', ), 678

@[ "test # 106" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&#678;',     input: 'xncr', ), 678

@[ "test # 107" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&#x678;'           ), 38

@[ "test # 108" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&#x678;',    input: 'ncr', ), 0x678

@[ "test # 109" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&#x678;',    input: 'xncr', ), 0x678

@[ "test # 110" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&jzr#678;'         ), 38

@[ "test # 111" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&jzr#678;',  input: 'ncr', ), 38

@[ "test # 112" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&jzr#678;',  input: 'xncr', ), 678

@[ "test # 113" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&jzr#x678;'        ), 38

@[ "test # 114" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&jzr#x678;', input: 'ncr', ), 38

@[ "test # 115" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr '&jzr#x678;', input: 'xncr', ), 0x678

@[ "test # 116" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr 'a'                 ), 97

@[ "test # 117" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr 'a',          input: 'ncr', ), 97

@[ "test # 118" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr 'a',          input: 'xncr', ), 97

@[ "test # 119" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr 'x'                 ), 120

@[ "test # 120" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr 'x',          input: 'ncr', ), 120

@[ "test # 121" ] = ( T ) ->
  T.eq ( NCR.cid_from_chr 'x',          input: 'xncr', ), 120

@[ "test # 123" ] = ( T ) ->
  T.eq ( NCR.html_from_text 'helo &#x24563; wörld'               ), """<span class="u-latn">helo &amp;#x24563; w</span><span class="u-latn-1">ö</span><span class="u-latn">rld</span>"""

@[ "test # 124" ] = ( T ) ->
  T.eq ( NCR.html_from_text 'helo &#x24563; wörld', input: 'xncr'), """<span class="u-latn">helo </span><span class="u-cjk-xb">𤕣</span><span class="u-latn"> w</span><span class="u-latn-1">ö</span><span class="u-latn">rld</span>"""

@[ "test # 125" ] = ( T ) ->
  T.eq ( NCR.html_from_text 'helo wörld'                         ), """<span class="u-latn">helo w</span><span class="u-latn-1">ö</span><span class="u-latn">rld</span>"""

@[ "test Unicode 8 / CJK Extension E" ] = ( T ) ->
  T.eq ( NCR.as_csg '𫠠' ), 'u'
  T.eq ( NCR.as_rsg '𫠠' ), 'u-cjk-xe'
  T.eq ( NCR.as_fncr '𫠠' ), 'u-cjk-xe-2b820'


### # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  ###
###  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # ###
### # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  ###
###  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # ###
### # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  ###


#-----------------------------------------------------------------------------------------------------------
@[ "test # 20" ] = ( T ) ->
  result  = NCR.analyze '&jzr#x24563;'
  matcher = {'~isa':     'NCR/info',"uchr":"&","chr":"&","csg":"u","cid":38,"fncr":"u-latn-26","sfncr":"u-26","ncr":"&#x26;","xncr":"&#x26;","rsg":"u-latn"}
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 21" ] = ( T ) ->
  result  = NCR.analyze '&jzr#x24563;', input: 'ncr'
  matcher = {'~isa':     'NCR/info',"uchr":"&","chr":"&","csg":"u","cid":38,"fncr":"u-latn-26","sfncr":"u-26","ncr":"&#x26;","xncr":"&#x26;","rsg":"u-latn"}
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 22" ] = ( T ) ->
  # debug '©BY7x6', JSON.stringify ( NCR.analyze '&jzr#x24563;', input: 'xncr'  )
  result  = NCR.analyze '&jzr#x24563;', input: 'xncr'
  # debug '©54241', result
  ### TAINT Character is mapped from JZR (i.e. another character set) to a Unicode non-PUA codepoint;
  this *may* be OK when there is appropriate styling information at that point (e.g.
  `<span style='font-family: foobar;'>𤕣</span>`), but is not desirable in text-only environments. ###
  matcher =
    '~isa':   'NCR/info'
    chr:      '&jzr#x24563;'
    uchr:     '𤕣'
    csg:      'jzr'
    cid:      148835
    fncr:     'jzr-24563'
    sfncr:    'jzr-24563'
    ncr:      '&#x24563;'
    xncr:     '&jzr#x24563;'
    rsg:      'jzr'
  ### Previous version:
  matcher =
    '~isa':   'NCR/info'
    chr:      '&jzr#x24563;'
    uchr:     '𤕣'
    csg:      'jzr'
    cid:      148835
    fncr:     'jzr-24563'
    sfncr:    'jzr-24563'
    ncr:      '&#x24563;'
    xncr:     '&jzr#x24563;'
    rsg:      null
  ###
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 22a" ] = ( T ) ->
  result  = NCR.analyze '&jzr#xe101;', input: 'xncr'
  # debug '©BY7x6', result
  matcher = {"~isa":"NCR/info","chr":"&jzr#xe101;","uchr":"","csg":"jzr","cid":57601,"fncr":"jzr-e101","sfncr":"jzr-e101","ncr":"&#xe101;","xncr":"&jzr#xe101;","rsg":"jzr"}
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 22b" ] = ( T ) ->
  result  = NCR.analyze '&jzr#e101;', input: 'xncr'
  matcher = {"~isa":"NCR/info","chr":"&","uchr":"&","csg":"u","cid":38,"fncr":"u-latn-26","sfncr":"u-26","ncr":"&#x26;","xncr":"&#x26;","rsg":"u-latn"}
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 53" ] = ( T ) ->
  result  = NCR.chunks_from_text 'ab&jzr#xe063;d', input: 'xncr'
  matcher = [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"ab"},{"~isa":"NCR/chunk","csg":"jzr","rsg":"jzr","text":"&#xe063;"},{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"d"}]
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 54" ] = ( T ) ->
  result  = NCR.chunks_from_text 'ab&jzr#xe063;d', input: 'xncr', output: 'html'
  matcher = [{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"ab"},{"~isa":"NCR/chunk","csg":"jzr","rsg":"jzr","text":"&#xe063;"},{"~isa":"NCR/chunk","csg":"u","rsg":"u-latn","text":"d"}]
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 79" ] = ( T ) ->
  result  = NCR.as_fncr     '&#x1;',        input:  'xncr', csg: 'jzr'
  matcher = 'jzr-1'
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 80" ] = ( T ) ->
  result  = NCR.as_fncr     '&#xe123;',     input:  'xncr', csg: 'jzr'
  matcher = 'jzr-e123'
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 83" ] = ( T ) ->
  T.eq ( NCR.as_range_name '&#xe100;',     input: 'ncr' ), 'Private Use Area'
  T.eq ( NCR.as_range_name '&#xe100;',     input: 'plain' ), 'Basic Latin'
  T.eq ( NCR.as_range_name '&#xe100;',     input: 'xncr' ), 'Private Use Area'
  T.eq ( NCR.as_range_name '&jzr#xe100;',  input: 'ncr' ), 'Basic Latin'
  T.eq ( NCR.as_range_name '&jzr#xe100;',  input: 'plain' ), 'Basic Latin'
  T.eq ( NCR.as_range_name 'a' ), 'Basic Latin'
  T.eq ( NCR.as_range_name '𤕣' ), 'CJK Unified Ideographs Extension B'
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "test # 88" ] = ( T ) ->
  result  = NCR.as_range_name '&jzr#xe100;',  input: 'xncr'
  matcher = 'jzr'
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 96" ] = ( T ) ->
  result  = NCR.as_rsg '&jzr#xe100;', input: 'xncr'
  matcher = 'jzr'
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 97" ] = ( T ) ->
  result  = NCR.as_rsg '&#x1;', input: 'xncr', csg: 'jzr'
  matcher = 'jzr'
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 98" ] = ( T ) ->
  result  = NCR.as_rsg      '&#xe100;',     input:  'xncr', csg: 'jzr'
  matcher = 'jzr'
  T.eq result, matcher

#-----------------------------------------------------------------------------------------------------------
@[ "test # 122" ] = ( T ) ->
  result  = NCR.html_from_text '&jzr#xe101; & you', input: 'xncr'
  matcher = """<span class="jzr">&#xe101;</span><span class="u-latn"> &amp; you</span>"""
  T.eq result, matcher

### # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #  ###
###  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # ###

# #-----------------------------------------------------------------------------------------------------------
# @[ "(v2) create derivatives of NCR (1)" ] = ( T ) ->
#   reducers =
#     '*':          'assign'
#     unicode_isl: ( values ) -> NCR._ISL.copy NCR.unicode_isl
#   #.........................................................................................................
#   mix             = ( require 'multimix006modern' ).mix.use reducers
#   XNCR            = mix NCR, { _input_default: 'xncr', }
#   XNCR._aggregate = XNCR._ISL.aggregate.use XNCR.unicode_isl
#   XNCR._ISL.add XNCR.unicode_isl, { lo: 0x00, hi: 0xff, rsg: 'u-foobar', }
#   ### TAINT because `aggregate` memoizes results, you must not add anything to the Unicode InterSkipList
#   after the first codepoint query—any result *might* reflect an outdated state of the data structure ###
#   #.........................................................................................................
#   T.ok  NCR.unicode_isl?
#   T.ok XNCR.unicode_isl?
#   T.ok XNCR.unicode_isl isnt NCR.unicode_isl
#   T.eq  NCR._input_default, 'plain'
#   T.eq XNCR._input_default, 'xncr'
#   T.eq (  NCR.analyze '&foo#x24563;' ), {"~isa":"NCR/info","chr":"&","uchr":"&","csg":"u","cid":38,"fncr":"u-latn-26","sfncr":"u-26","ncr":"&#x26;","xncr":"&#x26;","rsg":"u-latn"}
#   T.eq ( XNCR.analyze '&foo#x24563;' ), {"~isa":"NCR/info","chr":"&foo#x24563;","uchr":"𤕣","csg":"foo","cid":148835,"fncr":"foo-24563","sfncr":"foo-24563","ncr":"&#x24563;","xncr":"&foo#x24563;","rsg":'foo'}
#   # T.eq (  NCR.html_from_text 'abc&foo#x24563;xyzäöü丁三夫國形丁三夫國形丁三夫國形𫠠𧑴𨒡' ), "<span class=\"u-latn\">abc&amp;foo#x24563;xyz</span><span class=\"u-latn-1\">äöü</span><span class=\"u-cjk\">丁三夫國形丁三夫國形丁三夫國形</span><span class=\"u-cjk-xe\">𫠠</span><span class=\"u-cjk-xb\">𧑴𨒡</span>"
#   # T.eq ( XNCR.html_from_text 'abc&foo#x24563;xyzäöü丁三夫國形丁三夫國形丁三夫國形𫠠𧑴𨒡' ), "<span class=\"u-latn\">abc</span><span class=\"foo\">&#x24563;</span><span class=\"u-latn\">xyz</span><span class=\"u-latn-1\">äöü</span><span class=\"u-cjk\">丁三夫國形丁三夫國形丁三夫國形</span><span class=\"u-cjk-xe\">𫠠</span><span class=\"u-cjk-xb\">𧑴𨒡</span>"
#   T.eq (  NCR.html_from_text 'abc&foo#x24563;xyzäöü丁三𫠠' ), '<span class="u-latn">abc&amp;foo#x24563;xyz</span><span class="u-latn-1">äöü</span><span class="u-cjk">丁三</span><span class="u-cjk-xe">𫠠</span>'
#   T.eq ( XNCR.html_from_text 'abc&foo#x24563;xyzäöü丁三𫠠' ), '<span class="u-foobar">abc</span><span class="foo">&#x24563;</span><span class="u-foobar">xyzäöü</span><span class="u-cjk">丁三</span><span class="u-cjk-xe">𫠠</span>'
#   T.eq ( XNCR.as_rsg 'a' ), 'u-foobar'
#   T.eq (  NCR.as_rsg 'b' ), 'u-latn'
#   T.eq ( XNCR.as_rsg 'c' ), 'u-foobar'
#   T.eq (  NCR.as_rsg 'd' ), 'u-latn'
#   #.........................................................................................................
#   return null

#-----------------------------------------------------------------------------------------------------------
@[ "(v2) create derivatives of NCR (2)" ] = ( T ) ->
  XNCR = NCR._copy_library 'xncr'
  XNCR._ISL.add XNCR.unicode_isl, { lo: 0x00, hi: 0xff, rsg: 'u-foobar', }
  ### TAINT because `aggregate` memoizes results, you must not add anything to the Unicode InterSkipList
  after the first codepoint query—any result *might* reflect an outdated state of the data structure ###
  #.........................................................................................................
  T.ok  NCR.unicode_isl?
  T.ok XNCR.unicode_isl?
  T.ok XNCR.unicode_isl isnt NCR.unicode_isl
  T.eq  NCR._input_default, 'plain'
  T.eq XNCR._input_default, 'xncr'
  T.eq (  NCR.analyze '&foo#x24563;' ), {"~isa":"NCR/info","chr":"&","uchr":"&","csg":"u","cid":38,"fncr":"u-latn-26","sfncr":"u-26","ncr":"&#x26;","xncr":"&#x26;","rsg":"u-latn"}
  T.eq ( XNCR.analyze '&foo#x24563;' ), {"~isa":"NCR/info","chr":"&foo#x24563;","uchr":"𤕣","csg":"foo","cid":148835,"fncr":"foo-24563","sfncr":"foo-24563","ncr":"&#x24563;","xncr":"&foo#x24563;","rsg":'foo'}
  # T.eq (  NCR.html_from_text 'abc&foo#x24563;xyzäöü丁三夫國形丁三夫國形丁三夫國形𫠠𧑴𨒡' ), "<span class=\"u-latn\">abc&amp;foo#x24563;xyz</span><span class=\"u-latn-1\">äöü</span><span class=\"u-cjk\">丁三夫國形丁三夫國形丁三夫國形</span><span class=\"u-cjk-xe\">𫠠</span><span class=\"u-cjk-xb\">𧑴𨒡</span>"
  # T.eq ( XNCR.html_from_text 'abc&foo#x24563;xyzäöü丁三夫國形丁三夫國形丁三夫國形𫠠𧑴𨒡' ), "<span class=\"u-latn\">abc</span><span class=\"foo\">&#x24563;</span><span class=\"u-latn\">xyz</span><span class=\"u-latn-1\">äöü</span><span class=\"u-cjk\">丁三夫國形丁三夫國形丁三夫國形</span><span class=\"u-cjk-xe\">𫠠</span><span class=\"u-cjk-xb\">𧑴𨒡</span>"
  T.eq (  NCR.html_from_text 'abc&foo#x24563;xyzäöü丁三𫠠' ), '<span class="u-latn">abc&amp;foo#x24563;xyz</span><span class="u-latn-1">äöü</span><span class="u-cjk">丁三</span><span class="u-cjk-xe">𫠠</span>'
  T.eq ( XNCR.html_from_text 'abc&foo#x24563;xyzäöü丁三𫠠' ), '<span class="u-foobar">abc</span><span class="foo">&#x24563;</span><span class="u-foobar">xyzäöü</span><span class="u-cjk">丁三</span><span class="u-cjk-xe">𫠠</span>'
  T.eq ( XNCR.as_rsg 'a' ), 'u-foobar'
  T.eq (  NCR.as_rsg 'b' ), 'u-latn'
  T.eq ( XNCR.as_rsg 'c' ), 'u-foobar'
  T.eq (  NCR.as_rsg 'd' ), 'u-latn'
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "(v2) aggregate" ] = ( T ) ->
  # NCR       = require '../ncr'
  u         = NCR.unicode_isl
  ISL       = NCR._ISL
  probes_and_matchers = [
    [ 'q', {"tag":["assigned"],"rsg":"u-latn"}, ]
    [ '里', {"tag":["assigned","cjk","ideograph"],"rsg":"u-cjk"}, ]
    [ '䊷', {"tag":["assigned","cjk","ideograph"],"rsg":"u-cjk-xa"}, ]
    [ '《', {"tag":["assigned","cjk","punctuation"],"rsg":"u-cjk-sym"}, ]
    [ '🖹', {"tag":["assigned"]}, ]
    [ 887, {"tag":["assigned"],"rsg":"u-grek"}, ]
    [ 888, {"tag":["unassigned"],"rsg":"u-grek"}, ]
    [ 889, {"tag":["unassigned"],"rsg":"u-grek"}, ]
    [ 890, {"tag":["assigned"],"rsg":"u-grek"}, ]
    ]
  reducers  = { fallback: 'skip', fields: { 'tag': 'tag', 'rsg': 'assign', }, }
  for [ probe, matcher, ] in probes_and_matchers
    result = ISL.aggregate u, probe, reducers
    # debug '32771', JSON.stringify result
    T.eq result, matcher
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "(v2) query for fact" ] = ( T ) ->
  #.........................................................................................................
  u         = NCR.unicode_isl
  ISL       = NCR._ISL
  #.........................................................................................................
  # urge ISL.find_ids u, 'tag', 'cjk'
  # urge ISL.find_ids u, 'tag', 'assigned'
  # urge ISL.find_ids u, 'tag', 'foobar'
  # urge ISL.find_ids u, 'rsg', 'u-latn'
  # urge JSON.stringify ISL.find_entries u, 'tag', 'cjk'
  # urge JSON.stringify ISL.find_entries u, 'tag', 'assigned'
  # urge JSON.stringify ISL.find_entries u, 'tag', 'foobar'
  # urge JSON.stringify ISL.find_entries u, 'rsg', 'u-latn'
  # urge JSON.stringify ISL.find_entries u, 'rsg', 'u-cjk'
  # #.........................................................................................................
  # T.eq ( ISL.find_ids u, 'tag', 'cjk'           ), [ '+[2]', '+[4]' ]
  # T.eq ( ISL.find_ids u, 'tag', 'assigned'      ), [ '+[0]', '+[1]', '+[3]' ]
  T.eq ( ISL.find_ids u, 'tag', 'foobar'        ), []
  T.eq ( ISL.find_ids u, 'rsg', 'u-latn'        ), [ 'block:Basic Latin[0]' ]
  T.eq ( ISL.find_ids u, 'rsg', 'u-cjk'         ), [ 'block:CJK Unified Ideographs[0]' ]
  # T.eq ( ISL.find_entries u, 'tag', 'cjk'       ), [{"lo":37324,"hi":37324,"tag":["cjk","ideograph"],"idx":2,"id":"+[2]","name":"+","size":1},{"lo":17079,"hi":17079,"tag":["cjk","ideograph"],"idx":4,"id":"+[4]","name":"+","size":1}]
  # T.eq ( ISL.find_entries u, 'tag', 'assigned'  ), [{"lo":113,"hi":113,"tag":["assigned"],"rsg":"u-latn","idx":0,"id":"+[0]","name":"+","size":1},{"lo":37324,"hi":37324,"tag":["assigned"],"rsg":"u-cjk","idx":1,"id":"+[1]","name":"+","size":1},{"lo":17079,"hi":17079,"tag":["assigned"],"rsg":"u-cjk-xa","idx":3,"id":"+[3]","name":"+","size":1}]
  # T.eq ( ISL.find_entries u, 'tag', 'foobar'    ), []
  # T.eq ( ISL.find_entries u, 'rsg', 'u-latn'    ), [{"lo":113,"hi":113,"tag":["assigned"],"rsg":"u-latn","idx":0,"id":"+[0]","name":"+","size":1}]
  T.eq ( ISL.find_entries u, 'rsg', 'u-latn' ), [{"lo":0,"hi":127,"name":"block:Basic Latin","type":"block","block":"Basic Latin","rsg":"u-latn","comment":"(U+0..U+7f)","idx":676,"id":"block:Basic Latin[0]","size":128}]
  T.eq ( ISL.find_entries u, 'rsg', 'u-cjk' ), [{"lo":19968,"hi":40959,"name":"block:CJK Unified Ideographs","type":"block","block":"CJK Unified Ideographs","rsg":"u-cjk","comment":"(U+4e00..U+9fff)","idx":793,"id":"block:CJK Unified Ideographs[0]","size":20992}]
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "(v2) validates Unicode CID; does not validate non-Unicode CID" ] = ( T ) ->
  #.........................................................................................................
  hex = ( x ) -> '0x' + x.toString 16
  T.eq ( hex NCR.as_cid         '&#x0;', input: 'xncr' ),      '0x0'
  T.eq ( hex NCR.as_cid      '&#x1234;', input: 'xncr' ),   '0x1234'
  T.eq ( hex NCR.as_cid    '&#x10ffff;', input: 'xncr' ), '0x10ffff'
  T.throws "expected an integer between 0x000000 and 0x10ffff, got 0x110000", -> NCR.as_cid '&#x110000;', input: 'xncr'
  T.eq ( hex NCR.as_cid      '&foo#x0;', input: 'xncr' ),      '0x0'
  T.eq ( hex NCR.as_cid '&foo#x10ffff;', input: 'xncr' ), '0x10ffff'
  T.eq ( hex NCR.as_cid '&foo#x110000;', input: 'xncr' ), '0x110000'
  T.eq ( NCR.analyze '&#x1234;',         input: 'xncr' ), {"~isa":"NCR/info","chr":"ሴ","uchr":"ሴ","csg":"u","cid":4660,"fncr":"u-1234","sfncr":"u-1234","ncr":"&#x1234;","xncr":"&#x1234;","rsg":"u"}
  T.eq ( NCR.analyze '&mcs#x1234;',      input: 'xncr' ), {"~isa":"NCR/info","chr":"&mcs#x1234;","uchr":"ሴ","csg":"mcs","cid":4660,"fncr":"mcs-1234","sfncr":"mcs-1234","ncr":"&#x1234;","xncr":"&mcs#x1234;","rsg":"mcs"}
  T.eq ( NCR.analyze '&mcs#x6000c388;',  input: 'xncr' ), {"~isa":"NCR/info","chr":"&mcs#x6000c388;","uchr":null,"csg":"mcs","cid":1610662792,"fncr":"mcs-6000c388","sfncr":"mcs-6000c388","ncr":"&#x6000c388;","xncr":"&mcs#x6000c388;","rsg":"mcs"}
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "(v2) cloak" ] = ( T ) ->
  #.........................................................................................................
  text = 'helo \\world'
  help '(1)', rpr text
  help '(2)', rpr text = NCR._XXX_escape_chrs                  text
  help '(3)', rpr text = NCR._XXX_unescape_escape_chrs         text
  help '(4)', rpr text = NCR._XXX_remove_escaping_backslashes  text
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "(v2) backslashes (1)" ] = ( T ) ->
  #.........................................................................................................
  probes_and_matchers = [
    ["helo world",["h","e","l","o"," ","w","o","r","l","d"]]
    ["helo \\wo\\\\rld",["h","e","l","o"," ","w","o","\\","r","l","d"]]
    ["helo \\wo\\\\r\\ld\\!",["h","e","l","o"," ","w","o","\\","r","l","d","!"]]
    ["x\\",["x"]]
    ["x&jzr#xe100;x",["x","&","j","z","r","#","x","e","1","0","0",";","x"]]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    result = NCR.chrs_from_esc_text probe
    help JSON.stringify [ probe, result, ]
    T.eq matcher, result
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "(v2) backslashes (2)" ] = ( T ) ->
  #.........................................................................................................
  probes_and_matchers = [
    ["helo world",["h","e","l","o"," ","w","o","r","l","d"]]
    ["helo \\wo\\\\rld",["h","e","l","o"," ","w","o","\\","r","l","d"]]
    ["helo \\wo\\\\r\\ld\\!",["h","e","l","o"," ","w","o","\\","r","l","d","!"]]
    ["x\\",["x"]]
    ["x&jzr#xe100;x",["x","&jzr#xe100;","x"]]
    ["x\\&jzr#xe100;x",["x","&","j","z","r","#","x","e","1","0","0",";","x"]]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    result = NCR.chrs_from_esc_text probe, input: 'xncr'
    help JSON.stringify [ probe, result, ]
    T.eq matcher, result
  return null




############################################################################################################
if module is require.main then do =>
  # NCR = require '..'
  # debug '^3443^', new NCR.XXX_Ncr()
  test @

  # ( warn JSON.stringify key unless key in include ) for key in Object.keys @

  # XNCR = require './xncr'
  # text = 'A-&#x3004;-&jzr#xe100;-&morohashi#x56;-Z'
  # debug rpr ( XNCR.jzr_as_uchr chr for chr in XNCR.chrs_from_text text ).join ''
  # debug rpr XNCR.normalize_text text
  # debug JSON.stringify Object.keys @

  # @[ "(v2) create derivatives of NCR (3)" ]()



