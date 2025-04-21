import { FaSearch, FaSignInAlt, FaTimes, FaBars, FaGlobe } from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

export default function Header() {
  const { currentUser } = useSelector((state) => state.user)
  const [searchTerm, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [language, setLanguage] = useState('EN')
  const navigate = useNavigate()
  const location = useLocation()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'AR' : 'EN'))
  }

  const fetchSuggestions = async (value) => {
    try {
      const response = await fetch(
        `/api/listing/getSuggestions?searchTerm=${value}`
      )
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearch(value)
    if (value.length > 1) {
      fetchSuggestions(value)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion)
    setSuggestions([])
    navigate(`/search?searchTerm=${suggestion}`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/search?searchTerm=${searchTerm}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if (searchTermFromUrl) {
      setSearch(searchTermFromUrl)
    }
  }, [location.search])

  return (
    <header className="bg-gradient-to-r from-green-900 to-yellow-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-5 px-4 sm:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-3xl font-bold tracking-wide">
            Amine <span className="text-yellow-300">Estate</span>
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
          <button type="submit" className="text-green-600 p-2">
            <FaSearch />
          </button>
          {suggestions.length > 0 && (
            <div className="absolute left-0 top-full bg-white border mt-1 rounded-lg max-h-40 overflow-y-auto z-50 w-full">
              {suggestions.map((suggestion, index) => (
                <p
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-200 text-black"
                >
                  {suggestion}
                </p>
              ))}
            </div>
          )}
        </form>

        {/* Navigation and User Profile */}
        <nav className="hidden sm:flex gap-6 items-center p-2">
          <Link
            to="/"
            className="text-white hover:text-yellow-300 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-yellow-300 transition-colors duration-300"
          >
            About
          </Link>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors duration-300"
          >
            <FaGlobe />
            {language}
          </button>

          {/* User Profile or Sign-in */}
          <Link to="/profile" className="flex items-center">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile"
                className="rounded-full h-10 w-10 object-cover border-2 border-white"
              />
            ) : (
              <FaSignInAlt className="text-white text-2xl" />
            )}
          </Link>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden flex flex-col items-center bg-green-900 text-white py-5">
          <Link
            to="/"
            className="text-white hover:text-yellow-300 transition-colors duration-300 py-2"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-yellow-300 transition-colors duration-300 py-2"
            onClick={toggleMenu}
          >
            About
          </Link>
          <button
            onClick={toggleLanguage}
            className="text-white hover:text-yellow-300 transition-colors duration-300 py-2"
          >
            {language}
          </button>
          <Link
            to="/profile"
            className="flex items-center py-2"
            onClick={toggleMenu}
          >
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile"
                className="rounded-full h-10 w-10 object-cover border-2 border-white"
              />
            ) : (
              <FaSignInAlt className="text-white text-2xl" />
            )}
          </Link>
        </div>
      )}
    </header>
  )
}
