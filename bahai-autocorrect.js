// code to translate one or more Baha'i terms to TTS phonemes
// 

var phonemes = {};

function parse_words_replace_ipa(text) {
  var words = text.split(' ');
  words.forEach(function(element, index, array){
    if (_is_term(element)) array[index] = _term_to_ipa(element)
  });
  return words.join(' '); 
} 
 
function _is_term(term) {
  term = term.toLowerCase().trim();
  // trim leading and trailing punctuation
  var newterm = term.replace(/^[^a-zḥṭẓḍ_áíú]/g, '').replace(/[^a-zḥṭẓḍ_áíú]$/g, ''); 
  var isTerm = (newterm != newterm.replace(/[ẓḥṭẓḍ_áíú’‘]/g, ''));
  return isTerm;
}

function _strip_accents(term) {
    var in_chrs =  'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ',
        out_chrs = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY',
        transl = {};
    eval('var chars_rgx = /['+in_chrs+']/g');
    for(var i = 0; i < in_chrs.length; i++){ transl[in_chrs.charAt(i)] = out_chrs.charAt(i); }
    return term.replace(chars_rgx, function(match){ return transl[match]; });
}

function _term_to_ipa(term) {
  var original = term;
  var prefix = term.replace(/^([^a-zḥṭẓḍ_áíú]*).*/i, '$1');
  var suffix = term.replace(/.*?([^a-zḥṭẓḍ_áíú]*)$/i, '$1');
  var term = term.replace(/^[^a-zḥṭẓḍ_áíú]/ig, '').replace(/[^a-zḥṭẓḍ_áíú]$/ig, ''); 

   // Bahá’u’lláh ->  ba hah ow lah
  term = term.toLowerCase().trim();
  // conver html to glyph
  term = term.replace(/<u>/g, '_').replace(/<\/u>/g,'');
  // remove any remaining tags and whitespace
  term = term.replace(/<(.|\n)*?>/g, '').replace(/\s+/g, ' ').trim();
  // replace any letters that sound like another
  term = term.replace(/ḍ/g, 'z').replace(/_dh/g, 'z').replace(/_th/g, 's').replace(/u/g, 'o').replace(/aw/g, 'o');
  term = term.replace(/_gh/g, 'g');

  // connectors
  term = term.replace(/-i-/g, 'i-')
   .replace(/’(d-D|_kh-_kh|_sh-_sh|_ch-_ch|_zh-_zh|b-b|p-p|j-j|t-t|d-d|r-r|z-z|s-s|f-f|q-q|k-k|l-l|m-m|n-n|h-h)/, '$1') ;
  // remove beginning or ending ayn and hamza
  term = term.replace(/^[’‘]/, '').replace(/[’‘]$/, ''); 

  var vowels = {
    'ay' : 'eI',
    'iy' : 'eI',
    'ih' : 'eI',
    'a'  : '@',
    'á'  : 'A:',
    'i'  : 'e',
    'í'  : 'i:',
    'o'  : '@U',
    'ú'  : 'u:'
  };
  var consonants = {
    '_kh' : 'x',
    '_zh' : 'Z',
    '_sh' : 'S',
    '_ch' : 'tS',
    'b'   : 'b',
    'p'   : 'p',
    'j'   : 'dZ',
    't'   : 't',
    'ṭ'   : 't',
    'd'   : 'd',
    'r'   : 'r',
    'z'   : 'z',
    'ẓ'   : 'z',
    's'   : 's',
    'ṣ'   : 's',
    'f'   : 'f',
    'q'   : 'g',
    'k'   : 'k',
    'l'   : 'l',
    'm'   : 'm',
    'n'   : 'n',
    'h'   : 'h',
    'ḥ'   : 'h',
    'w'   : 'w',
    'v'   : 'v',
    'y'   : 'j',
    '’'   : '?',
    '‘'   : '?',
    '-'   : '?',
  };
  for(var key in vowels) if (key.length>1) {
    var regex = new RegExp(key, 'gi');
    term = term.replace(regex, vowels[key]+' ');
  }
  for(var key in consonants) if (key.length>1) {
    var regex = new RegExp(key, 'gi');
    term = term.replace(regex, consonants[key]+' ');
  }

  for(var key in vowels) if (key.length<2) {
    var regex = new RegExp(key, 'gi');
    term = term.replace(regex, vowels[key]+' ');
  }
  for(var key in consonants) if (key.length<2) {
    var regex = new RegExp(key, 'gi');
    term = term.replace(regex, consonants[key]+' ');
  }

  return prefix +'[['+ term.trim() + ']]'+ suffix; 
}


phoneme.replace = parse_words_replace_ipa;
module.export = phoneme;
 