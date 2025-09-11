import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // wait until loading finishes

    if (!user) {
      clearUser?.(); // call only if defined
      navigate("/login", { replace: true }); // replace history to avoid back button loophole
    }
  }, [user, loading, clearUser, navigate]);

  return user; // optional, if you want the component to use the user
};
