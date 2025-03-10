import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {IoMdSunny,IoMdRainy,IoMdCloudy,IoMdSnow,IoMdThunderstorm,IoMdSearch} from 'react-icons/io'
import {BsCloudHaze2Fill,BsCloudDrizzleFill,BsEye,BsWater,BsThermometer,BsWind} from 'react-icons/bs'
import {TbTemperatureCelsius} from 'react-icons/tb'
import {ImSpinner8} from 'react-icons/im'


const APIKey = '825b72f8ceee4c415f220c9784e7eef9';
const App = () => {

  const [data,setData] = useState(null);
  const [inputValue,setInputValue] = useState('');
  const [ animate, setAnimate] = useState(false);
  const [loading,setLoading] = useState(false);
  const [errorMsg,setErrorMsg] = useState('');


  useEffect(() => {
    // Check if geolocation is available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setErrorMsg("Location access denied. Search manually.");
        }
      );
    } else {
      setErrorMsg("Geolocation is not supported in this browser.");
    }
  }, []);

  const fetchWeatherByCoords = (lat, lon) => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;
    
    axios.get(url).then(res => {
      setTimeout(() => {
        setData(res.data);
        setLoading(false);
      }, 200);
    }).catch(err => {
      setLoading(false);
      setErrorMsg("Error fetching weather data.");
    });
  };

  const fetchWeatherByCity = (city) => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;
    
    axios.get(url).then(res => {
      setTimeout(() => {
        setData(res.data);
        setLoading(false);
      }, 200);
    }).catch(err => {
      setLoading(false);
      setErrorMsg("Error fetching weather data.");
    });
  };

  // console.log(data);

  const handleInput = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue !== '') {
      fetchWeatherByCity(inputValue);
    }

    const input = document.querySelector('input');
    if (input.value === '') {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }
    input.value = '';
  };


  useEffect(()=>{
    const timer= setTimeout(()=>{
      setErrorMsg('')
    },2000)
    return()=>clearTimeout(timer);
  },[errorMsg])

  
  if(!data){
    return(
      <div className='flex flex-col items-center justify-center w-full h-screen text-white bg-center bg-no-repeat bg-cover bg-gradientBg'>
        <div>
          <ImSpinner8 className='text-5xl animate-spin'/>
        </div>
      </div>
    );
  }

//set icon
let icon;
// console.log(data.weather[0].main);

switch (data.weather[0].main){
  case 'Clouds':
    icon =<IoMdCloudy/>
    break;
  case 'Haze':
    icon=<BsCloudHaze2Fill className='text-[#7D7098]'/>
    break;
  case 'Rain':
      icon = <IoMdRainy className='text-[#31cafb]'/>
      break;
  case 'Clear':
    icon = <IoMdSunny className='text-[#ffde33]'/>
    break;
  case 'Snow':
    icon = <IoMdSnow className='text-[#31cafb]'/>
    break;
  case 'Drizzle':
    icon = <BsCloudDrizzleFill className='text-[#31cafb]'/>
    break;
  case 'Thunderstorm':
    icon = <IoMdThunderstorm/>
    break;
    default:
      icon = <IoMdSunny className='text-[#ffde33]'/>
}

const date = new Date();
  return <div className='flex flex-col items-center justify-center w-full h-screen px-4 bg-center bg-no-repeat bg-cover bg-gradientBg lg:px-0'>
    {errorMsg && <div className='w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white
    absolute top-2 lg:top-10 p-4 capitalize rounded-md'>
      {`${errorMsg.response.data.message}`}
      </div>}

    <form className={`${animate?'animate-shake':'animate-none'} h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`}>
      <div className='relative flex items-center justify-between h-full p-2'>
        <input 
        onChange ={(e)=>handleInput(e)}
        className ='flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full'
         type='text' placeholder='Search by city or country'/>
        <button
        onClick = {(e)=>handleSubmit(e)}
         className='bg-[#1ab8ed] 
       hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition'>
          <IoMdSearch className='text-2xl text-white'/>
        </button>
      </div>
    </form>

    <div className='w-full max-w-[450px] bg-black/20 min-h-[584px] text-white
    backdrop-blur-[32px] rounded-[32px] py-12 px-6'>
      {loading ? (
      <div className='flex items-center justify-center w-full h-full'>
        <ImSpinner8 className='text-5xl text-white animate-spin'/>
        </div>):
      ( <div>
        <div className='flex items-center gap-x-5'>
           <div className='text-[87px]'>{icon}</div>
           
          <div>
           <div className='text-2xl font-semibold'>{data.name}, {data.sys.country}</div>
           <div>{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</div>
         </div>
       </div>

        <div className='my-20'>
          <div className='flex items-center justify-center'>
            <div className='text-[144px] leading-none font-light'>{parseInt(data.main.temp)}</div>
            <div className='text-4xl'>
              <TbTemperatureCelsius/>
            </div>
          </div>

          <div className='text-center capitalize'>
            {data.weather[0].description}
            </div>
        </div>

        <div className='max-w-[378px] mx-auto flex flex-col gap-y-6'>
          <div className='flex justify-between'>
            <div className='flex items-center gap-x-2'>
              <div>
                <BsEye/>
              </div>

              <div>
                Visibility <span className='ml-2 '>
                  {data.visibility/1000} km
                  </span>
              </div>
            </div>

            <div className='flex items-center gap-x-2'>
              <div className='text-[20px]'>
                <BsThermometer/>
              </div>

              <div className='flex'>
                Feels Like <div className='flex ml-2'>
                  {parseInt(data.main.feels_like)}
                  <TbTemperatureCelsius/>
                  </div>
              </div>
            </div>
          </div>

          <div className='flex justify-between'>
            <div className='flex items-center gap-x-2'>
              <div>
                <BsWater/>
              </div>

              <div>
                Humidity <span className='ml-2 '>
                  {data.main.humidity} %
                  </span>
              </div>
            </div>

            <div className='flex items-center gap-x-2'>
              <div className='text-[20px]'>
                <BsWind/>
              </div>

              <div>
               Wind <span className='ml-2'>{data.wind.speed} m/s</span>
              </div>
            </div>
          </div>
        </div>
    </div>)}
    </div>
  </div>;
};

export default App;
