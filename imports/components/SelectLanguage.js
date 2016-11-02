import React from 'react';
import { Meteor } from 'meteor/meteor';

class SelectLanguage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentStage: 0,
      stages: [
        { 
          placeholder:  'What language do you speak?',
          propertyName: 'language'
        },{ 
          placeholder:  'What language do you want to learn?',
          propertyName: 'learning'
        },{ 
          placeholder:  'Where are you located?',
          propertyName: 'location'
        },{ 
          placeholder:  'What are some of your interests?',
          propertyName: 'interests',
          instructions: 'Place a comma after each entry'
        }
      ],
    }
  }

  updateUser(event) {
    event.preventDefault();

    let query = {}
    let property = 'profile.' + this.state.stages[this.state.currentStage].propertyName

    query[property] = this.languageInput.value

    Meteor.users.update(this.props.id, {$set: query});
    this.languageInput.value = "";

    if (this.state.currentStage < 3) {
      this.setState({
        currentStage: this.state.currentStage + 1
      });
    } else {
      Meteor.users.update(this.props.id, {$set: {'profile.complete': true}});
    }
  }

  render() {
    return (
      <div className='language-select'>
        <form 
          className='language-form'
          onSubmit={this.updateUser.bind(this)}
        >   
         <div className='form-instructions'>
           {this.state.stages[this.state.currentStage].instructions || ''}
         </div>
          <input 
            type="text" 
            onFocus={()=> this.languageInput.placeholder = ''}
            placeholder={this.state.stages[this.state.currentStage].placeholder}
            ref={(ref) => this.languageInput = ref}
          />
          <br />
          <button 
            type="submit" 
            className='submit-button'
          > ENTER 
          </button>
        </form>
      </div>
    );
  }
}


export default SelectLanguage;