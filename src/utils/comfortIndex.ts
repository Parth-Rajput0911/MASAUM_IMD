/**
 * Outdoor Event Comfort Index Utility
 * Calculates an empirical outdoor comfort score (0-100) combining:
 * 1. Ambient Temperature (°C)
 * 2. Relative Humidity (%)
 * 3. Wind Speed (km/h)
 * 
 * Uses Steadman's Apparent Temperature (AT) and Thom's Discomfort Index (DI)
 * tailored for social gatherings (lawn parties, terrace dinners, weddings, barbecues).
 */

export interface ComfortFactorBreakdown {
  tempScore: number; // 0-100
  humidityScore: number; // 0-100
  windScore: number; // 0-100
  apparentTemp: number; // °C
  discomfortIndex: number;
  tempImpactDescription: { en: string; hi: string };
  humidityImpactDescription: { en: string; hi: string };
  windImpactDescription: { en: string; hi: string };
}

export type ComfortLevel = 'ideal' | 'pleasant' | 'moderate' | 'uncomfortable' | 'poor';

export interface SocialGatheringPlanningAdvice {
  verdict: { en: string; hi: string };
  catering: { en: string; hi: string };
  venueDecor: { en: string; hi: string };
  guestDress: { en: string; hi: string };
  backupIndoorRecommended: boolean;
  recommendedTimeSlot: { en: string; hi: string };
}

export interface OutdoorEventComfortResult {
  score: number; // 0-100
  level: ComfortLevel;
  title: string;
  titleHi: string;
  badgeClass: string;
  textColor: string;
  barGradient: string;
  apparentTemp: number;
  breakdown: ComfortFactorBreakdown;
  advice: SocialGatheringPlanningAdvice;
}

export function calculateOutdoorEventComfort(
  temp: number,
  humidity: number,
  windSpeed: number,
  rainProb: number = 0
): OutdoorEventComfortResult {
  // 1. Water Vapor Pressure (hPa)
  const vaporPressure = (humidity / 100) * 6.105 * Math.exp((17.27 * temp) / (237.7 + temp));

  // 2. Wind in m/s
  const windMps = Math.max(0, windSpeed) / 3.6;

  // 3. Apparent Temperature (Australian / Steadman model)
  const apparentTemp = Math.round((temp + 0.33 * vaporPressure - 0.70 * windMps - 4.0) * 10) / 10;

  // 4. Thom's Discomfort Index (DI)
  const discomfortIndex = Math.round((temp - 0.55 * (1 - 0.01 * humidity) * (temp - 14.5)) * 10) / 10;

  // 5. Component Sub-scores (0-100)
  // Temperature sub-score: Sweet spot is 21°C - 25°C
  let tempScore = 100;
  let tempDescEn = 'Ideal temperature sweet spot (21°C–25°C)';
  let tempDescHi = 'आदर्श तापमान (21°C–25°C)';

  if (temp > 25) {
    const penalty = (temp - 25) * 4.2;
    tempScore = Math.max(0, Math.round(100 - penalty));
    if (temp >= 35) {
      tempDescEn = `Severe thermal heat (${temp}°C) creates quick guest fatigue`;
      tempDescHi = `भीषण गर्मी (${temp}°C) से मेहमान जल्दी असहज होंगे`;
    } else if (temp >= 30) {
      tempDescEn = `Warm weather (${temp}°C) requires shade & chilled beverages`;
      tempDescHi = `गर्म मौसम (${temp}°C) के लिए छांव व ठंडे पेय आवश्यक हैं`;
    } else {
      tempDescEn = `Mildly warm (${temp}°C) but comfortable with gentle breeze`;
      tempDescHi = `हल्का गर्म (${temp}°C) किंतु हवा के साथ आरामदायक`;
    }
  } else if (temp < 21) {
    const penalty = (21 - temp) * 4.4;
    tempScore = Math.max(0, Math.round(100 - penalty));
    if (temp <= 12) {
      tempDescEn = `Chilly evening (${temp}°C) demands patio heaters or fire-pits`;
      tempDescHi = `ठंडी शाम (${temp}°C) के लिए हीटर या अंगीठी की जरूरत होगी`;
    } else {
      tempDescEn = `Crisp cool temperature (${temp}°C), perfect for hot appetizers`;
      tempDescHi = `हल्की ठंड (${temp}°C), गर्म खानपान के लिए सुखद`;
    }
  }

  // Humidity sub-score: Sweet spot 40% - 55%
  let humidityScore = 100;
  let humDescEn = 'Comfortable moisture level (40%–55%)';
  let humDescHi = 'अनुकूल नमी (40%–55%)';

  if (humidity > 55) {
    const penalty = (humidity - 55) * 1.55;
    humidityScore = Math.max(0, Math.round(100 - penalty));
    if (humidity >= 75) {
      humDescEn = `High humidity (${humidity}%) induces heavy sweat & hair frizz`;
      humDescHi = `अधिक उमस (${humidity}%) से चिपचिपाहट व पसीना बढ़ेगा`;
    } else {
      humDescEn = `Moderate humidity (${humidity}%), evaporative cooling is reduced`;
      humDescHi = `मध्यम नमी (${humidity}%), हल्की उमस महसूस होगी`;
    }
  } else if (humidity < 40) {
    const penalty = (40 - humidity) * 1.1;
    humidityScore = Math.max(0, Math.round(100 - penalty));
    humDescEn = `Dry air (${humidity}%), keep hydration stations handy`;
    humDescHi = `शुष्क हवा (${humidity}%), पानी व जूस काउंटर उपलब्ध रखें`;
  }

  // Wind sub-score: Sweet spot 6 - 14 km/h (gentle cooling breeze)
  let windScore = 100;
  let windDescEn = 'Pleasant gentle breeze (6–14 km/h), decorations secure';
  let windDescHi = 'सुखद मंद बयार (6–14 km/h), सजावट सुरक्षित रहेगी';

  if (windSpeed > 14) {
    const penalty = (windSpeed - 14) * 3.3;
    windScore = Math.max(0, Math.round(100 - penalty));
    if (windSpeed >= 28) {
      windDescEn = `Strong wind gusts (${windSpeed} km/h) threaten canopies & buffet flames`;
      windDescHi = `तेज हवा (${windSpeed} km/h) टेंट व बुफे बर्नर बुझा सकती है`;
    } else {
      windDescEn = `Breezy (${windSpeed} km/h), clip tablecloths & anchor lightweight decor`;
      windDescHi = `हवादार (${windSpeed} km/h), मेजपोश और सजावट को क्लिप से बांधें`;
    }
  } else if (windSpeed < 6) {
    if (temp > 28) {
      windScore = 65;
      windDescEn = 'Calm still air promotes heat stagnation; place pedestal fans';
      windDescHi = 'हवा बिल्कुल बंद है, उमस रोकने के लिए पंखे लगाएं';
    } else {
      windScore = 92;
      windDescEn = 'Still air, candles and outdoor table flames will stay lit';
      windDescHi = 'शांत हवा, मोमबत्तियां व टेबल लैंप आसानी से जलेंगे';
    }
  }

  // 6. Overall Weighted Score (45% Temp, 30% Humidity, 25% Wind)
  let rawScore = Math.round(tempScore * 0.45 + humidityScore * 0.30 + windScore * 0.25);

  // Rain probability dampening factor (wet lawn ruins social events)
  if (rainProb > 50) {
    rawScore = Math.min(rawScore, Math.round(rawScore * (1 - (rainProb - 50) / 80)));
  }

  const score = Math.max(5, Math.min(100, rawScore));

  // 7. Categorization & Planning Advice
  let level: ComfortLevel = 'ideal';
  let title = 'Ideal Outdoor Gathering Weather';
  let titleHi = 'समारोह हेतु आदर्श मौसम';
  let badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  let textColor = 'text-emerald-400';
  let barGradient = 'from-emerald-500 to-teal-400';

  if (score < 35) {
    level = 'poor';
    title = 'Inadvisable for Outdoors (Shift Inside)';
    titleHi = 'प्रतिकूल मौसम (बैंक्वेट या इनडोर चुनें)';
    badgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    textColor = 'text-rose-400';
    barGradient = 'from-rose-500 to-amber-500';
  } else if (score < 50) {
    level = 'uncomfortable';
    title = 'Uncomfortable (Weather Precautions Needed)';
    titleHi = 'असुविधाजनक (विशेष प्रबंध आवश्यक)';
    badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    textColor = 'text-amber-400';
    barGradient = 'from-amber-500 to-orange-400';
  } else if (score < 70) {
    level = 'moderate';
    title = 'Moderate / Manageable Outdoors';
    titleHi = 'मध्यम व प्रबंधनीय';
    badgeClass = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    textColor = 'text-sky-400';
    barGradient = 'from-sky-500 to-blue-400';
  } else if (score < 85) {
    level = 'pleasant';
    title = 'Pleasant & Comfortable';
    titleHi = 'सुखद व अनुकूल';
    badgeClass = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    textColor = 'text-teal-400';
    barGradient = 'from-teal-400 to-emerald-400';
  }

  // Social gathering tips synthesis
  const advice: SocialGatheringPlanningAdvice = {
    verdict: {
      en: level === 'ideal' || level === 'pleasant'
        ? 'Great conditions for open-air lawn events, terrace dinners, and photo sessions.'
        : level === 'moderate'
        ? 'Outdoor event viable with weather adaptations (shaded canopy, fans, or warm covers).'
        : 'High risk of guest discomfort. Secure an indoor banquet hall or weatherproof marquee.',
      hi: level === 'ideal' || level === 'pleasant'
        ? 'खुले लॉन, छत पर दावत व फोटोग्राफी के लिए शानदार मौसम।'
        : level === 'moderate'
        ? 'पंखों, छांव या शामियाने के प्रबंध के साथ कार्यक्रम सफल रहेगा।'
        : 'मेहमानों की असुविधा का खतरा। इनडोर हॉल या वाटरप्रूफ हैंगर टेंट तय करें।'
    },
    catering: {
      en: temp >= 32
        ? 'High heat: Provide mocktail hydration bars, iced mocktails, and store dairy/desserts in refrigerated coolers. Avoid chocolate displays in sunlight.'
        : windSpeed >= 20
        ? 'Windy conditions: Shield buffet chafing burners with wind guards; avoid paper plates and light napkins.'
        : temp <= 16
        ? 'Cool weather: Serve hot soups, tandoori starters, and live tea/coffee stations.'
        : 'All standard outdoor buffet and beverage arrangements are suitable.',
      hi: temp >= 32
        ? 'गर्मी: ठंडे पेय, नींबू पानी व छाछ काउंटर लगाएं। मिठाई व आइसक्रीम को कूलर में सुरक्षित रखें।'
        : windSpeed >= 20
        ? 'हवा: बुफे बर्नर के आगे विंडशील्ड लगाएं; भारी क्रॉकरी का इस्तेमाल करें।'
        : temp <= 16
        ? 'हल्की ठंड: गरमा-गरम चाय, कॉफी, सूप व तंदूरी स्नैक्स परोसें।'
        : 'सामान्य बुफे व खानपान व्यवस्था पूर्णतः अनुकूल है।'
    },
    venueDecor: {
      en: windSpeed >= 20
        ? `Anchor marquee tents with minimum 50 kg weights per upright leg. Clip table linens and weigh down floral centerpieces.`
        : humidity >= 70
        ? `High humidity: Provide electric misting fans and keep mosquito/insect repellent torches around perimeter.`
        : temp <= 15
        ? `Install patio radiant heaters or decorative charcoal fire-pits in open lounge areas.`
        : `Open lawns, fairy lights, floral arches, and freestanding photo booths are perfectly safe.`,
      hi: windSpeed >= 20
        ? `टेंट के खंभों को 50 किलो वजन से कसें। टेबल कवर पर क्लिप लगाएं।`
        : humidity >= 70
        ? `उमस: मेहमानों के लिए मिस्टिंग पंखे लगाएं और मच्छर रोधी व्यवस्था रखें।`
        : temp <= 15
        ? `लॉन में गैस/इलेक्ट्रिक हीटर या अंगीठी की व्यवस्था करें।`
        : `खुला लॉन, फेयरी लाइट्स व फोटो बूथ आसानी से लगाए जा सकते हैं।`
    },
    guestDress: {
      en: temp >= 30
        ? 'Advise guests: Breathable linen, lightweight pastel fabrics, sunglasses, and sun hats.'
        : temp <= 16
        ? 'Advise guests: Elegant formal layers, blazers, stoles, or evening cardigans.'
        : 'Smart casuals, cocktail dresses, or traditional wedding wear are comfortable.',
      hi: temp >= 30
        ? 'पहनावा: सूती, हल्के रंग के कपड़े व धूप का चश्मा उपयुक्त रहेगा।'
        : temp <= 16
        ? 'पहनावा: जैकेट, शॉल, ब्लेज़र या हल्की गर्म पोशाक पहनें।'
        : 'पारंपरिक परिधान, सूट या पार्टी वियर के लिए आरामदायक मौसम।'
    },
    backupIndoorRecommended: score < 50 || rainProb > 45,
    recommendedTimeSlot: {
      en: temp >= 32 
        ? 'Best Gathering Window: 06:30 PM – 10:30 PM (Post-sunset cool down)' 
        : temp <= 16 
        ? 'Best Gathering Window: 12:00 PM – 04:30 PM (Sunny afternoon)' 
        : 'Best Gathering Window: 04:30 PM – 09:30 PM (Golden hour & evening breeze)',
      hi: temp >= 32 
        ? 'श्रेष्ठ समय: शाम 06:30 से रात 10:30 (सूर्यास्त के बाद)' 
        : temp <= 16 
        ? 'श्रेष्ठ समय: दोपहर 12:00 से शाम 04:30 (धूप खिली रहने पर)' 
        : 'श्रेष्ठ समय: शाम 04:30 से रात 09:30 (गोल्डन ऑवर व सुखद हवा)'
    }
  };

  return {
    score,
    level,
    title,
    titleHi,
    badgeClass,
    textColor,
    barGradient,
    apparentTemp,
    breakdown: {
      tempScore,
      humidityScore,
      windScore,
      apparentTemp,
      discomfortIndex,
      tempImpactDescription: { en: tempDescEn, hi: tempDescHi },
      humidityImpactDescription: { en: humDescEn, hi: humDescHi },
      windImpactDescription: { en: windDescEn, hi: windDescHi }
    },
    advice
  };
}
