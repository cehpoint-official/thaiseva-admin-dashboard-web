import { useContext } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthProvider";
import { useReducer } from "react";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    oppositeUser: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          oppositeUser: action.payload,
          chatId:
            user.uid > action.payload?.uid
              ? user.uid + action.payload.uid
              : action.payload.uid + user.uid,
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
