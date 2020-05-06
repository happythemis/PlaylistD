import './App.css';
import SignIn from './SignIn'
import SignUp from './SignUp'
import Home from './Home'
import ChangePwd from './ChangePwd'
import DeleteAccount from './DeleteAccount'
import MyGroups from './MyGroups'
import MyFavSong from './MyFavSong'
import GroupManagement from './GroupManagement'

import React, {useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import HUE from '@material-ui/core/colors';
// import { createMuiTheme } from '@material-ui/core/styles';
import {createMuiTheme} from '@material-ui/styles'
import logo from './spotify-icon.png'; 




const useStyles = makeStyles(theme => ({
  root: {
        flexGrow: 1,
        // backgroundColor: #3f5a90,
        // backgroundColor: "DodgerBlue",
        // backgroundColor: '#00796b',
        // backgroundColor: "Green",
        // height: '100%',
        // display: "full",
  },
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    // backgroundColor: theme.palette.secondary.main,
  },
  // avatar: {
    // margin: theme.spacing(1),
    // backgroundColor: theme.palette.secondary.main,
  // },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),

  },
  
}));


export default function App() {
  const classes = useStyles();

  // 0->Not login;  1->Logged in
  const [login_status, change_login_status] = useState(0);////0///////
  const [user_id, change_user_id] = useState(-1);///-1//////////
  const [login_name, change_login_name] = useState('');
  const isBackgroundRed = true;

  function FormRow() {
    const navStyle = {
      color: 'white'
    };
    const logoStyle = {
      width: 50,
      height: 50,
    };
    return (
      <form className={classes.form} noValidate>
        {login_status ? (
          <navi>
            <div className="nav-logo">
              <img style={logoStyle} src={logo} />
              <h3>PlaylistD</h3>
            </div>
            <ul className ="nav-links">
              <Link style = {navStyle} to="/myfavsong">
                <li>My Fav Song</li>
              </Link>
              <Link style = {navStyle} to="/groupmanagement">
                <li>Group Management</li>
              </Link>
              <Link style = {navStyle} to="/mygroups">
                <li>My Groups</li>
              </Link>
              <Link style = {navStyle} to="/changepwd">
                <li>Change Password</li>
              </Link>
              <Link style = {navStyle} to="/deleteaccount">
                <li>Delete Account</li>
              </Link>
              <Link style = {navStyle} to="/">
                <li>Sign Out</li>
              </Link>
            </ul>
          </navi>
        ):(
          //Menu for NOT Signed in Status
          <navi>
            <div className="nav-logo">
              <img style={logoStyle} src={logo} />
              <h3>PlaylistD</h3>
            </div>
            <ul className ="nav-links">
              <Link style = {navStyle} to="/signin">
                <li>Sign In</li>
              </Link>
              <Link style = {navStyle} to="/signup">
                <li>Sign Up</li>
              </Link>
            </ul>
          </navi>  
        )}
      </form>
    );
  }
  
  return (
      <Router>
        <div className="App">
          {/* <Nav/> */}
          <FormRow/>
          <Switch>
            <Route
              exact path="/"
              render={(props) => <Home {...props} cls={change_login_status}
              cln={change_login_name} cui={change_user_id}/>}
            />
            <Route
              exact path="/signin"
              render={(props) => <SignIn {...props} cls={change_login_status} ls={login_status}
              cln={change_login_name} ln={login_name} cui={change_user_id}/>}
            />
            <Route exact path="/signup" component={SignUp} />
            <Route
              exact path="/changepwd"
              render={(props) => <ChangePwd {...props} ls = {login_status} ui={user_id}/>}
            />
            <Route 
              exact path="/deleteaccount"
              render={(props) => <DeleteAccount {...props} cls={change_login_status} ls={login_status}
              cui={change_user_id} cln={change_login_name} ui={user_id}/>}
            />
            <Route 
              exact path="/myfavsong"
              render={(props) => <MyFavSong {...props} ls={login_status}
              ui={user_id}/>}
            />
            <Route 
              exact path="/mygroups"
              render={(props) => <MyGroups {...props} ls={login_status}
              ui={user_id}/>}
            />
            <Route 
              exact path="/groupmanagement"
              render={(props) => <GroupManagement {...props} ls={login_status}
              ui={user_id}/>}
            />
          </Switch>
        </div>
      </Router>
  );
}

