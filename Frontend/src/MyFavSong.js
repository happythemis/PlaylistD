import React, {useState, useEffect}from 'react';
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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    // backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));



const MyFavSong= (props) => {
  const classes = useStyles();
  // const [email, setEmail] = useState("");
  // const [pwd, setPwd] = useState("");
  // const [tried_login, setTried_login] = useState(0)
  const [playlist, setPlaylist] = useState([]);
  const [method_number, setMethod_number] = useState(1);
  const [info_data, setInfo_data] = useState("");
  const [add_response, setAdd_response] = useState("");
  const [remove_s_id, setRemove_s_id] = useState("");
  const [remove_s_name, setRemove_s_name] = useState("");
  const [remove_response, setRemove_response] = useState("");

  useEffect(() => {
    if(props.ls){
      fetch("/show_liked_songs?user_id="+props.ui)
      .then(response => response.json())
      .then(data => {setPlaylist(data['data']);});
    }
  }, []);


  const refresh_liked_list = () => {
    if(props.ls){
      fetch("/show_liked_songs?user_id="+props.ui)
      .then(response => response.json())
      .then(data => {setPlaylist(data['data']);});
    }
  }

  if(!props.ls){
    return(
      <nav className = "HomeNav">
        <h1> Please sign in first</h1>
      </nav>
    );
  }

  return (
    <Container component="main">
      <Grid container item xs={12} spacing={6}>
        <Grid item xs={3}>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Add Songs to My Favorite List
            </Typography>
            <Typography component="h1" variant="h5">
              <br />
            </Typography>
            <Select
              labelId="select-method-number-label"
              id="select-method-number"
              value={method_number}
              onChange={e => setMethod_number(e.target.value)}
            >
              <MenuItem value={1}>Add your Top 50 Songs</MenuItem>
              <MenuItem value={2}>Add a Playlist</MenuItem>
            </Select>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="my_uri"
                label= {method_number == 1 ? "Spotify Username" : "Playlist URI"}
                name="my_uri"
                autoComplete="my_uri"
                autoFocus
                value={info_data}
                onChange={e => setInfo_data(e.target.value)}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={async () => {
                  const user_id = props.ui;
                  const user_info = {user_id, method_number, info_data};
                  const response = await fetch("/add_liked_songs", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user_info)
                  });

                  if(response.ok) {
                    setAdd_response("Songs Added Successfully");
                    refresh_liked_list();
                  }else{
                    setAdd_response("Unsuccessful, please try again");
                  }
                }}
                >
                Add
              </Button>
            </form>
            <Typography component="h1" variant="h5">
            {add_response}
            </Typography>

            <form className={classes.form} noValidate>
              <Typography component="h1" variant="h6">
                <br />
                Remove Song from the list
              </Typography>
              <Autocomplete
                id="controllable-states-demo"
                options={playlist}
                getOptionLabel={(option) => option.s_name}
                renderInput={(params) => <TextField {...params} label="Sone name" variant="outlined" />}
                inputvalue={remove_s_name}
                onInputChange={(event, newInputValue) => {setRemove_s_name(newInputValue);}}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={async () => {
                  var i;
                  var s_id = "NONE";
                  for (i = 0; i < playlist.length; i++){
                    if(remove_s_name == playlist[i].s_name){
                      s_id = playlist[i].s_id;
                      break;
                    }
                  }
                  const user_id = props.ui;
                  const user_info = {user_id, s_id};
                  const response = await fetch("/delete_liked_songs", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user_info)
                  });

                  if(response.ok) {
                    setRemove_response("Songs Removed Successfully");
                    refresh_liked_list();
                    setRemove_s_name("")
                  }else{
                    setRemove_response("Unsuccessful, please try again");
                  }
                }}
                >
                Remove
              </Button>
            </form>
          <Typography component="h1" variant="h5">
            {remove_response}
          </Typography>
          </div>
        </Grid>
        <Grid item xs={9}>
          <div className={classes.paper}>
          <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {/* <TableCell align="right">Song Order</TableCell> */}
                    <TableCell align="left">Song name</TableCell>
                    <TableCell align="left">Album</TableCell>
                    <TableCell align="left">Release Date</TableCell>
                    <TableCell align="left">Artists</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {playlist.map((playlist) => (
                    <TableRow key={playlist.name}>
                      <TableCell align="left">{playlist.s_name}</TableCell>
                      <TableCell align="left">{playlist.album_name}</TableCell>
                      <TableCell align="left">{playlist.album_release_date}</TableCell>
                      <TableCell align="left">{playlist.artist_names}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
        
      </Grid>
    </Container>
  );
}
export default MyFavSong;