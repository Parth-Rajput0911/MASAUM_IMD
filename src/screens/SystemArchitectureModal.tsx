import React from 'react';
import { X, Sparkles, Database, Cpu, Layout, ShieldCheck, CheckCircle2, Terminal } from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-white">
      <div 
        id="system-architecture-modal"
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                System Architecture & ML Specifications
              </h2>
              <p className="text-[10px] text-slate-400">
                Personalized Homepage for ‘Mausam’ Mobile App
              </p>
            </div>
          </div>
          <button 
            id="close-system-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Principle */}
        <div className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-2xl">
          <div className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider mb-1">
            🌟 Core Personalization Philosophy
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-semibold">
            “Mausam doesn’t just tell users the weather — it tells them what the weather means for them.”
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="space-y-3 text-xs">
          {/* 1. AI/ML Personalization Engine */}
          <div className="bg-slate-850 bg-slate-800/60 p-3 rounded-2xl border border-slate-700">
            <div className="flex items-center space-x-2 text-sky-400 font-bold mb-1.5">
              <Cpu className="w-4 h-4" />
              <span>1. AI/ML Engine (Python, Pandas, Scikit-learn)</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
              <li><strong>Alert Priority Formula:</strong> <code>Severity (0-10) + Location (0-10) + User Relevance (0-10) = Priority (0-30)</code></li>
              <li><strong>Composite Weather Risk Score:</strong> Multi-variable weighted sum across Commute Transit, Heat/Loo, Thunderstorm, AQI, UV, and Agricultural vulnerability.</li>
              <li><strong>Context Adaptation:</strong> Dynamically reorders UI components based on real-time meteorological conditions (Normal vs Heavy Rain vs Heatwave vs Squall).</li>
            </ul>
          </div>

          {/* 2. Backend & Data Layer */}
          <div className="bg-slate-850 bg-slate-800/60 p-3 rounded-2xl border border-slate-700">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-1.5">
              <Database className="w-4 h-4" />
              <span>2. Backend & Data Architecture</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
              <li><strong>FastAPI & Express REST APIs:</strong> Modular endpoints for <code>/api/weather/current</code>, <code>/api/alerts</code>, <code>/api/recommendations</code>, <code>/api/risk-score</code>, <code>/api/chat</code>.</li>
              <li><strong>MySQL Relational Schema:</strong> Normalised tables for Users, Saved Locations, Weather Cache, Alerts, Commute Routes, and Telemetry.</li>
              <li><strong>Firebase Authentication & Cloud Messaging:</strong> Role-based sign-in and geofenced push notification dispatch.</li>
            </ul>
          </div>

          {/* 3. Mobile UI & Interaction */}
          <div className="bg-slate-850 bg-slate-800/60 p-3 rounded-2xl border border-slate-700">
            <div className="flex items-center space-x-2 text-purple-400 font-bold mb-1.5">
              <Layout className="w-4 h-4" />
              <span>3. Mobile UI & User Experience</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
              <li><strong>5 Core Screens:</strong> Home, Interactive Radar Map, AI Assistant, Alerts, and Profile.</li>
              <li><strong>8 Tailored Domain Modules:</strong> Health (AQI/Pollen), Fitness (Running Hours), Marine (Tides/Swell), Travel (Flights/Packing), Families (School Commute), Agriculture (Soil/Agromet), Commuters (NHAI/Visibility), and Events (Comfort Index).</li>
              <li><strong>Voice Intelligence:</strong> Speech-to-text voice input + Bilingual (English & Hindi) SpeechSynthesis audio readout.</li>
              <li><strong>Smart Commute Card:</strong> Route-level rain probability, departure delay adjustment (e.g., "-20 mins"), and flood warnings.</li>
            </ul>
          </div>

          {/* 4. IMD Official API Integration Matrix */}
          <div className="bg-slate-850 bg-slate-800/60 p-3 rounded-2xl border border-slate-700">
            <div className="flex items-center space-x-2 text-amber-400 font-bold mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>4. Integrated Meteorological & NHAI API Matrix (28 Feeds)</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 font-mono">
              <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                <span className="text-sky-400 font-bold">Forecast & Nowcast:</span>
                <div>• City Weather (7 Days)</div>
                <div>• Station Nowcast & AWS Data</div>
                <div>• Mausamgram Lat/Lon API</div>
              </div>
              <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold">Marine & Coastal:</span>
                <div>• Port Warning & Sea Bulletin</div>
                <div>• Coastal & Fishermen Warning</div>
                <div>• Cyclone Track & Cone</div>
              </div>
              <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                <span className="text-lime-400 font-bold">Agri & Rainfall:</span>
                <div>• Agromet Advisory Bulletin</div>
                <div>• District & Basin QPF Rainfall</div>
                <div>• Soil Moisture Sensor Ingest</div>
              </div>
              <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                <span className="text-indigo-400 font-bold">NHAI & Astro:</span>
                <div>• Highway Nowcast Warning</div>
                <div>• Highway 5-Day Alert (NHAI)</div>
                <div>• Sun & Moon Rise/Set Times</div>
              </div>
            </div>
          </div>
        </div>

        {/* Python files note */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[10px] font-mono text-slate-400">
          <div className="text-slate-300 font-bold mb-1 flex items-center space-x-1">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            <span>Standalone Export Folders:</span>
          </div>
          <div>/backend - FastAPI application and REST routers</div>
          <div>/ai_ml - Scikit-learn Risk Classifier & Relevance Ranker</div>
          <div>/database - MySQL DDL schemas & seed records</div>
          <div>/tests - Python unit tests for automated validation</div>
        </div>
      </div>
    </div>
  );
};
