import React from 'react';
import { Meteor } from 'meteor/meteor';
import Stars from './Stars';

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit() {
    var reviews = this.props.partner.reviews || [];
    reviews.push(this.state.rating);

    console.log('reviews', reviews);


    Meteor.call('updateRating', {
      newReviews: reviews,
      _id: this.props.partner._id
    }, 
    (err) => {
      if (err) { return console.log(err); }
    });

    //This same format can be used to easily add different review values in whatever domains we want
  }

  starClick(rating) {
    this.setState({
      rating: rating
    });
  }

  render() {
    return (
      <div className='review'>
        <span> 
          Help out {this.props.partner.username} by giving them some feedback
        </span>
        <h2> How was your conversation? </h2>
        <Stars
          starClick = {this.starClick.bind(this)} 
          submit={()=> {
            this.handleSubmit.call(this);
            setTimeout(() => this.props.clearPartner(), 0);
            location.reload();
          }}
        />
      </div>
    );
  }
}

export default Review;
