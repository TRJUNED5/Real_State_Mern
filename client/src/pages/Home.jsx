import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper'
import ListingItem from '../components/ListingItem'

export default function Home() {
  const [ offerListings, setOfferListings ] = useState([]);
  const [ saleListings, setSaleListings ] = useState([]);
  const [ rentListings, setRentListings ] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(saleListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4')
        const data = await res.json();
        setOfferListings(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListing = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4')
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();

  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-blue-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-blue-500'>perfect</span> 
          <br/>
          place with ease
        </h1>
        <div className='text-gray-400 text-xd sm:text-sm'>
          TazanState is the best place to find your next perfect place to live
          <br/>
          we have a wide range of properties for you to choose from
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get started...
        </Link>
      </div>


      {/* swiper */}
      <Swiper navigation>

      {
        offerListings && offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide>
            <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:"cover"}} className='h-[500px]' key={listing._id}></div>
          </SwiperSlide>
        )
        )
      }
      </Swiper>



      {/* listing resualts for offer, sale and rent */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {
          offerListings && offerListings.length > 0 && (
            <div className=''>
              <div className=''>
                <h2>Recent offers</h2>
                <Link to={'/search?offer=true'}>
                  Show more offers
                </Link>
              </div>
              <div className=''>
                {
                  offerListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
