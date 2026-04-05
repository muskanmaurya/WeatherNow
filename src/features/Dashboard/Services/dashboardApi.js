import { weatherApi, airQualityApi } from "../../../api/axiosInstance";

export const fetchDashboardData = async(lat,lon,date) =>{

    const formattedDate = date.toISOString().split('T')[0];

    try{
        const[weatherRes,aqiRes]=await Promise.all([
            weatherApi.get(`/forecast`,{
                params:{
                    latitude: lat,
          longitude: lon,
          start_date: formattedDate,
          end_date: formattedDate,
          hourly: 'temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m,uv_index,precipitation_probability',
          daily: 'sunrise,sunset,temperature_2m_max,temperature_2m_min',
          timezone: 'auto',
                }
            })
        ])

        console.log(weatherRes.data);

        return {
            weather:weatherRes.data,
        }
    }catch(error){
        console.log(error);
    }

}