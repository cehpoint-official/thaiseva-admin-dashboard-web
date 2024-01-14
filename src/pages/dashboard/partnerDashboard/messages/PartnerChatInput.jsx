import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { AuthContext } from "../../../../contextAPIs/AuthProvider";
import { PartnerChatContext } from "../../../../contextAPIs/PartnerChatProvider";
import {
  chatRoomsCollection,
  chatsCollection,
  storage,
} from "../../../../firebase/firebase.config";

const PartnerChatInput = ({ audioUrl, setAudioUrl }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { data } = useContext(PartnerChatContext);
  let chatRoom = "";

  if (data) {
    chatRoom = data?.oppositeUser?.uid?.split("_")[1];
  }
  useEffect(() => {
    const sendAudio = async () => {
      const audioMessage = {
        id: uuid(),
        audioUrl,
        text: "",
        senderId: user.uid,
        date: Timestamp.now(),
      };

      await updateDoc(doc(chatsCollection, data.chatId), {
        messages: arrayUnion(audioMessage),
      }).then(async () => {
        setAudioUrl("");
        await updateDoc(doc(chatRoomsCollection, chatRoom), {
          [data.chatId + ".lastMessage"]: "",
          [data.chatId + ".audioUrl"]: true,
          [data.chatId + ".imgUrl"]: false,
          [data.chatId + ".isRead"]: false,
          [data.chatId + ".date"]: serverTimestamp(),
        });
      });
    };

    audioUrl && sendAudio();
  }, [audioUrl]);

  const handleSend = async () => {
    let newMessage = {
      id: uuid(),
      text,
      senderId: user.uid,
      date: Timestamp.now(),
      imageUrl: "",
    };

    if (text.length > 0) {
      await updateDoc(doc(chatsCollection, data.chatId), {
        messages: arrayUnion(newMessage),
      });
    }

    // adding the last message to the thaiseva admin conversation
    await updateDoc(doc(chatRoomsCollection, chatRoom), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".imgUrl"]: false,
      [data.chatId + ".audioUrl"]: false,
      [data.chatId + ".isRead"]: false,
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
  };

  const handleSendImage = async (img) => {
    if (img) {
      setLoading(true);
      const storageRef = ref(storage, uuid());
      const uploadTask = await uploadBytesResumable(storageRef, img);

      const imgURL = await getDownloadURL(uploadTask.ref);
      if (imgURL) {
        await updateDoc(doc(chatsCollection, data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: "",
            senderId: user.uid,
            date: Timestamp.now(),
            imageUrl: imgURL,
          }),
        }).then(async () => {
          setLoading(false);
          await updateDoc(doc(chatRoomsCollection, chatRoom), {
            [data.chatId + ".lastMessage"]: "",
            [data.chatId + ".imgUrl"]: true,
            [data.chatId + ".audioUrl"]: false,
            [data.chatId + ".isRead"]: false,
            [data.chatId + ".date"]: serverTimestamp(),
          });
        });
      }
    }
  };

  return (
    <div className="h-12 bg-white p-3 flex items-center justify-between ">
      <input
        type="text"
        placeholder="Type something..."
        className="w-full border-none outline-none text-[#2f2d52] text-lg placeholder-[lightgray] px-2 bg-transparent"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="flex gap-2 items-center">
        {loading && (
          <span className="text-orange-500 text-xs block">
            Sending image...
          </span>
        )}
        <input
          type="file"
          name=""
          id="img"
          className="hidden"
          onChange={(e) => handleSendImage(e.target.files[0])}
        />
        <label htmlFor="img">
          <InsertPhotoIcon />
        </label>
        <button
          className="text-white bg-blue-500 py-1 px-2 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default PartnerChatInput;
