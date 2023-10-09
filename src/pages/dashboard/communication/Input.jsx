import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { useContext } from "react";
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
import { AuthContext } from "../../../contextAPIs/AuthProvider";
import { AdminChatContext } from "../../../contextAPIs/AdminChatProvider";
import { db, storage } from "../../../firebase/firebase.config";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { user, isAdmin } = useContext(AuthContext);
  const { data } = useContext(AdminChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = await uploadBytesResumable(storageRef, img);

      const imgURL = await getDownloadURL(uploadTask.ref);

      if (imgURL) {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: "_CustomerSupport",
            date: Timestamp.now(),
            img: imgURL,
          }),
        });
      }
    } else if (text.length > 0) {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: "_CustomerSupport",
          date: Timestamp.now(),
        }),
      });
    }

    // adding the last message to the thaiseva admin conversation
    await updateDoc(doc(db, "chatRooms", "CustomerSupport"), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
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
        <AttachFileIcon />
        <input
          type="file"
          name=""
          id="img"
          className="hidden"
          onChange={(e) => setImg(e.target.files[0])}
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

export default Input;
