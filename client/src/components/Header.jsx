import { FaSearch, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchSuggestions = async (value) => {
    try {
      const response = await fetch(
        `/api/listing/getSuggestions?searchTerm=${value}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 1) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setSuggestions([]);
    navigate(`/search?searchTerm=${suggestion}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearch(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-5 px-4 sm:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-3xl font-bold tracking-wide">
            Amine <span className="text-indigo-200">Estate</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center bg-white rounded-lg p-2 w-full sm:w-80"
        >
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-transparent focus:outline-none w-full px-4 py-2 text-gray-700"
            onChange={handleInputChange}
            value={searchTerm}
          />
          <button type="submit" className="text-blue-600 p-2">
            <FaSearch />
          </button>
          {suggestions.length > 0 && (
            <div className="absolute left-0 top-full bg-white border mt-1 rounded-lg max-h-40 overflow-y-auto z-50 w-full">
              {suggestions.map((suggestion, index) => (
                <p
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)} // Navigate directly
                  className="cursor-pointer px-4 py-2 hover:bg-gray-200 text-black"
                >
                  {suggestion}
                </p>
              ))}
            </div>
          )}
        </form>

        {/* Navigation and User Profile */}
        <nav className=" flex gap-4 ">
          <Link
            to="/"
            className="text-white hover:text-indigo-300 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-indigo-300 transition-colors duration-300"
          >
            About
          </Link>

          {/* User Profile or Sign-in */}
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile"
                className="rounded-full h-7 w-7 object-cover "
              />
            ) : (
              <FaSignInAlt className="text-white text-2xl" />
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
