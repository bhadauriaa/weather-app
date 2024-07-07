// import { DateTime } from "luxon";

// const API_KEY='72c2343d346f19386e97c1846eb29738'
// const BASE_URL='https://api.openweathermap.org/data/2.5/'

// const getWeatherData=(infoType, searchParams)=>{
//     const url=new URL(BASE_URL+ infoType);
//     url.search=new URLSearchParams({...searchParams, appid:API_KEY});
//     console.log(url);
//     return fetch(url)
//     .then((response)=>response.json())

// };
// const iconUrlFromCode=(icon)=> `http://openweatherapp.org/img/wn/${icon}@2x.png`;
// const formatToLocalTime=(secs, offset, format="cccc, dd LLL yyyy' | Local time: 'hh:mm a"
// )=> DateTime.fromSeconds(secs+offset,{zone:"utc"}).toFormat(format);
// const formatCurrent=(data)=>{
//     const {
//         coord: { lat, lon},
//         main: {temp, feels_like, temp_min, temp_max, humidity },
//         name,
//         dt,
//         sys: { country, sunrise, sunset },
//         weather,
//         wind: { speed },
//         timezone,
//     }= data;
//     const {main: details, icon}=weather[0]
//     const formattedLocalTime=formatToLocalTime(dt, timezone);

//     return{
//         lat,
//         lon,
//         temp,
//         feels_like,
//         temp_min,
//         temp_max,
//         humidity,
//         name,
//         country,
//         sunrise: formatToLocalTime(sunrise, timezone,'hh:mm a'),
//         sunset: formatToLocalTime(sunset, timezone, 'hh:mm a'),
//         details,
//         icon:iconUrlFromCode(icon),
//         speed,
//         formattedLocalTime,
//         dt,
//         timezone
//     }
// };

// const formatForecastWeather=(secs, offset, data)=>{
//     const hourly=data.filter((f)=>f.dt>secs).map((f)=>({
//         temp:f.main.temp,
//         title: formatToLocalTime(f.dt, offset, "hh:mm a"),
//         icon: iconUrlFromCode(f.weather[0].icon),
//         date: f.dt_txt,
//     }))
//     .slice(0,5);
//     //daily
//     const daily=data.filter((f)=>f.dt_txt.slice(-8)==="00:00:00").map((f)=>({
//         temp:f.main.temp,
//         title: formatToLocalTime(f.dt, offset, "ccc"),
//         icon: iconUrlFromCode(f.weather[0].icon),
//         date: f.dt_txt,
//     }));
//     return {hourly, daily};
// };
 
// const getFormattedWeatherData=async (searchParams)=>{
//     try{
//         const formattedCurrentweather= await getWeatherData("weather",searchParams).then(formatCurrent);
//         const {dt, lat, lon, timezone}=formattedCurrentweather
//         const formattedForecastWeather=await getWeatherData('forecast',{lat, lon, units: searchParams.units}).then((d)=>formatForecastWeather(dt, timezone, d.list))
//         return {...formattedCurrentweather, ...formattedForecastWeather};
//     }catch (error){
//         console.error("Error getting formatted weather data:", error);
//     }
   
// }
// export default getFormattedWeatherData;



import { DateTime } from "luxon";

const API_KEY = '72c2343d346f19386e97c1846eb29738';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const ICON_URL = 'https://openweathermap.org/img/wn/';
const cache = {};

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  const queryKey = url.toString();

  // Check if the data is already cached
  if (cache[queryKey]) {
    return Promise.resolve(cache[queryKey]);
  }

  console.log(url);
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      cache[queryKey] = data; // Cache the response data
      return data;
    });
};

const iconUrlFromCode = (icon) => `${ICON_URL}${icon}@2x.png`;

const formatToLocalTime = (secs, offset, format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a") => 
  DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);

const formatCurrent = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;
  const { main: details, icon } = weather[0];
  const formattedLocalTime = formatToLocalTime(dt, timezone);

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    country,
    sunrise: formatToLocalTime(sunrise, timezone, 'hh:mm a'),
    sunset: formatToLocalTime(sunset, timezone, 'hh:mm a'),
    details,
    icon: iconUrlFromCode(icon),
    speed,
    formattedLocalTime,
    dt,
    timezone
  };
};

const formatForecastWeather = (secs, offset, data) => {
  const hourly = data.filter((f) => f.dt > secs).map((f) => ({
    temp: f.main.temp,
    title: formatToLocalTime(f.dt, offset, "hh:mm a"),
    icon: iconUrlFromCode(f.weather[0].icon),
    date: f.dt_txt,
  })).slice(0, 5);

  const daily = data.filter((f) => f.dt_txt.slice(-8) === "00:00:00").map((f) => ({
    temp: f.main.temp,
    title: formatToLocalTime(f.dt, offset, "ccc"),
    icon: iconUrlFromCode(f.weather[0].icon),
    date: f.dt_txt,
  }));

  return { hourly, daily };
};

const getFormattedWeatherData = async (searchParams) => {
  try {
    const formattedCurrentWeather = await getWeatherData("weather", searchParams).then(formatCurrent);
    const { dt, lat, lon, timezone } = formattedCurrentWeather;
    const formattedForecastWeather = await getWeatherData('forecast', { lat, lon, units: searchParams.units }).then((d) => formatForecastWeather(dt, timezone, d.list));
    return { ...formattedCurrentWeather, ...formattedForecastWeather };
  } catch (error) {
    console.error("Error getting formatted weather data:", error);
  }
};

export default getFormattedWeatherData;


