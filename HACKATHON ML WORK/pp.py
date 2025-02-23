from pymongo import MongoClient

# Replace with your connection string
uri = "mongodb+srv://himansubansal1701:6hREFQR28HHCC858@clusterhackathon.nbny8.mongodb.net/safety_db?retryWrites=true&w=majority"

# Connect to MongoDB
client = MongoClient(uri)
db = client.get_database("your_database_name")

# Test connection
print("Connected to MongoDB:", db.list_collection_names())
