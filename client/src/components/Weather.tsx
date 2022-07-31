const weather = require('react-open-weather-widget');
// import ReactWeather from "react-open-weather-widget";

export const Weather = () => {
    // const { data, isLoading, errorMessage } = weather.useOpenWeather({
    //     key: '69766e1b1f0ca7f8e7ff02124be9a796',
    //     lat: '48.137154',
    //     lon: '11.576124',
    //     lang: 'en',
    //     unit: 'metric', // values are (metric, standard, imperial)
    // });
    // return (
    //     <weather.ReactWeather
    //         isLoading={isLoading}
    //         errorMessage={errorMessage}
    //         data={data}
    //         lang="en"
    //         locationLabel="Munich"
    //         unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
    //         showForecast
    //     />
    // );
    return <weather.ReactWeather forecast="today" apikey="69766e1b1f0ca7f8e7ff02124be9a796" type="auto" />
};
