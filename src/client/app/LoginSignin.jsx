import React from 'react';
import {render} from 'react-dom';
import Axios from '../../../node_modules/axios/lib/axios.js'; 
import { connect } from 'react-redux';
import {setUser, setCorrect, setIncorrect} from './actions/index.jsx';
import {Link} from 'react-router';
import {browserHistory} from 'react-router'
import {Alerts} from './Alerts.jsx';
import {AvatarChoices} from './AvatarChoices.jsx';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      avatarChoices: [],
      alertToUser: null
    }
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  login(username, password) {
    var context = this;
    Axios.post('http://localhost:3000/user/login', {
      username: username,
      password: password,
    })
    .then(function(res) {
      if (res.data.error) {
        console.log('unable to login');
        context.setState({alertToUser: 'unsuccessfulsignin'});
      } else {
        console.log(res.data);
        context.props.dispatch(setUser({
          username: res.data.username,
          userlvl: res.data.level,
          userAvatar: res.data.imageUrl,
        }));
        context.props.dispatch(setCorrect(res.data.correctAnswers));
        context.props.dispatch(setIncorrect(res.data.incorrectAnswers));
        browserHistory.push('/Arena');
      }
    })
  }

  register(username, password, url) {
    var context = this;
    Axios.post('http://localhost:3000/user/signup', {
      username: username,
      password: password,
      imageUrl: url,
    })
    .then(function(res) {
      if (res.data.error) {
        console.log('unable to register');
        context.setState({alertToUser: 'unsuccessfulregister'});
        context.setState({avatarChoices: []});
      } else {
        console.log(res.data);
        context.props.dispatch(setUser({
          username: res.data.username,
          userlvl: res.data.level,
          userAvatar: res.data.imageUrl,
        }));
        context.props.dispatch(setCorrect({
          addition: 0,
          subtraction: 0,
          multiplication: 0,
          division: 0,
        }));
        context.props.dispatch(setIncorrect({
          addition: 0,
          subtraction: 0,
          multiplication: 0,
          division: 0,
        }));
        browserHistory.push('/Arena');
      }
    })
  }

  getAvatars() {
    var context = this;
    Axios.get('https://www.googleapis.com/customsearch/v1?key=' + window.GMAP_KEY + '&cx=009407302250325958776:7xs2zpwdaho&q=happy%20cat&searchType=image&imgSize=small')
    .then(function(res) {
      context.setState({avatarChoices: res.data.items});
    });
  }

  dismissAlert() {
    this.setState({alertToUser: null});
  }

  render () {
    let displayChoices = this.state.avatarChoices.length > 0 ? <AvatarChoices register={this.register.bind(this)} avatarChoices={this.state.avatarChoices}/> : <div></div>

    let alertToUser = this.state.alertToUser !== null ? <Alerts alert={this.state.alertToUser} dismiss={this.dismissAlert.bind(this)}/> : <div></div>

    return (
      <div className="container" onSubmit={this.handleSubmit}>
        <form className="form-signin">
          <h2 className="form-signin-heading">Please sign in</h2>
          <label className="sr-only">Username</label>
          <input type="username" id="inputUsername" className="form-control" placeholder="Username" required autoFocus/>
          <label className="sr-only">Password</label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" required/>
          <button onClick={() => this.login(document.getElementById('inputUsername').value, document.getElementById('inputPassword').value)} className="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
          <button onClick={() => this.getAvatars()} className="btn btn-lg btn-primary btn-block" type="submit">Register</button>
        </form>

        <div id='alerts'>
          {alertToUser}
        </div>
        
        {displayChoices}

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  username : state.username,
  userlvl: state.userlvl,
  userAvatar: state.userAvatar,
  correctAnswers: state.userCorrectAnswers,
  incorrectAnswers: state.userIncorrectAnswers,
});

Login = connect(mapStateToProps)(Login);

export {Login};
