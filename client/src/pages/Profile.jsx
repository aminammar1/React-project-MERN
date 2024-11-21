import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Client, Storage } from "appwrite";
import {
  updateAvatar,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutstart,
  signoutSuccess,
  signoutFailure,
} from "../user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [uploadError, setUploadError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  // Initialize Appwrite Client
  const client = useMemo(() => {
    const appwriteClient = new Client();
    appwriteClient
      .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
      .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
    return appwriteClient;
  }, []);

  // Initialize Storage object once
  const storage = useMemo(() => new Storage(client), [client]);

  const handleFileUpload = useCallback(
    async (file) => {
      setUploadError(null);
      setUploadMessage("");

      try {
        const response = await storage.createFile(
          import.meta.env.VITE_APPWRITE_BUCKET_ID,
          "unique()",
          file
        );

        const avatarUrl = `${
          import.meta.env.VITE_APPWRITE_ENDPOINT
        }/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID}/files/${
          response.$id
        }/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
        dispatch(updateAvatar(avatarUrl));

        setFormData((prevFormData) => ({
          ...prevFormData,
          avatar: avatarUrl,
        }));
        setUploadMessage("Image uploaded successfully.");
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadError("Failed to upload file. Please try again.");
      }
    },
    [storage, dispatch]
  );

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file, handleFileUpload]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.sucess === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.sucess === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutstart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutFailure(data.message));
        return;
      }
      dispatch(signoutSuccess(data));
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        {uploadMessage && <div className="text-green-500">{uploadMessage}</div>}
        {uploadError && <p className="text-red-500">{uploadError}</p>}
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-500 text-white p-3 rounded-lg uppercase text-center hover:opacity-95  "
          to="/create-listing"
        >
          Create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-gray-500 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-gray-500 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5"> {error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {" "}
        {updateSuccess ? "Profile updated successfully." : ""}
      </p>
    </div>
  );
}
