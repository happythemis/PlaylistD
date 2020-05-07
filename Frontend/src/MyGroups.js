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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    // maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  paper2: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    // marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MyGroups= (props) => {
  const classes = useStyles();

  const [group_list, setGroup_list] = useState([]);
  const [selected_group_id, setSelected_group_id] = useState("");
  const [max_number, setMax_number] = useState(20);
  const [order_by, setOrder_by] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [group_name, setGroup_name] = useState("");
  const [view_response, setView_response] = useState("");
  const [remove_s_id, setRemove_s_id] = useState("");
  const [remove_s_name, setRemove_s_name] = useState("");
  const [remove_response, setRemove_response] = useState("");

  const [GAC, setGAC] = useState("");
  const [names, setNames] = useState("");

  const [danceability, setDanceability] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [loudness, setLoudness] = useState(0);
  const [valence, setValence] = useState(0);

  const [add_response, setAdd_response] = useState("");

  const [spotify_username, setSpotify_username] = useState("");
  const [spotify_playlist_id, setSpotify_playlist_id] = useState("");
  const [export_response, setExport_response] = useState("");

  useEffect(() => {
    if(props.ls){
      fetch("/get_joined_groups?user_id="+props.ui)
      .then(response => response.json())
      .then(data => {setGroup_list(data['data']);});
    }
  }, []);


  const refresh_group_list = () => {
    if(props.ls){
      var request = "/get_group_song_list?group_id="+selected_group_id;
      request = request + "&danceability=" + danceability;
      request = request + "&energy=" + energy;
      request = request + "&loudness=" + loudness;
      request = request + "&valence=" + valence;
      request = request + "&max_number=" + max_number;
      request = request + "&order_by=" + order_by;
      fetch(request)
      .then(response => response.json())
      .then(data => {
        if(data['status'] == 0){

        }else{
          setPlaylist(data['data']);
          setSelected_group_id(GAC);
        }
      })
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
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={3}>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Select a Group
            </Typography>
            <Typography component="h1" variant="h5">
              <br />
            </Typography>
            <Select
              labelId="select-method-number-label"
              id="select-method-number"
              value={selected_group_id}
              onChange={e => setSelected_group_id(e.target.value)}
            >
              {group_list.map((group) =>
                <MenuItem value={group.group_id}>{group.group_name}</MenuItem>
              )}
            </Select>
          </div>
          
          <div className="container">
            <Typography component="h5" variant="h6" className={classes.title}>
              Preference
            </Typography>
            <Grid container>
              <Grid item xs={12}>
                <div>
                 <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="danceability-label">Danceability</InputLabel>
                    <Select
                      labelId="danceability-select-label"
                      id="danceability-select"
                      value={danceability}
                      onChange={e => setDanceability(e.target.value)}
                      label="option"
                    >
                      <MenuItem value={0}>-</MenuItem>
                      <MenuItem value={1}>Low</MenuItem>
                      <MenuItem value={2}>High</MenuItem>
                    </Select>
                 </FormControl>
                 </div>
              </Grid>
              <Grid item xs={12}>
                <div>
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="energy-label">Energy</InputLabel>
                    <Select
                      labelId="energy-select-label"
                      id="energy-select"
                      value={energy}
                      onChange={e => setEnergy(e.target.value)}
                      label="option"
                    >
                      <MenuItem value={0}>-</MenuItem>
                      <MenuItem value={1}>Low</MenuItem>
                      <MenuItem value={2}>High</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div> 
                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="loudness-label">Loudness</InputLabel>
                    <Select
                      labelId="loudness-select-label"
                      id="loudness-select"
                      value={loudness}
                      onChange={e => setLoudness(e.target.value)}
                      label="option"
                    >
                      <MenuItem value={0}>-</MenuItem>
                      <MenuItem value={1}>Low</MenuItem>
                      <MenuItem value={2}>High</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div>
                 <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="valence-label">Valence</InputLabel>
                    <Select
                      labelId="valence-select-label"
                      id="valence-select"
                      value={valence}
                      onChange={e => setValence(e.target.value)}
                      label="option"
                    >
                      <MenuItem value={0}>-</MenuItem>
                      <MenuItem value={1}>Low</MenuItem>
                      <MenuItem value={2}>High</MenuItem>
                    </Select>
                 </FormControl>
                 </div>
              </Grid>
            </Grid>
          </div>
          <div className={classes.paper}>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="max_number"
                label= "Max Number of Songs"
                name="max_number"
                autoComplete="max_number"
                value={max_number}
                onChange={e => setMax_number(e.target.value)}
              />
              <Select
                labelId="select-order-by-label"
                id="select-order-by"
                value={order_by}
                onChange={e => setOrder_by(e.target.value)}
              >
                <MenuItem value={0}>Order by Popularity</MenuItem>
                <MenuItem value={1}>Order by Name</MenuItem>
                <MenuItem value={2}>Order by Name Decreasing</MenuItem>
                <MenuItem value={3}>Order From Old to New</MenuItem>
                <MenuItem value={4}>Order From New to Old</MenuItem>
              </Select>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={async () => {
                  var request = "/get_group_song_list?group_id="+selected_group_id;
                  request = request + "&danceability=" + danceability;
                  request = request + "&energy=" + energy;
                  request = request + "&loudness=" + loudness;
                  request = request + "&valence=" + valence;
                  request = request + "&max_number=" + max_number;
                  request = request + "&order_by=" + order_by;
                  fetch(request)
                  .then(response => response.json())
                  .then(data => {
                    if(data['status'] == 0){
                      setView_response("Unsuccessful, please try again");
                      setRemove_response("");
                      setAdd_response("");
                      setExport_response("");
                    }else{
                      setPlaylist(data['data']);
                      setGroup_name(data['group_name']);
                      setNames(data['names']);
                      setView_response("");
                      setGAC(selected_group_id);
                      setRemove_response("");
                      setAdd_response("");
                      setExport_response("");
                    }
                  });
                }}
                >
                View
              </Button>
              <Typography component="h1" variant="h5">
                {view_response}
              </Typography>
              <Divider />
              <Typography component="h1" variant="h6">
                <br />
                Add My Fav Songs to the group
              </Typography>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={async () => {
                  const group_id = GAC;
                  const user_id = props.ui
                  const info = {user_id, group_id};
                  const response = await fetch("/add_fav_songs_to_group", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(info)
                  });
                  if(response.ok) {
                    setAdd_response("Songs Added Successfully");
                    setRemove_s_name("")
                    setRemove_response("");
                    refresh_group_list();
                    setExport_response("");
                  }else{
                    setAdd_response("Unsuccessful, please try again");
                    setExport_response("");
                  }
                }}
                >
                Add Fav Songs
              </Button>
              <Typography component="h5" variant="body1" className={classes.title}>
                {add_response}
              </Typography>
              <Divider />
              <Typography component="h1" variant="h6">
                <br />
                Remove Song from the Group
              </Typography>
              <Autocomplete
                id="controllable-states-demo"
                options={playlist}
                getOptionLabel={(option) => option.s_name}
                renderInput={(params) => <TextField {...params} label="Sone Name" variant="outlined" />}
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
                  const group_id = GAC;
                  const info = {group_id, s_id};
                  const response = await fetch("/remove_song_from_group", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(info)
                  });

                  if(response.ok) {
                    setRemove_response("Songs Removed Successfully");
                    setRemove_s_name("");
                    setAdd_response("");
                    refresh_group_list();
                    setExport_response("");
                  }else{
                    setRemove_response("Unsuccessful, please try again");
                    setExport_response("");
                  }
                }}
                >
                Remove
              </Button>
              <Typography component="h5" variant="body1" className={classes.title}>
                {remove_response}
              </Typography>
              <Divider />
              <Typography component="h5" variant="h6" className={classes.title}>
                <br />
                Export Songs to Spotify
              </Typography>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="spotify_username"
                label= "Spotify Username"
                name="spotify_username"
                autoComplete="spotify_username"
                value={spotify_username}
                onChange={e => setSpotify_username(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="playlist_uri"
                label= "Spotify Playlist URI"
                name="playlist_uri"
                autoComplete="playlist_uri"
                value={spotify_playlist_id}
                onChange={e => setSpotify_playlist_id(e.target.value)}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={async () => {
                  const username = spotify_username;
                  const playlist_id = spotify_playlist_id;
                  var i;
                  var song_ids = [];
                  for (i = 0; i < playlist.length; i++){
                    song_ids.push(playlist[i].s_id);
                  }
                  const info = {username, playlist_id, song_ids};
                  const response = await fetch("/add_songs_to_spotify", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(info)
                  });

                  if(response.ok) {
                    setExport_response("Export Successfully");
                  }else{
                    setExport_response("Unsuccessful, please try again");
                  }
                }}
                >
                Export to Spotify
              </Button>
              <Typography component="h1" variant="h5">
                {export_response}
              </Typography>
            </form>
            
          </div>
        </Grid>
        <Grid item xs={9}>
          <div className={classes.paper}>
            {group_name != "" ? (
              <Typography component="h1" variant="h5">
                {group_name} (Group Access Code: {GAC})
                <br />
                {names}
              </Typography>
            ):(
              <Typography component="h1" variant="h5">
              </Typography>
            )}
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {/* <TableCell align="right">Song Order</TableCell> */}
                    <TableCell align="left" className={classes.chip}>Song name</TableCell>
                    <TableCell align="left">Album</TableCell>
                    <TableCell align="left">Release Date</TableCell>
                    <TableCell align="left">Artists</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playlist.map((playlist) => (
                    <TableRow key={playlist.name}>
                      <TableCell align="left" className={classes.chip}>{playlist.s_name}</TableCell>
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
export default MyGroups;