import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import SwiperCore from 'swiper'
import 'swiper/css/bundle'
import ListingItem from '../components/ListingItem'

export default function Home() {
  const [offreListings, setOffreListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  SwiperCore.use([Autoplay])

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await fetch('/api/listing/search?offer=true&limit=4')
        const data = await response.json()
        setOffreListings(data)
        fetchRentListings()
      } catch (error) {
        console.error(error)
      }
    }
    const fetchRentListings = async () => {
      try {
        const response = await fetch('/api/listing/search?type=rent&limit=4')
        const data = await response.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.error(error)
      }
    }
    const fetchSaleListings = async () => {
      try {
        const response = await fetch('/api/listing/search?type=sale&limit=4')
        const data = await response.json()
        setSaleListings(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchOfferListings()
  }, [])

  return (
    <div>
      {/* Top Section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl lg:text-6xl mx-auto">
        <h1 className="text-yellow-600 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-green-900">perfect</span>
          <br />
          place to live
        </h1>
        <div className="text-gray-500 text-xs sm:text-sm">
          Amine Estate is the best place to find your next place to live.
          <br />
          We have the best properties and the best prices.
        </div>
        <Link
          to={'/search'}
          className="text-xs sm:text-sm text-green-900 font-bold hover:underline"
        >
          Let’s get started...
        </Link>
      </div>

      {/* Swiper Section */}
      <Swiper autoplay={{ delay: 3000, disableOnInteraction: false }}>
        {offreListings &&
          offreListings.length > 0 &&
          offreListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[500px] rounded-lg shadow-lg overflow-hidden"
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Offer Listings Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offreListings && offreListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-green-900">
                Recent offers
              </h2>
              <Link
                to="/search?offer=true"
                className="text-green-900 font-bold hover:underline"
              >
                See more
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offreListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-green-900">
                Recent places for rent
              </h2>
              <Link
                to="/search?type=rent"
                className="text-green-900 font-bold hover:underline"
              >
                See more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-green-900">
                Recent sales
              </h2>
              <Link
                to="/search?type=sale"
                className="text-green-900 font-bold hover:underline"
              >
                See more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
