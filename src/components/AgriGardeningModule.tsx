import React, { useState } from 'react';
import { 
  Sprout, 
  Droplets, 
  Snowflake, 
  AlertTriangle, 
  CheckCircle2, 
  Sun, 
  CloudRain, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  ThermometerSnowflake, 
  ThermometerSun, 
  Sparkles, 
  Leaf,
  Info
} from 'lucide-react';
import { UserProfile, WeatherScenarioMode, WeatherCondition, GardeningTask } from '../types';
import { getAgriMetrics } from '../data/domainData';

interface AgriGardeningModuleProps {
  user: UserProfile;
  weather: WeatherCondition;
  scenario: WeatherScenarioMode;
  language: 'en' | 'hi';
}

type SoilType = 'loam' | 'clay' | 'sand';
type PlantCategory = 'all' | 'indoor' | 'vegetables' | 'crops';

export const AgriGardeningModule: React.FC<AgriGardeningModuleProps> = ({
  user,
  weather,
  scenario,
  language
}) => {
  const baseAgri = getAgriMetrics(scenario);

  // User interactive state
  const [soilType, setSoilType] = useState<SoilType>('loam');
  const [plantCategory, setPlantCategory] = useState<PlantCategory>('all');
  const [tempOverride, setTempOverride] = useState<number | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [customTasks, setCustomTasks] = useState<GardeningTask[]>([]);
  const [newCustomTaskText, setNewCustomTaskText] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'all' | 'soil' | 'frost' | 'tasks'>('all');

  // Effective predicted temperature (allows testing frost scenario or hot day)
  const currentTemp = tempOverride !== null ? tempOverride : weather.temp;
  const predictedMinTemp = tempOverride !== null 
    ? Math.max(-2, tempOverride - 8) 
    : (baseAgri.predictedMinTemp ?? weather.tempMin);

  // Compute frost danger based on predicted min temp
  const isFrostAlert = predictedMinTemp <= 3.5;
  const isFrostWatch = predictedMinTemp > 3.5 && predictedMinTemp <= 6;
  const frostLevel = isFrostAlert ? 'Critical Freeze' : isFrostWatch ? 'Frost Watch' : 'None';

  // Soil moisture adjustment based on soil type
  const soilTypeFactor = soilType === 'clay' ? 1.15 : soilType === 'sand' ? 0.75 : 1.0;
  const topsoilMoisture = Math.min(100, Math.max(8, Math.round((baseAgri.topsoilMoisturePct ?? baseAgri.soilMoisturePct) * soilTypeFactor)));
  const rootMoisture = Math.min(100, Math.max(12, Math.round((baseAgri.rootZoneMoisturePct ?? baseAgri.soilMoisturePct) * (soilType === 'clay' ? 1.1 : 0.9))));

  // Soil moisture status
  const getMoistureStatus = (pct: number) => {
    if (pct > 85) return { label: language === 'hi' ? 'अत्यधिक जलभराव' : 'Waterlogged', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    if (pct > 65) return { label: language === 'hi' ? 'नम / पर्याप्त' : 'High Moisture', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
    if (pct >= 35) return { label: language === 'hi' ? 'आदर्श नमी' : 'Optimal', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    return { label: language === 'hi' ? 'सूखी मिट्टी (सिंचाई चाहिए)' : 'Dry (Water Needed)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  };

  const moistureStatus = getMoistureStatus(topsoilMoisture);

  // Dynamic temperature-driven seasonal tasks
  const generateSeasonalTasks = (): GardeningTask[] => {
    const tasks: GardeningTask[] = [];

    // 1. Frost & Low Temperature Rules (< 7°C)
    if (predictedMinTemp <= 6) {
      tasks.push({
        id: 'task_bring_indoor',
        task: 'Bring indoor plants inside',
        taskHi: 'घर के अंदर रखने वाले पौधों को तुरंत भीतर लाएं',
        description: `Predicted night temperature will plunge to ${predictedMinTemp}°C. Move potted tropicals, succulents, ferns, and balcony herbs indoors before 5:00 PM.`,
        descriptionHi: `रात का तापमान ${predictedMinTemp}°C तक गिरने का अनुमान है। गमले वाले मनी प्लांट, सकुलेंट्स और तुलसी को शाम 5 बजे से पहले अंदर लाएं।`,
        urgency: isFrostAlert ? 'critical' : 'high',
        category: 'indoor_care'
      });

      tasks.push({
        id: 'task_frost_cover',
        task: 'Cover outdoor vegetable beds with frost cloth or burlap',
        taskHi: 'खुले बगीचे की क्यारियों को पाले से बचाने के लिए कपड़े या पुआल से ढकें',
        description: 'Ground radiation frost freezes leaf cells. Erect wooden stakes and drape breathable frost fabric or dry straw mulch.',
        descriptionHi: 'पाला पड़ने से पत्तियों के ऊतक जम जाते हैं। क्यारियों के ऊपर हल्का कपड़ा या पुआल बिछाएं।',
        urgency: isFrostAlert ? 'critical' : 'high',
        category: 'frost_protection'
      });

      tasks.push({
        id: 'task_suspend_evening_water',
        task: 'Do NOT water late in the evening',
        taskHi: 'शाम के समय पौधों में पानी बिल्कुल न दें',
        description: 'Wet soil freezes faster under freezing air, chilling root tips and causing root death.',
        descriptionHi: 'गीली मिट्टी तेजी से जमती है जिससे पौधों की जड़ें गल सकती हैं। केवल दोपहर में गुनगुना पानी दें।',
        urgency: 'high',
        category: 'watering'
      });
    }

    // 2. High Temperature / Heatwave Rules (> 32°C)
    if (currentTemp >= 33) {
      tasks.push({
        id: 'task_water_more_freq',
        task: 'Water more frequently (Early Morning & Sunset)',
        taskHi: 'अधिक बार पानी दें (सुबह जल्दी और शाम को)',
        description: `High heat (${currentTemp}°C) and strong evaporation (${baseAgri.evapotranspirationMm ?? 6.5} mm/day) dehydrate root zones rapidly. Soak deeply twice daily.`,
        descriptionHi: `भीषण तापमान (${currentTemp}°C) में मिट्टी तेजी से सूखती है। सुबह 6-8 बजे और शाम ढलने पर दो बार गहरी सिंचाई करें।`,
        urgency: 'critical',
        category: 'watering'
      });

      tasks.push({
        id: 'task_heat_shade',
        task: 'Install 50% green agro-shade netting over tender plants',
        taskHi: 'नाजुक पौधों पर 50% हरा शेड नेट लगाएं',
        description: 'Shield balcony pots and tomato/chili seedlings from direct scorching sun rays.',
        descriptionHi: 'दोपहर की सीधी धूप से मिर्च, टमाटर और फूलों के पौधों को झुलसने से बचाएं।',
        urgency: 'high',
        category: 'indoor_care'
      });

      tasks.push({
        id: 'task_soil_mulch',
        task: 'Apply 2-inch organic straw or bark mulch',
        taskHi: 'पौधों की जड़ों में 2 इंच सूखी घास या पत्तियों की मल्चिंग करें',
        description: 'Mulch reduces soil surface evaporation by up to 50% and protects micro-nutrients.',
        descriptionHi: 'मल्चिंग से मिट्टी की नमी बनी रहती है और मिट्टी की ऊपरी सतह ठंडी रहती है।',
        urgency: 'moderate',
        category: 'soil'
      });
    }

    // 3. Heavy Rain / Waterlogging Rules
    if (scenario === 'heavy_rain' || topsoilMoisture > 80) {
      tasks.push({
        id: 'task_rain_drainage',
        task: 'Unclog container drainage holes & create drainage trenches',
        taskHi: 'गमलों के ड्रेनेज होल खोलें और क्यारियों में जल निकासी नाली बनाएं',
        description: 'Standing water suffocates feeder roots within 24 hours. Elevate pots on bricks.',
        descriptionHi: 'खेत या गमले में पानी भरा रहने से जड़ें सड़ने लगती हैं। गमलों को ईंटों पर ऊंचा रखें।',
        urgency: 'critical',
        category: 'soil'
      });

      tasks.push({
        id: 'task_halt_irrigation',
        task: 'Pause all sprinkler and hose watering',
        taskHi: 'सिंचाई पूरी तरह बंद रखें',
        description: 'Soil moisture is above 85%. Additional water causes root fungal rot (damping off).',
        descriptionHi: 'मिट्टी में पर्याप्त नमी है, अतिरिक्त पानी फंगल रोगों को बढ़ावा देगा।',
        urgency: 'high',
        category: 'watering'
      });
    }

    // 4. Optimal / Moderate Seasonal Weather (15°C - 30°C)
    if (currentTemp >= 16 && currentTemp <= 32 && scenario !== 'heavy_rain' && !isFrostAlert) {
      tasks.push({
        id: 'task_seasonal_sowing',
        task: 'Plant seasonal seeds (Tomatoes, Coriander, Spinach, Marigold)',
        taskHi: 'मौसमी सब्जियों और फूलों की बुवाई करें (टमाटर, धनिया, पालक, गेंदा)',
        description: `Optimal soil temp (${Math.round(currentTemp - 2)}°C) provides 90%+ germination rate. Safe window for sowing.`,
        descriptionHi: `मौसम अनुकूल है। बीज अंकुरण के लिए यह सर्वोत्तम समय है।`,
        urgency: 'moderate',
        category: 'sowing'
      });

      tasks.push({
        id: 'task_routine_watering',
        task: 'Check top 1 inch of soil before watering',
        taskHi: 'पानी देने से पहले 1 इंच ऊपरी मिट्टी चेक करें',
        description: 'Water only when soil feels dry to the touch. Deep soak once every 2–3 days.',
        descriptionHi: 'हर 2-3 दिन में केवल तभी पानी दें जब ऊपरी मिट्टी सूखी लगे।',
        urgency: 'routine',
        category: 'watering'
      });

      tasks.push({
        id: 'task_organic_feed',
        task: 'Top-dress soil with vermicompost and neem cake',
        taskHi: 'मिट्टी में जैविक खाद या नीम की खली मिलाएं',
        description: 'Mild weather facilitates active nutrient absorption and healthy root branching.',
        descriptionHi: 'पौधों की स्वस्थ वृद्धि के लिए जैविक खाद देने का यह आदर्श समय है।',
        urgency: 'routine',
        category: 'soil'
      });
    }

    return tasks;
  };

  const allGeneratedTasks = [...generateSeasonalTasks(), ...customTasks];

  const filteredTasks = allGeneratedTasks.filter(task => {
    if (plantCategory === 'indoor') return task.category === 'indoor_care' || task.category === 'frost_protection';
    if (plantCategory === 'vegetables') return task.category === 'sowing' || task.category === 'watering';
    if (plantCategory === 'crops') return task.category === 'soil' || task.category === 'watering';
    return true;
  });

  const completedCount = filteredTasks.filter(t => completedTasks[t.id]).length;
  const progressPct = filteredTasks.length > 0 ? Math.round((completedCount / filteredTasks.length) * 100) : 0;

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTaskText.trim()) return;
    const newTask: GardeningTask = {
      id: `custom_${Date.now()}`,
      task: newCustomTaskText.trim(),
      taskHi: newCustomTaskText.trim(),
      description: language === 'hi' ? 'कस्टम बागवानी रिमाइंडर' : 'User custom gardening reminder',
      descriptionHi: 'कस्टम बागवानी रिमाइंडर',
      urgency: 'moderate',
      category: 'indoor_care'
    };
    setCustomTasks(prev => [newTask, ...prev]);
    setNewCustomTaskText('');
    setShowAddCustom(false);
  };

  const removeCustomTask = (taskId: string) => {
    setCustomTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <div id="agri-gardening-module" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-lime-500 to-emerald-600 text-slate-950 font-bold shadow-md shadow-lime-500/20">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                {language === 'hi' ? 'कृषि व बागवानी मॉड्यूल' : 'Agri-Gardening Intelligence'}
              </h2>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-lime-500/20 text-lime-300 border border-lime-500/30">
                IMD Agromet
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'hi' 
                ? 'मिट्टी की नमी, पाला (Frost) अलर्ट व तापमान-आधारित बागवानी सलाह' 
                : 'Soil moisture estimates, frost alerts & temperature-driven planting helper'}
            </p>
          </div>
        </div>

        {/* Interactive Cold / Frost Simulator Toggle */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            id="agri-sim-frost-btn"
            onClick={() => setTempOverride(tempOverride === 2 ? null : 2)}
            title="Simulate Cold / Frost Conditions (2°C)"
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              tempOverride === 2 
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' 
                : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            <Snowflake className="w-3 h-3" />
            <span>2°C Frost</span>
          </button>
          <button
            id="agri-sim-heat-btn"
            onClick={() => setTempOverride(tempOverride === 41 ? null : 41)}
            title="Simulate Heatwave Conditions (41°C)"
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              tempOverride === 41 
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' 
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>41°C Heat</span>
          </button>
          {tempOverride !== null && (
            <button
              onClick={() => setTempOverride(null)}
              className="text-[10px] text-rose-400 px-1 hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 2. Critical Frost Alert Banner (Triggered when predicted min temp <= 6°C) */}
      {(isFrostAlert || isFrostWatch) && (
        <div 
          id="agri-frost-alert-banner"
          className={`p-3.5 rounded-2xl border flex items-start space-x-3 animate-fade-in ${
            isFrostAlert 
              ? 'bg-gradient-to-r from-sky-950/90 via-blue-950/80 to-slate-900 border-sky-400/50 shadow-lg shadow-sky-500/20' 
              : 'bg-slate-900/90 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/40 shrink-0">
            <Snowflake className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-sky-300 flex items-center space-x-1">
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  <span>{isFrostAlert ? (language === 'hi' ? 'गंभीर पाला (Frost) चेतावनी' : 'Severe Frost Freeze Alert') : (language === 'hi' ? 'पाला निगरानी (Frost Watch)' : 'Frost Watch Active')}</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-400/20 text-white font-bold">
                  Min {predictedMinTemp}°C
                </span>
              </div>
              <span className="text-[9px] text-sky-400 font-bold">Dawn 04:30 - 06:30 AM</span>
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              {language === 'hi'
                ? `न्यूनतम तापमान ${predictedMinTemp}°C तक गिरने से खुले पौधों में पाले का खतरा है। नाजुक गमलों को अंदर रखें और क्यारियों को ढकें।`
                : `Predicted ground temperature of ${predictedMinTemp}°C will induce ice crystallization. Tender foliage and outdoor potted tropicals will suffer irreversible leaf necrosis.`}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-200 border border-sky-400/30 flex items-center space-x-1">
                <Leaf className="w-3 h-3 text-sky-300" />
                <span>{language === 'hi' ? 'इनडोर पौधों को अंदर रखें' : 'Bring indoor plants inside'}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-200 border border-sky-400/30 flex items-center space-x-1">
                <ShieldAlert className="w-3 h-3 text-sky-300" />
                <span>{language === 'hi' ? 'पुआल या कपड़े से ढकें' : 'Cover with frost fabric'}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-200 border border-rose-400/30 flex items-center space-x-1">
                <span>✕ {language === 'hi' ? 'देर शाम पानी न दें' : 'No late evening watering'}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Soil Moisture & Field Telemetry Card */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'hi' ? 'मृदा नमी अनुमान (Soil Moisture Profile)' : 'Soil Moisture Estimates'}
            </h3>
          </div>
          
          {/* Soil Texture Selector */}
          <div className="flex items-center space-x-1 text-[10px]">
            <span className="text-slate-500 mr-1">{language === 'hi' ? 'मिट्टी:' : 'Soil:'}</span>
            {(['loam', 'clay', 'sand'] as SoilType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSoilType(type)}
                className={`px-2 py-0.5 rounded-md capitalize font-medium transition-all cursor-pointer ${
                  soilType === type
                    ? 'bg-lime-500/20 text-lime-300 border border-lime-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Moisture Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Topsoil Layer (0 - 10 cm) */}
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60">
            <div className="flex justify-between items-center text-[11px] mb-1.5">
              <span className="text-slate-300 font-semibold flex items-center space-x-1">
                <span>Topsoil Layer (0–10 cm)</span>
              </span>
              <span className="font-mono font-bold text-lime-400 text-xs">{topsoilMoisture}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  topsoilMoisture > 85 
                    ? 'bg-rose-500' 
                    : topsoilMoisture > 65 
                    ? 'bg-sky-400' 
                    : topsoilMoisture >= 35 
                    ? 'bg-emerald-400' 
                    : 'bg-amber-400'
                }`}
                style={{ width: `${topsoilMoisture}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px]">
              <span className={`px-1.5 py-0.5 rounded border font-medium ${moistureStatus.color}`}>
                {moistureStatus.label}
              </span>
              <span className="text-slate-400">
                ET₀: {baseAgri.evapotranspirationMm ?? 3.8} mm/day
              </span>
            </div>
          </div>

          {/* Root Zone Layer (10 - 40 cm) */}
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60">
            <div className="flex justify-between items-center text-[11px] mb-1.5">
              <span className="text-slate-300 font-semibold">Deep Root Zone (10–40 cm)</span>
              <span className="font-mono font-bold text-sky-400 text-xs">{rootMoisture}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${rootMoisture}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[10px]">
              <span className="text-slate-400">
                {language === 'hi' ? '5-दिवसीय वर्षा पूर्वानुमान:' : '5-Day Rain Forecast:'}
              </span>
              <span className="font-mono font-bold text-sky-300">{baseAgri.fiveDayRainfallMm} mm</span>
            </div>
          </div>
        </div>

        {/* Immediate Irrigation Guidance Message */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-xl border border-slate-800/50">
          <Info className="w-3.5 h-3.5 text-lime-400 shrink-0" />
          <span>
            {topsoilMoisture < 35 
              ? (language === 'hi' ? 'सलाह: ऊपरी मिट्टी सूखी है। सुबह 8 बजे से पहले गहरी सिंचाई करें।' : 'Advisory: Topsoil is depleted. Deep morning watering strongly recommended.')
              : topsoilMoisture > 80
              ? (language === 'hi' ? 'सलाह: अत्यधिक जलभराव। कृत्रिम पानी न दें और जल निकासी सुनिश्चित करें।' : 'Advisory: Soil is saturated. Halt irrigation and check drainage outlets.')
              : (language === 'hi' ? 'सलाह: मिट्टी की नमी अनुकूल (40-60%) है। अगले 24 घंटों तक पानी देने की जरूरत नहीं।' : 'Advisory: Moisture is in the optimal band. Hold additional watering for 24 hours.')}
          </span>
        </div>
      </div>

      {/* 4. Seasonal Planting Advice Helper & Interactive Tasks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'hi' ? 'तापमान-आधारित मौसमी बागवानी सहायक' : 'Seasonal Planting Advice Helper'}
            </h3>
          </div>
          
          <span className="text-[10px] text-slate-400 font-mono">
            {completedCount}/{filteredTasks.length} {language === 'hi' ? 'पूर्ण' : 'done'}
          </span>
        </div>

        {/* Plant Category Filter Tabs */}
        <div className="flex space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {[
            { id: 'all' as PlantCategory, label: language === 'hi' ? 'सभी कार्य' : 'All Tasks' },
            { id: 'indoor' as PlantCategory, label: language === 'hi' ? '🪴 इनडोर व गमले' : '🪴 Indoor & Pots' },
            { id: 'vegetables' as PlantCategory, label: language === 'hi' ? '🥕 किचन गार्डन' : '🥕 Veg & Herbs' },
            { id: 'crops' as PlantCategory, label: language === 'hi' ? '🌾 खेत व क्यारियां' : '🌾 Farm Beds' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setPlantCategory(tab.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                plantCategory === tab.id
                  ? 'bg-slate-800 text-lime-300 border-lime-500/40 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Task Completion Progress Bar */}
        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/80">
          <div 
            className="h-full bg-gradient-to-r from-lime-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Actionable Task Cards List */}
        <div className="space-y-2">
          {filteredTasks.map(task => {
            const isCompleted = !!completedTasks[task.id];
            return (
              <div
                key={task.id}
                id={`task-item-${task.id}`}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  isCompleted
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : task.urgency === 'critical'
                    ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-400/50'
                    : task.urgency === 'high'
                    ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-400/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id);
                  }}
                  className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center transition-colors border shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                      : 'border-slate-600 hover:border-lime-400'
                  }`}
                >
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold truncate ${
                      isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
                    }`}>
                      {language === 'hi' ? task.taskHi : task.task}
                    </h4>
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded shrink-0 ml-1.5 ${
                      task.urgency === 'critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : task.urgency === 'high'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {task.urgency}
                    </span>
                  </div>
                  <p className={`text-[11px] mt-0.5 leading-relaxed ${
                    isCompleted ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {language === 'hi' ? task.descriptionHi : task.description}
                  </p>
                </div>

                {task.id.startsWith('custom_') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCustomTask(task.id);
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete custom task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Custom Gardening Task Form */}
        {showAddCustom ? (
          <form onSubmit={handleAddCustomTask} className="flex space-x-2 pt-1">
            <input
              type="text"
              value={newCustomTaskText}
              onChange={(e) => setNewCustomTaskText(e.target.value)}
              placeholder={language === 'hi' ? 'नया कार्य लिखें (उदा. गुलाब में खाद डालें)...' : 'Add custom task (e.g. Water bonsai pots)...'}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-400"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-lime-500 text-slate-950 font-bold text-xs hover:bg-lime-400 cursor-pointer"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            id="add-custom-garden-task-btn"
            onClick={() => setShowAddCustom(true)}
            className="w-full py-2 rounded-xl border border-dashed border-slate-700/80 text-xs text-slate-400 hover:text-lime-300 hover:border-lime-500/40 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '+ नया बागवानी कार्य जोड़ें' : '+ Add Custom Garden Task'}</span>
          </button>
        )}

        {/* IMD Seasonal Sowing Bulletin Footer */}
        <div className="p-2.5 rounded-xl bg-lime-950/20 border border-lime-500/20 text-[11px] text-slate-300 flex items-start space-x-2">
          <Leaf className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-lime-300">
              {language === 'hi' ? 'मौसम-आधारित फसल व बागवानी सलाह: ' : 'Predicted Temperature Advisory: '}
            </span>
            <span>
              {language === 'hi' ? baseAgri.plantingGuidanceHi : baseAgri.plantingGuidance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
