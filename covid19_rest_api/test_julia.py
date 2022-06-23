#
#   Hello World client in Python
#   Connects REQ socket to tcp://localhost:5555
#   Sends "Hello" to server, expects "World" back
#

from utils.mongo_utils import create_mongo_client

mongo_client = create_mongo_client()

predictions_db = mongo_client["predictions"]

db = predictions_db["predictions"]
print(db.find_one({'hash_id': '6be49b21896b862f413bd9f8201cb346'}))