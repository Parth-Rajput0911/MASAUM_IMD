import React, { useEffect, useRef, useState } from 'react';
import { 
  Layers, 
  CloudRain, 
  Sun, 
  Wind, 
  Gauge, 
  Play, 
  Pause, 
  RotateCcw, 
  MapPin, 
  Navigation, 
  Info,
  Building,
  School,
  Trees,
  Home
} from 'lucide-react';
import { UserProfile, WeatherCondition, WeatherScenarioMode, SavedLocation } from '../types';
import L from 'leaflet';

interface MapScreenProps {
  user: UserProfile;
  weather: WeatherCondition;
  scenario: WeatherScenarioMode;
  language: 'en' | 'hi';
}

type LayerMode = 'radar' | 'temp' | 'wind' | 'aqi';

export const MapScreen: React.FC<MapScreenProps> = ({
  user,
  weather,
  scenario,
  language
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const radarOverlayRef = useRef<L.Circle | null>(null);

  const [activeLayer, setActiveLayer] = useState<LayerMode>('radar');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timelineStep, setTimelineStep] = useState<number>(2); // 0: -2h, 1: -1h, 2: Now, 3: +1h, 4: +2h
  const [selectedLocation, setSelectedLocation] = useState<SavedLocation | null>(null);

  const activeLoc = user.savedLocations.find(l => l.id === user.activeLocationId) || user.savedLocations[0];

  const timelineLabels = ['-2 Hours', '-1 Hour', 'NOW (Live)', '+1 Hour', '+2 Hours'];

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [activeLoc.lat, activeLoc.lon],
      zoom: 11,
      zoomControl: false,
      attributionControl: false
    });

    // Dark-styled carto / OpenStreetMap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add Markers for saved locations
    user.savedLocations.forEach((loc) => {
      const isCurrent = loc.id === user.activeLocationId;
      const markerColor = isCurrent ? '#0ea5e9' : '#818cf8';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="
          background: ${markerColor};
          color: white;
          padding: 6px;
          border-radius: 9999px;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          font-weight: bold;
          font-size: 11px;
        ">
          📍
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([loc.lat, loc.lon], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedLocation(loc);
      });
    });

    // Add Simulated Radar / Heat Circle Overlay
    const circleColor = scenario === 'heavy_rain' ? '#0284c7' : scenario === 'heatwave' ? '#f59e0b' : scenario === 'severe' ? '#e11d48' : '#10b981';
    const circle = L.circle([activeLoc.lat, activeLoc.lon], {
      color: circleColor,
      fillColor: circleColor,
      fillOpacity: 0.35,
      radius: 12000
    }).addTo(map);

    radarOverlayRef.current = circle;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeLoc.lat, activeLoc.lon, user.savedLocations, scenario]);

  // Update radar overlay radius and opacity on timeline change
  useEffect(() => {
    if (radarOverlayRef.current) {
      const radiusBase = 8000 + timelineStep * 2500;
      const opacityBase = 0.2 + (timelineStep === 2 ? 0.25 : 0.15);
      radarOverlayRef.current.setRadius(radiusBase);
      radarOverlayRef.current.setStyle({ fillOpacity: opacityBase });
    }
  }, [timelineStep]);

  // Animation player loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineStep((prev) => (prev + 1) % 5);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div id="interactive-weather-map-screen" className="relative h-[calc(100vh-120px)] max-w-md mx-auto overflow-hidden animate-fade-in flex flex-col">
      {/* Top Map Floating Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] space-y-2 pointer-events-none">
        {/* Layer Selector */}
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 shadow-xl flex items-center justify-between pointer-events-auto">
          <button
            id="layer-radar-btn"
            onClick={() => setActiveLayer('radar')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              activeLayer === 'radar' 
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'डॉपलर रडार' : 'Radar'}</span>
          </button>

          <button
            id="layer-temp-btn"
            onClick={() => setActiveLayer('temp')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              activeLayer === 'temp' 
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'तापमान' : 'Temp'}</span>
          </button>

          <button
            id="layer-wind-btn"
            onClick={() => setActiveLayer('wind')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              activeLayer === 'wind' 
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'हवा' : 'Wind'}</span>
          </button>

          <button
            id="layer-aqi-btn"
            onClick={() => setActiveLayer('aqi')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
              activeLayer === 'aqi' 
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'AQI' : 'AQI'}</span>
          </button>
        </div>
      </div>

      {/* Actual Leaflet Map Canvas */}
      <div 
        ref={mapContainerRef} 
        id="leaflet-map-canvas" 
        className="w-full h-full z-0 bg-slate-950" 
      />

      {/* Selected Location Card Popup */}
      {selectedLocation && (
        <div 
          id="map-selected-location-popup"
          className="absolute top-16 left-3 right-3 z-[400] bg-slate-900/95 border border-slate-700 rounded-2xl p-3 shadow-2xl backdrop-blur-md animate-fade-in text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <h3 className="text-xs font-bold">{selectedLocation.name}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 capitalize">
                  {selectedLocation.type}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {selectedLocation.city}, {selectedLocation.state} ({selectedLocation.lat.toFixed(2)}, {selectedLocation.lon.toFixed(2)})
              </p>
            </div>
            <button 
              onClick={() => setSelectedLocation(null)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded-lg bg-slate-800 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className="bg-slate-800/60 p-1 rounded-lg">
              <span className="text-slate-400 block">{language === 'hi' ? 'तापमान' : 'Temp'}</span>
              <span className="font-bold text-white">{weather.temp}°C</span>
            </div>
            <div className="bg-slate-800/60 p-1 rounded-lg">
              <span className="text-slate-400 block">{language === 'hi' ? 'वर्षा' : 'Rain'}</span>
              <span className="font-bold text-sky-400">{weather.rainProb}%</span>
            </div>
            <div className="bg-slate-800/60 p-1 rounded-lg">
              <span className="text-slate-400 block">{language === 'hi' ? 'कम्यूट रिस्क' : 'Transit'}</span>
              <span className="font-bold text-amber-400">{scenario === 'heavy_rain' ? 'High' : 'Normal'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Radar Player Timeline */}
      <div className="absolute bottom-20 left-3 right-3 z-[400] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-2xl text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <button
              id="toggle-radar-playback-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-400 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <span className="text-xs font-bold">
              {timelineLabels[timelineStep]}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {scenario === 'heavy_rain' ? 'IMD Doppler Cloud Reflectivity' : 'Satellite Cloud Matrix'}
          </span>
        </div>

        {/* Timeline Slider Steps */}
        <div className="flex items-center justify-between space-x-1">
          {timelineLabels.map((lbl, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTimelineStep(idx);
                setIsPlaying(false);
              }}
              className={`flex-1 py-1 rounded-lg text-[9px] font-mono font-bold transition-all cursor-pointer ${
                timelineStep === idx 
                  ? 'bg-sky-500 text-white shadow-sm' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {idx === 2 ? 'LIVE' : idx < 2 ? `-${2 - idx}h` : `+${idx - 2}h`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
