import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { SigninSuccess } from "../user/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function GoogleAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(SigninSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("error with google authentification ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full bg-red-600 text-white p-3 rounded-lg uppercase mt-4 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
      disabled={loading}
    >
      {loading ? "Loading..." : "Continue with Google"}
    </button>
  );
}
