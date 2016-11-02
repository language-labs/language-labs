var languageCodes = {
};

var languages = 'Afrikaans af Irish ga Albanian sq Italian it Arabic ar Japanese ja Azerbaijani az Kannada kn Basque eu Korean ko Bengali bn Latin la Belarusian be Latvian lv Bulgarian bg Lithuanian lt Catalan ca Macedonian mk Malay ms Maltese mt Croatian hr Norwegian no Czech cs Persian fa Danish da Polish pl Dutch nl Portuguese pt English en Romanian ro Esperanto eo Russian ru Estonian et Serbian sr Filipino tl Slovak sk Finnish fi Slovenian sl French fr Spanish es Galician gl Swahili sw Georgian ka Swedish sv German de Tamil ta Greek el Telugu te Gujarati gu Thai th Turkish tr Hebrew iw Ukrainian uk Hindi hi Urdu ur Hungarian hu Vietnamese vi Icelandic is Welsh cy Indonesian id Yiddish yi'

var populateObj = function(languages) {
	var split = languages.split(/(?=[A-Z])/);
	for (var i = 0; i < split.length; i++) {
		var pair = split[i].slice(0, split[i].length - 1);
		var key = pair.substring(0, pair.lastIndexOf(" ")).toLowerCase();	
		var value = pair.substring(pair.lastIndexOf(" ") + 1).toLowerCase();

		languageCodes[key] = value;
	}
}
populateObj(languages);
console.log(languageCodes);

module.exports = languageCodes;