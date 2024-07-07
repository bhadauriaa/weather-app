import { FaThermometerEmpty } from "react-icons/fa";
import { BiSolidDropletHalf } from "react-icons/bi";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import React from 'react'

const TempAndDetails = ({
    weather:{
        details, 
        icon,
        temp, 
        temp_min, 
        temp_max, 
        sunrise, 
        sunset, 
        speed, 
        humidity, 
        feels_like
    },
    units,
}) => {
    const verticalData=[
        {
            id:1,
            Icon: FaThermometerEmpty,
            Title:"Real Feel",
            value:`${feels_like.toFixed()}°`,
        },
        {
            id:2,
            Icon: BiSolidDropletHalf,
            Title:"Humidity",
            value:`${humidity.toFixed()}%`,
        },
        {
            id:3,
            Icon: FiWind,
            Title:"Wind",
            value:`${speed.toFixed()} ${ units === 'metric' ? "km/h": "m/s"}`,
            
        },
    ];
      const HorizontalData=[
        {
            id:1,
            Icon: GiSunrise,
            Title:"Sunrise",
            value: sunrise,
        },
        {
            id:2,
            Icon: GiSunset,
            Title:"Sunset",
            value: sunset,
        },
        {
            id:3,
            Icon: MdKeyboardArrowUp,
            Title:"High",
            value:`${temp_max.toFixed()}°`,
            
        },
        {
            id:4,
            Icon: MdKeyboardArrowDown,
            Title:"Down",
            value:`${temp_min.toFixed()}°`,            
        },
    ];
    return (
        <div>
            <div className="flex items-center justify-center py-6 text-xl text-cyan-300">
                <p>{details}</p>
            </div>
            <div className="flex flex-row items-center justify-between py-3">
                <img 
                    src={icon}
                    alt="weather icon"
                    className="w-20"
                />
                <p className="text-5xl">{`${temp.toFixed()}`}</p>
            
                <div className="flex flex-col space-y-3 items-start">

                    {verticalData.map(({id, Icon, Title, value})=>(
                        <div key={id} className="flex font-light text-sm items-center justify-center">
                            <Icon size={18} className="mr-1" />
                            {`${Title}:`} <span className="font-medium ml-1">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-row items-center justify-center space-x-10 text-sm py-3">
                {
                    HorizontalData.map(({id,Icon,Title,value})=>(
                        <div key={id} className="flex flex-row items-center">
                            <Icon size={30} />
                            <p className="font-light ml-1 "></p>
                                {`${Title}:`} <span className="font-medium ml-1">{value}</span>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default TempAndDetails