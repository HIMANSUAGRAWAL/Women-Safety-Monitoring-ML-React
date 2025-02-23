import json
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

# MongoDB Connection
MONGO_URI = "mongodb+srv://himansubansal1701:6hREFQR28HHCC858@clusterhackathon.nbny8.mongodb.net/safety_db?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URI)
db = client["safety_db"]
collection = db["stations"]

# Jatni Data
jatni_data = [
    {
        "name": "Jatni Police Station",
        "city": "Jatni",
        "state": "Odisha",
        "type": "police_station",
        "location": {
            "type": "Point",
            "coordinates": [85.7191, 20.1006]
        }
    },
    {
        "name": "Khordha Road GRP Police Station",
        "city": "Jatni",
        "state": "Odisha",
        "type": "police_station",
        "location": {
            "type": "Point",
            "coordinates": [85.7104, 20.1052]
        }
    },
    {
        "name": "Jatni Fire Station",
        "city": "Jatni",
        "state": "Odisha",
        "type": "fire_station",
        "location": {
            "type": "Point",
            "coordinates": [85.7197, 20.0998]
        }
    },
    {
        "name": "Railway Hospital Jatni",
        "city": "Jatni",
        "state": "Odisha",
        "type": "hospital",
        "location": {
            "type": "Point",
            "coordinates": [85.7153, 20.1024]
        }
    },
    {
        "name": "Capital Hospital Jatni",
        "city": "Jatni",
        "state": "Odisha",
        "type": "hospital",
        "location": {
            "type": "Point",
            "coordinates": [85.7220, 20.0987]
        }
    }
]

# Function to insert data into MongoDB
async def insert_jatni_data():
    await collection.insert_many(jatni_data)
    await collection.create_index([("location", "2dsphere")])  # Ensure geospatial indexing
    print("Jatni data inserted successfully!")

# Run async function
asyncio.run(insert_jatni_data())
