import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  ListingItem.propTypes = {
    listing: PropTypes.shape({
      name: PropTypes.string.isRequired,
      imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
      _id: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      offer: PropTypes.string.isRequired,
      discountedPrice: PropTypes.string.isRequired,
      regularPrice: PropTypes.string,
      type: PropTypes.string.isRequired,
      bedrooms: PropTypes.number.isRequired,
      bathrooms: PropTypes.number.isRequired,
    }).isRequired,
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] ">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://www.neighbor.com/storage-blog/wp-content/uploads/2020/03/AdobeStock_89298214-min_8421efb06b9d433a6f2f17d886703510_2000.jpeg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-gray-600 text-sm truncate ">{listing.address}</p>
          </div>
          <p className="text-gray-600 text-sm  line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-700 mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountedPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" ? " / month" : ""}
            <div className="text-slate-950 flex gap-4 ">
              <div className="font-bold text-xs ">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} bedrooms`
                  : `${listing.bedrooms} bedroom`}
              </div>
              <div className="font-bold text-xs ">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bathrooms`
                  : `${listing.bathrooms} bathoom`}
              </div>
            </div>
          </p>
        </div>
      </Link>
    </div>
  );
}
