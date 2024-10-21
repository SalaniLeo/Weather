import { env } from '$env/dynamic/private';
import { weatherLocation, weatherToken } from '$lib/weather.js';

export async function load(event) {
    let user_ip = event.getClientAddress();

    let preloadCity, preloadToken;
    let loc, city, weatherData;

    preloadCity = await new Promise((resolve) => {
        weatherLocation.subscribe((value) => resolve(value));
    });

    preloadToken = await new Promise((resolve) => {
        weatherToken.subscribe((value) => resolve(value));
    });

    if (!preloadCity) {
        if(user_ip != '::ffff:127.0.0.1') {
            const ipres = await fetch(`https://ipinfo.io/${user_ip}/json`);
            const ipData = await ipres.json();
            loc = ipData.loc;
            city = ipData.city;
        } else {
            loc = '44.4667,11.4333'
            city = 'Ferrara'
        }
    } else {
        const resolveCityRes = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${preloadCity}&limit=1&appid=${preloadToken}`);
        const resolveCityData = await resolveCityRes.json();

        if (resolveCityData.length > 0) {
            loc = `${resolveCityData[0].lat},${resolveCityData[0].lon}`;
            city = resolveCityData[0].name;
        } else {
            throw new Error('City not found');
        }
    }

    weatherData = await getWeather(loc, city, preloadToken);
    return { weatherData, city, token:preloadToken, origin:event.url.origin };
}

async function getWeather(loc: any, city: string, token: unknown) {
    const weatherRes = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${loc.split(',')[0]}&lon=${loc.split(',')[1]}&units=metric&appid=${token}`);
    const weatherData = await weatherRes.json();
    return weatherData;
}
