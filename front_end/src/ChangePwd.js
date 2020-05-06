import React, {useState}from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ChangePwd = (props) => {
  const classes = useStyles();
  const [old_pwd, setOld_pwd] = useState("");
  const [new_pwd, setNew_pwd] = useState("");
  const [change_success, setChange_success] = useState(0)
  const [change_fail, setChange_fail] = useState(0)

  if(!props.ls){
    return(
        <h1> Please sign in first</h1>
    );
  }

  if(change_success){
      return(
        <nav className = "HomeNav">
          <h1> Password change successfully</h1>
        </nav>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      {/* <CssBaseline /> */}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
        </Avatar>
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Old Password"
            type="password"
            id="old_password"
            autoComplete="current-password"
            value={old_pwd}
            onChange={e => setOld_pwd(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="new_password"
            autoComplete="current-password"
            value={new_pwd}
            onChange={p => setNew_pwd(p.target.value)}
          />
          {change_fail ? (
            <Typography component="h1" variant="h5">
            Your old password input is wrong
            </Typography>
          ):(
            <Typography component="h1" variant="h5">
            </Typography>
          )}
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={async () => {
              const user_id = props.ui;
              const user_info = {user_id, old_pwd, new_pwd};
              const response = await fetch("/change_pwd", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(user_info)
              });

              if(response.ok) {
                console.log("response worked!");
                setChange_success(1);
              }else{
                console.log("response Failed");
                setChange_fail(1);
              }
            }}
          >
            Change Password
          </Button>
        </form>
      </div>
     
    </Container>
  );
}

export default ChangePwd;
