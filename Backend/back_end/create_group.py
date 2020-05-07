import pymongo

def create_group(user_id, group_name):
    myclient = pymongo.MongoClient('mongodb+srv://mjneal2:Bre302th%26@playlistd-9nctl.mongodb.net/test?authSource=admin&replicaSet=Playlistd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    mydb = myclient["Playlistd"]
    mycol = mydb["Playlist_Groups"]

    # Check if group name already exists
    if len(list(mycol.find({"group_name" : group_name}))) == 1 :
        print('group name already exists')
        return {'status' : 0}

    user_ids = [user_id]
    song_ids = list(mydb["Likes"].find({"_id":user_id},{"liked_songs":1}))[0]['liked_songs']


    info = {"group_name":group_name, "user_ids":user_ids, "song_ids":song_ids}
    group_id = mycol.insert_one(info).inserted_id
    group_id = str(group_id)

    return {'status' : 1, 'group_id' : group_id}