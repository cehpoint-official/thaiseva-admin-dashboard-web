import { useContext, useRef } from "react";
import Message from "./Message";
import { useState } from "react";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { AdminChatContext } from "../../../contextAPIs/AdminChatProvider";
import { db } from "../../../firebase/firebase.config";
const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(AdminChatContext);
  const ref = useRef();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data]);

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={ref}
      className="bg-[#ddddf7] h-[calc(100%-112px)] p-3 overflow-y-scroll scroll-smooth"
    >
      {messages && messages?.map((m) => <Message message={m} key={m.id} />)}
    </div>
  );
};

export default Messages;
