import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [contact, setContact] = useState(null);
  const [message, setMessage] = useState("");

  Contact.propTypes = {
    listing: PropTypes.shape({
      userRef: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`);
        const data = await response.json();
        setContact(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContact();
  }, [listing.userRef]);

  return (
    <>
      {contact && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span> {contact.username} </span>
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()} </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Type your message here..."
            className="w-full p-3  border border-gray-300 rounded-lg"
          ></textarea>

          <Link
            to={`https://mail.google.com/mail/?view=cm&fs=1&to=${
              contact.email
            }&su=${encodeURIComponent(
              "Regarding " + listing.name
            )}&body=${encodeURIComponent(message)}`}
            className="bg-blue-500 text-white text-center p-3 rounded-lg uppercase hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
