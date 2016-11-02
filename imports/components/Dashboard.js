import React             from 'react';
import { Meteor }        from 'meteor/meteor';
import AccountsUIWrapper from './accounts';
import SelectLanguage    from './SelectLanguage';
import Matches           from './Matches';
import UserProfile       from './UserProfile';
import Clock             from './Clock';
import TopicSuggestion   from './TopicSuggestion';
import Review            from './Review';
import Waiting           from './Waiting';
import Welcome           from './Welcome';
import GoogleTranslate   from './GoogleTranslate';
import SpeechToTextBox   from './SpeechToTextBox';
var request = require('request');
var languageCodes = require( '../../public/languageCodes');

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localStream: false,
      currentCall: false,
      callDone: false,
      callLoading: false,
      partner: false,
      translate: null,
      translated: null,
      speechToText: false
    };

    this.startChat.bind(this);
    this.endChat.bind(this);
  }

  startChat(users, peer) {
    // save context
    var dashboard = this;

    // get html video elements
    var myVideo = this.refs.myVideo;
    var theirVideo = this.refs.theirVideo;
    
    // get audio/video permissions
    navigator.getUserMedia({ audio: true, video: true }, function (stream) {
      // save your users own feed to state
      dashboard.setState({ localStream: stream });

      // show loading screen
      dashboard.toggleLoading(true);

      // show own videostream of user
      myVideo.src = URL.createObjectURL(stream);

      // give the current user a peerId and save their streamId
      Meteor.users.update({_id: Meteor.userId()}, {
        $set: {
          'profile.peerId': peer.id,
          'profile.streamId': stream.id
        }
      });

      // find other person to call
      var user = users[0];

      // setTimeout needed to ensure partner can be found
      setTimeout(function() {
        // receive a call from other person
        if (!dashboard.state.currentCall) {
          peer.on('call', function (incomingCall) {
            dashboard.setState({ currentCall: incomingCall });
            incomingCall.answer(stream);
            incomingCall.on('stream', function (theirStream) {
              dashboard.toggleLoading(false);
              theirVideo.src = URL.createObjectURL(theirStream);
              dashboard.setPartner(theirStream.id);
            });
          });
        }

        // if call not received first, call other person
        if (!dashboard.state.currentCall) {
          var outgoingCall = peer.call(user.profile.peerId, stream);
          dashboard.setState({ currentCall: outgoingCall });
          outgoingCall.on('stream', function (theirStream) {
            dashboard.toggleLoading(false);
            theirVideo.src = URL.createObjectURL(theirStream);
            dashboard.setPartner(theirStream.id);
          });
        }

        // if other person ends chat, end chat too
        dashboard.state.currentCall.on('close', function() {
          dashboard.endChat();
        });
      }, 200);
    }, function (error) { 
      console.log(error); 
    });
  }

  endChat() {
    // close peerjs connection
    this.state.currentCall.close();
 
    // turn off camera and microphone
    this.state.localStream.getTracks().forEach(function(track) {
      track.stop();
    });

    // remove streams from html video elements
    this.refs.myVideo.src = null;
    this.refs.theirVideo.src = null;
    
    this.setState({ 
      currentCall: false,
      callDone: true 
    });
  }

  toggleLoading(loading) {
    this.setState({
      callLoading: loading
    });
  }

  setPartner(id) {
    var partner = Meteor.users.findOne({ 'profile.streamId': id });
    if (partner) {
      this.setState({
        partner: partner
      });
    }
  }

  clearPartner () {
    this.setState({
      partner: false,
      callDone: false
    });
  }

  handleTextChange(e) {
    var text = e.target.value;
    this.setState({
      translate: text,
      translated: null
    });
  };

  // handleSpeechActive(e) {
  //   console.log('hit live translate button!');
  //   this.setState({
  //     speechToText: !this.state.speechToText
  //   });
  // }

  handleTextSubmit() {
    var textToTranslate = this.state.translate;
    var sourceLang = languageCodes[this.props.user.profile.language].toLowerCase();
    var targetLang = languageCodes[this.props.user.profile.learning].toLowerCase();
    var context = this;



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
          translated: translatedText
        });
        console.log('this is what state looks like', context.state.translated);
      }
    });
  }


  flipCard() {
     console.log(document.querySelector(".flip-container").className);
      if (document.querySelector(".flip-container").className.includes('flip-activate')) {
        document.querySelector(".flip-container").className = "flip-container"
      } else {
        document.querySelector(".flip-container").className += ' flip-activate'
      }
   }

  render() {
    return (
      <div className='dashboard'>
        <div className='top'>
          <div className='video-box'>
            {!this.state.callDone &&
              <div className='video-wrapper'>
                {!this.state.callLoading && !this.state.currentCall &&
                  <Welcome numMatches={this.props.onlineUsers.length}/>
                }
                {this.state.callLoading &&
                  <Waiting />
                }
                <video ref='myVideo' id='myVideo' muted='true' autoPlay='true' 
                  className={this.state.callLoading ? 'hidden' : null}></video>
                <video ref='theirVideo' id='theirVideo' muted='true' autoPlay='true'
                  className={this.state.callLoading ? 'hidden' : null}></video>
              </div>
            }

            {!this.state.currentCall && this.state.callDone &&
              <Review 
                partner={this.state.partner}
                clearPartner={this.clearPartner.bind(this)}
              />
            }
          </div>
          <div className='profile'>
            <div className='sign-out'>
              <AccountsUIWrapper />
            </div>
            <UserProfile user={this.props.user}/>
          </div>
        </div>
        <div className='bottom'>
          <div className='text-box'>
          {
            this.state.partner &&

            <div className="clock-suggestion-wrapper">
              <div className="flip-container">
                <div className="flipper">
                  <div className="front">
                    <Clock partner={this.state.partner} callDone={this.state.callDone} handleSpeechActive={this.flipCard.bind(this)}/>
                  </div>
                  <div className="back">
                    <SpeechToTextBox handleSpeechActive={this.flipCard.bind(this)} currentLanguage={this.props.user.profile.language.toLowerCase()} languageToLearn={this.props.user.profile.learning.toLowerCase()}/>
                  </div>
                </div>
              </div>
              <GoogleTranslate translated={this.state.translated} handleTextChange={this.handleTextChange.bind(this)} handleTextSubmit={this.handleTextSubmit.bind(this)}/>
            </div>
          }
            {
              !this.state.partner &&
              <div className='waiting-for-match'>Waiting for match...</div>
            }
          </div>
          <div className='new-chat'>
            <div className='selected-language'>
              Selected Languages
            </div>
            <div className='language'>
              {
               `${this.props.user.profile.language} / 
                ${this.props.user.profile.learning}`
              }
            </div>
            <div className='button-wrapper'>
              {!this.props.onlineUsers[0] &&
                <button>Waiting</button>
              }
              {this.props.onlineUsers[0] && !this.state.currentCall &&
                <button onClick={this.startChat.bind(this, this.props.onlineUsers, this.props.peer)}>
                  Start Chat
                </button>
              }
              {this.state.currentCall &&
                <button onClick={this.endChat.bind(this)}>
                  End Chat
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;