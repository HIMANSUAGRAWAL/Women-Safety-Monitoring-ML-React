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
