import pymongo

def delete_liked_songs(user_id, s_id) :
    myclient = pymongo.MongoClient('mongodb+srv://mjneal2:Bre302th%26@playlistd-9nctl.mongodb.net/test?authSource=admin&replicaSet=Playlistd-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true')
    mydb = myclient["Playlistd"]
    mycol = mydb["Likes"]

    liked_songs = list(mycol.find({"_id":user_id},{"liked_songs":1}))[0]['liked_songs']

    if s_id in liked_songs :
        liked_songs.remove(s_id)
        mycol.update_one({"_id":user_id}, {"$set":{"liked_songs":liked_songs}})
        return 200
    else :
        return 422