import React             from 'react';
import { Meteor }        from 'meteor/meteor';
import AccountsUIWrapper from './accounts'
import SelectLanguage    from './SelectLanguage';
import Matches           from './Matches';
import UserProfile       from './UserProfile'
import Clock             from './Clock';
import TopicSuggestion   from './TopicSuggestion';
import Review            from './Review';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inCall: false,
      callDone: true,
      initialCall: true
    };
  }

  startChat(users, peer) {
    // get html video elements
    var myVideo = this.refs.myVideo;
    var theirVideo = this.refs.theirVideo;
    
    // get audio/video permissions
    navigator.getUserMedia({audio: true, video: true}, function (stream) {  
      // show own videostream of user
      myVideo.src = URL.createObjectURL(stream);
      
      // give the current user a peerId
      Meteor.users.update({_id: Meteor.userId()}, {
        $set: { 'profile.peerId': peer.id }
      });

      // find other person to call
      var user = users[0];

      // receive a call from other person
      peer.on('call', function (incomingCall) {
        incomingCall.answer(stream);
        incomingCall.on('stream', function (theirStream) {
          theirVideo.src = URL.createObjectURL(theirStream);
        });
      });

      // if call not received first, call other person
      var outgoingCall = peer.call(user.profile.peerId, stream);
      outgoingCall.on('stream', function (theirStream) {
        theirVideo.src = URL.createObjectURL(theirStream);
      });
    }, function (error) { 
      console.log(error); 
    });
  }

  toggleCall() {

    if (this.state.initialCall) {
      this.setState({
        initialCall: false,
        inCall: !this.state.inCall,
        callDone: !this.state.callDone
      });
    } else {
      this.setState({
        inCall: !this.state.inCall,
        callDone: !this.state.callDone
      });
    }
  }

  render() {
    return (
      <div className='dashboard'>
        <div className='top'>
          <div className='video-box'>
            {this.state.inCall ?
              <div className='video-wrapper'>
                <video 
                  ref='myVideo' 
                  id='myVideo' 
                  muted='true' 
                  autoPlay='true'
                ></video>
                <video 
                  ref='theirVideo' 
                  id='theirVideo' 
                  autoPlay='true'
                ></video>
              </div>
              : this.state.callDone && !this.state.initialCall
                ? <Review />
                : <p>Waiting</p>
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
            <Clock />
            <TopicSuggestion />
            {/*This button toggles call on/off to conditionally render call or review logic */}
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
              <button 
                onClick={() => {
                  this.toggleCall();
                  setTimeout(() => {
                    this.startChat(this.props.onlineUsers, this.props.peer)
                  }, 100)
                }}
              > {this.state.inCall 
                  ? 'End Chat' 
                  : 'Start Chat'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Dashboard;