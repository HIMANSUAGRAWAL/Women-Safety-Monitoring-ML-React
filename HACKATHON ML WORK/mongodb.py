from fastapi import FastAPI, Query, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI (Only One Instance)
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://your-connection-string")
client = AsyncIOMotorClient(MONGO_URI)
db = client["safety_db"]
collection = db["stations"]

# ✅ Define Route for Nearby Stations
@app.get("/nearby_stations")
async def get_nearby_stations(lat: float = Query(...), lng: float = Query(...), max_distance: int = 1000):
    try:
        nearby_stations = await collection.find({
            "location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "$maxDistance": max_distance
                }
            }
        }).to_list(length=50)

        # Convert ObjectId to string
        for station in nearby_stations:
            station["_id"] = str(station["_id"])

        return {"stations": nearby_stations}
    except Exception as e:
        print(f"Error querying stations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Health Check Endpoint
@app.get("/health")
async def health_check():
    try:
        await client.admin.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
