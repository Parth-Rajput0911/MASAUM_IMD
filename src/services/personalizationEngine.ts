import { 
  UserProfile, 
  WeatherCondition, 
  WeatherScenarioMode, 
  WeatherAlert, 
  SmartCommuteData, 
  WeatherRiskScore, 
  PersonalizedRecommendation, 
  AISummary,
  UserType 
} from '../types';

export function calculateWeatherRiskScore(
  user: UserProfile, 
  weather: WeatherCondition, 
  scenario: WeatherScenarioMode
): WeatherRiskScore {
  let heatRisk = 15;
  let commuteRisk = 20;
  let stormRisk = 10;
  let aqiRisk = Math.min(100, Math.round((weather.aqi / 300) * 100));
  let uvRisk = Math.min(100, Math.round((weather.uvIndex / 12) * 100));
  let agriRisk = 15;

  if (scenario === 'heavy_rain') {
    commuteRisk = user.commuteProfile?.preferredMode === 'bike' ? 92 : 78;
    stormRisk = 65;
    heatRisk = 10;
    uvRisk = 15;
    agriRisk = user.userType === 'farmer' ? 85 : 40; // field flooding risk
  } else if (scenario === 'heatwave') {
    heatRisk = user.userType === 'outdoor_worker' ? 96 : 82;
    commuteRisk = user.commuteProfile?.preferredMode === 'bike' ? 70 : 40;
    stormRisk = 5;
    uvRisk = 95;
    agriRisk = 80; // crop transpiration & wilting
  } else if (scenario === 'severe') {
    stormRisk = 98;
    commuteRisk = 95;
    heatRisk = 15;
    agriRisk = 90; // lodging of crops, hailstorm risk
  }

  // Persona weightings
  let composite = 0;
  switch (user.userType) {
    case 'farmer':
      composite = agriRisk * 0.45 + stormRisk * 0.25 + heatRisk * 0.15 + commuteRisk * 0.15;
      break;
    case 'student':
      composite = commuteRisk * 0.45 + stormRisk * 0.25 + aqiRisk * 0.20 + uvRisk * 0.10;
      break;
    case 'office_worker':
      composite = commuteRisk * 0.50 + stormRisk * 0.20 + aqiRisk * 0.20 + heatRisk * 0.10;
      break;
    case 'outdoor_worker':
      composite = heatRisk * 0.35 + uvRisk * 0.30 + stormRisk * 0.20 + commuteRisk * 0.15;
      break;
    case 'traveller':
      composite = stormRisk * 0.45 + commuteRisk * 0.35 + aqiRisk * 0.10 + heatRisk * 0.10;
      break;
    default:
      composite = (heatRisk + commuteRisk + stormRisk + aqiRisk) / 4;
  }

  const overallScore = Math.min(100, Math.max(5, Math.round(composite)));

  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let color = '#10B981'; // green
  if (overallScore >= 80) {
    riskLevel = 'Severe';
    color = '#EF4444'; // red
  } else if (overallScore >= 60) {
    riskLevel = 'High';
    color = '#F97316'; // orange
  } else if (overallScore >= 35) {
    riskLevel = 'Moderate';
    color = '#F59E0B'; // yellow
  }

  const summary = getRiskSummary(user.userType, riskLevel, scenario);
  const summaryHi = getRiskSummaryHi(user.userType, riskLevel, scenario);

  return {
    overallScore,
    riskLevel,
    color,
    heatRisk,
    commuteRisk,
    stormRisk,
    aqiRisk,
    uvRisk,
    agriRisk,
    summary,
    summaryHi
  };
}

function getRiskSummary(userType: UserType, level: string, scenario: WeatherScenarioMode): string {
  if (scenario === 'heavy_rain') {
    if (userType === 'student') return 'High rain risk during college transit. Road waterlogging and delayed public transport expected.';
    if (userType === 'farmer') return 'Heavy precipitation: Pause all fertilizer spray. Clear field drainage channels to prevent water stagnation.';
    if (userType === 'office_worker') return 'Evening commute significantly impacted by rain. Expect 25-35 min delays on key arterial routes.';
    if (userType === 'outdoor_worker') return 'Slippery surfaces & low visibility. Waterproof cover required for all outdoor assignments.';
    return 'Significant rain risk. Carry waterproof protection and plan extra travel time.';
  }
  if (scenario === 'heatwave') {
    if (userType === 'outdoor_worker') return 'Severe Heat Hazard: Direct sun exposure risk. Mandatory hydration break every 25 minutes.';
    if (userType === 'student') return 'Excessive heat index. Avoid outdoor campus activity between 11 AM and 4 PM.';
    if (userType === 'farmer') return 'High evapotranspiration: Irrigate early morning or late evening to protect seedlings.';
    return 'Extreme Heat Alert: High risk of heat exhaustion. Stay in shaded/cool environments.';
  }
  if (scenario === 'severe') {
    return 'EMERGENCY: Squall winds (74 km/h) & active lightning. Cease all non-essential movement immediately.';
  }
  return 'Normal weather conditions. Minimal environmental risk detected for your daily routine.';
}

function getRiskSummaryHi(userType: UserType, level: string, scenario: WeatherScenarioMode): string {
  if (scenario === 'heavy_rain') {
    if (userType === 'farmer') return 'भारी बारिश का खतरा: फसलों में दवा छिड़काव रोकें, खेतों से जल निकासी की व्यवस्था करें।';
    if (userType === 'student') return 'कॉलेज आवागमन में जलभराव एवं सार्वजनिक परिवहन में देरी की संभावना है।';
    return 'बारिश का उच्च प्रभाव। छाता साथ रखें एवं यात्रा में अतिरिक्त समय लेकर निकलें।';
  }
  if (scenario === 'heatwave') {
    return 'भीषण लू की चेतावनी: दोपहर 11 से 4 बजे के बीच धूप से बचें और भरपूर पानी पिएं।';
  }
  if (scenario === 'severe') {
    return 'आपातकालीन चेतावनी: तेज आंधी एवं आकाशीय बिजली का खतरा। तुरंत सुरक्षित पक्के स्थान पर रहें।';
  }
  return 'सामान्य मौसम। आपकी दैनिक दिनचर्या के लिए कोई गंभीर पर्यावरणीय जोखिम नहीं है।';
}

export function generatePersonalizedAlerts(
  user: UserProfile, 
  weather: WeatherCondition, 
  scenario: WeatherScenarioMode
): WeatherAlert[] {
  const activeLocation = user.savedLocations.find(l => l.id === user.activeLocationId) || user.savedLocations[0];
  const locationName = activeLocation.name;

  const alerts: WeatherAlert[] = [];

  if (scenario === 'heavy_rain') {
    // Alert 1: Heavy Rain & Waterlogging
    const sevScore = 8;
    const locScore = 9;
    const userRelScore = user.userType === 'office_worker' || user.userType === 'student' || user.userType === 'farmer' ? 10 : 7;
    alerts.push({
      id: 'alt_rain_01',
      title: 'Monsoon Orange Alert: Heavy Rain & Inundation',
      titleHi: 'मानसून ऑरेंज अलर्ट: भारी बारिश एवं जलभराव',
      description: `IMD station near ${activeLocation.city} reports sustained rainfall of 68mm. Water accumulation reported on major transit underpasses.`,
      descriptionHi: `${activeLocation.city} के निकट मौसम केंद्र ने 68 मिमी बारिश दर्ज की है। मुख्य मार्गों पर जलभराव की संभावना है।`,
      severity: 'orange',
      category: 'rain',
      locationName,
      severityScore: sevScore,
      locationScore: locScore,
      userRelevanceScore: userRelScore,
      totalPriority: sevScore + locScore + userRelScore, // 8 + 9 + 10 = 27
      issuedAt: '45 mins ago',
      validUntil: 'Tonight 11:30 PM',
      safetyInstructions: [
        'Carry sturdy waterproof gear/umbrella',
        'Avoid low-lying subways and flooded underpasses',
        'Check metro/traffic advisory before evening commute'
      ],
      safetyInstructionsHi: [
        'मजबूत छाता या वाटरप्रूफ रेनकोट साथ रखें',
        'जलभराव वाले अंडरपास और निचले रास्तों से बचें',
        'शाम को निकलने से पहले ट्रैफिक एडवाइजरी देखें'
      ],
      impactedUserTypes: ['student', 'office_worker', 'outdoor_worker', 'farmer']
    });

    // Alert 2: Lightning & Wind Advisory
    const sevScore2 = 7;
    const locScore2 = 8;
    const userRelScore2 = user.userType === 'farmer' || user.userType === 'outdoor_worker' ? 9 : 5;
    alerts.push({
      id: 'alt_rain_02',
      title: 'Gusty Winds & Moderate Lightning Advisory',
      titleHi: 'तेज हवा एवं बिजली चमकने की चेतावनी',
      description: 'Wind gusts up to 45 km/h with thunderstorm cells moving across the district.',
      descriptionHi: 'जिले में 45 किमी/घंटे की रफ्तार से झोंकेदार हवाएं और बिजली गिरने की संभावना है।',
      severity: 'yellow',
      category: 'thunderstorm',
      locationName,
      severityScore: sevScore2,
      locationScore: locScore2,
      userRelevanceScore: userRelScore2,
      totalPriority: sevScore2 + locScore2 + userRelScore2,
      issuedAt: '1 hour ago',
      validUntil: 'Today 08:00 PM',
      safetyInstructions: [
        'Do not take shelter under isolated tall trees',
        'Unplug sensitive electronic appliances during lightning'
      ],
      safetyInstructionsHi: [
        'बिजली कड़कने पर ऊंचे पेड़ों के नीचे आश्रय न लें',
        'घरों में बिजली के संवेदनशील उपकरण बंद रखें'
      ],
      impactedUserTypes: ['farmer', 'outdoor_worker', 'traveller']
    });
  } else if (scenario === 'heatwave') {
    const sevScore = 9;
    const locScore = 9;
    const userRelScore = user.userType === 'outdoor_worker' ? 10 : user.userType === 'farmer' ? 9 : 8;
    alerts.push({
      id: 'alt_heat_01',
      title: 'IMD Red Warning: Severe Heatwave (Loo)',
      titleHi: 'मौसम विभाग रेड अलर्ट: भीषण लू चेतावनी',
      description: `Ambient temperature reached 43°C (Feels like 47°C) with dry westerly Loo winds across ${activeLocation.city}. High risk of dehydration and heat stress.`,
      descriptionHi: `${activeLocation.city} में तापमान 43°C (महसूस 47°C) पर पहुंच गया है। शुष्क पश्चिमी लू चलने से लू लगने का भारी जोखिम है।`,
      severity: 'red',
      category: 'heatwave',
      locationName,
      severityScore: sevScore,
      locationScore: locScore,
      userRelevanceScore: userRelScore,
      totalPriority: sevScore + locScore + userRelScore, // 9 + 9 + 10 = 28
      issuedAt: 'Today 08:00 AM',
      validUntil: 'Tomorrow 06:00 PM',
      safetyInstructions: [
        'Avoid going outdoors between 11:30 AM and 4:30 PM',
        'Drink ORS, lemon water, buttermilk or coconut water frequently',
        'Wear light, loose cotton clothing and cover head with cloth'
      ],
      safetyInstructionsHi: [
        'सुबह 11:30 से शाम 4:30 बजे के बीच धूप में न निकलें',
        'ओआरएस, नींबू पानी, छाछ या नारियल पानी का सेवन करें',
        'हल्के सूती कपड़े पहनें और सिर को ढक कर रखें'
      ],
      impactedUserTypes: ['outdoor_worker', 'farmer', 'student', 'office_worker', 'general_user']
    });
  } else if (scenario === 'severe') {
    const sevScore = 10;
    const locScore = 10;
    const userRelScore = 10;
    alerts.push({
      id: 'alt_severe_01',
      title: 'IMD Red Alert: Squall Storm & Damaging Winds (75+ km/h)',
      titleHi: 'मौसम विभाग रेड अलर्ट: विनाशकारी आंधी-तूफान (75+ किमी/घं)',
      description: `Emergency weather bulletin for ${activeLocation.city}. Severe cyclonic squall with cloud-to-ground lightning and heavy downpour. High risk of falling branches and power interruptions.`,
      descriptionHi: `${activeLocation.city} के लिए आपातकालीन मौसम बुलेटिन। 75+ किमी/घंटा की गति से आंधी, भारी बारिश और आकाशीय बिजली की चेतावनी।`,
      severity: 'red',
      category: 'thunderstorm',
      locationName,
      severityScore: sevScore,
      locationScore: locScore,
      userRelevanceScore: userRelScore,
      totalPriority: sevScore + locScore + userRelScore, // 10 + 10 + 10 = 30
      issuedAt: '15 mins ago',
      validUntil: 'Next 4 Hours',
      safetyInstructions: [
        'STAY INDOORS away from glass windows and loose tin sheds',
        'Halt all highway and motorcycle transit immediately',
        'Keep mobile devices charged in case of local power outage'
      ],
      safetyInstructionsHi: [
        'कांच की खिड़कियों और टीन शेड से दूर पक्के मकानों में रहें',
        'सड़क यात्रा और दोपहिया वाहन चलाना तुरंत रोक दें',
        'बिजली गुल होने की आशंका को देखते हुए फोन चार्ज रखें'
      ],
      impactedUserTypes: ['student', 'farmer', 'office_worker', 'outdoor_worker', 'traveller', 'general_user']
    });
  } else {
    // Normal weather: Green / Yellow mild advisory
    alerts.push({
      id: 'alt_normal_01',
      title: 'Green Code: Favorable Weather Window',
      titleHi: 'ग्रीन कोड: अनुकूल एवं सुखद मौसम',
      description: `Conditions in ${activeLocation.city} are pleasant with normal atmospheric pressure and good air ventilation.`,
      descriptionHi: `${activeLocation.city} में मौसम सामान्य और सुखद बना हुआ है। किसी प्रतिकूल मौसम की संभावना नहीं है।`,
      severity: 'green',
      category: 'wind',
      locationName,
      severityScore: 2,
      locationScore: 8,
      userRelevanceScore: 6,
      totalPriority: 16,
      issuedAt: 'Today 06:00 AM',
      validUntil: 'Tonight 10:00 PM',
      safetyInstructions: [
        'Ideal time for outdoor routines and travel',
        'Moderate UV midday: wear basic sunglasses or sunscreen if in direct sun'
      ],
      safetyInstructionsHi: [
        'दैनिक कार्यों एवं यात्रा के लिए अनुकूल समय',
        'दोपहर में हल्की धूप से बचाव के लिए चश्मा या सनस्क्रीन उपयोगी'
      ],
      impactedUserTypes: ['student', 'office_worker', 'farmer', 'outdoor_worker', 'traveller', 'general_user']
    });
  }

  // Sort strictly by the core formula: Total Priority Descending!
  return alerts.sort((a, b) => b.totalPriority - a.totalPriority);
}

export function generateSmartCommute(
  user: UserProfile, 
  weather: WeatherCondition, 
  scenario: WeatherScenarioMode
): SmartCommuteData {
  const originLoc = user.savedLocations.find(l => l.id === user.commuteProfile?.originLocationId) || user.savedLocations[0];
  const destLoc = user.savedLocations.find(l => l.id === user.commuteProfile?.destinationLocationId) || user.savedLocations[1] || user.savedLocations[0];

  let routeRainProb = 15;
  let travelRisk: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let recommendedShift = 'Normal Departure';
  let reason = 'Clear traffic corridor and stable weather.';
  let textEn = 'Traffic is flowing normally along your route. No weather delays anticipated.';
  let textHi = 'आपके रास्ते पर मौसम अनुकूल है और यातायात सामान्य गति से चल रहा है।';
  let hazards: string[] = ['Standard peak-hour city traffic'];

  if (scenario === 'heavy_rain') {
    routeRainProb = 88;
    travelRisk = user.commuteProfile?.preferredMode === 'bike' ? 'High' : 'Moderate';
    recommendedShift = 'Leave 25 mins earlier';
    reason = 'Evening monsoon showers peaking between 5:00 PM and 7:00 PM with slow road drainage.';
    textEn = `Rain probability is 88% along ${originLoc.name} → ${destLoc.name}. Metro/Road transit may see waterlogged junctions. Carry a sturdy umbrella and consider leaving 25 minutes earlier.`;
    textHi = `${originLoc.name} से ${destLoc.name} मार्ग पर 88% बारिश की संभावना है। जलभराव के कारण देरी हो सकती है, छाता साथ रखें और 25 मिनट पहले निकलें।`;
    hazards = ['Waterlogging near arterial underpass', 'Reduced braking traction for 2-wheelers', 'Water splash from passing heavy vehicles'];
  } else if (scenario === 'heatwave') {
    routeRainProb = 0;
    travelRisk = user.commuteProfile?.preferredMode === 'bike' ? 'High' : 'Moderate';
    recommendedShift = 'Commute before 10:30 AM or after 5:30 PM';
    reason = 'Peak asphalt radiation and heat index reaching 47°C during midday.';
    textEn = `High thermal stress on road between ${originLoc.name} → ${destLoc.name}. If traveling by bike or walking, carry at least 1L electrolyte water and avoid peak midday transit.`;
    textHi = `दोपहर में सड़क का तापमान अत्यधिक रहेगा। यदि बाइक से जा रहे हैं तो सिर और चेहरे को ढकें एवं ओआरएस पानी साथ रखें।`;
    hazards = ['Extreme radiant road heat', 'Engine overheating risk in stop-and-go traffic', 'Dehydration & sun glare'];
  } else if (scenario === 'severe') {
    routeRainProb = 96;
    travelRisk = 'Severe';
    recommendedShift = 'Postpone non-urgent travel';
    reason = 'Squall winds (74 km/h) with risk of falling tree branches and localized flash inundation.';
    textEn = `CRITICAL TRAVEL WARNING: Hazardous squall along ${originLoc.name} → ${destLoc.name}. Road transit is not recommended until storm core passes.`;
    textHi = `गंभीर यात्रा चेतावनी: मार्ग पर तेज आंधी और पेड़ गिरने का खतरा है। तूफान थमने तक यात्रा स्थगित करें।`;
    hazards = ['Falling tree limbs and hoardings', 'Flash flooding in subway dips', 'Zero road visibility in squalls'];
  }

  return {
    origin: originLoc.name,
    destination: destLoc.name,
    morningTime: user.commuteProfile?.morningDeparture || '08:30 AM',
    eveningTime: user.commuteProfile?.eveningDeparture || '05:30 PM',
    distanceKm: 14.2,
    estDurationMin: travelRisk === 'High' ? 52 : travelRisk === 'Severe' ? 75 : 32,
    routeRainProbability: routeRainProb,
    travelRisk,
    recommendedDepartureTime: recommendedShift,
    timeShiftReason: reason,
    recommendationText: textEn,
    recommendationTextHi: textHi,
    routeHazards: hazards
  };
}

export function generatePersonalizedRecommendations(
  user: UserProfile, 
  weather: WeatherCondition, 
  scenario: WeatherScenarioMode
): PersonalizedRecommendation[] {
  const recs: PersonalizedRecommendation[] = [];

  if (user.userType === 'student') {
    if (scenario === 'heavy_rain') {
      recs.push({
        id: 'rec_s1',
        icon: 'umbrella',
        title: 'Waterproof Gear & Laptop Protection',
        titleHi: 'लैपटॉप व किताबों की सुरक्षा',
        action: 'Rain is likely during your evening commute. Pack college notebooks and electronics in waterproof sleeves, carry an umbrella and leave 20 minutes earlier.',
        actionHi: 'शाम के सफर में तेज बारिश की संभावना है। बैग में वाटरप्रूफ कवर लगाएं और 20 मिनट पहले निकलें।',
        priority: 'urgent',
        category: 'commute',
        badgeText: 'Evening Commute Alert'
      });
      recs.push({
        id: 'rec_s2',
        icon: 'bus',
        title: 'Metro / Bus Service Watch',
        titleHi: 'मेट्रो व बस समय सारिणी',
        action: 'Campus perimeter routes face minor water accumulation. Prefer metro over low-floor buses.',
        actionHi: 'कैंपस के मुख्य द्वार के पास पानी भर सकता है। बस की तुलना में मेट्रो को प्राथमिकता दें।',
        priority: 'important',
        category: 'commute'
      });
    } else if (scenario === 'heatwave') {
      recs.push({
        id: 'rec_s3',
        icon: 'droplets',
        title: 'Hydration for Campus Transit',
        titleHi: 'कैंपस में हाइड्रेशन बनाए रखें',
        action: 'UV index is 11 (Extreme). Carry an insulated water bottle and schedule outdoor library transitions through shaded corridors.',
        actionHi: 'यूवी इंडेक्स 11 (अति गंभीर) है। पानी की बोतल साथ रखें और धूप में सीधे निकलने से बचें।',
        priority: 'urgent',
        category: 'health',
        badgeText: 'Extreme UV Index 11'
      });
    } else {
      recs.push({
        id: 'rec_s4',
        icon: 'sparkles',
        title: 'Optimal Campus Study Weather',
        titleHi: 'पढ़ाई व आउटडोर के लिए अनुकूल',
        action: 'Pleasant temperature of 28°C. Perfect day for sports practice or open-air campus discussions.',
        actionHi: 'तापमान 28°C सुहावना है। कॉलेज ग्राउंड और अध्ययन के लिए शानदार दिन है।',
        priority: 'info',
        category: 'outdoor'
      });
    }
  } else if (user.userType === 'farmer') {
    if (scenario === 'heavy_rain') {
      recs.push({
        id: 'rec_f1',
        icon: 'wheat',
        title: 'Agro Advisory: Postpone Spraying',
        titleHi: 'कीटनाशक छिड़काव स्थगित करें',
        action: 'Rain probability is 92% with 68mm rainfall. Do NOT spray pesticides or urea today as chemical wash-off will occur.',
        actionHi: 'बारिश की 92% संभावना है। आज कीटनाशक या यूरिया का छिड़काव बिल्कुल न करें, दवा बह जाएगी।',
        priority: 'urgent',
        category: 'farming',
        badgeText: 'Kisan Krishi Salah'
      });
      recs.push({
        id: 'rec_f2',
        icon: 'droplet',
        title: 'Drainage Channel Clearance',
        titleHi: 'खेतों में जलनिकासी की तैयारी',
        action: 'Open field furrows to prevent root rot in cotton/paddy nurseries from standing water.',
        actionHi: 'खेतों की मेड़ें जांचें और जल निकासी नाली साफ करें ताकि पानी न ठहरे।',
        priority: 'important',
        category: 'farming'
      });
    } else if (scenario === 'heatwave') {
      recs.push({
        id: 'rec_f3',
        icon: 'sun',
        title: 'Night / Early Morning Irrigation Only',
        titleHi: 'सुबह या शाम ही सिंचाई करें',
        action: 'Loo winds cause severe moisture loss. Irrigate crops strictly between 7:00 PM and 6:00 AM to prevent thermal shock.',
        actionHi: 'दिन की धूप में सिंचाई न करें। पौधों को झुलसने से बचाने के लिए शाम 7 बजे के बाद ही पानी दें।',
        priority: 'urgent',
        category: 'farming',
        badgeText: 'Evapotranspiration Alert'
      });
    } else {
      recs.push({
        id: 'rec_f4',
        icon: 'check-circle-2',
        title: 'Ideal Sowing & Fertilization Window',
        titleHi: 'बुवाई व खाद डालने का सही समय',
        action: 'Favorable soil temperature (24°C) and moderate humidity. Good window for scheduled field operations.',
        actionHi: 'मिट्टी का तापमान और नमी उपयुक्त है। निर्धारित कृषि कार्य पूरे करने के लिए अनुकूल दिन।',
        priority: 'info',
        category: 'farming'
      });
    }
  } else if (user.userType === 'office_worker') {
    if (scenario === 'heavy_rain') {
      recs.push({
        id: 'rec_o1',
        icon: 'umbrella',
        title: 'Evening Commute Alert',
        titleHi: 'शाम के सफर की तैयारी',
        action: 'Rain is likely during your evening commute. Carry an umbrella and consider leaving 20 minutes earlier.',
        actionHi: 'शाम के आवागमन के समय तेज बारिश की संभावना है। छाता साथ रखें और 20 मिनट पहले निकलने पर विचार करें।',
        priority: 'urgent',
        category: 'commute',
        badgeText: 'Smart Commute Recommended'
      });
      recs.push({
        id: 'rec_o2',
        icon: 'car',
        title: 'Cab Surge & Transit Delays',
        titleHi: 'कैब सर्ज व ट्रैफिक जाम',
        action: 'High demand for app-based rides expected post 5:00 PM. Pre-book or coordinate carpool.',
        actionHi: 'शाम 5 बजे के बाद कैब की भारी मांग रहेगी। समय से पहले कैब बुक करें।',
        priority: 'important',
        category: 'commute'
      });
    } else if (scenario === 'heatwave') {
      recs.push({
        id: 'rec_o3',
        icon: 'thermometer',
        title: 'AC to Outdoor Thermal Transition',
        titleHi: 'एसी से धूप में अचानक न जाएं',
        action: 'Temperature difference between office AC (22°C) and outdoor (43°C) is high. Acclimatize for 5 mins in lobby before exiting.',
        actionHi: 'ऑफिस के ठंडे एसी से सीधे 43°C धूप में न जाएं, 5 मिनट सामान्य तापमान में रुकें।',
        priority: 'important',
        category: 'health'
      });
    } else {
      recs.push({
        id: 'rec_o4',
        icon: 'coffee',
        title: 'Smooth Transit & Clear Skies',
        titleHi: 'सुगम आवागमन व सामान्य दिन',
        action: 'Clear commute corridors with standard travel times. Comfortable indoor and outdoor weather.',
        actionHi: 'रास्ते साफ हैं और यात्रा सामान्य समय में पूरी होगी।',
        priority: 'info',
        category: 'commute'
      });
    }
  } else if (user.userType === 'outdoor_worker') {
    if (scenario === 'heatwave') {
      recs.push({
        id: 'rec_w1',
        icon: 'alert-triangle',
        title: 'Mandatory Heat Safety Protocol',
        titleHi: 'अनिवार्य धूप सुरक्षा नियम',
        action: 'Wet cloth around neck, drink salted lemonade or ORS every 30 mins, and avoid heavy manual lifting between 1:00 PM and 3:30 PM.',
        actionHi: 'गर्दन पर गीला गमछा रखें, हर 30 मिनट में नमक-पानी/ओआरएस पिएं और दोपहर 1 से 3:30 के बीच भारी काम रोकें।',
        priority: 'urgent',
        category: 'outdoor',
        badgeText: 'Occupational Heat Warning'
      });
    } else if (scenario === 'heavy_rain') {
      recs.push({
        id: 'rec_w2',
        icon: 'shield-alert',
        title: 'Slip Hazard & Electric Cable Caution',
        titleHi: 'फिसलन व खुले तारों से सावधानी',
        action: 'Wear anti-skid boots. Stay at least 10 meters away from waterlogged electric poles and open transformer yards.',
        actionHi: 'एंटी-स्किड जूते पहनें। पानी भरे बिजली के खंभों और ट्रांसफार्मर से दूर रहें।',
        priority: 'urgent',
        category: 'outdoor'
      });
    } else {
      recs.push({
        id: 'rec_w3',
        icon: 'check',
        title: 'Favorable Outdoor Work Conditions',
        titleHi: 'कार्य के लिए अनुकूल मौसम',
        action: 'Moderate temperature and manageable humidity. Standard hydration and sun protection recommended.',
        actionHi: 'हवा और तापमान सामान्य है। सामान्य सावधानी के साथ काम जारी रख सकते हैं।',
        priority: 'info',
        category: 'outdoor'
      });
    }
  } else {
    // General user / traveller
    recs.push({
      id: 'rec_g1',
      icon: scenario === 'heavy_rain' ? 'umbrella' : scenario === 'heatwave' ? 'sun' : 'smile',
      title: scenario === 'heavy_rain' ? 'Monsoon Preparedness' : scenario === 'heatwave' ? 'Beat the Heat' : 'Daily Lifestyle Outlook',
      titleHi: scenario === 'heavy_rain' ? 'बारिश से बचाव' : scenario === 'heatwave' ? 'गर्मी से राहत' : 'दैनिक जीवन सुझाव',
      action: scenario === 'heavy_rain' 
        ? 'Keep rain gear handy. Check route conditions before stepping out for evening gatherings.'
        : scenario === 'heatwave'
        ? 'Avoid direct sun exposure between 12 PM and 4 PM. Keep pets well-hydrated indoors.'
        : 'Pleasant weather today. Great day for morning walks, laundry, and outdoor errands.',
      actionHi: scenario === 'heavy_rain'
        ? 'शाम को बाहर जाने से पहले छाता साथ रखें और जलभराव वाले रास्तों से बचें।'
        : scenario === 'heatwave'
        ? 'दोपहर 12 से 4 के बीच धूप से बचें और पर्याप्त तरल पदार्थ लेते रहें।'
        : 'आज का दिन सुहावना है। सैर और दैनिक कार्यों के लिए एकदम उपयुक्त।',
      priority: scenario === 'normal' ? 'info' : 'important',
      category: 'attire'
    });
  }

  return recs;
}

export function generateAISummary(
  user: UserProfile, 
  weather: WeatherCondition, 
  scenario: WeatherScenarioMode
): AISummary {
  const activeLocation = user.savedLocations.find(l => l.id === user.activeLocationId) || user.savedLocations[0];
  const userName = user.name.split(' ')[0];

  if (scenario === 'heavy_rain') {
    return {
      headline: `Intense Monsoon Showers impacting ${activeLocation.city}`,
      headlineHi: `${activeLocation.city} में मानसून की जोरदार बारिश का दौर`,
      explanation: `Atmospheric moisture has surged to 94% with deep convective thunderclouds active over the NCR/district area. 68mm accumulated rainfall reported.`,
      explanationHi: `वायुमंडलीय आर्द्रता 94% तक पहुंच गई है और घने गरज-चमक वाले बादल सक्रिय हैं। अब तक 68 मिमी बारिश दर्ज की गई है।`,
      meaningForUser: `For you as a ${user.userType.replace('_', ' ')}, this means your evening routine and travel will face waterlogged roads, slow traffic speeds, and potential public transport bottlenecks around 5:30 PM.`,
      meaningForUserHi: `एक ${user.userType === 'farmer' ? 'किसान' : user.userType === 'student' ? 'छात्र' : 'कर्मचारी'} के रूप में आपके लिए इसका अर्थ है कि शाम के सफर में जलभराव और ट्रैफिक जाम का सामना करना पड़ सकता है।`,
      recommendedAction: `Carry rain gear, pack electronic gadgets in sealed sleeves, and leave 20-25 minutes before your scheduled transit time.`,
      recommendedActionHi: `छाता व रेनकोट साथ रखें, इलेक्ट्रॉनिक्स को सुरक्षित रखें और यात्रा के लिए 20-25 मिनट पहले निकलें।`,
      contextTag: 'Monsoon Impact Engine'
    };
  }

  if (scenario === 'heatwave') {
    return {
      headline: `Extreme Heatwave & Severe Loo Advisory in ${activeLocation.city}`,
      headlineHi: `${activeLocation.city} में भीषण लू एवं अत्यधिक गर्मी का प्रकोप`,
      explanation: `Day temperature has hit 43°C (Feels like 47°C) accompanied by scorching dry westerly winds. UV Index is critically high at 11.`,
      explanationHi: `तापमान 43°C (महसूस 47°C) पर पहुंच चुका है और शुष्क पश्चिमी लू चल रही है। यूवी इंडेक्स 11 (अति गंभीर) स्तर पर है।`,
      meaningForUser: `For ${userName}, prolonged exposure during afternoon hours poses a high risk of dehydration, heat cramps, and acute sun fatigue.`,
      meaningForUserHi: `${userName} के लिए दोपहर के समय धूप में अधिक देर रहने से डिहाइड्रेशन, चक्कर और लू लगने का गंभीर खतरा है।`,
      recommendedAction: `Restrict outdoor activities between 11:30 AM and 4:30 PM. Drink lemon electrolyte water frequently and wear protective cotton headwear.`,
      recommendedActionHi: `दोपहर 11:30 से 4:30 के बीच धूप से बचें, नींबू पानी या ओआरएस पिएं और सिर पर सूती कपड़ा रखें।`,
      contextTag: 'Thermal Health Risk Guard'
    };
  }

  if (scenario === 'severe') {
    return {
      headline: `Urgent: Severe Squall & Lightning Threat in ${activeLocation.city}`,
      headlineHi: `आपातकालीन: ${activeLocation.city} में भीषण आंधी एवं आकाशीय बिजली`,
      explanation: `Doppler radar shows severe squall line with wind gusts reaching 74 km/h and frequent cloud-to-ground lightning discharges.`,
      explanationHi: `डॉपलर रडार पर 74 किमी/घंटे की रफ्तार वाली तूफानी हवाएं और बादलों से जमीन पर बिजली गिरने की घटनाएं दर्ज हुई हैं।`,
      meaningForUser: `Critical safety risk. High probability of fallen tree limbs, flying debris, and sudden power cuts affecting home and transit.`,
      meaningForUserHi: `यह गंभीर सुरक्षा जोखिम है। पेड़ गिरने, टीन शेड उड़ने और बिजली आपूर्ति बाधित होने की प्रबल आशंका है।`,
      recommendedAction: `Remain inside a pucca building away from windows. Do not ride two-wheelers or walk under tall trees or bill boards.`,
      recommendedActionHi: `पक्के मकान में खिड़कियों से दूर रहें। दोपहिया वाहन चलाना तुरंत रोकें और पेड़ों के नीचे बिल्कुल न खड़े हों।`,
      contextTag: 'Severe Emergency Protocol'
    };
  }

  // Normal
  return {
    headline: `Pleasant & Stable Weather Window in ${activeLocation.city}`,
    headlineHi: `${activeLocation.city} में सुहावना एवं स्थिर मौसम`,
    explanation: `Atmospheric pressure is steady at 1012 hPa with comfortable 58% relative humidity and a gentle 12 km/h breeze.`,
    explanationHi: `वायुमंडलीय दबाव 1012 hPa पर सामान्य है, 58% नमी और 12 किमी/घंटे की सुहानी हवा चल रही है।`,
    meaningForUser: `Ideal atmospheric conditions for your daily tasks, studies, commute, and evening outdoor leisure.`,
    meaningForUserHi: `आपकी दैनिक दिनचर्या, पढ़ाई, आवागमन और शाम के कार्यों के लिए यह एकदम उत्तम दिन है।`,
    recommendedAction: `No weather disruptions expected. Plan your day with standard routines. Enjoy good outdoor air quality.`,
    recommendedActionHi: `मौसम में किसी रुकावट की संभावना नहीं है। निश्चिंत होकर अपनी सामान्य दिनचर्या जारी रखें।`,
    contextTag: 'AI Personalized Clarity'
  };
}
