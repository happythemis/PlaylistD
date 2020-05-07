import pymongo
from bson import ObjectId

def remove_song_from_group(group_id, s_id) :
    myclient = pymongo.MongoClient('mongodb+srv://mjneal2:Bre302th%26@playlistd-9nctl.mongodb.net/test?authSource=admin&replicaSet=Playlistd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    mydb = myclient["Playlistd"]
    mycol = mydb["Playlist_Groups"]

    try:
        group_id_obj = ObjectId(group_id)
    except:
        print('group_id wrong')
        return 422

    song_ids = list(mycol.find({"_id":group_id_obj},{"song_ids":1}))[0]['song_ids']

    if s_id in song_ids :
        song_ids.remove(s_id)
    else :
        return 422

    # update the db
    mycol.update_one({"_id":group_id_obj}, {"$set":{"song_ids":song_ids}})

    return 200