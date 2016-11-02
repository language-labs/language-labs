import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

const GoogleTranslate = ({handleTextChange, handleTextSubmit, translated}) => {
	if (translated !== null ) {
		return (
		  <div className="topics">
		    <h5> Translate </h5>
		    <textarea className="googleTranslateInput" rows="4" cols="30" value = {translated} onKeyUp={handleTextChange.bind(this)}> </textarea>
		    <div className='button-wrapper'>
		    	<button type="submit" className="googleTranslateButton" onClick={handleTextSubmit.bind(this)}> Translate! </button>
			</div>
		  </div>
		);
	} else {
		return (
		  <div className="topics">
		    <h5> Translate </h5>
		    <textarea className="googleTranslateInput" rows="4" cols="30" onKeyUp={handleTextChange.bind(this)}> </textarea>
		    <div className='button-wrapper'>
		    	<button type="submit" className="googleTranslateButton" onClick={handleTextSubmit.bind(this)}> Translate! </button>
			</div>
		  </div>
		);
	}
}

export default GoogleTranslate;