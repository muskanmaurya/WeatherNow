import { useState, useEffect } from 'react'; //here we are using useState and useEffect hooks from React

export const useGeolocation = () => {   //here we are creating a custom hook called useGeolocation
  const [location, setLocation] = useState({     //here we are using useState to create a state variable called location and a function to update it called setLocation. We are initializing it with default values for Delhi. we are doing this so that if the user denies access to their location, we can still show them weather data for a default location (Delhi in this case).
    lat: 28.6139,   // Default latitude for Delhi
    lon: 77.2090,   // Default longitude for Delhi
    city: "Delhi" // Default city name for Delhi
  });
  const [error, setError] = useState(null);  //here we are using useState to create a state variable called error and a function to update it called setError. We are initializing it with null. This will be used to store any error messages that occur during the geolocation process.

  useEffect(() => { //here we are using useEffect to run some code when the component mounts. The empty dependency array [] means this effect will only run once when the component mounts.
    if (!navigator.geolocation) {   //here we are checking if the browser supports geolocation. If it doesn't, we set an error message and return early.
      setError("Geolocation not supported");  // Set error message if geolocation is not supported
      return;  // Exit early since we can't get location
    }

    const handleSuccess = async (position) => {   // This function will be called if we successfully get the user's location. It receives a position object that contains the latitude and longitude. We mark it as async because we will be making an API call to reverse geocode the coordinates into a city name.
      const { latitude, longitude } = position.coords;  // Here we are extracting the latitude and longitude from the position object.

      try {
        // Reverse Geocoding Call
        // const response = await fetch(
        //   `https://geocoding-api.open-meteo.com/v1/get?latitude=${latitude}&longitude=${longitude}`  // Here we are making a fetch call to the Open-Meteo geocoding API, passing in the latitude and longitude. This API will return information about the location, including the city name.
        // );

        const res = await fetch(  // Here we are making a fetch call to the BigDataCloud reverse geocoding API, passing in the latitude and longitude. This API will return information about the location, including the city name.
    //   `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    `https://geocoding-api.open-meteo.com/v1/get?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    const dataa = await res.json();  // Here we are parsing the response from the API as JSON. The variable dataa will now contain the location information returned by the API.

    const cityName = dataa.city || dataa.locality || dataa.principalSubdivision || "Unknown Place";  // Here we are trying to extract the city name from the API response. We check several fields (city, locality, principalSubdivision) to find a suitable name for the location. If none of those fields are available, we default to "Unknown Place".


        // const data = await response.json();
        
        // Open-Meteo returns an array of results
        // const cityName = data.results?.[0]?.name || "Unknown Location";

        setLocation({
          lat: latitude,
          lon: longitude,
          city: cityName,
        });

        // console.log("📍 Location Found:", cityName);
      } catch (err) {
        console.error("Geocoding failed", err);
        setLocation({ lat: latitude, lon: longitude, city: "Detected Location" });
        console.warn("GPS Access Denied, defaulting to Delhi.");
        setError(err.message);
        // Default to Delhi so the app still works!
        setLocation({ lat: 28.6139, lon: 77.2090, city: "Delhi" });
      }
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, (err) => setError(err.message));
  }, []);

  return { location, error };
};