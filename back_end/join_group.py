import pymongo
from bson import ObjectId

def join_group(user_id, group_id) :
    myclient = pymongo.MongoClient('mongodb+srv://mjneal2:Bre302th%26@playlistd-9nctl.mongodb.net/test?authSource=admin&replicaSet=Playlistd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    mydb = myclient["Playlistd"]
    mycol = mydb["Playlist_Groups"]

    # Check if group_id is valid
    try:
        group_id_obj = ObjectId(group_id)
    except:
        print('group_id wrong')
        return {'status' : 0}

    # Check if group exist
    if len(list(mycol.find({"_id" : group_id_obj}))) != 1 :
        print('group do not exist')
        return {'status' : 0}

    # Check if already joined
    user_ids = list(mycol.find({"_id" : group_id_obj}))[0]['user_ids']
    if user_id in user_ids :
        print('already joined')
        return {'status' : 0}

    group_name = list(mycol.find({"_id" : group_id_obj}))[0]['group_name']
    group_song_ids = list(mycol.find({"_id" : group_id_obj}))[0]['song_ids']
    my_song_ids = list(mydb["Likes"].find({"_id":user_id},{"liked_songs":1}))[0]['liked_songs']
    for i in range(len(my_song_ids)) :
        if my_song_ids[i] not in group_song_ids :
            group_song_ids.append(my_song_ids[i])

    user_ids.append(user_id)

    # Update the Mongodb
    mycol.update_one({"_id":group_id_obj}, {"$set":{"song_ids":group_song_ids}})
    mycol.update_one({"_id":group_id_obj}, {"$set":{"user_ids":user_ids}})

    return {'status' : 1, "group_name" : group_name}