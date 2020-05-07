import sqlite3
import pymongo
from pymongo import MongoClient


def show_liked_songs(user_id):
    #Connection to MongoDB server
    client = MongoClient('mongodb+srv://mjneal2:Bre302th%26@playlistd-9nctl.mongodb.net/test?authSource=admin&replicaSet=Playlistd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    db = client['Playlistd']
    pg = db['Likes']

    #Extracting s_ID's from group and putting in SQL serviceable format
    doc = pg.find_one({'_id': user_id})
    songs_list = tuple(doc["liked_songs"])

    #Connection to SQL server
    connection = sqlite3.connect("Playlistd.db")
    cursor = connection.cursor()

    #Selecting song information from SQL
    sql_command = """
    SELECT DISTINCT
        s.s_id as s_id,
        s.s_name as s_name,
        q.album_name as album_name,
        q.album_release_date as album_release_date,
        f.artist_names as artist_names
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

    ORDER BY s_id
    ;"""
    # %placeholders
    cursor.execute(sql_command.format(
        songs = songs_list
    ))
    data = cursor.fetchall()
    ret_val = []
    for i in data :
        ret_val.append({'s_id':i[0], 's_name':i[1], 'album_name':i[2], 'album_release_date':i[3],'artist_names':i[4]})
    return ret_val
