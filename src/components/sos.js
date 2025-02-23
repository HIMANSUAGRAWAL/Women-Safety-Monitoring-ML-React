// import React, { useState, useEffect } from "react";
// import { db } from "./firebase";
// import { addDoc, collection, getDocs, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore"; 




// import { toast } from "react-toastify";
// import React, { useState, useEffect } from "react";

// function SOS() {
//   const [userCoords, setUserCoords] = useState({ lat: null, lng: null });
//   const [recipientEmails, setRecipientEmails] = useState("");

//   // Retrieve the user's location using the Geolocation API.
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserCoords({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error("Error fetching location:", error);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   // This function builds a mailto: link with the email addresses,
//   const handleSendEmailAlert = () => {
//     if (!userCoords.lat || !userCoords.lng) {
//       console.error("User location not available.");
//       return;
//     }

//     const emails = recipientEmails
//       .split(",")
//       .map((email) => email.trim())
//       .filter((email) => email !== "");

//     if (emails.length === 0) {
//       console.error("No email addresses provided.");
//       return;
//     }

//     const subject = encodeURIComponent("Emergency Alert");
//     let body = "Emergency alert: Please check your surroundings.";
//     body += `\nMy current location: https://www.google.com/maps/search/?api=1&query=${userCoords.lat},${userCoords.lng}`;
//     const encodedBody = encodeURIComponent(body);

//     // Build the mailto link. Multiple recipients are comma-separated.
//     const mailtoLink = `mailto:${emails.join(
//       ","
//     )}?subject=${subject}&body=${encodedBody}`;

//     // Open the user's default email client with the pre-populated message.
//     window.location.href = mailtoLink;
//   };

//   return (
//     <div style={{ padding: "20px", textAlign: "center" }}>
//       <h2>SOS Email Alert</h2>
//       <p>Enter recipient email addresses (separated by commas):</p>
//       <input
//         type="text"
//         placeholder="e.g. example1@mail.com"
//         value={recipientEmails}
//         onChange={(e) => setRecipientEmails(e.target.value)}
//         style={{ width: "80%", padding: "10px", marginBottom: "20px" }}
//       />
//       <br />
//       <button
//         onClick={handleSendEmailAlert}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "red",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         Send SOS Email Alert
//       </button>
//     </div>
//   );
// }

// export default SOS;


import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Ensure you've configured Firebase

function EmailSOS() {
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);

  // Fetch emails from Firestore
  const fetchEmails = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "sosEmails"));
      const emailList = querySnapshot.docs.map((doc) => doc.data().email);
      setEmails(emailList);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // Add a new email to Firestore
  const handleAddEmail = async (e) => {
    e.preventDefault();
    if (emailInput.trim() === "") return;
    try {
      await addDoc(collection(db, "sosEmails"), { email: emailInput.trim() });
      setEmailInput("");
      fetchEmails(); // refresh the list after adding
    } catch (error) {
      console.error("Error adding email:", error);
    }
  };

  // Build a mailto link and open the user's default email client
  const handleSendEmail = () => {
    if (emails.length === 0) {
      alert("No emails available to send alerts.");
      return;
    }
    const subject = encodeURIComponent("Emergency Alert");
    const body = encodeURIComponent("Emergency alert: Please check your surroundings.");
    // Join all email addresses with a comma separator
    const mailtoLink = `mailto:${emails.join(",")}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>SOS Email Alert</h2>
      <form onSubmit={handleAddEmail}>
        <input
          type="email"
          placeholder="Enter email (e.g. example@mail.com)"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          style={{ width: "300px", padding: "10px", marginRight: "10px" }}
          required
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Add Email
        </button>
      </form>

      <h3>Stored Emails:</h3>
      {emails.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {emails.map((email, index) => (
            <li key={index} style={{ margin: "5px 0" }}>
              {email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No emails stored.</p>
      )}

      <button
        onClick={handleSendEmail}
        style={{
          padding: "10px 20px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Send Email Alert to All
      </button>
    </div>
  );
}

export default EmailSOS;

