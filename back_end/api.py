import flask
import sqlite3

from add_liked_songs import *
from show_liked_songs import *
from delete_liked_songs import *
from delete_account import *
from sign_up import *
from create_group import *
from join_group import *
from get_joined_groups import *
from get_group_song_list import *
from add_songs_to_spotify import *
from remove_song_from_group import *
from add_fav_songs_to_group import *

app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def api_home():
    return '''<h1>CS411 Project Playlistd API</h1>
<p>All kinds of amazing APIs</p>'''


@app.route('/add_fav_songs_to_group', methods=['POST'])
def api_add_fav_songs_to_group():
    # Get parameters
    data = flask.request.get_json()
    user_id = data['user_id']
    group_id = data['group_id']

    response = add_fav_songs_to_group(user_id, group_id)
    if response == 200 :
        return 'Done', 200
    else :
        return 'Fail', 422


@app.route('/remove_song_from_group', methods=['POST'])
def api_remove_song_from_group():
    # Get parameters
    data = flask.request.get_json()
    group_id = data['group_id']
    s_id = data['s_id']

    response = remove_song_from_group(group_id, s_id)
    if response == 200 :
        return 'Done', 200
    else :
        return 'Fail', 422


@app.route('/add_songs_to_spotify', methods=['POST'])
def api_add_songs_to_spotify():
    # Get parameters
    data = flask.request.get_json()
    username = data['username']
    playlist_id = data['playlist_id']
    song_ids = data['song_ids']

    response = add_songs_to_spotify(username, playlist_id, song_ids)
    if response == 200 :
        return 'Done', 200
    else :
        return 'Fail', 422


@app.route('/get_group_song_list', methods=['GET'])
def api_get_group_song_list():
    # Get parameters
    group_id = flask.request.args.get('group_id')
    danceability = flask.request.args.get('danceability')
    energy = flask.request.args.get('energy')
    loudness = flask.request.args.get('loudness')
    valence = flask.request.args.get('valence')
    max_number = flask.request.args.get('max_number')
    order_by = flask.request.args.get('order_by')
    if (not group_id) or (not danceability) or (not energy) or (not loudness) or (not valence) or (not max_number) or (not order_by) :
        return flask.jsonify({'status' : 0, 'data':[]})

    ret_val = get_group_song_list(str(group_id), int(danceability), int(energy), int(loudness), int(valence), int(max_number), int(order_by))
    return flask.jsonify(ret_val)


@app.route('/get_joined_groups', methods=['GET'])
def api_get_joined_groups():
    # Get parameters
    user_id = flask.request.args.get('user_id')
    if not user_id :
        return flask.jsonify({'status' : 0, 'data':[]})

    ret_val = get_joined_groups(int(user_id))
    return flask.jsonify(ret_val)


@app.route('/join_group', methods=['GET'])
def api_join_group():
    # Get parameters
    user_id = flask.request.args.get('user_id')
    group_id = flask.request.args.get('group_id')
    if (not user_id) or (not group_id) :
        return flask.jsonify({'status' : 0})

    ret_val = join_group(int(user_id), group_id)
    return flask.jsonify(ret_val)


@app.route('/create_group', methods=['GET'])
def api_create_group():
    # Get parameters
    user_id = flask.request.args.get('user_id')
    group_name = flask.request.args.get('group_name')
    if (not user_id) or (not group_name) :
        return flask.jsonify({'status' : 0})

    ret_val = create_group(int(user_id), group_name)
    return flask.jsonify(ret_val)


@app.route('/delete_liked_songs', methods=['POST'])
def api_delete_liked_songs():
    # Get parameters
    data = flask.request.get_json()
    user_id = data['user_id']
    s_id = data['s_id']

    response = delete_liked_songs(user_id, s_id)
    if response == 200 :
        return 'Done', 200
    else :
        return 'Fail', 422


@app.route('/show_liked_songs', methods=['GET'])
def api_show_liked_songs():
    # Get parameters
    user_id = flask.request.args.get('user_id')
    if not user_id :
        return flask.jsonify({'status' : 0})

    ret_val = show_liked_songs(int(user_id))
    return flask.jsonify({'status':1,'data':ret_val})


@app.route('/add_liked_songs', methods=['POST'])
def api_add_liked_songs():
    # Get parameters
    data = flask.request.get_json()
    user_id = data['user_id']
    method_number = data['method_number']
    info_data = data['info_data']

    response = add_liked_songs(user_id, method_number, info_data)
    if response == 200 :
        return 'Done', 200
    else :
        return 'Fail', 422


@app.route('/delete_account', methods=['POST'])
def api_delete_account():
    # Get parameters
    data = flask.request.get_json()
    user_id = data['user_id']
    pwd = data['pwd']

    response = delete_account(user_id,pwd)
    if response == 200 :
        return 'Done', 200
    else :
        return 'Fail', 422


@app.route('/change_pwd', methods=['POST'])
def api_change_pwd():
    conn = sqlite3.connect('Playlistd.db')
    data = flask.request.get_json()
    user_id = data['user_id']
    old_pwd = data['old_pwd']
    new_pwd = data['new_pwd']

    # Check if old password is correct
    param = []
    param.append(user_id)
    param.append(old_pwd)
    query_check = "SELECT count(user_id) FROM User WHERE user_id=? AND pwd=?;"
    cur = conn.cursor()
    result_check = cur.execute(query_check,param).fetchall()[0][0]
    if result_check != 1:
        return 'Fail', 422
    
    # Update the password
    param = []
    param.append(new_pwd)
    param.append(user_id)
    cur = conn.cursor()
    query = "UPDATE User SET pwd=? WHERE user_id=?;"
    count = cur.execute(query,param)
    conn.commit()
    cur.close()

    return 'Done', 200


@app.route('/sign_up', methods=['POST'])
def api_sign_up():
    # Get Parameter
    data = flask.request.get_json()
    email = data['email']
    fname = data['fname']
    lname = data['lname']
    pwd = data['pwd']

    response = sign_up(email,fname,lname,pwd)
    if response == 200 :
        return 'Done', 200
    else :
        return 'Fail', 422


@app.route('/login', methods=['GET'])
def api_login():
    conn = sqlite3.connect('Playlistd.db')
    query_parameters = flask.request.args
    email = query_parameters.get('email')
    pwd = query_parameters.get('pwd')

    # Check if parameters are valid or not
    if not (email and pwd):
        return flask.jsonify({'status' : 0, 'fname' : ""})

    query = "FROM User WHERE"
    to_filter = []
    query += ' email=? AND'
    to_filter.append(email)
    query += ' pwd=? AND'
    to_filter.append(pwd)
    query = query[:-4] + ';'

    # Check if pwd and email matches
    query_check = "SELECT count(email) " + query
    cur = conn.cursor()
    result_check = cur.execute(query_check,to_filter).fetchall()[0][0]
    if result_check != 1:
        return flask.jsonify({'status' : 0, 'fname' : ""})

    # Get result
    query = "SELECT fname, user_id " + query
    cur = conn.cursor()
    result = cur.execute(query,to_filter).fetchall()[0]
    fname = result[0]
    user_id = result[1]
    return flask.jsonify({'status' : 1, 'fname' : fname, 'user_id':user_id})


app.run()