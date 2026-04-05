import {useState, useEffect} from "react"

export const useGeolocation = () => {
    const [location, setLocation] = useState({
        lat: 28.6139,
        lon: 77.2090,
        city: "Delhi"
    })

    const [error,setError] = useState(null);


    useEffect(()=>{
        if(!navigator.geolocation){
            setError("Geolocation not supported");
            return;
        }

        const handleSuccess = async (position)=>{
            const {latitude, longitude}= position.coords;

            try {
                const response = await fetch(
                    // `https://geocoding-api.open-meteo.com/v1/get?latitude=${latitude}&longitude=${longitude}&localityLanguage=en` 
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                );

                const data = await response.json();

                const cityName = data.city || data.locality || data.principalSubdivision || "Unknown Place";

                setLocation({
                    lat:latitude,
                    lon:longitude,
                    city:cityName,
                });

                // console.log("📍 Location Found:", cityName);
            } catch (error) {
                console.log("Geocoding failed",error);
                setLocation({lat:latitude, lon:longitude, city:"Detected Location"});

                setError("Failed to get location");
            }
        }

        navigator.geolocation.getCurrentPosition(handleSuccess, (error)=> setError(error.message));

},[])

return { location, error}

}