import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase.config";
import Message from "./Message";
import { PartnerChatContext } from "../../../../contextAPIs/PartnerChatProvider";
import { useRef } from "react";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(PartnerChatContext);
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
      className="bg-[#ddddf7] p-3 h-[calc(100%-112px)] overflow-y-scroll scroll-smooth"
    >
      {messages && messages?.map((m) => <Message message={m} key={m.id} />)}
    </div>
  );
};

export default Messages;
