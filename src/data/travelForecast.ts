import { SavedLocation, WeatherScenarioMode } from '../types';

export interface EssentialTravelItem {
  id: string;
  name: string;
  nameHi: string;
  iconEmoji: string;
  category: 'rain_gear' | 'sun_protection' | 'clothing' | 'electronics' | 'health' | 'footwear';
  categoryLabel: string;
  categoryLabelHi: string;
  priority: 'must_have' | 'recommended' | 'optional';
  reason: string;
  reasonHi: string;
  triggerKey: 'rain' | 'sun' | 'cold' | 'wind' | 'aqi' | 'general';
}

export interface DestinationForecastData {
  locationId: string;
  city: string;
  state: string;
  country: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  feelsLike: number;
  condition: string;
  conditionHi: string;
  rainProb: number;
  uvIndex: number;
  uvStatus: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  humidity: number;
  windSpeed: number;
  aqi: number;
  aqiStatus: 'Good' | 'Moderate' | 'Poor' | 'Unhealthy';
  threeDayForecast: {
    day: string;
    dayHi: string;
    dateLabel: string;
    maxTemp: number;
    minTemp: number;
    rainProb: number;
    condition: string;
    conditionHi: string;
    iconType: 'sun' | 'rain' | 'cloud' | 'thunder' | 'fog' | 'snow';
  }[];
  essentialItems: EssentialTravelItem[];
  travelAdvisory: string;
  travelAdvisoryHi: string;
  packingVolumeTip: string;
  packingVolumeTipHi: string;
}

// Popular curated Indian & international travel destinations for quick exploration
export const POPULAR_TRAVEL_DESTINATIONS: Omit<SavedLocation, 'id'>[] = [
  {
    name: 'Manali Retreat',
    type: 'destination',
    city: 'Manali',
    state: 'Himachal Pradesh',
    lat: 32.2396,
    lon: 77.1887
  },
  {
    name: 'Goa Coast & Palms',
    type: 'destination',
    city: 'Goa',
    state: 'Goa',
    lat: 15.2993,
    lon: 74.1240
  },
  {
    name: 'Jaipur Royal City',
    type: 'destination',
    city: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lon: 75.7873
  },
  {
    name: 'Munnar Tea Hills',
    type: 'destination',
    city: 'Munnar',
    state: 'Kerala',
    lat: 10.0889,
    lon: 77.0595
  },
  {
    name: 'Leh-Ladakh Heights',
    type: 'destination',
    city: 'Leh',
    state: 'Ladakh',
    lat: 34.1526,
    lon: 77.5771
  },
  {
    name: 'Shimla Pines',
    type: 'destination',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    lat: 31.1048,
    lon: 77.1734
  },
  {
    name: 'Rishikesh Valley',
    type: 'destination',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    lat: 30.0869,
    lon: 78.2676
  },
  {
    name: 'Udaipur Lake Palace',
    type: 'destination',
    city: 'Udaipur',
    state: 'Rajasthan',
    lat: 24.5854,
    lon: 73.7125
  }
];

export function getDestinationForecast(
  location: SavedLocation,
  scenario: WeatherScenarioMode
): DestinationForecastData {
  const city = (location.city || '').toLowerCase();
  const state = (location.state || '').toLowerCase();
  const isMountain = city.includes('manali') || city.includes('shimla') || city.includes('leh') || 
                    city.includes('dharamshala') || city.includes('munnar') || city.includes('ooty') ||
                    state.includes('himachal') || state.includes('ladakh') || state.includes('uttarakhand');
  const isBeach = city.includes('goa') || city.includes('mumbai') || city.includes('puri') || 
                  city.includes('kochi') || city.includes('pondicherry') || city.includes('andaman');
  const isDesert = city.includes('jaipur') || city.includes('jodhpur') || city.includes('jaisalmer') || 
                   city.includes('bikaner') || city.includes('udaipur') || state.includes('rajasthan');

  let baseTemp = 26;
  let tempMin = 18;
  let tempMax = 30;
  let rainProb = 15;
  let uvIndex = 6.2;
  let humidity = 55;
  let windSpeed = 12;
  let aqi = 68;
  let condition = 'Partly Cloudy';
  let conditionHi = 'आंशिक रूप से बादल';

  // Adjust base climate according to destination region
  if (isMountain) {
    baseTemp = 16;
    tempMin = 10;
    tempMax = 20;
    humidity = 68;
    uvIndex = 7.8; // higher UV at high altitudes
    windSpeed = 14;
    aqi = 28;
    condition = 'Crisp Mountain Breeze';
    conditionHi = 'शीतल पहाड़ी हवा';
  } else if (isBeach) {
    baseTemp = 30;
    tempMin = 25;
    tempMax = 33;
    humidity = 82;
    uvIndex = 9.4;
    windSpeed = 19;
    aqi = 45;
    condition = 'Tropical Sunshine & Coastal Humid';
    conditionHi = 'उष्णकटिबंधीय धूप व आर्द्र समुद्री हवा';
  } else if (isDesert) {
    baseTemp = 35;
    tempMin = 23;
    tempMax = 39;
    humidity = 28;
    uvIndex = 9.8;
    windSpeed = 16;
    aqi = 110;
    condition = 'Hot & Sunny Dry Skies';
    conditionHi = 'तीखी धूप व शुष्क मौसम';
  }

  // Modulate according to the active weather scenario
  if (scenario === 'heavy_rain') {
    rainProb = isMountain ? 85 : isBeach ? 90 : 65;
    condition = isMountain ? 'Heavy Mountain Downpour & Chilly' : 'Monsoon Squalls & Heavy Showers';
    conditionHi = isMountain ? 'पहाड़ों में मूसलाधार बारिश व ठंड' : 'मानसून की तेज फुहारें व बारिश';
    humidity = Math.min(95, humidity + 25);
    uvIndex = 2.4;
    baseTemp = Math.max(12, baseTemp - 5);
    tempMin = Math.max(8, tempMin - 4);
    windSpeed += 10;
  } else if (scenario === 'heatwave') {
    baseTemp += 6;
    tempMax += 6;
    tempMin += 4;
    rainProb = 5;
    uvIndex = Math.min(11.5, uvIndex + 2.5);
    humidity = Math.max(18, humidity - 15);
    condition = 'Intense Heatwave & Scorching Sun';
    conditionHi = 'तीव्र लू व भीषण धूप';
  } else if (scenario === 'severe') {
    rainProb = 80;
    windSpeed += 22;
    condition = 'Gale Storm & Heavy Rain Advisory';
    conditionHi = 'तेज आंधी-तूफान व भारी वर्षा';
    uvIndex = 1.8;
  }

  // Calculate feels-like temperature
  const feelsLike = Math.round(baseTemp + (humidity > 70 ? (humidity - 70) * 0.1 : -(windSpeed > 15 ? 2 : 0)));

  // Calculate UV Status
  let uvStatus: DestinationForecastData['uvStatus'] = 'Moderate';
  if (uvIndex < 3) uvStatus = 'Low';
  else if (uvIndex < 6) uvStatus = 'Moderate';
  else if (uvIndex < 8) uvStatus = 'High';
  else if (uvIndex < 11) uvStatus = 'Very High';
  else uvStatus = 'Extreme';

  // Calculate AQI Status
  let aqiStatus: DestinationForecastData['aqiStatus'] = 'Good';
  if (aqi > 150) aqiStatus = 'Unhealthy';
  else if (aqi > 100) aqiStatus = 'Poor';
  else if (aqi > 50) aqiStatus = 'Moderate';

  // Generate 3-Day Forecast for trip planning
  const threeDayForecast: DestinationForecastData['threeDayForecast'] = [
    {
      day: 'Today (Arrival)',
      dayHi: 'आज (पहुंच)',
      dateLabel: 'Day 1',
      maxTemp: tempMax,
      minTemp: tempMin,
      rainProb: rainProb,
      condition: condition,
      conditionHi: conditionHi,
      iconType: rainProb > 60 ? 'rain' : rainProb > 30 ? 'cloud' : uvIndex > 7 ? 'sun' : 'cloud'
    },
    {
      day: 'Tomorrow (Sightseeing)',
      dayHi: 'कल (भ्रमण)',
      dateLabel: 'Day 2',
      maxTemp: scenario === 'heavy_rain' ? tempMax - 1 : tempMax + 1,
      minTemp: tempMin,
      rainProb: scenario === 'heavy_rain' ? Math.max(40, rainProb - 15) : Math.min(30, rainProb + 5),
      condition: scenario === 'heavy_rain' ? 'Scattered Morning Showers' : 'Pleasant & Bright',
      conditionHi: scenario === 'heavy_rain' ? 'सुबह हल्की फुहारें' : 'सुहाना व उजला दिन',
      iconType: scenario === 'heavy_rain' ? 'rain' : 'sun'
    },
    {
      day: 'Day 3 (Excursions)',
      dayHi: 'तीसरा दिन (आउटडोर)',
      dateLabel: 'Day 3',
      maxTemp: tempMax,
      minTemp: tempMin - 1,
      rainProb: scenario === 'heavy_rain' ? 30 : 10,
      condition: 'Clear Horizons & Gentle Breeze',
      conditionHi: 'साफ़ मौसम व हल्की बयार',
      iconType: 'sun'
    }
  ];

  // Dynamic Essential Items Engine based on destination weather
  const essentialItems: EssentialTravelItem[] = [];

  // 1. RAIN CONDITIONS: "Take a raincoat" or "Bring compact umbrella"
  if (rainProb >= 35 || condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('shower') || scenario === 'heavy_rain' || scenario === 'severe') {
    essentialItems.push({
      id: 'raincoat',
      name: 'Take a Raincoat / Waterproof Poncho',
      nameHi: 'वाटरप्रूफ रेनकोट या पोंचो साथ रखें',
      iconEmoji: '🧥',
      category: 'rain_gear',
      categoryLabel: 'Rain Gear',
      categoryLabelHi: 'बारिश से सुरक्षा',
      priority: 'must_have',
      reason: `${rainProb}% rain probability forecast in ${location.city}. Essential for hands-free sightseeing during downpours.`,
      reasonHi: `${location.city} में ${rainProb}% बारिश का पूर्वानुमान। भीगने से बचने के लिए वाटरप्रूफ रेनकोट अनिवार्य है।`,
      triggerKey: 'rain'
    });

    essentialItems.push({
      id: 'umbrella',
      name: 'Windproof Compact Umbrella',
      nameHi: 'हवा-रोधी छोटा छाता',
      iconEmoji: '☂️',
      category: 'rain_gear',
      categoryLabel: 'Rain Gear',
      categoryLabelHi: 'बारिश से सुरक्षा',
      priority: rainProb > 60 ? 'must_have' : 'recommended',
      reason: `Quick-deploy protection when hopping between transport, markets, and scenic spots in ${location.city}.`,
      reasonHi: `बाजारों व दर्शनीय स्थलों पर अचानक हल्की बारिश से तुरंत बचने के लिए सुविधाजनक।`,
      triggerKey: 'rain'
    });

    essentialItems.push({
      id: 'waterproof_pouch',
      name: 'Waterproof Pouch for Phone & Documents',
      nameHi: 'मोबाइल व पासपोर्ट वाटरप्रूफ पाउच',
      iconEmoji: '📱',
      category: 'electronics',
      categoryLabel: 'Gadget Care',
      categoryLabelHi: 'इलेक्ट्रॉनिक्स सुरक्षा',
      priority: 'must_have',
      reason: `Saturated air (${humidity}% humidity) and rain squalls threaten smartphones, IDs, and boarding passes.`,
      reasonHi: `अत्यधिक नमी (${humidity}%) और बारिश के छींटों से फोन और जरूरी कागजात सुरक्षित रखें।`,
      triggerKey: 'rain'
    });

    essentialItems.push({
      id: 'quickdry_shoes',
      name: 'Waterproof / Anti-Skid Footwear',
      nameHi: 'फिसलन-रोधी वाटरप्रूफ जूते',
      iconEmoji: '🥾',
      category: 'footwear',
      categoryLabel: 'Footwear',
      categoryLabelHi: 'जूते-चप्पल',
      priority: 'recommended',
      reason: `Wet stone stairs, muddy trails, and slippery cobblestones in ${location.city} demand rubber grip.`,
      reasonHi: `गीली सड़कों, पत्थरों व कीचड़ वाले रास्तों पर मजबूत पकड़ के लिए ग्रिप वाले जूते पहनें।`,
      triggerKey: 'rain'
    });
  }

  // 2. SUN / UV CONDITIONS: "Bring sunscreen" or "UV sunglasses"
  if (uvIndex >= 5.5 || scenario === 'heatwave' || isDesert || isBeach || baseTemp > 30) {
    essentialItems.push({
      id: 'sunscreen',
      name: 'Bring Sunscreen (SPF 50+ Broad Spectrum)',
      nameHi: 'सनस्क्रीन (SPF 50+ ब्रॉड स्पेक्ट्रम) ले जाएं',
      iconEmoji: '🧴',
      category: 'sun_protection',
      categoryLabel: 'Sun Protection',
      categoryLabelHi: 'धूप से सुरक्षा',
      priority: 'must_have',
      reason: `UV Index is ${uvIndex.toFixed(1)} (${uvStatus}). Unprotected skin incurs solar UV erythema in just 20 minutes of exposure.`,
      reasonHi: `पराबैंगनी किरण सूचकांक (UV Index) ${uvIndex.toFixed(1)} (${uvStatus}) है। तेज धूप में टैनिंग और सनबर्न से बचाव हेतु सनस्क्रीन लगाएं।`,
      triggerKey: 'sun'
    });

    essentialItems.push({
      id: 'sunglasses',
      name: 'UV400 Polarized Sunglasses',
      nameHi: 'UV400 पोलराइज्ड धूप का चश्मा',
      iconEmoji: '🕶️',
      category: 'sun_protection',
      categoryLabel: 'Sun Protection',
      categoryLabelHi: 'धूप से सुरक्षा',
      priority: 'must_have',
      reason: `Prevents retinal solar glare and headache fatigue from direct sunlight and reflective water/surfaces.`,
      reasonHi: `तेज चमक व परावर्तन से आंखों में जलन और सिरदर्द से बचने के लिए यूवी चश्मा पहनें।`,
      triggerKey: 'sun'
    });

    essentialItems.push({
      id: 'sun_hat',
      name: 'Wide-Brim Sun Hat / Breathable Cap',
      nameHi: 'चौड़े किनारे वाली टोपी / हैट',
      iconEmoji: '🧢',
      category: 'clothing',
      categoryLabel: 'Apparel',
      categoryLabelHi: 'पहनावा',
      priority: 'recommended',
      reason: `Direct solar shield for face, ears, and neck while exploring open outdoor landmarks.`,
      reasonHi: `खुली धूप में स्मारकों और दर्शनीय स्थलों पर घूमने के दौरान सिर और गर्दन को ठंडा रखें।`,
      triggerKey: 'sun'
    });

    essentialItems.push({
      id: 'water_flask',
      name: 'Insulated Water Bottle with ORS/Electrolytes',
      nameHi: 'इंसुलेटेड पानी की बोतल व इलेक्ट्रोलिट्स',
      iconEmoji: '💧',
      category: 'health',
      categoryLabel: 'Hydration',
      categoryLabelHi: 'जल व ऊर्जा',
      priority: 'must_have',
      reason: `High heat (${baseTemp}°C) induces rapid dehydration. Keep 1.5L chilled water and oral rehydration salts handy.`,
      reasonHi: `गर्मी (${baseTemp}°C) में निर्जलीकरण (डिहाइड्रेशन) से बचने के लिए ठंडा पानी और इलेक्ट्रोलिट्स साथ रखें।`,
      triggerKey: 'sun'
    });
  }

  // 3. COLD / MOUNTAIN NIGHTS: Thermal fleece or warm jacket
  if (tempMin < 18 || isMountain) {
    const isVeryCold = tempMin < 12;
    essentialItems.push({
      id: 'warm_jacket',
      name: isVeryCold ? 'Pack Heavy Thermal Fleece / Down Jacket' : 'Pack Lightweight Windbreaker / Fleece',
      nameHi: isVeryCold ? 'भारी गर्म जैकेट / फ्लीस इनर पैक करें' : 'हल्की गर्म जैकेट या विंडचीटर पैक करें',
      iconEmoji: '🧥',
      category: 'clothing',
      categoryLabel: 'Warm Layers',
      categoryLabelHi: 'गर्म वस्त्र',
      priority: isVeryCold ? 'must_have' : 'recommended',
      reason: `Night temperature in ${location.city} plunges to ${tempMin}°C. Layered warmth is essential for evening walks.`,
      reasonHi: `${location.city} में रात का तापमान गिरकर ${tempMin}°C हो जाता है। शाम को ठंड से बचने के लिए गर्म परतदार कपड़े जरूरी हैं।`,
      triggerKey: 'cold'
    });

    essentialItems.push({
      id: 'lip_balm',
      name: 'Cold Cream & Hydrating Lip Balm',
      nameHi: 'कोल्ड क्रीम व मॉइस्चराइजिंग लिप बाम',
      iconEmoji: '💄',
      category: 'health',
      categoryLabel: 'Skin Care',
      categoryLabelHi: 'त्वचा की देखभाल',
      priority: 'recommended',
      reason: `Dry, cool mountain winds trigger painful chapped lips and skin dryness.`,
      reasonHi: `पहाड़ी ठंडी हवा से होंठ फटने और त्वचा रूखी होने से रोकने के लिए लिप बाम लगाएं।`,
      triggerKey: 'cold'
    });

    if (tempMin < 12) {
      essentialItems.push({
        id: 'woolen_beanie',
        name: 'Woolen Beanie & Thermal Socks',
        nameHi: 'ऊनी टोपी और गर्म मोज़े',
        iconEmoji: '🧣',
        category: 'clothing',
        categoryLabel: 'Warm Accessories',
        categoryLabelHi: 'गर्म सहायक सामग्री',
        priority: 'recommended',
        reason: `Sub-12°C alpine nights cause rapid body heat loss through extremities.`,
        reasonHi: `ठंड में सिर और पैरों को गर्म रखने से सर्दी-जुकाम से बचाव होता है।`,
        triggerKey: 'cold'
      });
    }
  }

  // 4. HIGH HUMIDITY / TROPICAL: Insect repellent
  if (humidity > 70 || isBeach) {
    essentialItems.push({
      id: 'insect_repellent',
      name: 'Mosquito & Insect Repellent Spray',
      nameHi: 'मच्छर व कीट-रोधी स्प्रे',
      iconEmoji: '🦟',
      category: 'health',
      categoryLabel: 'Health & Wellness',
      categoryLabelHi: 'स्वास्थ्य रक्षा',
      priority: 'recommended',
      reason: `Dense coastal/valley foliage and high humidity (${humidity}%) elevate evening mosquito bites.`,
      reasonHi: `नमी व हरियाली के कारण शाम के समय मच्छरों और कीटों से बचने के लिए रिपेलेंट लगाएं।`,
      triggerKey: 'general'
    });
  }

  // 5. GENERAL TRAVEL ESSENTIALS
  essentialItems.push({
    id: 'power_bank',
    name: 'High-Capacity Power Bank (10,000+ mAh)',
    nameHi: 'फास्ट चार्जिंग पावर बैंक (10,000+ mAh)',
    iconEmoji: '🔋',
    category: 'electronics',
    categoryLabel: 'Tech Gear',
    categoryLabelHi: 'गैजेट्स',
    priority: 'must_have',
    reason: `Continuous camera photography, live GPS turn-by-turn navigation, and digital boarding tickets exhaust battery fast.`,
    reasonHi: `फोटो खींचने, जीपीएस मैप्स और टिकट दिखाने से फोन की बैटरी जल्दी खत्म होती है।`,
    triggerKey: 'general'
  });

  essentialItems.push({
    id: 'travel_meds',
    name: 'Travel First-Aid & Motion Sickness Pills',
    nameHi: 'फर्स्ट-एड किट व यात्रा उल्टी/चक्कर की दवा',
    iconEmoji: '💊',
    category: 'health',
    categoryLabel: 'Medical Kit',
    categoryLabelHi: 'प्राथमिक चिकित्सा',
    priority: isMountain ? 'must_have' : 'optional',
    reason: isMountain 
      ? `Hairpin bends and altitude change on road to ${location.city} frequently trigger motion sickness.`
      : `Handy for unexpected stomach upsets or minor sprains during holiday excursions.`,
    reasonHi: isMountain 
      ? `${location.city} के घुमावदार पहाड़ी मोड़ों पर उल्टी और चक्कर से राहत के लिए दवा साथ रखें।`
      : `सफर में अचानक पेट दर्द या सिरदर्द होने पर तुरंत राहत के लिए जरूरी।`,
    triggerKey: 'general'
  });

  // Travel Advisory & Luggage tips
  let travelAdvisory = `Safe travel conditions expected for ${location.city}. Keep an eye on afternoon weather shifts.`;
  let travelAdvisoryHi = `${location.city} के लिए यात्रा मौसम अनुकूल है। दोपहर बाद मौसम में बदलाव पर ध्यान दें।`;

  if (rainProb >= 60) {
    travelAdvisory = `Wet Weather Warning for ${location.city}: Expect intermittent roadway waterlogging and damp conditions. Plan indoor activities between 2 PM - 6 PM.`;
    travelAdvisoryHi = `${location.city} में भारी बारिश की चेतावनी: सड़कों पर जलभराव और फिसलन हो सकती है। दोपहर 2 से शाम 6 बजे इनडोर गतिविधियों की योजना बनाएं।`;
  } else if (uvIndex >= 8.5) {
    travelAdvisory = `High Solar Heat Alert for ${location.city}: Peak UV radiation window between 11:30 AM and 3:30 PM. Schedule outdoor monument visits in early morning or late afternoon.`;
    travelAdvisoryHi = `${location.city} में तीव्र धूप की चेतावनी: 11:30 से 3:30 बजे तक सीधी धूप से बचें। दर्शनीय स्थलों की सैर सुबह या शाम को करें।`;
  } else if (tempMin < 12) {
    travelAdvisory = `Cold Mountain Climate in ${location.city}: Crisp sunny days transitioning to sharp sub-12°C chills after sunset. Pack multi-layer clothing.`;
    travelAdvisoryHi = `${location.city} में पहाड़ी ठंड: दिन में सुखद धूप लेकिन शाम होते ही तापमान 12°C से नीचे गिर जाता है। गर्म कपड़े जरूर रखें।`;
  }

  let packingVolumeTip = 'Medium Suitcase / 40L Daypack: Standard comfortable gear for sightseeing.';
  let packingVolumeTipHi = 'मध्यम सूटकेस / 40L बैग: सामान्य पर्यटन के लिए पर्याप्त जगह।';

  if (rainProb > 60 || tempMin < 14) {
    packingVolumeTip = 'Bulky Packing Required: Heavy jackets, waterproof shells, and boots require extra luggage volume (~55L).';
    packingVolumeTipHi = 'अधिक सामान आवश्यक: गर्म जैकेट, वाटरप्रूफ कपड़े और जूतों के लिए बड़ा बैग (~55L) चुनें।';
  } else if (isBeach && uvIndex > 8) {
    packingVolumeTip = 'Ultra-Light Packing: Breathable cottons, swimwear, and lightweight daypack (under 7 kg).';
    packingVolumeTipHi = 'हल्का सामान: सूती कपड़े, स्विमवियर और हल्का बैगपैक (7 किलो से कम) रखें।';
  }

  return {
    locationId: location.id,
    city: location.city,
    state: location.state,
    country: 'India',
    temp: baseTemp,
    tempMin,
    tempMax,
    feelsLike,
    condition,
    conditionHi,
    rainProb,
    uvIndex,
    uvStatus,
    humidity,
    windSpeed,
    aqi,
    aqiStatus,
    threeDayForecast,
    essentialItems,
    travelAdvisory,
    travelAdvisoryHi,
    packingVolumeTip,
    packingVolumeTipHi
  };
}
