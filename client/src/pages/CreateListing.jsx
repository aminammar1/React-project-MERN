import { useState } from "react";
import { Client, Storage } from "appwrite";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ imageUrls: [] });
  const [imageUploadError, setImageUploadError] = useState(false);

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
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="50"
            minLength="10"
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                required
                className="border border-gray-300 p-3 rounded-lg"
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
                min="1"
                className="border border-gray-300 p-3 rounded-lg"
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
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
