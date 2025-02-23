from fastapi import FastAPI, Query, HTTPException, Security, Depends
from fastapi.security.api_key import APIKeyHeader, APIKey
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from typing import Optional
import secrets

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# API Key Configuration
API_KEY_NAME = "X-API-Key"
API_KEY = os.getenv("API_KEY", secrets.token_urlsafe(32))  # Generate a random API key if not set
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

# Print the API key (only for development)
print(f"API Key: {API_KEY}")

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://himansubansal1701:6hREFQR28HHCC858@clusterhackathon.nbny8.mongodb.net/safety_db?retryWrites=true&w=majority")

async def get_api_key(api_key_header: str = Security(api_key_header)) -> str:
    if api_key_header == API_KEY:
        return api_key_header
    raise HTTPException(
        status_code=403,
        detail="Invalid API Key"
    )

try:
    client = AsyncIOMotorClient(MONGO_URI)
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    raise

db = client["safety_db"]
collection = db["stations"]

@app.get("/nearby_stations")
async def get_nearby_stations(
    api_key: APIKey = Depends(get_api_key),
    lat: float = Query(...),
    lng: float = Query(...),
    max_distance: int = 1000
):
    """
    Fetch nearby safety stations using MongoDB geospatial query.
    Requires API key authentication.
    """
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

        for station in nearby_stations:
            station["_id"] = str(station["_id"])
        return {"stations": nearby_stations}
    except Exception as e:
        print(f"Error querying stations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check(api_key: APIKey = Depends(get_api_key)):
    try:
        await client.admin.command('ping')
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")



import requests

url = "http://127.0.0.1:8000/nearby_stations"
params = {
    "lat": 20.1006,
    "lng": 85.7191,
    "max_distance": 2000
}
headers = {
    "X-API-Key": "ByteNav-PS-89ab67cd45ef23gh01ijklmn234567op"
}

response = requests.get(url, params=params, headers=headers)
print(response.json())  # Print the response
