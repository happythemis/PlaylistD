import sqlite3
import pymongo
from pymongo import MongoClient
from bson import ObjectId


def get_group_song_list(group_id, danceability, energy, loudness, valence, max_number, order_by):
    #Connection to MongoDB server
    client = MongoClient('mongodb+srv://mjneal2:Bre302th%26@playlistd-9nctl.mongodb.net/test?authSource=admin&replicaSet=Playlistd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    db = client['Playlistd']
    pg = db['Playlist_Groups']
    
    # Check if group_id is valid
    try:
        group_id_obj = ObjectId(group_id)
    except:
        print('group_id wrong')
        return {"status":0, "data":[]}


    # Get the features
    if danceability == 0:
        LD1 = 0
        HD1 = 1
    elif danceability == 1:
        LD1 = 0
        HD1 = 0.5
    else :
        LD1 = 0.7
        HD1 = 1

    if energy == 0:
        LE1 = 0
        HE1 = 1
    elif energy == 1:
        LE1 = 0
        HE1 = 0.5
    else :
        LE1 = 0.7
        HE1 = 1

    if loudness == 0:
        LL1 = -200
        HL1 = 200
    elif loudness == 1:
        LL1 = -200
        HL1 = -8
    else :
        LL1 = -7
        HL1 = 200

    if valence == 0:
        LV1 = 0
        HV1 = 1
    elif valence == 1:
        LV1 = 0
        HV1 = 0.5
    else :
        LV1 = 0.7
        HV1 = 1

    #Extracting s_ID's from group and putting in SQL serviceable format
    doc = pg.find_one({'_id': group_id_obj})
    songs_list = tuple(doc["song_ids"])
    names_list = tuple(doc["user_ids"])
    if len(doc["user_ids"]) == 1 :
        names_list = "(" + str(doc["user_ids"][0]) + ")"
    if len(doc["user_ids"]) == 0 :
        names_list = "()"
    group_name = doc['group_name']
    print(names_list)

    #Connection to SQL server
    connection = sqlite3.connect("Playlistd.db")

    # Get all the names
    sql_command = """
    SELECT fname, lname
    FROM User
    WHERE user_id IN {user_ids} ;
    """
    cursor = connection.cursor()
    cursor.execute(sql_command.format(
        user_ids = names_list
    ))
    data = cursor.fetchall()
    names = ""
    for i in range(len(data)) :
        names = names + data[i][0] + " " + data[i][1]
        if i != len(data)-1 :
            names = names + ", "

    #Selecting song information from SQL
    sql_command = """
    SELECT DISTINCT
        s.s_id as s_id,
        s.s_name as s_name,
        q.album_name as album_name,
        q.album_release_date as album_release_date,
        f.artist_names as artist_names,
        s.s_popularity as s_popularity
    FROM
        Song s,

        (SELECT ap.s_id as s_id, GROUP_CONCAT(a.artist_name, ', ') as artist_names
        FROM Artist a, Artist_perform ap
        WHERE a.artist_ID = ap.artist_ID
        GROUP BY ap.s_id) f,

        (SELECT
            c.s_id as s_id,
            d.album_name as album_name,
            d.album_release_date as album_release_date
        FROM Song c, Album d
        WHERE c.album_id = d.album_id) q

    WHERE s.s_id = f.s_id
    AND s.s_id = q.s_id

    AND s.s_id IN {songs}

    
    AND s.s_danceability >= {LD}
    AND s.s_danceability <= {HD}
    AND s.s_energy >= {LE}
    AND s.s_energy <= {HE}
    AND s.s_loudness >= {LL}
    AND s.s_loudness <= {HL}
    AND s.s_valence >= {LV}
    AND s.s_valence <= {HV}
    """

    if order_by == 0 :
        sql_command = sql_command + "ORDER BY s_popularity"
    elif order_by == 1 :
        sql_command = sql_command + "ORDER BY s_name"
    elif order_by == 2 :
        sql_command = sql_command + "ORDER BY s_name DESC"
    elif order_by == 3 :
        sql_command = sql_command + "ORDER BY album_release_date"
    elif order_by == 4 :
        sql_command = sql_command + "ORDER BY album_release_date DESC"

    if max_number < 0 :
        max_number = 0
    sql_command = sql_command + " LIMIT {MAX_NUM};"

    # %placeholders
    cursor = connection.cursor()
    cursor.execute(sql_command.format(
        songs = songs_list,
        LD = LD1,
        HD = HD1,
        LE = LE1,
        HE = HE1,
        LL = LL1,
        HL = HL1,
        LV = LV1,
        HV = HV1,
        MAX_NUM = max_number
    ))
    data = cursor.fetchall()
    ret_val = []
    for i in data :
        ret_val.append({'s_id':i[0], 's_name':i[1], 'album_name':i[2], 'album_release_date':i[3],'artist_names':i[4]})
    
    return {"status":1, "data":ret_val, "group_name": group_name, "names":names}
