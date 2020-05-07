import spotipy

def add_songs_to_spotify(username, playlist_id, song_ids) :
    token = spotipy.util.prompt_for_user_token(username,
        scope='playlist-modify-public',
        client_id='d3a2c5cb1ea44a33b2f0dee665e22f05',
        client_secret='82802a97d56147499df1aa0ca2a88d07',
        redirect_uri='http://127.0.0.1:9090'
    )
    sp = spotipy.Spotify(auth=token)
    try :
        sp.user_playlist_add_tracks(username, playlist_id, song_ids)
    except :
        print('add to spotify failed')
        return 422

    return 200