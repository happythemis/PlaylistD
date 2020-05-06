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

const GroupManagement= (props) => {
  const classes = useStyles();

  const [group_name, setGroup_name] = useState("");
  const [new_group_id, setNew_group_id] = useState("");
  const [create_group_response, setCreate_group_response] = useState("");

  const [group_access_code, setGroup_access_code] = useState("");
  const [joined_group_name, setJoined_group_name] = useState("");
  const [join_group_response, setJoin_group_response] = useState("");

  const [group_list, setGroup_list] = useState([]);
  const [selected_group_id, setSelected_group_id] = useState("");
  const [max_number, setMax_number] = useState(20);
  const [order_by, setOrder_by] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  
  const [view_response, setView_response] = useState("");
  const [remove_s_id, setRemove_s_id] = useState("");
  const [remove_s_name, setRemove_s_name] = useState("");
  const [remove_response, setRemove_response] = useState("");

  const [danceability, setDanceability] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [loudness, setLoudness] = useState(0);
  const [valence, setValence] = useState(0);

  useEffect(() => {
    if(props.ls){
      fetch("/get_joined_groups?user_id="+props.ui)
      .then(response => response.json())
      .then(data => {setGroup_list(data['data']);});
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
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={5}>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Create a Group
            </Typography>
            <Typography component="h1" variant="h5">
              <br />
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="new_group_name"
              label= "New Group Name"
              name="new_group_name"
              autoComplete="new_group_name"
              value={group_name}
              onChange={e => setGroup_name(e.target.value)}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={async () => {
                var request = "/create_group?user_id="+props.ui;
                request = request + "&group_name=" + group_name;
                fetch(request)
                .then(response => response.json())
                .then(data => {
                  if(data['status'] == 0){
                    setNew_group_id("");
                    setCreate_group_response("Name already exists, please use a different name");
                  }else{
                    setNew_group_id(data['group_id']);
                    setCreate_group_response("Create Success. Please invite others by sharing this Group Access Code :")
                  }
                });
              }}
              >
              Create
            </Button>
            <Typography component="h5" variant="body1" className={classes.title}>
              {create_group_response} {new_group_id}
            </Typography>
          </div>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item xs={5}>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Join a Group
            </Typography>
            <Typography component="h1" variant="h5">
              <br />
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="group_access_code"
              label= "Group Access Code"
              name="group_access_code"
              autoComplete="group_access_code"
              value={group_access_code}
              onChange={e => setGroup_access_code(e.target.value)}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={async () => {
                var request = "/join_group?user_id="+props.ui;
                request = request + "&group_id=" + group_access_code;
                fetch(request)
                .then(response => response.json())
                .then(data => {
                  if(data['status'] == 0){
                    setJoined_group_name("")
                    setJoin_group_response("Wrong input, please try again");
                  }else{
                    setJoined_group_name(data['group_name']);
                    setJoin_group_response("Join Success. You have joined the group:")
                  }
                });
              }}
              >
              Join
            </Button>
            <Typography component="h5" variant="body1" className={classes.title}>
              {join_group_response} {joined_group_name}
            </Typography>
          </div>
        </Grid>
        
      </Grid>
    </Container>
  );
}
export default GroupManagement;