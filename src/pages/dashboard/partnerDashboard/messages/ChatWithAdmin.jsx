import { useContext, useEffect } from "react";
import { AuthContext } from "../../../../contextAPIs/AuthProvider";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebase.config";
import PartnerChats from "./PartnerChats";
import { PartnerChatContext } from "../../../../contextAPIs/PartnerChatProvider";

const ChatWithAdmin = () => {
  const { dispatch } = useContext(PartnerChatContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // taking the admin details for messaging
    const handleSelect = async () => {
      const adminInfo = {
        uid: "_CustomerSupport",
        displayName: "Customer Support",
        photoURL:
          "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // todo : thaiseva logo
      };

      dispatch({ type: "CHANGE_USER", payload: adminInfo });

      const conversationId = user.uid + "_CustomerSupport";

      try {
        const res = await getDoc(doc(db, "chats", conversationId));

        if (!res.exists()) {
          await setDoc(doc(db, "chats", conversationId), { message: [] });

          // creating conversation for thaiseva admin
          await updateDoc(doc(db, "chatRooms", "CustomerSupport"), {
            [conversationId + ".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            [conversationId + ".date"]: serverTimestamp(),
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    user?.photoURL !== null && handleSelect();
  }, [dispatch, user]);

  return (
    <div className="md:h-[80vh] h-[85vh]">
      <PartnerChats />
    </div>
  );
};

export default ChatWithAdmin;
