import sqlite3
import pymongo

def delete_account(user_id,pwd) :
    conn = sqlite3.connect('Playlistd.db')

    # Check if password is correct
    param = []
    param.append(user_id)
    param.append(pwd)
    query_check = "SELECT count(user_id) FROM User WHERE user_id=? AND pwd=?;"
    cur = conn.cursor()
    result_check = cur.execute(query_check,param).fetchall()[0][0]
    if result_check != 1:
        return 'Fail', 422
    
    # Delete account in SQL
    param = []
    param.append(user_id)
    cur = conn.cursor()
    query = "DELETE FROM User WHERE user_id=?;"
    count = cur.execute(query,param)
    conn.commit()
    cur.close()

    # Delete account in Mongodb
    myclient = pymongo.MongoClient('mongodb+srv://mjneal2:Bre302th%26@playlistd-9nctl.mongodb.net/test?authSource=admin&replicaSet=Playlistd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    mydb = myclient["Playlistd"]
    mycol = mydb["Likes"]
    mycol.delete_one({"_id": user_id})

    return 200