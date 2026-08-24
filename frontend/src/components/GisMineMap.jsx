import React, { useState } from "react";

import {

  MapPin,

  Radio,



  Compass,
  Wind,





  Info } from
"lucide-react";








export const GisMineMap = ({
  selectedMine,
  violations,
  inspections,
  onInspectViolation
}) => {
  // Layer visibility toggles
  const [activeLayers, setActiveLayers] = useState({
    pitBoundary: true,
    slopeRadar: true,
    haulRoads: true,
    environmentalSensors: true,
    blastingRadius: true,
    inspectionPins: true
  });

  // Selected GIS item for inspector drawer
  const [selectedPin, setSelectedPin] = useState(


    null);

  const toggleLayer = (layerName) => {
    setActiveLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const isUnderground = selectedMine.type === "Underground";

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono tracking-widest text-[#E64A19] uppercase font-bold">
              Spatial Cadastre & Drone Orthomosaic
            </span>
            <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-mono font-bold">
              CMR 2017 Reg 64
            </span>
          </div>
          <h2 className="text-xl font-serif italic text-slate-900 mt-1">
            {selectedMine.name} ({selectedMine.subsidiary}) — Real-Time Spatial GIS Cadastre
          </h2>
          <p className="text-xs text-slate-600 font-sans mt-0.5">
            Georeferenced mine plan with overlay of slope stability radar telemetry, haul road gradients (1:16 max), and 500m statutory blasting danger zones.
          </p>
        </div>

        {/* Spatial Layer Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => toggleLayer("pitBoundary")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
            activeLayers.pitBoundary ?
            "bg-slate-900 border-slate-900 text-white shadow-2xs" :
            "bg-white border-slate-300 text-slate-600 hover:text-slate-900"}`
            }>
            
            Boundary / Lease
          </button>
          <button
            onClick={() => toggleLayer("slopeRadar")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
            activeLayers.slopeRadar ?
            "bg-red-50 border-red-300 text-red-700 shadow-2xs" :
            "bg-white border-slate-300 text-slate-600 hover:text-slate-900"}`
            }>
            
            Slope Radar / Dumps
          </button>
          <button
            onClick={() => toggleLayer("haulRoads")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
            activeLayers.haulRoads ?
            "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs" :
            "bg-white border-slate-300 text-slate-600 hover:text-slate-900"}`
            }>
            
            Haul Roads (1:16)
          </button>
          <button
            onClick={() => toggleLayer("environmentalSensors")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
            activeLayers.environmentalSensors ?
            "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-2xs" :
            "bg-white border-slate-300 text-slate-600 hover:text-slate-900"}`
            }>
            
            CAAQMS Sensors
          </button>
          <button
            onClick={() => toggleLayer("blastingRadius")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
            activeLayers.blastingRadius ?
            "bg-orange-50 border-orange-300 text-[#E64A19] shadow-2xs" :
            "bg-white border-slate-300 text-slate-600 hover:text-slate-900"}`
            }>
            
            500m Danger Zone
          </button>
          <button
            onClick={() => toggleLayer("inspectionPins")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
            activeLayers.inspectionPins ?
            "bg-purple-50 border-purple-300 text-purple-700 shadow-2xs" :
            "bg-white border-slate-300 text-slate-600 hover:text-slate-900"}`
            }>
            
            Inspection Pins
          </button>
        </div>
      </div>

      {/* Main Canvas & Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Stage (Col 3) */}
        <div className="lg:col-span-3 bg-[#F1F5F9] border border-slate-300 rounded-xl p-3 relative overflow-hidden shadow-sm min-h-[500px] flex flex-col justify-between">
          {/* Compass & Scale Overlay */}
          <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-md border border-slate-300 p-3 rounded-lg text-xs space-y-1 shadow-md">
            <div className="flex items-center space-x-2 text-slate-800 font-serif">
              <Compass className="w-4 h-4 text-[#FF4D00]" />
              <span className="font-bold">North True (TN)</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Scale 1 : 10,000 • Datum: WGS 84
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-emerald-700 font-mono font-bold">
              <Radio className="w-3 h-3 text-[#FF4D00] animate-pulse" />
              <span>Telemetry: 12 Nodes Online</span>
            </div>
          </div>

          {/* Interactive SVG GIS Visualizer with Editorial styling */}
          <div className="w-full h-full flex-1 flex items-center justify-center p-2">
            <svg
              viewBox="0 0 900 550"
              className="w-full h-auto max-h-[520px] select-none filter drop-shadow-sm">
              
              <defs>
                {/* Geological coal patterns */}
                <pattern id="coalSeamPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 0,10 L 20,10 M 10,0 L 10,20" stroke="#CBD5E1" strokeWidth="1" />
                  <circle cx="10" cy="10" r="1.5" fill="#94A3B8" />
                </pattern>

                <linearGradient id="pitDepthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#CBD5E1" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="dangerZoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF4D00" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FF4D00" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Background Grid */}
              <rect x="0" y="0" width="900" height="550" fill="#F8FAFC" />
              {Array.from({ length: 9 }).map((_, i) =>
              <line
                key={`gx-${i}`}
                x1={i * 100}
                y1="0"
                x2={i * 100}
                y2="550"
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="4 4" />

              )}
              {Array.from({ length: 6 }).map((_, i) =>
              <line
                key={`gy-${i}`}
                x1="0"
                y1={i * 100}
                x2="900"
                y2={i * 100}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="4 4" />

              )}

              {/* Layer 1: Leasehold Boundary */}
              {activeLayers.pitBoundary &&
              <g>
                  <polygon
                  points="80,50 820,70 850,480 120,490"
                  fill="url(#coalSeamPattern)"
                  stroke="#64748B"
                  strokeWidth="1.5"
                  strokeDasharray="8 4" />
                
                  <text x="95" y="70" fill="#475569" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
                    MINE LEASEHOLD BOUNDARY (ML AREA: 1,480 HECTARES)
                  </text>
                </g>
              }

              {/* Opencast Quarry Benches vs Underground Panelling */}
              {!isUnderground ? (
              /* Opencast Quarry Geometry */
              <g>
                  {/* Bench 1: Surface Terrace RL +220m */}
                  <polygon
                  points="150,110 750,120 780,430 180,440"
                  fill="url(#pitDepthGradient)"
                  stroke="#94A3B8"
                  strokeWidth="1.5" />
                

                  {/* Bench 2: Intermediate RL +180m */}
                  <polygon
                  points="200,150 700,160 730,390 220,400"
                  fill="#E2E8F0"
                  stroke="#94A3B8"
                  strokeWidth="1.5" />
                

                  {/* Bench 3: Coal Bottom Floor RL +140m */}
                  <polygon
                  points="270,190 640,200 660,340 280,350"
                  fill="#CBD5E1"
                  stroke="#64748B"
                  strokeWidth="1.5" />
                

                  <text x="320" y="270" fill="#0F172A" fontSize="12" fontFamily="serif" fontStyle="italic" fontWeight="bold">
                    Bottom Coal Seam Floor (Pure Anthracite/Bituminous)
                  </text>
                  <text x="320" y="290" fill="#475569" fontSize="9" fontFamily="monospace">
                    RL +140.50m • Thickness: 18.2m • Sump Water Pumped Out: 1.4 MGD
                  </text>
                </g>) : (

              /* Underground Gallery & Board-and-Pillar Network */
              <g>
                  <rect x="180" y="120" width="540" height="300" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                  {/* Shaft Inset */}
                  <circle cx="230" cy="170" r="14" fill="#0F172A" stroke="#FF4D00" strokeWidth="2" />
                  <text x="255" y="174" fill="#0F172A" fontSize="11" fontFamily="mono" fontWeight="bold">
                    Main Downcast Air Shaft #1 (Man-Riding Cage)
                  </text>

                  <circle cx="670" cy="170" r="14" fill="#0F172A" stroke="#2563EB" strokeWidth="2" />
                  <text x="520" y="150" fill="#1E40AF" fontSize="11" fontFamily="mono" fontWeight="bold">
                    Upcast Main Fan Shaft #2
                  </text>

                  {/* Board and Pillar Grid */}
                  {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 7 }).map((_, c) =>
                <rect
                  key={`pillar-${r}-${c}`}
                  x={250 + c * 55}
                  y={210 + r * 45}
                  width="38"
                  height="30"
                  fill="#94A3B8"
                  stroke="#64748B"
                  strokeWidth="1" />

                )
                )}
                  <text x="350" y="405" fill="#334155" fontSize="10" fontFamily="mono" fontWeight="bold">
                    Dip Heading Panel IV (Depillaring Underway with Hydraulic Props)
                  </text>
                </g>)
              }

              {/* Layer 2: Haul Roads (1:16 Ramp gradient) */}
              {activeLayers.haulRoads && !isUnderground &&
              <g>
                  {/* Main Spiral Haul Road */}
                  <path
                  d="M 150,110 Q 750,120 730,390 T 280,350"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="16 4"
                  className="opacity-80" />
                
                  <text x="530" y="240" fill="#1D4ED8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    Main Haul Ramp (1:16 DGMS Compliant)
                  </text>

                  {/* Heavy Dump Trucks in transit */}
                  <circle cx="580" cy="205" r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="380" cy="355" r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                </g>
              }

              {/* Layer 3: Overburden Dumps & Slope Radar */}
              {activeLayers.slopeRadar && !isUnderground &&
              <g>
                  {/* South Overburden Dump */}
                  <path
                  d="M 680,80 Q 840,110 820,280 Q 750,260 680,80 Z"
                  fill="#EF4444"
                  fillOpacity="0.2"
                  stroke="#DC2626"
                  strokeWidth="1.5"
                  strokeDasharray="4 2" />
                
                  <text x="700" y="110" fill="#991B1B" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    OB DUMP #3 (RL +280m)
                  </text>
                  <text x="700" y="125" fill="#DC2626" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    Slope Radar: 2.1mm/hr (Normal)
                  </text>
                </g>
              }

              {/* Layer 4: 500m Blasting Radius Danger Zone */}
              {activeLayers.blastingRadius &&
              <g>
                  <circle
                  cx="480"
                  cy="260"
                  r="140"
                  fill="url(#dangerZoneGradient)"
                  stroke="#EA580C"
                  strokeWidth="1.5"
                  strokeDasharray="6 4" />
                
                  <circle cx="480" cy="260" r="4" fill="#EA580C" />
                  <text x="495" y="265" fill="#C2410C" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    500m Statutory Blasting Danger Perimeter
                  </text>
                </g>
              }

              {/* Layer 5: CAAQMS Environmental Telemetry Sensors */}
              {activeLayers.environmentalSensors &&
              <g>
                  {/* CAAQMS Sensor 1 */}
                  <g
                  className="cursor-pointer"
                  onClick={() =>
                  setSelectedPin({
                    type: "sensor",
                    data: {
                      name: "Continuous Ambient Air Station (CAAQMS North)",
                      pm10: `${selectedMine.telemetry.dustPm10} µg/m³`,
                      pm25: "48.2 µg/m³",
                      so2: "14.5 µg/m³",
                      nox: "28.1 µg/m³",
                      status: "Compliant"
                    }
                  })
                  }>
                  
                    <circle cx="160" cy="90" r="10" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="175" y="94" fill="#047857" fontSize="10" fontFamily="mono" fontWeight="bold">
                      CAAQMS-01 (Air Station)
                    </text>
                  </g>

                  {/* Water Sump Sensor 2 */}
                  <g
                  className="cursor-pointer"
                  onClick={() =>
                  setSelectedPin({
                    type: "sensor",
                    data: {
                      name: "Central Sump Water Discharge Telemetry",
                      ph: selectedMine.telemetry.waterPh,
                      tss: "24 mg/L",
                      cod: "12 mg/L",
                      status: "Compliant"
                    }
                  })
                  }>
                  
                    <circle cx="320" cy="320" r="10" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="335" y="324" fill="#0369A1" fontSize="10" fontFamily="mono" fontWeight="bold">
                      WQMS-Sump (pH: {selectedMine.telemetry.waterPh})
                    </text>
                  </g>
                </g>
              }

              {/* Layer 6: Statutory Violation / Audit Hazard Pins */}
              {activeLayers.inspectionPins &&
              <g>
                  {violations.
                filter((v) => v.mineId === selectedMine.id || selectedMine.id === "M01-GEVRA").
                map((viol, index) => {
                  const posX = 300 + index * 130 % 450;
                  const posY = 170 + index * 75 % 250;
                  const isCritical = viol.severity === "Critical";

                  return (
                    <g
                      key={viol.id}
                      className="cursor-pointer group"
                      onClick={() => setSelectedPin({ type: "violation", data: viol })}>
                      
                          <circle
                        cx={posX}
                        cy={posY}
                        r={isCritical ? "12" : "10"}
                        fill={isCritical ? "#DC2626" : "#F59E0B"}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className={isCritical ? "animate-pulse" : ""} />
                      
                          <text
                        x={posX}
                        y={posY + 4}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold">
                        
                            !
                          </text>
                          <text
                        x={posX + 14}
                        y={posY + 4}
                        fill="#0F172A"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                        className="bg-white">
                        
                            {viol.id}
                          </text>
                        </g>);

                })}
                </g>
              }
            </svg>
          </div>

          {/* Bottom Coordinate Bar */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-300">
            <span>Lat: 22°20'44" N • Long: 82°35'12" E</span>
            <span>Elevation: +240m to +140m MSL</span>
            <span>Colliery Area: {selectedMine.subsidiary} Command Zone</span>
          </div>
        </div>

        {/* Feature Inspector Drawer (Col 1) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-serif italic text-base font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#FF4D00]" />
                <span>Feature Inspector</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Live Spatial Sync</span>
            </div>

            {selectedPin ?
            <div className="space-y-3 text-xs">
                {selectedPin.type === "violation" &&
              <>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-red-700 font-bold">{selectedPin.data.id}</span>
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
                        {selectedPin.data.severity}
                      </span>
                    </div>

                    <strong className="text-slate-900 block font-serif text-sm">
                      {selectedPin.data.clause}
                    </strong>

                    <p className="text-slate-600 text-xs leading-relaxed font-sans">
                      {selectedPin.data.description}
                    </p>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Assigned Inspector:</span>
                        <span className="text-slate-800 font-medium">{selectedPin.data.assignedTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Deadline:</span>
                        <span className="text-red-700 font-bold">{selectedPin.data.statutoryDeadline}</span>
                      </div>
                    </div>

                    {selectedPin.data.actionTaken &&
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px]">
                        <strong className="block font-mono text-[10px] uppercase text-emerald-900">Action Taken:</strong>
                        <span>{selectedPin.data.actionTaken}</span>
                      </div>
                }

                    {onInspectViolation &&
                <button
                  onClick={() => onInspectViolation(selectedPin.data)}
                  className="w-full mt-2 py-2 bg-[#FF4D00] hover:bg-[#e04400] text-white font-mono font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs">
                  
                        <Radio className="w-3.5 h-3.5" />
                        <span>Inspect in AI Sentinel & Draft ATR</span>
                      </button>
                }
                  </>
              }

                {selectedPin.type === "sensor" &&
              <>
                    <div className="flex items-center space-x-2">
                      <Wind className="w-4 h-4 text-emerald-600" />
                      <strong className="text-slate-900 font-serif text-sm">{selectedPin.data.name}</strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {Object.entries(selectedPin.data).
                  filter(([k]) => k !== "name" && k !== "status").
                  map(([key, val]) =>
                  <div key={key} className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <span className="text-slate-500 text-[10px] uppercase block font-bold">{key}</span>
                            <span className="text-slate-900 font-bold">{String(val)}</span>
                          </div>
                  )}
                    </div>

                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
                      Telemetry transmission rate: Every 15 seconds to Central Environment CPCB portal.
                    </div>
                  </>
              }
              </div> :

            <div className="text-center py-10 text-slate-500 space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-xs">
                  Click on any quarry bench, haul road, hazard pin, or CAAQMS telemetry station to inspect statutory metadata.
                </p>
              </div>
            }
          </div>

          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
            DGMS Approved Digital Mine Survey (Scale 1:1000)
          </div>
        </div>
      </div>
    </div>);

};