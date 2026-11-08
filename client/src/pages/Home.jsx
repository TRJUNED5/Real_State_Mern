import { Link } from 'react-router-dom'

export default function Home() {
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



      {/* listing resualts for offer, sale and rent */}
    </div>
  )
}
