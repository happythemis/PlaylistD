import sqlite3
import pymongo

def sign_up(email,fname,lname,pwd) :
    conn = sqlite3.connect('Playlistd.db')

    # Check if email already exists
    param = []
    param.append(email)
    query_check = "SELECT count(email) FROM User WHERE email=?;"
    cur = conn.cursor()
    result_check = cur.execute(query_check,param).fetchall()[0][0]
    if result_check != 0:
        return 'Fail', 422

    # Get a new user_id
    query = "SELECT MAX(user_id) FROM User;"
    cur = conn.cursor()
    new_user_id = cur.execute(query).fetchall()[0][0] + 1

    new_user_val = []
    new_user_val.append(email)
    new_user_val.append(fname)
    new_user_val.append(lname)
    new_user_val.append(pwd)
    new_user_val.append(new_user_id)
    
    cur = conn.cursor()
    query = "INSERT INTO User(email, fname, lname, pwd, user_id) VALUES(?,?,?,?,?)"
    count = cur.execute(query,new_user_val)
    conn.commit()
    cur.close()

    # Insert into MongoDB
    myclient = pymongo.MongoClient('mongodb+srv://mjneal2:Bre302th%26@playlistd-9nctl.mongodb.net/test?authSource=admin&replicaSet=Playlistd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    mydb = myclient["Playlistd"]
    mycol = mydb["Likes"]

    # First check if new_user_id already exists
    check_result = list(mycol.find({"_id":new_user_id},{}))

    # new_user_id not exist, insert it with empty like_songs
    if len(check_result) == 0:
        song_list = []
        info = {"_id":new_user_id,"liked_songs":song_list}
        mycol.insert_one(info)

    return 200