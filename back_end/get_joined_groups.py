import pymongo

def get_joined_groups(user_id) :
    myclient = pymongo.MongoClient('mongodb+srv://mjneal2:Bre302th%26@playlistd-9nctl.mongodb.net/test?authSource=admin&replicaSet=Playlistd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    mydb = myclient["Playlistd"]
    mycol = mydb["Playlist_Groups"]

    result_list = list(mycol.find({"user_ids":{"$in":[user_id]}}))
    num_groups = len(result_list)

    ret_val = []
    for i in range(num_groups):
        ret_val.append({"group_id":str(result_list[i]['_id']), "group_name":result_list[i]['group_name']})

    return {'status':1, 'data':ret_val}

