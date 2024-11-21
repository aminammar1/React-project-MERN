import { useState } from "react";
import { Client, Storage } from "appwrite";
import { useSelector } from "react-redux";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });
  console.log(formData);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const client = new Client();
  client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

  const storage = new Storage(client);

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 2 * 1024 * 1024) {
          setImageUploadError("Image size should be less than 2MB.");
          setUploading(false);
          return;
        }
      }

      setUploading(true);
      setImageUploadError(false);
      const promises = Array.from(files).map((file, index) =>
        storeImage(file, index)
      );

      try {
        const urls = await Promise.all(promises);
        setFormData((formData) => ({
          ...formData,
          imageUrls: [...formData.imageUrls, ...urls],
        }));
        setImageUploadError(false);
        setUploading(false);
      } catch {
        setImageUploadError("Image upload failed. Please try again.");
      }
    } else {
      setImageUploadError("You can only upload a maximum of 6 images.");
      setUploading(false);
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const uploadFile = async () => {
        try {
          const response = await storage.createFile(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            "unique()",
            file
          );

          const fileUrl = `${
            import.meta.env.VITE_APPWRITE_ENDPOINT
          }/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID}/files/${
            response.$id
          }/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;

          resolve(fileUrl);
        } catch (error) {
          reject(error);
        }
      };
      uploadFile();
    });
  };

  const handelRemoveImage = (index) => {
    setFormData((formData) => ({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        type: e.target.id,
      }));
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.id]: e.target.checked,
      }));
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [e.target.id]: e.target.value,
      }));
    }
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form onSubmit={handelSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="50"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type == "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type == "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="border border-gray-300 p-3 rounded-lg"
                onChange={handleChange}
                checked={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="border border-gray-300 p-3 rounded-lg"
                onChange={handleChange}
                checked={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="border border-gray-300 p-3 rounded-lg"
                onChange={handleChange}
                checked={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountedPrice"
                min="50"
                max="1000000"
                className="border border-gray-300 p-3 rounded-lg"
                onChange={handleChange}
                checked={formData.discountedPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              the first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="border border-gray-300 p-3 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-600 border border-green-600 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-600">
            {" "}
            {imageUploadError && imageUploadError}{" "}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handelRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-95 "
                >
                  {" "}
                  Delete
                </button>
              </div>
            ))}
          <button className="p-3 bg-green-500 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? "Loading..." : "Create Listing"}
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </form>
    </main>
  );
}
