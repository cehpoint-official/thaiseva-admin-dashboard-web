// import { useContext } from "react";
import { createContext } from "react";
// import { AuthContext } from "./AuthProvider";
import { useReducer } from "react";

export const AdminChatContext = createContext();

const AdminChatProvider = ({ children }) => {
  // const { user, isAdmin } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    oppositeUser: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          oppositeUser: action.payload,
          chatId: action.payload.uid + "_CustomerSupport",
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return (
    <AdminChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </AdminChatContext.Provider>
  );
};

export default AdminChatProvider;
