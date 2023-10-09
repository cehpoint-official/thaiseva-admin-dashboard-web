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
import { getDocs, query, where } from "firebase/firestore";
export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPartner, setIsPatner] = useState(false);
  const [isVerifiedPartner, setIsVerifiedPartner] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const loadUser = async (user) => {
      setLoadingUserData(true);
      if (user?.email) {
        const res = await getDocs(
          query(usersCollection, where("email", "==", user.email))
        );
        const userData = res.docs[0]?.data();
        // const data = setPartnerDetails({ id: data.id, ...data.data() });
        if (userData?.role === "Admin") {
          setIsVerifiedPartner(false);
          setIsAdmin(true);
          setLoadingUserData(false);
        } else if (userData?.role === "Partner") {
          setIsAdmin(false);
          setIsPatner(true);
          setUserData(userData);
          userData?.status === "Verified" && setIsVerifiedPartner(true);
          setLoadingUserData(false);
        }
      }
    };

    user && loadUser(user);
  }, [user]);

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
    setIsAdmin(false);
    setIsPatner(false);
    setLoading(false);
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
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
    loadingUserData,
    isAdmin,
    userData,
    setLoading,
    isVerifiedPartner,
    isPartner,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
