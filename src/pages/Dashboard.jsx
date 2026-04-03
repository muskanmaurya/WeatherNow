import React from 'react'
import {transformHourlyData } from '../utils/dataTransformer'
import {mockdata} from '../mockData.js'
import WeatherChart from "../components/Layout/WeatherChart.jsx"
import { Calendar } from 'lucide-react';
import  WeatherWidget from '../components/Layout/WeatherWidget.jsx';
import { Sun, Droplets, Wind, Eye } from 'lucide-react';
import AQICard from '../components/Layout/AQICard.jsx';

const Dashboard = () => {

  return (
    <div>Dashboard
        <h1>Weather Now <div><Calendar/> </div> </h1>
        <h1 className='bg-pink-500'>{transformHourlyData(mockdata.hourly).map((hour)=>{
            return <div key={hour.time}>{hour.time}: {hour.temp}°C, Humidity: {hour.humidity}%</div>
            
        })}</h1>

        <h1>{mockdata.latitude}, {mockdata.longitude}</h1>
        <h1>{mockdata.hourly.time[0]}</h1>
        <div>
          <WeatherChart />
        </div>
        <div className="bg-blue-950 grid grid-cols-2 gap-4 p-4">

            <WeatherWidget 
              title="UV INDEX" 
              icon={<Sun size={16}/>} 
              value="4" 
              description="Moderate" 
              footer="Use sun protection until 4 PM."
            />
            <WeatherWidget 
              title="HUMIDITY" 
              icon={<Droplets size={16}/>} 
              value="82" 
              unit="%" 
              description="The dew point is 21° right now." 
            />
            {/* Add Wind, Visibility, etc. here */}
          </div>
          <div className='bg-blue-950'>
            <AQICard value={200} />
          </div>
    </div>
  )
}

export default Dashboard