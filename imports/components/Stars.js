import React from 'react';

class Star extends React.Component {
  constructor() {
    super();
  }

  render () {
    var starClass = 'fa fa-3x fa-star';
    if (!this.props.selected) {
      starClass += '-o';
    }

    return (
      <i {...this.props} className={starClass} style={{color: '#5fa9d9'}} />
    );
  }
}

class Rating extends React.Component {
  constructor() {
    super();

    this.state = {
      rating: 0,
      hoverAt: null
    };
  }

  handleMouseOver(index) {
    this.setState({
      hoverAt: index + 1
    });
  }

  handleMouseOut(index) {
    this.setState({
      hoverAt: null
    });
  }

  handleClick(index) {
    this.setState({
      rating: index + 1
    });
  }

  render() {
    var stars = [];
    for (var i = 0; i < 5; i++) {
      var rating = this.state.hoverAt != null ? this.state.hoverAt : this.state.rating; 
      var selected = i < rating;
      stars.push(
        <Star key={i} selected={selected}
          onMouseOver={this.handleMouseOver.bind(this, i)}
          onMouseOut={this.handleMouseOut.bind(this, i)}
          onClick={this.handleClick.bind(this, i)}
        />
      );
    }
    return (
      <div className='stars'>
        <div>
         {stars}
        </div>
        <br />
        <button className='review-submit' 
          onClick={this.props.submit.bind(null, this.state.rating)}> 
            Submit 
        </button>
      </div>

    );
  }
}

export default Rating;
