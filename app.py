from fastapi import FastAPI
from pydantic import BaseModel
from twilio.rest import Client

app = FastAPI()

# Twilio Credentials
TWILIO_SID = "AC63130ba85b06cc9550833b1b222223a5"
TWILIO_AUTH_TOKEN = "9e5905c2fa4980edc4805b669df63f7e"
TWILIO_PHONE = "+14707984883"
EMERGENCY_PHONE = "+919608924544"  # Single Emergency Contact

class SOSRequest(BaseModel):
    location: str

@app.get("/")
def home():
    return {"message": "🚨 SOS API is running! Use /send_sms to send an alert."}

@app.post("/send_sms")
def send_sos_sms(request: SOSRequest):
    client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)

    try:
        message = client.messages.create(
            body=f"🚨 SOS ALERT! Need help. Location: {request.location}",
            from_=TWILIO_PHONE,
            to=EMERGENCY_PHONE
        )

        return {
            "status": "SMS sent!",
            "number": EMERGENCY_PHONE,
            "message_sid": message.sid
        }
    except Exception as e:
        return {"status": "Failed to send SMS", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
