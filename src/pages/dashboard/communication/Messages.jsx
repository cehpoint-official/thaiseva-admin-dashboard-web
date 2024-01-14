import { useContext, useRef } from "react";
import Message from "./Message";
import { useState } from "react";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { AdminChatContext } from "../../../contextAPIs/AdminChatProvider";
import { db } from "../../../firebase/firebase.config";
const Messages = ({ setLastMessage, oppositeUser }) => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(AdminChatContext);
  const ref = useRef();

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        const { messages } = doc.data();

        const matched = messages?.filter((message) => {
          if (message.senderId !== "_CustomerSupport") {
            return message;
          }
        });
        setLastMessage(matched[matched.length - 1]);
        setMessages(messages);
      }
    });

    return () => {
      unSub();
    };
  }, [data, setLastMessage]);

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={ref}
      className="bg-[#ddddf7] h-[calc(100%-112px)] md:p-3 p-2 overflow-y-scroll scroll-smooth flex flex-col gap-1"
    >
      {!oppositeUser.displayName ? (
        <div className="flex items-center justify-center h-full text-xl text-slate-500">
          <h3>Select a conversation to chat.</h3>
        </div>
      ) : (
        messages.length > 0 &&
        messages?.map((m) => <Message message={m} key={m.id} />)
      )}
    </div>
  );
};

export default Messages;
