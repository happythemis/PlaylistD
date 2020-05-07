import React,{useState} from 'react';
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

const SignIn = (props) => { 
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [tried_login, setTried_login] = useState(0)

  if(props.ls){
      return (
      <h1> Hello {props.ln}, you have already signed in</h1>
  )
  }
  return (
    <Container component="main" maxWidth="xs">
      {/* <CssBaseline /> */}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
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
            onChange={p => setPwd(p.target.value)}
          />
          {tried_login? (
            <Typography component="h1" variant="h5">
            Wrong Email or Password
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
            onClick={() => {
              fetch("/login?email="+email+"&pwd="+pwd)
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                  setTried_login(1);
                  if(data.status){
                    props.cls(1);
                    props.cln(data.fname);
                    props.cui(data.user_id);
                  }
                });
              }
            }
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      
    </Container>
  );
}

export default SignIn;
