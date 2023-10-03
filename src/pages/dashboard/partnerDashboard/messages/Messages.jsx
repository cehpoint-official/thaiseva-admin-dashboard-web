import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../../../firebase/firebase.config";
import { ChatContext } from "../../../../contextAPIs/ChatProvider";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data]);

  return (
    <div className="bg-[#ddddf7] p-3 h-[calc(100%-96px)] overflow-y-scroll">
      {messages && messages?.map((m) => <Message message={m} key={m.id} />)}
    </div>
  );
};

export default Messages;
