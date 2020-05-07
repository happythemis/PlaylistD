import spotipy
import pymongo
import sqlite3

# user can add their liked songs in 2 ways
#   1. add their own top 50 songs
#   2. add a playlist using playlist_id
# assume user has [user_id], using which method [method_number] (either 1 or 2)
# [info_data] (either username or playlist_id)

def add_liked_songs(user_id, method_number, info_data):
    # check if method_number is valid
    if method_number < 1 or method_number > 2 :
        print('method_number wrong')
        return 422

    # get authorization
    if method_number == 1 :
        # fetch user top 50, use Authorization Code Flow
        token = spotipy.util.prompt_for_user_token(info_data,
            scope='user-top-read',
            client_id='d3a2c5cb1ea44a33b2f0dee665e22f05',
            client_secret='82802a97d56147499df1aa0ca2a88d07',
            redirect_uri='http://127.0.0.1:9090'
        )
        if not token:
            print("token issue, quit")
            return 422
        sp = spotipy.Spotify(auth=token)
    else :
        # fetch playlist, use Client Credentials Flow
        client_credentials_manager = spotipy.oauth2.SpotifyClientCredentials(
            client_id='d3a2c5cb1ea44a33b2f0dee665e22f05',
            client_secret='82802a97d56147499df1aa0ca2a88d07'
        )
        sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    # initialize empty list
    album_id = []
    album_name = []
    album_release_date = []
    artist_id = []
    artist_name = []
    artist_popularity = []
    s_id = []
    s_name = []
    s_popularity = []
    s_danceability = []
    s_energy = []
    s_loudness = []
    s_valence = []

    if method_number == 1 :
        # fetch top 50
        tracks = sp.current_user_top_tracks(limit=50, offset=0, time_range='medium_term')
        num_songs = len(tracks['items'])
    else:
        # fetch playlist
        playlist = sp.playlist(info_data, fields="tracks,next")
        num_songs = playlist['tracks']['total']
        tracks = playlist['tracks']

    while True:
        # for loop, for each song(track)
        for i, item in enumerate(tracks['items']):
            track = item
            if method_number == 2 :
                track = track['track']
            album_id.append(track['album']['id'])
            album_name.append(track['album']['name'])
            album_release_date.append(track['album']['release_date'][0:4])
            s_id.append(track['id'])
            s_name.append(track['name'])
            s_popularity.append(track['popularity'])

            # get song features
            s_features = sp.audio_features(track['id'])[0]
            s_danceability.append(s_features['danceability'])
            s_energy.append(s_features['energy'])
            s_loudness.append(s_features['loudness'])
            s_valence.append(s_features['valence'])

            # find artists
            num_artists = len(track['artists'])
            tmp_artist_id = []
            tmp_artist_name = []
            tmp_artist_popularity = []
            for j in range(num_artists):
                tmp_artist_id.append(track['artists'][j]['id'])
                tmp_artist_name.append(track['artists'][j]['name'])
                tmp_artist_popularity.append(sp.artist(track['artists'][0]['id'])['popularity'])
            artist_id.append(tmp_artist_id)
            artist_name.append(tmp_artist_name)
            artist_popularity.append(tmp_artist_popularity)
        if tracks['next'] :
            tracks = sp.next(tracks)
        else :
            break;

    # for i in range(num_songs):
    #     print(album_id[i])
    #     print(album_name[i])
    #     print(album_release_date[i])
    #     print(artist_id[i])
    #     print(artist_name[i])
    #     print(artist_popularity[i])
    #     print(s_id[i])
    #     print(s_name[i])
    #     print(s_popularity[i])
    #     print(s_danceability[i])
    #     print(s_energy[i])
    #     print(s_loudness[i])
    #     print(s_valence[i])
    #     print('---------------------------')
    # print()
    # print(num_songs)

    # SQL process --------------------------------------------------------------
    conn = sqlite3.connect('Playlistd.db')

    query_insert_album = "INSERT INTO Album(album_id,album_name,album_release_date) VALUES(?,?,?);"
    query_insert_song = "INSERT INTO Song(s_id,s_name,s_popularity,s_danceability,s_energy,s_loudness,s_valence,album_id) VALUES(?,?,?,?,?,?,?,?);"
    query_insert_artist = "INSERT INTO Artist(artist_id,artist_name,artist_popularity) VALUES(?,?,?);"
    query_insert_a_p = "INSERT INTO Artist_Perform(artist_id,s_id) VALUES(?,?);"
    for i in range(num_songs):

        # insert album into db
        param = []
        param.append(album_id[i])
        param.append(album_name[i])
        param.append(album_release_date[i])
        cur = conn.cursor()
        count = cur.execute(query_insert_album,param)
        conn.commit()

        # insert song into db
        param = []
        param.append(s_id[i])
        param.append(s_name[i])
        param.append(s_popularity[i])
        param.append(s_danceability[i])
        param.append(s_energy[i])
        param.append(s_loudness[i])
        param.append(s_valence[i])
        param.append(album_id[i])
        cur = conn.cursor()
        count = cur.execute(query_insert_song,param)
        conn.commit()

        # insert artist into db
        for j in range(len(artist_id[i])) :
            param = []
            param.append(artist_id[i][j])
            param.append(artist_name[i][j])
            param.append(artist_popularity[i][j])
            cur = conn.cursor()
            count = cur.execute(query_insert_artist,param)
            conn.commit()

        # insert artist_perform info
        for j in range(len(artist_id[i])) :
            param = []
            param.append(artist_id[i][j])
            param.append(s_id[i])
            cur = conn.cursor()
            count = cur.execute(query_insert_a_p,param)
            conn.commit()
    # End of SQL process --------------------------------------------------------------

    # MongoDB process
    myclient = pymongo.MongoClient('mongodb+srv://mjneal2:Bre302th%26@playlistd-9nctl.mongodb.net/test?authSource=admin&replicaSet=Playlistd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    mydb = myclient["Playlistd"]
    mycol = mydb["Likes"]

    liked_songs = list(mycol.find({"_id":user_id},{"liked_songs":1}))[0]['liked_songs']

    # insert the song into liked song list
    for i in range(num_songs) :
        if s_id[i] not in liked_songs :
            liked_songs.append(s_id[i])

    # update the db
    mycol.update_one({"_id":user_id}, {"$set":{"liked_songs":liked_songs}})

    return 200