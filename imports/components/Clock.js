import React from 'react';
import { Meteor } from 'meteor/meteor';

class Clock extends React.Component {
  constructor(props) {
    super(props);

    //Create array of language options, sorted alphabetically
    var user = Meteor.user().profile;
    var languages = [user.language, user.learning];
    languages.sort();

    this.state = { 
      seconds: 0,
      minutes: 0,
      printable: '0:00',
      languages: languages,
      timerUnused: true
    };
  }

  startClock() {
    timerInterval = setInterval(this.timerTick.bind(this), 1000);
    this.setState({
      timerUnused: false,
      timerInterval: timerInterval,
    });
  }


  timerTick() {
    var secs = this.state.seconds + 1;
    var mins = this.state.minutes;
    if (secs === 60) {
      secs = 0;
      mins ++;
    }

    var print = secs < 10 ? '0' + secs : '' + secs;
    print = mins + ':' + print;

    //toggle between languages every 5 minutes
    var current = '';
    var notCurrent = '';

    if (mins % 10 < 1) {
      current = this.state.languages[0];
      notCurrent = this.state.languages[1];
    } else {
      current = this.state.languages[1];
      notCurrent = this.state.languages[0];
    }

    this.setState({
      seconds: secs,
      minutes: mins,
      printable: print,
      language: current,
      notLanguage: notCurrent
    });
  }

  clickHandler(e) {
    e.preventDefault();
    console.log('this is the current language', this.state.language);
    this.props.handleSpeechActive.call();
    this.props.setCurrentLanguage.call(this, this.state.language, this.state.notLanguage);  
  }


  render() {
    //Start timer when video chat starts
    if (this.props.partner && this.state.timerUnused) {
      this.startClock();
    }
    //Stop timer when call is done
    if (this.props.callDone) {
      clearInterval(this.state.timerInterval);
    }

    return (
      <div className='clock'>
        <i className="fa fa-clock-o" aria-hidden="true"></i>
        <h4>  It's time to speak {this.state.language} </h4>
        <h3> 
          {this.state.printable} 
        </h3>
        <div className="button-wrapper">
          <button className="toggleButton"  onClick={this.clickHandler.bind(this)}> Live Translate! </button>
        </div>
      </div>
    );
  }
}

export default Clock;
