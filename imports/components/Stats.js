import React from 'react';
import { Meteor } from 'meteor/meteor';

class Stats extends React.Component {
  constructor(props) {
    super(props);
    console.log('user', Meteor.user());
  }

  render() {
    //Gets full user data from database
    var user = Meteor.users.find({'_id': Meteor.user()._id}).fetch()[0];
    //Compute avg rating for user

    var ratings = user.reviews || [];

    var count = 0;
    for (var i = 0; i < ratings.length; i++) {
      count += ratings[i];
    }
    var avgRating = count / ratings.length;

    return (
      <div className='stats'>
        <h3> Usage Stats </h3>
        <div className='avgReviews'>
          <h5> Your current rating average is </h5>
          <h3> {avgRating} </h3>
        </div>
        <div className='avgCallLength'>
          <h5> Your average chat has been... </h5>
          <h3> (some value) minutes long </h3>
        </div>
      </div>
    );
  }
}

export default Stats;

