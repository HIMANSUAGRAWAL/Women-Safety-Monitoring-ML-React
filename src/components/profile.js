import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import Maps from "./maps";
import SOS from "./sos";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("User data not found.");
        }
      } else {
        console.log("User is not logged in");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  return (
    <div className="scroll-container">
    <div className="profile-container">
      {userDetails ? (
        <div className="content-wrapper">
          <div className="user-details">
            {/* <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={userDetails.photo}
                width={"40%"}
                style={{ borderRadius: "50%" }}
                alt="Profile"
              />
            </div> */}
            <h3>Welcome {userDetails.firstName} 🙏</h3>
            <div className="details">
              <p>Email: {userDetails.email}</p>
              <p>Name: {userDetails.firstName + " " + userDetails.lastName}</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          
          <div className="map-container">
            <Maps />
          </div>

          <div className="sos-container">
                <SOS/>
            </div>

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
  );
}

export default Profile;
