import {
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { db, usersCollection } from "../../../../firebase/firebase.config";
import { useContext } from "react";
import { AuthContext } from "../../../../contextAPIs/AuthProvider";

const Search = () => {
  const [username, setUsername] = useState("");
  const [oppositeUser, setOppositeUser] = useState(null);
  const [error, setError] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSearch = async () => {
    try {
      const querySnapshot = await getDocs(
        query(usersCollection, where("displayName", "==", username))
      );
      querySnapshot.forEach((doc) => {
        setOppositeUser(doc.data());
      });
    } catch (error) {
      setError(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    const combinedId =
      user.uid > oppositeUser?.uid
        ? user.uid + oppositeUser.uid
        : oppositeUser.uid + user.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { message: [] });

        // create user chats
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: oppositeUser.uid,
            displayName: oppositeUser.displayName,
            photoURL: oppositeUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        // doc(collection(db, "userChats")
        await updateDoc(doc(db, "userChats", oppositeUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }
    setOppositeUser(null);
    setUsername("");
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Find a customer"
          className="outline-none border-b bg-transparent py-1 px-2"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {error && <span>User Not Found!</span>}
      {oppositeUser && (
        <div
          className="border-b p-2 flex items-center gap-2 cursor-pointer hover:bg-[#2f2d52]"
          onClick={handleSelect}
        >
          <img
            src={oppositeUser.photoURL}
            alt=""
            className="w-10 h-10 rounded-full bg-transparent"
          />
          <div>
            <span>{oppositeUser.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
