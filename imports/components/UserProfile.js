import React from 'react';
import { Meteor } from 'meteor/meteor';
import InlineEdit from 'react-edit-inline';

class UserProfile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      language:  Meteor.user().profile.language  || '',
      learning:  Meteor.user().profile.learning  || '',
      location:  Meteor.user().profile.location  || '',
      interests: Meteor.user().profile.interests || '',
    }
  }

  update(data) {
    const update = Object.keys(data)[0];
    const id = Meteor.userId();
    const newData = data[update];

    this.setState({...data});
    
    if (update === 'language') {
      return Meteor.users.update(id, {$set: {'profile.language': newData}});
    }
    if (update === 'learning') {
      return Meteor.users.update(id, {$set: {'profile.learning': newData}});
    }
    if (update === 'location') {
      return Meteor.users.update(id, {$set: {'profile.location': newData}});
    }
    if (update === 'interests') {
      return Meteor.users.update(id, {$set: {'profile.interests': newData}});
    }
  }

  render() {
    return (
      <div className='user-profile'>
        <div className='profile-input-wrapper'>
          <div className='title'>
            I Speak 
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </div>
          <InlineEdit
            activeClassName="editing"
            text={this.state.language}
            paramName="language"
            change={this.update.bind(this)}
            className='profile-input'
          />
        </div>
        <div className='profile-input-wrapper'>
          <div className='title'>
            I'm Learning
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </div>
          <InlineEdit
            activeClassName="editing"
            text={this.state.learning}
            paramName="learning"
            change={this.update.bind(this)}
            className='profile-input'
          />
        </div>
        <div className='profile-input-wrapper'>
          <div className='title'>
            My Location
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </div>
          <InlineEdit
            activeClassName="editing"
            text={this.state.location}
            paramName="location"
            change={this.update.bind(this)}
            className='profile-input'
          />
        </div>
        <div className='profile-input-wrapper'>
          <div className='title'>
            Interests
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </div>
          <InlineEdit
            activeClassName="editing"
            text={this.state.interests}
            paramName="interests"
            change={this.update.bind(this)}
            className='profile-input'
          />
        </div>
      </div>
    );
  }
}

export default UserProfile;