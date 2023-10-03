import { useContext } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthProvider";
import { useReducer } from "react";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const { user, isAdmin } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    oppositeUser: {},
  };

  let currentUid;

  if (isAdmin) {
    currentUid = "ThaisevaAdmin";
  } else {
    currentUid = user?.uid;
  }

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          oppositeUser: action.payload,
          chatId:
            currentUid > action.payload?.uid
              ? currentUid + action.payload.uid
              : action.payload.uid + currentUid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
