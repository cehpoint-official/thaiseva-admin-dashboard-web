import { createContext, useEffect, useState } from "react";
import { app, usersCollection } from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { onSnapshot, query, where } from "firebase/firestore";
export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPartner, setIsPatner] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
  const [isVerifiedPartner, setIsVerifiedPartner] = useState(false);
  const [userData, setUserData] = useState({});

  // creating user with email and password
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  //   login user with email and password
  const logInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logout user
  const logOut = () => {
    return signOut(auth);
  };

  // updating user name and img
  const updateUserProfile = (name, profile) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: profile,
    });
  };

  //   observing the user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);

        const unSub = onSnapshot(
          query(usersCollection, where("uid", "==", currentUser?.uid)),
          (result) => {
            const user = result?.docs[0]?.data();
            if (user?.role === "Admin") {
              setIsAdmin(true);
            } else if (user?.role === "Partner") {
              setIsPatner(true);
              setUserData(user);
              user?.status === "Verified" && setIsVerifiedPartner(true);
            } else if (user?.role === "Sub Admin") {
              setIsSubAdmin(true);
            }
          }
        );
        return () => {
          unSub();
        };
      } else {
        setUser(null);
        setLoading(false);
        setUserData(null);
        setIsAdmin(false);
        setIsPatner(false);
        setIsSubAdmin(false);
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    logInUser,
    logOut,
    createUser,
    updateUserProfile,
    isAdmin,
    userData,
    setLoading,
    isVerifiedPartner,
    isPartner,
    isSubAdmin,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
