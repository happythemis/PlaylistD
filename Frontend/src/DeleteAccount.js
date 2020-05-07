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

const DeleteAccount = (props) => {
  const classes = useStyles();
  const [pwd, setPwd] = useState("");
  const [delete_success, setDelete_success] = useState(0)
  const [delete_fail, setDelete_fail] = useState(0)

  if(delete_success){
      return(
          <h1> Your account has been deleted</h1>
    );
  }

  if(!props.ls){
    return(
      <nav className = "HomeNav">
        <h1> Please sign in first</h1>
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
          Delete Account
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
          />
          {delete_fail ? (
            <Typography component="h1" variant="h5">
            Your password input is wrong
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
              const user_info = {user_id, pwd};
              const response = await fetch("/delete_account", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(user_info)
              });

              if(response.ok) {
                console.log("response worked!");
                setDelete_success(1);
                props.cls(0);
                props.cui(-1);
                props.cln("");
              }else{
                console.log("response Failed");
                setDelete_fail(1);
              }
            }}
          >
            Delete My Account
          </Button>
        </form>
      </div>
    
    </Container>
  );
}

export default DeleteAccount;
