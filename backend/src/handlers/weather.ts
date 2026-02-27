import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { success, error } from '../utils/response';

// Weather simulation based on Indian city climate patterns
// In production, this would use OpenWeatherMap API (free tier: 1000 calls/day)
// API Key needed: OPENWEATHER_API_KEY env var

interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  condition: string;
  conditionIcon: string;
  windSpeed: number;
  forecast: ForecastDay[];
  businessImpact: BusinessImpact;
}

interface ForecastDay {
  day: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  conditionIcon: string;
  rainChance: number;
}

interface BusinessImpact {
  summary: string;
  demandChanges: { category: string; change: string; reason: string }[];
  recommendation: string;
}

// Realistic climate data per Indian city (Feb/March patterns)
const CITY_CLIMATE: Record<string, { tempRange: [number, number]; humidity: number; conditions: string[]; rainyChance: number }> = {
  Mumbai: { tempRange: [22, 34], humidity: 65, conditions: ['Sunny', 'Partly Cloudy', 'Hazy'], rainyChance: 5 },
  Delhi: { tempRange: [10, 28], humidity: 55, conditions: ['Sunny', 'Partly Cloudy', 'Foggy'], rainyChance: 15 },
  Bangalore: { tempRange: [18, 32], humidity: 50, conditions: ['Sunny', 'Partly Cloudy', 'Light Rain'], rainyChance: 20 },
  Lucknow: { tempRange: [12, 30], humidity: 60, conditions: ['Sunny', 'Partly Cloudy', 'Foggy', 'Light Rain'], rainyChance: 20 },
  Jaipur: { tempRange: [12, 30], humidity: 35, conditions: ['Sunny', 'Clear', 'Hazy'], rainyChance: 5 },
  Chennai: { tempRange: [24, 34], humidity: 70, conditions: ['Sunny', 'Partly Cloudy', 'Humid'], rainyChance: 10 },
  Kolkata: { tempRange: [16, 30], humidity: 65, conditions: ['Sunny', 'Partly Cloudy', 'Overcast'], rainyChance: 15 },
  Ahmedabad: { tempRange: [15, 33], humidity: 40, conditions: ['Sunny', 'Clear', 'Hot'], rainyChance: 5 },
  Pune: { tempRange: [14, 32], humidity: 45, conditions: ['Sunny', 'Pleasant', 'Partly Cloudy'], rainyChance: 10 },
  Indore: { tempRange: [12, 30], humidity: 40, conditions: ['Sunny', 'Clear', 'Pleasant'], rainyChance: 10 },
};

const CONDITION_ICONS: Record<string, string> = {
  'Sunny': 'sun',
  'Clear': 'sun',
  'Partly Cloudy': 'cloud-sun',
  'Cloudy': 'cloud',
  'Overcast': 'cloud',
  'Foggy': 'cloud-fog',
  'Hazy': 'cloud-sun',
  'Light Rain': 'cloud-rain',
  'Rain': 'cloud-rain',
  'Heavy Rain': 'cloud-lightning',
  'Hot': 'thermometer-sun',
  'Humid': 'droplets',
  'Pleasant': 'sun',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getSeededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateWeather(city: string): WeatherData {
  const climate = CITY_CLIMATE[city] || CITY_CLIMATE['Lucknow'];
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const random = getSeededRandom(seed + city.length);

  const tempRange = climate.tempRange[1] - climate.tempRange[0];
  const currentTemp = Math.round(climate.tempRange[0] + random() * tempRange);
  const condition = climate.conditions[Math.floor(random() * climate.conditions.length)];
  const isRainy = condition.includes('Rain');

  // Generate 5-day forecast
  const forecast: ForecastDay[] = [];
  for (let i = 1; i <= 5; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + i);
    const dayRandom = getSeededRandom(seed + i * 7 + city.length);

    const dayCondition = climate.conditions[Math.floor(dayRandom() * climate.conditions.length)];
    const rainChance = dayCondition.includes('Rain') ? 60 + Math.round(dayRandom() * 30) : Math.round(climate.rainyChance * dayRandom());

    forecast.push({
      day: DAYS[futureDate.getDay()],
      tempHigh: Math.round(climate.tempRange[0] + dayRandom() * tempRange * 0.8 + tempRange * 0.2),
      tempLow: Math.round(climate.tempRange[0] + dayRandom() * tempRange * 0.3),
      condition: dayCondition,
      conditionIcon: CONDITION_ICONS[dayCondition] || 'cloud',
      rainChance,
    });
  }

  const hasUpcomingRain = forecast.some(f => f.rainChance > 50);

  // Generate business impact based on weather
  const demandChanges: { category: string; change: string; reason: string }[] = [];

  if (isRainy || hasUpcomingRain) {
    demandChanges.push(
      { category: 'Umbrellas & Raincoats', change: '+60%', reason: 'Rain predicted this week' },
      { category: 'Hot Beverages', change: '+35%', reason: 'Cold/rainy weather increases chai demand' },
      { category: 'Fresh Produce', change: '-20%', reason: 'Rain disrupts supply chains' },
    );
  } else if (currentTemp > 32) {
    demandChanges.push(
      { category: 'Cold Drinks & Ice Cream', change: '+45%', reason: 'High temperatures drive cooling product demand' },
      { category: 'Sunscreen & Skincare', change: '+30%', reason: 'Summer heat increases skincare demand' },
      { category: 'Water Bottles', change: '+25%', reason: 'Hydration products in high demand' },
    );
  } else {
    demandChanges.push(
      { category: 'Outdoor Products', change: '+15%', reason: 'Pleasant weather encourages outdoor activities' },
      { category: 'Snacks & Beverages', change: '+10%', reason: 'Normal seasonal demand' },
    );
  }

  const businessImpact: BusinessImpact = {
    summary: isRainy
      ? `Rain expected in ${city}. Stock up on monsoon essentials. Delivery times may increase.`
      : currentTemp > 32
        ? `Hot weather in ${city}. Summer products in high demand. Ensure cold storage for perishables.`
        : `Pleasant weather in ${city}. Normal business conditions. Good time for outdoor promotions.`,
    demandChanges,
    recommendation: isRainy
      ? `Order umbrellas and raincoats from nearby wholesalers. Price can be marked up 20-30% during rain. Also stock extra chai and snacks — footfall increases during rain for convenience stores.`
      : currentTemp > 32
        ? `Stock cold beverages, lassi, and ice cream. Consider adding matka (clay pot) water at your store entrance — attracts walk-in customers and builds goodwill.`
        : `Great weather for business. Focus on optimizing your regular inventory. Consider putting out a small display outside your store to attract walk-in traffic.`,
  };

  return {
    city,
    temperature: currentTemp,
    feelsLike: currentTemp + (climate.humidity > 60 ? 3 : -1),
    humidity: climate.humidity + Math.round((random() - 0.5) * 20),
    condition,
    conditionIcon: CONDITION_ICONS[condition] || 'cloud',
    windSpeed: Math.round(5 + random() * 20),
    forecast,
    businessImpact,
  };
}

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const params = event.queryStringParameters || {};
    const city = params.city || 'Lucknow';

    if (!CITY_CLIMATE[city]) {
      return error(400, `Unsupported city: ${city}`, 'INVALID_REQUEST');
    }

    // Try real OpenWeatherMap API first, fall back to simulation
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (apiKey) {
      try {
        const owmRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`
        );
        if (owmRes.ok) {
          const owm = await owmRes.json() as any;
          const condition = owm.weather?.[0]?.main || 'Clear';
          const currentTemp = Math.round(owm.main?.temp || 25);
          const iconMap: Record<string, string> = {
            Clear: 'sun', Clouds: 'cloud-sun', Rain: 'cloud-rain',
            Drizzle: 'cloud-rain', Thunderstorm: 'cloud-lightning',
            Mist: 'cloud-fog', Haze: 'cloud-sun', Fog: 'cloud-fog',
          };

          // Use simulated forecast for 5-day (OWM free tier doesn't include it)
          const simulated = generateWeather(city);

          const realWeather: WeatherData = {
            city,
            temperature: currentTemp,
            feelsLike: Math.round(owm.main?.feels_like || currentTemp),
            humidity: owm.main?.humidity || 50,
            condition,
            conditionIcon: iconMap[condition] || 'cloud',
            windSpeed: Math.round(owm.wind?.speed || 5),
            forecast: simulated.forecast,
            businessImpact: simulated.businessImpact,
          };

          return success(realWeather);
        }
      } catch (owmErr) {
        console.warn('OpenWeatherMap failed, using simulation:', owmErr);
      }
    }

    // Fallback to deterministic simulation
    const weather = generateWeather(city);

    return success(weather);
  } catch (err: any) {
    console.error('Weather handler error:', err);
    return error(500, err.message || 'Internal server error');
  }
}
