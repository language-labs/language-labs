var languages = 'Afrikaans af Irish ga Albanian sq Italian it Arabic ar Japanese ja Azerbaijani az Kannada kn Basque eu Korean ko Bengali bn Latin la Belarusian be Latvian lv Bulgarian bg Lithuanian lt Catalan ca Macedonian mk Malay ms Maltese mt Croatian hr Norwegian no Czech cs Persian fa Danish da Polish pl Dutch nl Portuguese pt English en Romanian ro Esperanto eo Russian ru Estonian et Serbian sr Filipino tl Slovak sk Finnish fi Slovenian sl French fr Spanish es Galician gl Swahili sw Georgian ka Swedish sv German de Tamil ta Greek el Telugu te Gujarati gu Thai th Turkish tr Hebrew iw Ukrainian uk Hindi hi Urdu ur Hungarian hu Vietnamese vi Icelandic is Welsh cy Indonesian id Yiddish yi'
var speeches = 'Afrikaans af Basque eu Bulgarian bg Catalan ca Arabic ar-EG Czech cs Dutch nl-NL English en-US Finnish fi French fr-FR Galician gl German de-DE Hebrew he Hungarian hu Icelandic is Italian it-IT Indonesian id Japanese ja Korean ko Latin la Mandarin zh-CN Malaysian ms-MY Norwegian no-NO Polish pl Portuguese pt-PT Romanian ro-RO Russian ru Serbian sr-SP Slovak sk Spanish es-US Swedish sv-SE Turkish tr Zulu zu'

var populateObj = function(languages) {
  var split = languages.split(' ');
  var obj = {};

  for (var i = 0; i < split.length; i += 2) {
    var key = split[i].toLowerCase();
    var value = split[i + 1];
    obj[key] = value;
  }
  return obj;
}
var languageCodes = populateObj(languages)
var speechCodes = populateObj(speeches);

module.exports = {
  languageCodes: languageCodes,
  speechCodes: speechCodes
}