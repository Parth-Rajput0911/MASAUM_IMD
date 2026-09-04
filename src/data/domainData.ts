import {
  WeatherScenarioMode,
  HealthWeatherMetrics,
  FitnessWeatherMetrics,
  MarineSurfingMetrics,
  TravelWeatherMetrics,
  FamilyWeatherMetrics,
  AgriGardeningMetrics,
  CommuterHighwayMetrics,
  EventPlannerMetrics
} from '../types';

export function getHealthMetrics(scenario: WeatherScenarioMode): HealthWeatherMetrics {
  switch (scenario) {
    case 'heatwave':
      return {
        aqi: 215,
        aqiStatus: 'Poor',
        pm25: 145,
        pm10: 220,
        pollenGrass: 'High',
        pollenTree: 'Moderate',
        pollenWeed: 'Moderate',
        uvIndex: 11,
        uvStatus: 'Extreme',
        humidity: 24,
        asthmaRisk: 'High',
        skinSensitivityIndex: 'Extreme Sunburn Risk',
        guidance: 'High ground-level ozone and dry particulate matter. Severe UV-C index requires SPF 50+ and immediate shaded shelter between 11 AM - 4 PM.',
        guidanceHi: 'ओजोन व धूलकणों की उच्च मात्रा। यूवी इंडेक्स 11+ होने से सनबर्न का भारी जोखिम, धूप में निकलने से बचें और सनस्क्रीन लगाएं।'
      };
    case 'heavy_rain':
      return {
        aqi: 32,
        aqiStatus: 'Good',
        pm25: 18,
        pm10: 28,
        pollenGrass: 'Low',
        pollenTree: 'Low',
        pollenWeed: 'Low',
        uvIndex: 2,
        uvStatus: 'Low',
        humidity: 94,
        asthmaRisk: 'Moderate',
        skinSensitivityIndex: 'Safe',
        guidance: 'Air quality is pristine due to rain scrubbing. However, high relative humidity (94%) and dampness may trigger mold allergies or asthma bronchospasm indoors.',
        guidanceHi: 'बारिश से वायु गुणवत्ता उत्तम (AQI 32) है, परंतु 94% नमी से सीलन व मोल्ड एलर्जी या अस्थमा के मरीजों को सांस लेने में कठिनाई हो सकती है।'
      };
    case 'severe':
      return {
        aqi: 45,
        aqiStatus: 'Good',
        pm25: 22,
        pm10: 40,
        pollenGrass: 'Very High',
        pollenTree: 'High',
        pollenWeed: 'Moderate',
        uvIndex: 1,
        uvStatus: 'Low',
        humidity: 98,
        asthmaRisk: 'High',
        skinSensitivityIndex: 'Safe',
        guidance: 'Thunderstorm Asthma Alert: Violent downdrafts break pollen grains into respirable micro-particles. Asthma patients must stay indoors with closed windows.',
        guidanceHi: 'आंधी-तूफान अस्थमा चेतावनी: तूफानी हवाएं परागकणों को महीन कणों में तोड़ देती हैं। दमा रोगी खिड़कियां बंद रखकर घर के अंदर रहें।'
      };
    default:
      return {
        aqi: 78,
        aqiStatus: 'Satisfactory',
        pm25: 42,
        pm10: 68,
        pollenGrass: 'Moderate',
        pollenTree: 'Low',
        pollenWeed: 'Low',
        uvIndex: 5,
        uvStatus: 'Moderate',
        humidity: 58,
        asthmaRisk: 'Low',
        skinSensitivityIndex: 'Safe',
        guidance: 'Clean atmospheric envelope. Mild pollen presence. Safe for jogging and normal outdoor ventilation.',
        guidanceHi: 'वायु गुणवत्ता संतोषजनक। परागकण सामान्य स्तर पर हैं। सामान्य आउटडोर गतिविधियों के लिए मौसम अनुकूल है।'
      };
  }
}

export function getFitnessMetrics(scenario: WeatherScenarioMode): FitnessWeatherMetrics {
  switch (scenario) {
    case 'heatwave':
      return {
        sunrise: '05:24 AM',
        sunset: '07:18 PM',
        bestRunningHours: [
          { time: '05:00 AM - 06:15 AM', score: 85, note: 'Coolest dawn window (28°C)', status: 'optimal' },
          { time: '06:30 AM - 08:00 AM', score: 62, note: 'Rapid temperature climb', status: 'moderate' },
          { time: '09:00 AM - 06:30 PM', score: 10, note: 'Danger: Heat stroke risk (43°C)', status: 'avoid' },
          { time: '07:30 PM - 09:00 PM', score: 55, note: 'Residual heat, high hydration needed', status: 'moderate' }
        ],
        windSpeed: 22,
        windGusts: 34,
        heatStressAlert: 'Extreme Danger',
        hydrationRequirement: '750ml electrolyte per 30 mins',
        workoutWindowText: 'Avoid midday workouts completely. Restrict all outdoor running to dawn before 6:30 AM.',
        workoutWindowTextHi: 'दोपहर में वर्कआउट बिल्कुल न करें। सुबह 6:30 बजे से पहले ही रनिंग पूरी करें।'
      };
    case 'heavy_rain':
      return {
        sunrise: '05:42 AM',
        sunset: '07:08 PM',
        bestRunningHours: [
          { time: '06:00 AM - 07:30 AM', score: 40, note: 'Steady drizzle, wet asphalt', status: 'moderate' },
          { time: '08:00 AM - 01:00 PM', score: 20, note: 'Heavy downpour & poor footing', status: 'avoid' },
          { time: '02:00 PM - 04:30 PM', score: 35, note: 'Localized waterlogging on trails', status: 'avoid' },
          { time: '07:00 PM - 08:30 PM', score: 45, note: 'Tapering rain, indoor treadmill preferred', status: 'moderate' }
        ],
        windSpeed: 38,
        windGusts: 52,
        heatStressAlert: 'None',
        hydrationRequirement: '400ml water per 45 mins',
        workoutWindowText: 'Slick roads and standing puddles pose sprain hazards. Prefer indoor strength training or treadmill.',
        workoutWindowTextHi: 'सड़कें गीली व फिसलन भरी हैं। बाहर दौड़ने के बजाय इनडोर वर्कआउट या ट्रेडमिल को प्राथमिकता दें।'
      };
    case 'severe':
      return {
        sunrise: '05:40 AM',
        sunset: '07:05 PM',
        bestRunningHours: [
          { time: 'All Day / Anytime', score: 5, note: 'Dangerous 74 km/h squalls & lightning', status: 'avoid' }
        ],
        windSpeed: 74,
        windGusts: 92,
        heatStressAlert: 'None',
        hydrationRequirement: 'Normal hydration',
        workoutWindowText: 'OUTDOOR ATHLETIC SUSPENSION: High velocity tree branch fall and cloud lightning risk.',
        workoutWindowTextHi: 'आउटडोर वर्कआउट स्थगित: 74 किमी/घंटे की आंधी और आकाशीय बिजली का गंभीर खतरा।'
      };
    default:
      return {
        sunrise: '05:32 AM',
        sunset: '07:12 PM',
        bestRunningHours: [
          { time: '05:30 AM - 07:30 AM', score: 96, note: 'Ideal fresh temperature & low wind', status: 'optimal' },
          { time: '07:30 AM - 09:30 AM', score: 82, note: 'Warm sun, comfortable jog', status: 'optimal' },
          { time: '05:30 PM - 07:15 PM', score: 88, note: 'Golden hour sunset run', status: 'optimal' }
        ],
        windSpeed: 12,
        windGusts: 18,
        heatStressAlert: 'None',
        hydrationRequirement: '500ml water per hour',
        workoutWindowText: 'Superb athletic conditions across morning and evening windows. Excellent cardiovascular pacing weather.',
        workoutWindowTextHi: 'सुबह और शाम दोनों समय दौड़ने व व्यायाम के लिए मौसम बेहद शानदार और सुखद है।'
      };
  }
}

export function getMarineMetrics(scenario: WeatherScenarioMode): MarineSurfingMetrics {
  switch (scenario) {
    case 'heavy_rain':
      return {
        seaCondition: 'Rough',
        tideHigh: '11:42 AM',
        tideHighHeight: '+2.4 m',
        tideLow: '05:55 PM',
        tideLowHeight: '+0.5 m',
        waveHeightM: 3.2,
        swellPeriodSec: 11,
        waterTempC: 27,
        portWarning: 'Local Cautionary Signal No. 3 hoisted at coastal ports',
        fishermenAdvisory: 'IMD Coastal Warning: Fishermen are advised not to venture into deep sea due to squally winds 45-55 km/h.',
        fishermenAdvisoryHi: 'तटीय चेतावनी: मछुआरों को समुद्र में न जाने की सलाह, 45-55 किमी/घंटा तेज हवाएं एवं ऊंची लहरें।',
        surfQuality: 'Fair'
      };
    case 'severe':
      return {
        seaCondition: 'Very Rough',
        tideHigh: '01:15 PM',
        tideHighHeight: '+3.1 m (Spring Tide)',
        tideLow: '07:20 PM',
        tideLowHeight: '+0.2 m',
        waveHeightM: 4.8,
        swellPeriodSec: 14,
        waterTempC: 25,
        portWarning: 'Danger Signal No. 7 hoisted at all major harbors',
        fishermenAdvisory: 'CRITICAL MARINE WARNING: Severe storm surge expected. Total suspension of all boating, surfing and beach entry.',
        fishermenAdvisoryHi: 'गंभीर समुद्री चेतावनी: समुद्र में 4.8 मीटर ऊंची लहरें, सर्फिंग और समुद्र तट पर जाना पूर्णतः प्रतिबंधित।',
        surfQuality: 'Dangerous'
      };
    case 'heatwave':
      return {
        seaCondition: 'Calm',
        tideHigh: '09:20 AM',
        tideHighHeight: '+1.6 m',
        tideLow: '03:40 PM',
        tideLowHeight: '+0.7 m',
        waveHeightM: 0.8,
        swellPeriodSec: 7,
        waterTempC: 31,
        portWarning: 'No port warning active (Green Code)',
        fishermenAdvisory: 'Safe coastal navigation. High thermal water temperature. Beware of midday sunstroke on open decks.',
        fishermenAdvisoryHi: 'समुद्र शांत है। दोपहर की कड़ी धूप से बचें और पर्याप्त पानी साथ रखें।',
        surfQuality: 'Poor'
      };
    default:
      return {
        seaCondition: 'Moderate',
        tideHigh: '10:30 AM',
        tideHighHeight: '+1.9 m',
        tideLow: '04:45 PM',
        tideLowHeight: '+0.6 m',
        waveHeightM: 1.5,
        swellPeriodSec: 9,
        waterTempC: 28,
        portWarning: 'Port signals normal (Fair Weather)',
        fishermenAdvisory: 'Gentle swell and normal tidal flow. Ideal conditions for recreational swimming and board sports.',
        fishermenAdvisoryHi: 'समुद्र सामान्य है, तैराकी, नौकायन और वाटर स्पोर्ट्स के लिए सुखद परिस्थितियां हैं।',
        surfQuality: 'Good'
      };
  }
}

export function getTravelMetrics(scenario: WeatherScenarioMode): TravelWeatherMetrics {
  return {
    savedDestinations: [
      {
        city: 'London',
        country: 'United Kingdom',
        temp: 16,
        condition: 'Passing Showers',
        flightAlert: 'Minor Delays',
        packingTip: 'Carry a lightweight waterproof raincoat & compact umbrella',
        packingTipHi: 'वाटरप्रूफ रेनकोट व छोटा छाता अवश्य साथ रखें'
      },
      {
        city: 'Mumbai',
        country: 'India',
        temp: scenario === 'heavy_rain' ? 24 : 31,
        condition: scenario === 'heavy_rain' ? 'Heavy Downpour' : 'Warm & Humid',
        flightAlert: scenario === 'heavy_rain' ? 'Turbulence / Delay Risk' : 'Normal',
        packingTip: 'Quick-dry synthetic clothing and water-sealed phone pouch',
        packingTipHi: 'जल्दी सूखने वाले कपड़े और वाटरप्रूफ बैग पाउच रखें'
      },
      {
        city: 'Manali',
        country: 'Himachal Pradesh',
        temp: 15,
        condition: scenario === 'heavy_rain' ? 'Cloudburst Risk' : 'Pleasant Mountain Air',
        flightAlert: scenario === 'heavy_rain' ? 'Turbulence / Delay Risk' : 'Normal',
        packingTip: 'Fleece layer jacket and sturdy non-slip trekking boots',
        packingTipHi: 'गर्म जैकेट और फिसलन-रोधी ट्रेकिंग जूते पैक करें'
      },
      {
        city: 'Dubai',
        country: 'UAE',
        temp: 38,
        condition: 'Clear & Sunny',
        flightAlert: 'Normal',
        packingTip: 'Breathable linen shirts, UV sunglasses, and lip balm',
        packingTipHi: 'हल्के सूती कपड़े, धूप का चश्मा और सनस्क्रीन रखें'
      }
    ],
    flightAdvisory: scenario in ['heavy_rain', 'severe'] 
      ? 'Aviation Weather Warning: Runway visibility reduced. Terminal departures experiencing 25-45 minute weather holding patterns.' 
      : 'On-time flight operations across regional sectors. Clear cruising altitudes.',
    flightAdvisoryHi: scenario in ['heavy_rain', 'severe'] 
      ? 'उड़ान चेतावनी: बारिश से रनवे दृश्यता कम, उड़ानों में 25-45 मिनट की देरी संभावित।' 
      : 'उड़ानें समय पर संचालित हो रही हैं।',
    packingChecklist: [
      'Sturdy windproof umbrella',
      'Waterproof raincoat / windcheater',
      'Power bank in waterproof zip lock',
      'Breathable quick-dry footwear',
      'Travel sickness & allergy medication'
    ]
  };
}

export function getFamilyMetrics(scenario: WeatherScenarioMode): FamilyWeatherMetrics {
  switch (scenario) {
    case 'heavy_rain':
      return {
        schoolCommuteSafety: 'Caution - Wet Roads',
        morningBusStopRainProb: 88,
        morningBusTime: '07:30 AM - 08:15 AM',
        afternoonPickupRainProb: 75,
        playgroundSafetyIndex: 'Wet / Muddy',
        childHydrationAdvisory: 'Pack warm water or soup thermos. Ensure children wear rain boots with anti-skid rubber soles.',
        childHydrationAdvisoryHi: 'बच्चों को गरम पानी की बोतल दें और वाटरप्रूफ जूते पहनाएं।',
        severeWarningSummary: 'Expect 20 min delay on morning yellow school bus routes due to waterlogged arterial roads.'
      };
    case 'heatwave':
      return {
        schoolCommuteSafety: 'Caution - Wet Roads',
        morningBusStopRainProb: 0,
        morningBusTime: '07:00 AM - 07:45 AM',
        afternoonPickupRainProb: 0,
        playgroundSafetyIndex: 'Stay Indoors',
        childHydrationAdvisory: 'Extreme afternoon heat: Double water flask with ORS/lemonade. School recess must be conducted indoors.',
        childHydrationAdvisoryHi: 'दोपहर में बच्चों को धूप से बचाएं, ओआरएस युक्त पानी की बोतल अवश्य दें।',
        severeWarningSummary: 'Government advisory: Avoid school assemblies under open sun.'
      };
    case 'severe':
      return {
        schoolCommuteSafety: 'Hazardous',
        morningBusStopRainProb: 98,
        morningBusTime: 'Suspended / Delayed',
        afternoonPickupRainProb: 95,
        playgroundSafetyIndex: 'Stay Indoors',
        childHydrationAdvisory: 'Keep children safely away from glass balconies and open terraces during squalls.',
        childHydrationAdvisoryHi: 'तेज आंधी के दौरान बच्चों को बालकनी और खिड़कियों से दूर सुरक्षित रखें।',
        severeWarningSummary: 'Local administration advisory recommending school closure or remote classes today.'
      };
    default:
      return {
        schoolCommuteSafety: 'Safe',
        morningBusStopRainProb: 10,
        morningBusTime: '07:30 AM - 08:15 AM',
        afternoonPickupRainProb: 15,
        playgroundSafetyIndex: 'Great for Outdoor Play',
        childHydrationAdvisory: 'Comfortable day for outdoor activities, sports practice, and playground games.',
        childHydrationAdvisoryHi: 'स्कूल जाने और खेलकूद के लिए मौसम एकदम सुरक्षित और अनुकूल है।'
      };
  }
}

export function getAgriMetrics(scenario: WeatherScenarioMode): AgriGardeningMetrics {
  switch (scenario) {
    case 'heavy_rain':
      return {
        soilMoisturePct: 88,
        topsoilMoisturePct: 94,
        rootZoneMoisturePct: 82,
        evapotranspirationMm: 1.2,
        fiveDayRainfallMm: 110,
        predictedMinTemp: 21,
        frostRisk: 'None',
        frostWarningActive: false,
        heatStressCrop: 'Normal',
        spraySuitability: 'Delay Spraying (Rain Wash-off)',
        plantingGuidance: 'IMD Agromet: Do NOT apply chemical fertilizers or pesticides. Heavy rain will cause 95% chemical wash-off and root suffocation in low beds. Ensure field drainage channels are clear.',
        plantingGuidanceHi: 'कृषि मौसम सलाह: आज कीटनाशक या खाद का छिड़काव बिल्कुल न करें, बारिश से दवा बह जाएगी। खेतों में जल निकासी की व्यवस्था करें।',
        agrometBulletin: 'High risk of standing water stagnation in paddy nurseries and vegetable beds.',
        suggestedTasks: [
          {
            id: 'task_drainage',
            task: 'Clear drainage trenches and pot saucers',
            taskHi: 'जल निकासी की नालियां और गमलों की तश्तरियां साफ करें',
            description: 'Soil is waterlogged (88%). Ensure excess runoff flows away to avoid pythium root rot.',
            descriptionHi: 'मिट्टी में अत्यधिक जलभराव (88%) है। जड़ों को सड़ने से बचाने के लिए पानी निकालें।',
            urgency: 'critical',
            category: 'soil'
          },
          {
            id: 'task_pause_watering',
            task: 'Suspend all artificial watering',
            taskHi: 'कृत्रिम सिंचाई पूरी तरह रोकें',
            description: 'Rainfall exceeds soil absorption capacity; topsoil moisture is at 94%.',
            descriptionHi: 'बारिश मिट्टी की सोखने की क्षमता से अधिक है। अतिरिक्त पानी की आवश्यकता नहीं है।',
            urgency: 'high',
            category: 'watering'
          },
          {
            id: 'task_shelter_pots',
            task: 'Move delicate potted plants under porch shelter',
            taskHi: 'नाज़ुक गमलों को शेड या बरामदे के नीचे रखें',
            description: 'Heavy raindrops will batter tender herbs and succulent leaves.',
            descriptionHi: 'भारी बारिश की बूँदों से कोमल पत्ते और कलियाँ टूट सकती हैं।',
            urgency: 'moderate',
            category: 'indoor_care'
          }
        ]
      };
    case 'heatwave':
      return {
        soilMoisturePct: 18,
        topsoilMoisturePct: 12,
        rootZoneMoisturePct: 24,
        evapotranspirationMm: 7.8,
        fiveDayRainfallMm: 0,
        predictedMinTemp: 32,
        frostRisk: 'None',
        frostWarningActive: false,
        heatStressCrop: 'Severe Wilting Risk',
        spraySuitability: 'Safe to Spray',
        plantingGuidance: 'Apply light evening irrigation to safeguard crops against thermal desiccation and loo winds. Apply straw mulching around fruit orchards.',
        plantingGuidanceHi: 'फसलों को लू से बचाने के लिए शाम के समय हल्की सिंचाई करें और मल्चिंग अपनाएं।',
        agrometBulletin: 'Soil moisture depleted below wilting point in un-irrigated topsoil.',
        suggestedTasks: [
          {
            id: 'task_water_frequent',
            task: 'Water more frequently (Early Morning & Sunset)',
            taskHi: 'अधिक बार पानी दें (सुबह जल्दी और शाम ढलने पर)',
            description: 'Topsoil moisture has dropped to critical 12% with 7.8mm/day evapotranspiration.',
            descriptionHi: 'उच्च तापमान के कारण मिट्टी की नमी घटकर 12% रह गई है, दिन में दो बार गहरी सिंचाई करें।',
            urgency: 'critical',
            category: 'watering'
          },
          {
            id: 'task_shade_cloth',
            task: 'Erect green agro-net shade (50%) over tender seedlings',
            taskHi: 'कोमल पौधों और नर्सरी पर 50% ग्रीन शेड नेट लगाएं',
            description: 'Extreme solar radiation will cause thermal leaf scorching and blossom drop.',
            descriptionHi: 'प्रचंड धूप से पत्तियों के झुलसने और फूल गिरने का खतरा है।',
            urgency: 'high',
            category: 'indoor_care'
          },
          {
            id: 'task_mulch_beds',
            task: 'Apply 3-inch organic straw or dry leaf mulch',
            taskHi: 'जड़ों के पास 3 इंच सूखी घास या पत्तियों की मल्चिंग करें',
            description: 'Mulching insulates roots from high ground heat and cuts soil water evaporation by 50%.',
            descriptionHi: 'मल्चिंग से मिट्टी की नमी सुरक्षित रहती है और जड़ों को भीषण गर्मी से राहत मिलती है।',
            urgency: 'high',
            category: 'soil'
          }
        ]
      };
    case 'severe':
      return {
        soilMoisturePct: 95,
        topsoilMoisturePct: 98,
        rootZoneMoisturePct: 92,
        evapotranspirationMm: 0.8,
        fiveDayRainfallMm: 145,
        predictedMinTemp: 19,
        frostRisk: 'None',
        frostWarningActive: false,
        heatStressCrop: 'Normal',
        spraySuitability: 'High Wind Drift',
        plantingGuidance: 'Hail & Squall Alert: Secure banana plantations, sugarcane and horticulture netting. Cease all tractor field operations.',
        plantingGuidanceHi: 'तेज हवाओं व ओलावृष्टि की संभावना: केले व गन्ने की फसल को सहारा दें, खुले खेत में काम रोकें।',
        agrometBulletin: 'Emergency hail and squall damage advisory active across district.',
        suggestedTasks: [
          {
            id: 'task_secure_trellis',
            task: 'Strap and stake tomato vines and climber vegetables',
            taskHi: 'टमाटर और बेल वाली सब्जियों को डंडों से मजबूती से बांधें',
            description: 'Severe squalls (60+ km/h) can uproot unsupported garden frames.',
            descriptionHi: 'तेज आंधी (60+ किमी/घंटा) से कमजोर बेलें और पौधे टूट सकते हैं।',
            urgency: 'critical',
            category: 'soil'
          },
          {
            id: 'task_protect_harvest',
            task: 'Harvest mature fruits, pods, and leafy greens immediately',
            taskHi: 'पकी हुई सब्जियां, फल और पत्तेदार साग तुरंत तोड़ लें',
            description: 'Prevent physical hail damage and waterlogged rot on mature produce.',
            descriptionHi: 'ओलावृष्टि और पानी भरने से पहले तैयार फसल को सुरक्षित कर लें।',
            urgency: 'high',
            category: 'sowing'
          }
        ]
      };
    default:
      return {
        soilMoisturePct: 54,
        topsoilMoisturePct: 52,
        rootZoneMoisturePct: 56,
        evapotranspirationMm: 3.4,
        fiveDayRainfallMm: 12,
        predictedMinTemp: 17,
        frostRisk: 'None',
        frostWarningActive: false,
        heatStressCrop: 'Normal',
        spraySuitability: 'Safe to Spray',
        plantingGuidance: 'Optimal soil moisture and light wind (12 km/h). Safe for foliar nutrient sprays and seasonal sowing of legumes and leafy greens.',
        plantingGuidanceHi: 'मौसम अनुकूल है। कीटनाशक छिड़काव और मौसमी बुवाई के लिए उत्तम समय है।',
        agrometBulletin: 'Favorable vegetative growth indices across district farms.',
        suggestedTasks: [
          {
            id: 'task_seasonal_sow',
            task: 'Sow seasonal seeds (Spinach, Coriander, Chilies, Okra)',
            taskHi: 'मौसमी सब्जियां और धनिया-पालक की बुवाई करें',
            description: 'Soil temperature (24°C) and moisture (54%) are in the ideal germination sweet spot.',
            descriptionHi: 'मिट्टी का तापमान (24°C) और नमी (54%) बीज अंकुरण के लिए एकदम अनुकूल है।',
            urgency: 'moderate',
            category: 'sowing'
          },
          {
            id: 'task_standard_water',
            task: 'Standard deep watering (check top 1-inch soil)',
            taskHi: 'सामान्य सिंचाई (ऊपरी 1 इंच मिट्टी सूखने पर ही पानी दें)',
            description: 'Watering every 2 days is adequate; avoid over-saturation.',
            descriptionHi: 'हर 2 दिन में नियमित पानी देना पर्याप्त है; अधिक पानी से बचें।',
            urgency: 'routine',
            category: 'watering'
          },
          {
            id: 'task_vermicompost',
            task: 'Feed flowering pots with organic compost or neem cake',
            taskHi: 'गमलों में जैविक वर्मीकम्पोस्ट या नीम खली की खाद डालें',
            description: 'Mild weather facilitates active nutrient uptake by root hairs.',
            descriptionHi: 'शांत मौसम में पौधे पोषक तत्वों को तेजी से ग्रहण करते हैं।',
            urgency: 'routine',
            category: 'soil'
          }
        ]
      };
  }
}

export function getCommuterMetrics(scenario: WeatherScenarioMode): CommuterHighwayMetrics {
  switch (scenario) {
    case 'heavy_rain':
      return {
        highwayVisibilityKm: 1.8,
        visibilityStatus: 'Dense Rain Spray',
        nhaiNowcastWarning: 'NHAI Highway Nowcast: Severe water-logging on NH-48 and Ring Road underpasses. Speed limit advisory 40 km/h.',
        trafficDelayMultiplier: '+45% Commute Delay',
        underpassFloodRisk: 'High Waterlogging Risk',
        corridorAlert: 'Submerged underpasses reported at Minto Bridge & Pul Prahladpur. Use elevated flyover routes.',
        corridorAlertHi: 'अंडरपासों में जलभराव का खतरा। निचले रास्तों के बजाय फ्लाईओवर का उपयोग करें।'
      };
    case 'heatwave':
      return {
        highwayVisibilityKm: 6.5,
        visibilityStatus: 'Clear',
        nhaiNowcastWarning: 'NHAI Advisory: High road surface temperatures (58°C). Check tire pressure to prevent blowout hazard.',
        trafficDelayMultiplier: 'Normal (+5%)',
        underpassFloodRisk: 'Safe',
        corridorAlert: 'High vehicle coolant evaporation risk. Carry surplus radiator water for highway drives.',
        corridorAlertHi: 'टायरों का प्रेशर जांचें, अत्यधिक गर्म सड़क से टायर फटने का खतरा रहता है।'
      };
    case 'severe':
      return {
        highwayVisibilityKm: 0.6,
        visibilityStatus: 'Zero Visibility',
        nhaiNowcastWarning: 'CRITICAL HIGHWAY ALERT: Zero visibility squall and fallen trees reported on Outer Ring Road.',
        trafficDelayMultiplier: '+80% Heavy Congestion',
        underpassFloodRisk: 'High Waterlogging Risk',
        corridorAlert: 'Two-wheelers must halt transit immediately and take shelter in solid structures.',
        corridorAlertHi: 'दोपहिया वाहन चालक तुरंत यात्रा रोककर सुरक्षित पक्की इमारत में शरण लें।'
      };
    default:
      return {
        highwayVisibilityKm: 8.0,
        visibilityStatus: 'Clear',
        nhaiNowcastWarning: 'NHAI Highway Advisory: Clear highways with standard urban traffic flow.',
        trafficDelayMultiplier: 'Normal Travel Time',
        underpassFloodRisk: 'Safe',
        corridorAlert: 'Green transit corridors. Ideal commute conditions.',
        corridorAlertHi: 'सभी प्रमुख सड़कों और हाईवे पर यातायात सामान्य व सुगम है।'
      };
  }
}

export function getEventMetrics(scenario: WeatherScenarioMode): EventPlannerMetrics {
  switch (scenario) {
    case 'heavy_rain':
      return {
        rainProbabilityCurve: [
          { time: '12:00 PM', prob: 45 },
          { time: '02:00 PM', prob: 70 },
          { time: '04:00 PM', prob: 92 },
          { time: '06:00 PM', prob: 88 },
          { time: '08:00 PM', prob: 65 },
          { time: '10:00 PM', prob: 40 }
        ],
        comfortIndex: 42,
        comfortLevel: 'Humid & Sticky',
        tempFactorScore: 82,
        windFactorScore: 48,
        humidityFactorScore: 28,
        apparentTemp: 28.5,
        factorsSummary: 'Saturated air (92% RH) and rain squalls cause mugginess and high event disruption.',
        factorsSummaryHi: 'अत्यधिक नमी (92%) और बारिश के झोंकों के कारण भारी उमस व असुविधा होगी।',
        backupIndoorAdvisory: 'MANDATORY INDOOR BACKUP: Peak precipitation window between 4:00 PM - 7:30 PM will overwhelm open lawn tents.',
        backupIndoorAdvisoryHi: 'खुले मैदान में कार्यक्रम के लिए वाटरप्रूफ वाटर-टाइट हैंगर टेंट या बैंक्वेट हॉल का विकल्प अनिवार्य है।',
        goldenHourPhotoTime: 'Overcast (Diffused Light at 06:15 PM)',
        tentWindRequirement: 'Waterproof marquee rated for 40 km/h wind load'
      };
    case 'heatwave':
      return {
        rainProbabilityCurve: [
          { time: '12:00 PM', prob: 0 },
          { time: '02:00 PM', prob: 0 },
          { time: '04:00 PM', prob: 0 },
          { time: '06:00 PM', prob: 0 },
          { time: '08:00 PM', prob: 0 },
          { time: '10:00 PM', prob: 0 }
        ],
        comfortIndex: 28,
        comfortLevel: 'High Heat Discomfort',
        tempFactorScore: 18,
        windFactorScore: 62,
        humidityFactorScore: 45,
        apparentTemp: 44.2,
        factorsSummary: 'Extreme ambient temperature (42°C) causes rapid thermal exhaustion for outdoor guests.',
        factorsSummaryHi: 'अत्यधिक तापमान (42°C) के कारण मेहमानों के लिए खुली धूप में बैठना हानिकारक है।',
        backupIndoorAdvisory: 'Misting fans, industrial evaporative desert coolers, and shaded canopy mandatory for daytime guests.',
        backupIndoorAdvisoryHi: 'अत्यधिक गर्मी: मेहमानों के लिए कूलर, मिस्टिंग पंखे और ठंडे पेय की भरपूर व्यवस्था करें।',
        goldenHourPhotoTime: '06:45 PM - 07:15 PM (Amber Sunset)',
        tentWindRequirement: 'Open canopy with UV-reflective fabric'
      };
    case 'severe':
      return {
        rainProbabilityCurve: [
          { time: '12:00 PM', prob: 75 },
          { time: '02:00 PM', prob: 85 },
          { time: '04:00 PM', prob: 98 },
          { time: '06:00 PM', prob: 95 },
          { time: '08:00 PM', prob: 80 },
          { time: '10:00 PM', prob: 70 }
        ],
        comfortIndex: 15,
        comfortLevel: 'High Heat Discomfort',
        tempFactorScore: 65,
        windFactorScore: 12,
        humidityFactorScore: 15,
        apparentTemp: 24.0,
        factorsSummary: 'Gale squalls (60+ km/h) and severe rain make outdoor setups physically hazardous.',
        factorsSummaryHi: 'तेज अंधड़ (60+ किमी/घं) और मूसलाधार बारिश से टेंट व सजावट के उखड़ने का भारी खतरा है।',
        backupIndoorAdvisory: 'EVACUATION ADVISORY: Cancel or postpone open-air wedding lawns. High risk of marquee structure collapse in 75 km/h squalls.',
        backupIndoorAdvisoryHi: 'खुले में आयोजन तुरंत स्थगित करें, तेज आंधी में शामियाना गिरने का बड़ा खतरा है।',
        goldenHourPhotoTime: 'No golden hour (Storm Sky)',
        tentWindRequirement: 'Temporary outdoor tents NOT safe'
      };
    default:
      return {
        rainProbabilityCurve: [
          { time: '12:00 PM', prob: 10 },
          { time: '02:00 PM', prob: 12 },
          { time: '04:00 PM', prob: 15 },
          { time: '06:00 PM', prob: 15 },
          { time: '08:00 PM', prob: 8 },
          { time: '10:00 PM', prob: 5 }
        ],
        comfortIndex: 94,
        comfortLevel: 'Ideal Outdoor Weather',
        tempFactorScore: 96,
        windFactorScore: 94,
        humidityFactorScore: 92,
        apparentTemp: 23.4,
        factorsSummary: 'Optimal combination: 23°C temperature, 12 km/h gentle breeze, and 48% pleasant humidity.',
        factorsSummaryHi: 'आदर्श संयोजन: 23°C तापमान, 12 किमी/घंटा सुखद बयार और 48% अनुकूल नमी।',
        backupIndoorAdvisory: 'Superb conditions for outdoor weddings, garden parties, catering and musical performances.',
        backupIndoorAdvisoryHi: 'आउटडोर शादी, पार्टी और समारोहों के लिए मौसम एकदम अनुकूल व सुखद है।',
        goldenHourPhotoTime: '06:20 PM - 06:55 PM (Spectacular Glow)',
        tentWindRequirement: 'Standard decorative canopy'
      };
  }
}
