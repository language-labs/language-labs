import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
var languageCodes = require( '../../public/languageCodes');
var request = require('request');

class SpeechToTextBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    	translatedText: null,
    	languageToLearn: null,
    	currentLanguage: null
    };
  }




  componentDidMount() {
  	var context = this;
  	var handleTranslation = function (text) {
  	  var textToTranslate = text;
  	  var sourceLang = languageCodes[context.props.currentLanguage];
  	  var targetLang = languageCodes[context.props.languageToLearn];

  	  var url = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyC9JmWKmSXKwWuB82g3aZKF9yiIczu5pao&q=' + 
  	            textToTranslate +
  	            '&source=' + sourceLang + '&'
  	            + 'target=' + targetLang;

  	  request.get(url, function(err, res, body) {
  	    if (err) {
  	      console.error(err);
  	    } else {
  	      console.log(JSON.parse(body).data.translations[0].translatedText);
  	      var translatedText = (JSON.parse(body).data.translations[0].translatedText);
  	      console.log('this is the translated text', translatedText);
  	      context.setState({
  	        translatedText: translatedText
  	      });
  	      console.log('this is what state looks like', context.state.translated);
  	    }
  	  });
  	}

  	if (!('webkitSpeechRecognition' in window)) {
  	    //Speech API not supported here…
  	} else { //Let’s do some cool stuff :)
  		var context = this;
  	    var recognition = new webkitSpeechRecognition();
  	    recognition.continuous = true; 
  	    recognition.interimResults = true; 
  	    recognition.lang = "en-US"; 
  	    recognition.maxAlternatives = 1;

  	    recognition.onstart = function() {
  	    };

  	    recognition.onend = function() {
  	    };

  	    recognition.onresult = function(event) { 
  	        if (typeof(event.results) === 'undefined') { 
  	            recognition.stop();
  	            return;
  	        }

  	        for (var i = event.resultIndex; i < event.results.length; ++i) {      
  	            if (event.results[i].isFinal) {
  	                handleTranslation(event.results[i][0].transcript);
  	            } else { 
  	                handleTranslation(event.results[i][0].transcript);
  	            } 
  	        } 
  	    }; 
  	    recognition.start();
  	}
  }



  render() {
  	return (
  		<div className='clock'>
  		  <h4> {'Live translating ' + this.props.currentLanguage + ' to ' + this.props.languageToLearn}  </h4> 
  		  	<p> {this.state.translatedText} </p>
  		</div>
	)
  }
}

export default SpeechToTextBox;