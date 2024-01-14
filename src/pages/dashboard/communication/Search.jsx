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
import { useContext } from "react";
import { db, usersCollection } from "../../../firebase/firebase.config";
import { Tooltip } from "@mui/material";
import { AdminChatContext } from "../../../contextAPIs/AdminChatProvider";
import CloseIcon from "@mui/icons-material/Close";
const Search = ({ setOpenSidebar }) => {
  const [username, setUsername] = useState("");
  const [oppositeUser, setOppositeUser] = useState(null);
  const [error, setError] = useState(false);
  const { dispatch } = useContext(AdminChatContext) || {};
  // const { chatRoom } = useContext(PartnerContext);

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
    let adminUid = "";
    let chatRoom = "";
    if (oppositeUser?.serviceCategory === "Driving") {
      adminUid = "_DriversSupport";
      chatRoom = "DriversSupport";
    } else if (oppositeUser?.serviceCategory === "Hotel") {
      adminUid = "_HotelSupport";
      chatRoom = "HotelSupport";
    } else if (oppositeUser?.serviceCategory === "Restaurant") {
      adminUid = "_RestaurantSupport";
      chatRoom = "RestaurantSupport";
    } else {
      adminUid = "_LocalPartnerSupport";
      chatRoom = "LocalPartnerSupport";
    }

    const conversationId = oppositeUser.uid + adminUid;

    try {
      const res = await getDoc(doc(db, "chats", conversationId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", conversationId), { messages: [] });
        dispatch({
          type: "CHANGE_USER",
          payload: {
            uid: oppositeUser.uid,
            displayName: oppositeUser.displayName,
            photoURL: oppositeUser.photoURL,
          },
        });

        // creating conversation for thaiseva admin
        await updateDoc(doc(db, "chatRooms", chatRoom), {
          [conversationId + ".userInfo"]: {
            uid: oppositeUser.uid,
            displayName: oppositeUser.displayName,
            photoURL: oppositeUser.photoURL,
          },
          [conversationId + ".date"]: serverTimestamp(),
        });

        // creating conversation for user
        // await updateDoc(doc(db, "chatRooms", oppositeUser.uid), {
        //   [conversationId + ".userInfo"]: {
        //     uid: adminUid,
        //     displayName: displayName,
        //     photoURL:
        //       "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // todo : thaiseva logo
        //   },
        //   [conversationId + ".date"]: serverTimestamp(),
        // });
      } else {
        dispatch({ type: "CHANGE_USER", payload: oppositeUser });
      }
    } catch (error) {
      console.log(error);
    }
    setOpenSidebar(false);
    setOppositeUser(null);
    setUsername("");
  };

  return (
    <div>
      <div className="bg-[blue] h-16 p-3 border-r flex items-center">
        <input
          type="text"
          placeholder="Find a Partner"
          className="outline-none border-b bg-[#fffffff0] rounded-full py-2 px-3 w-full text-[blue]"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <div onClick={() => setOpenSidebar(false)} className="lg:hidden block">
          <CloseIcon />
        </div>
      </div>
      {error && <span>User Not Found!</span>}
      {oppositeUser && (
        <Tooltip arrow title="Tap to chat" placement="top">
          <div
            className="border-b p-2 mr-2 flex items-center gap-2 cursor-pointer bg-[#363636] hover:bg-[#2f2d52]"
            onClick={handleSelect}
          >
            <img
              src={oppositeUser?.photoURL}
              alt=""
              className="w-10 h-10 rounded-full bg-transparent"
            />
            <div>
              <span>{oppositeUser?.displayName}</span>
            </div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default Search;
