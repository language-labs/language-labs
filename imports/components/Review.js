import React from 'react';
import { Meteor } from 'meteor/meteor';
import Stars from './Stars';

class Review extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(rating) {
    //As it is, this will select the current users profile. Later, we just need to switch the
    //Meteor.user().profile.peerId with the peerId of whoever they are paired with to rate other person instead
    var user = Meteor.users.findOne({ 'profile.peerId': Meteor.user().profile.peerId });

    var reviews = user.profile.reviews || [];

    reviews.push(rating);

    Meteor.users.update({_id: user._id}, {$set: {'profile.reviews': reviews}});
    //This same format can be used to easily add different review values in whatever domains we want
  
    console.log('Users current reviews', Meteor.user().profile.reviews);
  }


  render() {
    return (
      <div className='review'>
        <span> 
          Help out your partner by giving them some feedback
        </span>
        <h2> How was your conversation? </h2>
        <Stars 
          submit={this.handleSubmit.bind(this)} 
        />
      </div>
    );
  }
}

export default Review;
