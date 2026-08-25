import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Radio,
  Compass,
  Wind,
  Info,
  Layers,
  AlertTriangle,
  CheckCircle2,
  X,
  BarChart2,
  Thermometer,
  Droplets,
  Volume2,
  Activity,
} from "lucide-react";
import { MINE_SITES, STATUTORY_VIOLATIONS } from "../data/mockData";

// --------------- Leaflet lazy-load (no SSR issues) ---------------
let L;
const loadLeaflet = () => {
  if (L) return Promise.resolve(L);
  return import("leaflet").then((mod) => {
    L = mod.default;
    // Fix default marker icon path issue with bundlers
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
    return L;
  });
};

// -------- Compliance colour helper --------
const getComplianceColor = (score) => {
  if (score >= 93) return "#10B981"; // green
  if (score >= 85) return "#F59E0B"; // amber
  return "#EF4444"; // red
};

const getSeverityColor = (severity) => {
  if (severity === "Critical") return "#EF4444";
  if (severity === "High") return "#F97316";
  return "#F59E0B";
};

const getStatusBadge = (status) => {
  const map = {
    Operational: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    Restricted_Notice: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  };
  return map[status] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };
};

// -------- Telemetry card --------
const TelemetryRow = ({ icon: Icon, label, value, unit, alert }) => (
  <div className={`flex items-center justify-between p-2 rounded-lg border text-xs ${alert ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
    <div className="flex items-center gap-1.5 text-slate-600">
      <Icon className={`w-3.5 h-3.5 ${alert ? "text-red-500" : "text-slate-400"}`} />
      <span>{label}</span>
    </div>
    <span className={`font-mono font-bold ${alert ? "text-red-700" : "text-slate-900"}`}>
      {value} <span className="text-slate-500 font-normal">{unit}</span>
    </span>
  </div>
);

// ===============================================================
//  MAIN COMPONENT
// ===============================================================
export const GisMineMap = ({ selectedMine, violations, inspections, onInspectViolation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupsRef = useRef({});

  const [activeLayers, setActiveLayers] = useState({
    allMines: true,
    violations: true,
    slopeRadar: true,
    envSensors: true,
    dangerZone: true,
  });

  const [selectedFeature, setSelectedFeature] = useState(null); // { type, data }
  const [mapReady, setMapReady] = useState(false);

  // ---- Init Leaflet map once ----
  useEffect(() => {
    let mapInstance;

    // Inject Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    loadLeaflet().then((Lf) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      mapInstance = Lf.map(mapRef.current, {
        center: [23.5, 84.5],
        zoom: 6,
        zoomControl: true,
        attributionControl: true,
      });

      // Satellite hybrid tile layer
      Lf.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar",
          maxZoom: 18,
        }
      ).addTo(mapInstance);

      // Labels overlay
      Lf.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18, opacity: 0.7 }
      ).addTo(mapInstance);

      mapInstanceRef.current = mapInstance;

      // Initialise empty layer groups
      const groups = {
        allMines: Lf.layerGroup().addTo(mapInstance),
        violations: Lf.layerGroup().addTo(mapInstance),
        slopeRadar: Lf.layerGroup().addTo(mapInstance),
        envSensors: Lf.layerGroup().addTo(mapInstance),
        dangerZone: Lf.layerGroup().addTo(mapInstance),
      };
      layerGroupsRef.current = groups;

      // -------- ALL MINE SITES --------
      MINE_SITES.forEach((mine) => {
        const color = getComplianceColor(mine.complianceScore);
        const isSelected = mine.id === selectedMine.id;

        const circleMarker = Lf.circleMarker([mine.lat, mine.lng], {
          radius: isSelected ? 16 : 11,
          fillColor: color,
          color: "#fff",
          weight: isSelected ? 3 : 2,
          opacity: 1,
          fillOpacity: 0.9,
        });

        const popupHtml = `
          <div style="font-family: 'Courier New', monospace; font-size: 11px; min-width: 200px;">
            <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px; color: #0f172a;">${mine.name}</div>
            <div style="color: #64748b; margin-bottom: 6px;">${mine.subsidiary} · ${mine.state}</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748b;">Compliance</span>
              <span style="color: ${color}; font-weight: bold;">${mine.complianceScore}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748b;">Violations</span>
              <span style="color: #ef4444; font-weight: bold;">${mine.activeViolations}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">Status</span>
              <span style="font-weight: bold;">${mine.status}</span>
            </div>
          </div>`;

        circleMarker.bindPopup(popupHtml, { maxWidth: 260 });
        circleMarker.on("click", () => {
          setSelectedFeature({ type: "mine", data: mine });
        });

        // Star rating label
        const stars = "★".repeat(mine.starRating) + "☆".repeat(5 - mine.starRating);
        const labelIcon = Lf.divIcon({
          className: "",
          html: `<div style="background: rgba(15,23,42,0.85); color: #fff; font-family: monospace; font-size: 9px; padding: 2px 5px; border-radius: 4px; white-space: nowrap; margin-top: -2px; backdrop-filter: blur(4px);">${mine.subsidiary} ${stars}</div>`,
          iconAnchor: [-14, 5],
        });
        Lf.marker([mine.lat, mine.lng], { icon: labelIcon, interactive: false }).addTo(groups.allMines);

        circleMarker.addTo(groups.allMines);
      });

      // -------- VIOLATION PINS --------
      STATUTORY_VIOLATIONS.forEach((v) => {
        if (!v.geoTag?.lat) return;
        const color = getSeverityColor(v.severity);
        const icon = Lf.divIcon({
          className: "",
          html: `<div style="width:22px; height:22px; background:${color}; border:2px solid #fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; color:#fff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">!</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        const marker = Lf.marker([v.geoTag.lat, v.geoTag.lng], { icon });
        marker.on("click", () => setSelectedFeature({ type: "violation", data: v }));
        marker.addTo(groups.violations);
      });

      // -------- SLOPE RADAR CIRCLES --------
      MINE_SITES.filter((m) => m.telemetry.slopeDisplacementMm > 3).forEach((mine) => {
        const alert = mine.telemetry.slopeDisplacementMm > 10;
        const circle = Lf.circle([mine.lat, mine.lng], {
          radius: 1200,
          color: alert ? "#DC2626" : "#F59E0B",
          weight: 1.5,
          fillColor: alert ? "#DC2626" : "#F59E0B",
          fillOpacity: 0.08,
          dashArray: "6 4",
        });
        circle.bindTooltip(
          `Slope Radar: ${mine.telemetry.slopeDisplacementMm} mm/hr${alert ? " ⚠ ALERT" : ""}`,
          { sticky: true }
        );
        circle.addTo(groups.slopeRadar);
      });

      // -------- ENV SENSOR MARKERS --------
      MINE_SITES.forEach((mine) => {
        const dust = mine.telemetry.dustPm10;
        const alert = dust > 100;
        const icon = Lf.divIcon({
          className: "",
          html: `<div style="width:14px; height:14px; background:${alert ? "#22c55e" : "#22c55e"}; border:2px solid #fff; border-radius:3px; box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const m = Lf.marker([mine.lat + 0.01, mine.lng - 0.012], { icon });
        m.bindTooltip(`CAAQMS: PM10 ${dust} µg/m³${alert ? " ⚠ EXCEEDS NAAQS" : " ✓"}`, { sticky: true });
        m.on("click", () =>
          setSelectedFeature({
            type: "sensor",
            data: {
              mineName: mine.name,
              pm10: dust,
              waterPh: mine.telemetry.waterPh,
              noise: mine.telemetry.noiseDb,
              slope: mine.telemetry.slopeDisplacementMm,
              methane: mine.telemetry.methanePct || null,
            },
          })
        );
        m.addTo(groups.envSensors);
      });

      // -------- 500m BLASTING ZONES --------
      MINE_SITES.forEach((mine) => {
        const circle = Lf.circle([mine.lat, mine.lng], {
          radius: 500,
          color: "#FF4D00",
          weight: 1,
          fillColor: "#FF4D00",
          fillOpacity: 0.04,
          dashArray: "4 4",
        });
        circle.bindTooltip("500m Statutory Blasting Danger Zone (CMR Reg 160)", { sticky: true });
        circle.addTo(groups.dangerZone);
      });

      setMapReady(true);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // eslint-disable-line

  // ---- Fly to selected mine when prop changes ----
  useEffect(() => {
    if (mapInstanceRef.current && selectedMine) {
      mapInstanceRef.current.flyTo([selectedMine.lat, selectedMine.lng], 12, {
        animate: true,
        duration: 1.2,
      });
      setSelectedFeature({ type: "mine", data: selectedMine });
    }
  }, [selectedMine]);

  // ---- Toggle layer groups ----
  useEffect(() => {
    if (!mapReady) return;
    const groups = layerGroupsRef.current;
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.entries(activeLayers).forEach(([key, visible]) => {
      if (!groups[key]) return;
      if (visible) {
        if (!map.hasLayer(groups[key])) map.addLayer(groups[key]);
      } else {
        if (map.hasLayer(groups[key])) map.removeLayer(groups[key]);
      }
    });
  }, [activeLayers, mapReady]);

  const toggleLayer = (key) =>
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  // -------- LAYER PILLS --------
  const layerPills = [
    { key: "allMines", label: "Mine Sites", activeClass: "bg-emerald-600 text-white border-emerald-700" },
    { key: "violations", label: "Violations", activeClass: "bg-red-500 text-white border-red-700" },
    { key: "slopeRadar", label: "Slope Radar", activeClass: "bg-amber-500 text-white border-amber-700" },
    { key: "envSensors", label: "CAAQMS Sensors", activeClass: "bg-teal-600 text-white border-teal-700" },
    { key: "dangerZone", label: "500m Danger Zone", activeClass: "bg-orange-600 text-white border-orange-700" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-widest text-[#E64A19] uppercase font-bold">
                Live Spatial Cadastre · Satellite Imagery
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                CMR 2017 Reg 64
              </span>
            </div>
            <h2 className="text-xl font-serif italic text-slate-900">
              {selectedMine.name} — Interactive GIS Command Map
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Real-time mine surveillance with violation overlays, slope stability telemetry &amp; CAAQMS sensors across {MINE_SITES.length} CIL projects.
            </p>
          </div>

          {/* Layer Switcher */}
          <div className="flex flex-wrap gap-1.5">
            {layerPills.map(({ key, label, activeClass }) => (
              <button
                key={key}
                onClick={() => toggleLayer(key)}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                  activeLayers[key]
                    ? activeClass
                    : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3 relative rounded-xl overflow-hidden border border-slate-300 shadow-sm" style={{ height: 560 }}>
          {/* Compass overlay */}
          <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md border border-slate-200 rounded-lg p-2.5 shadow-md text-xs space-y-1 pointer-events-none">
            <div className="flex items-center gap-1.5 font-serif text-slate-800">
              <Compass className="w-4 h-4 text-[#FF4D00]" />
              <span className="font-bold">True North</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">WGS 84 · EPSG 4326</div>
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700">
              <Radio className="w-3 h-3 text-[#FF4D00] animate-pulse" />
              Live Telemetry
            </div>
          </div>

          {/* Legend overlay */}
          <div className="absolute bottom-6 left-4 z-[1000] bg-white/90 backdrop-blur-md border border-slate-200 rounded-lg p-2.5 shadow-md text-[10px] font-mono space-y-1">
            <div className="text-slate-500 font-bold uppercase tracking-wide mb-1">Compliance Score</div>
            {[["≥93%", "#10B981"], ["85–92%", "#F59E0B"], ["<85%", "#EF4444"]].map(([label, color]) => (
              <div key={label} className="flex items-center gap-2">
                <span style={{ background: color }} className="w-3 h-3 rounded-full inline-block shrink-0" />
                <span className="text-slate-700">{label}</span>
              </div>
            ))}
            <div className="border-t border-slate-200 mt-1.5 pt-1.5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold text-xs">!</span>
                <span className="text-slate-700">Critical violation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold text-xs">!</span>
                <span className="text-slate-700">Medium/High violation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-teal-500 rounded-sm inline-block shrink-0" />
                <span className="text-slate-700">CAAQMS sensor</span>
              </div>
            </div>
          </div>

          {/* Loading placeholder */}
          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-[999]">
              <div className="text-center space-y-2">
                <Layers className="w-8 h-8 text-slate-400 mx-auto animate-pulse" />
                <p className="text-xs text-slate-500 font-mono">Loading satellite tiles…</p>
              </div>
            </div>
          )}

          {/* Leaflet map container */}
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Feature Inspector */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
            <h3 className="font-serif italic text-base font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#FF4D00]" />
              Feature Inspector
            </h3>
            {selectedFeature && (
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1 p-4">
            {!selectedFeature && (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 text-slate-500 space-y-2">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs leading-relaxed">
                  Click any mine site, violation pin, or sensor on the map to inspect its statutory metadata.
                </p>
              </div>
            )}

            {/* MINE DETAIL */}
            {selectedFeature?.type === "mine" && (() => {
              const mine = selectedFeature.data;
              const badge = getStatusBadge(mine.status);
              return (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {mine.status}
                    </span>
                    <h4 className="font-serif font-bold text-slate-900 text-sm mt-1.5 leading-tight">{mine.name}</h4>
                    <p className="text-slate-500 font-mono">{mine.subsidiary} · {mine.state} · {mine.district}</p>
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-center">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Compliance</div>
                      <div className="text-lg font-bold" style={{ color: getComplianceColor(mine.complianceScore) }}>{mine.complianceScore}%</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-center">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Star Rating</div>
                      <div className="text-base font-bold text-amber-500">{"★".repeat(mine.starRating)}{"☆".repeat(5 - mine.starRating)}</div>
                    </div>
                  </div>

                  {/* Production */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Type</span>
                      <span className="font-bold text-slate-900">{mine.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">EC Capacity</span>
                      <span className="font-bold text-slate-900">{mine.ecCapMTPA} MTPA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Production</span>
                      <span className="font-bold text-[#FF4D00]">{mine.currentProductionMT} MT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Violations</span>
                      <span className={`font-bold ${mine.activeViolations > 2 ? "text-red-700" : "text-amber-600"}`}>{mine.activeViolations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Inspection</span>
                      <span className="font-bold text-slate-900">{mine.lastInspectionDate}</span>
                    </div>
                  </div>

                  {/* Telemetry */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono font-bold uppercase text-slate-500">Live Telemetry</p>
                    <TelemetryRow icon={Activity} label="PM10 Dust" value={mine.telemetry.dustPm10} unit="µg/m³" alert={mine.telemetry.dustPm10 > 100} />
                    <TelemetryRow icon={Droplets} label="Water pH" value={mine.telemetry.waterPh} unit="pH" alert={mine.telemetry.waterPh < 6.5 || mine.telemetry.waterPh > 8.5} />
                    <TelemetryRow icon={BarChart2} label="Slope Disp." value={mine.telemetry.slopeDisplacementMm} unit="mm/hr" alert={mine.telemetry.slopeDisplacementMm > 10} />
                    <TelemetryRow icon={Volume2} label="Noise" value={mine.telemetry.noiseDb} unit="dB" alert={mine.telemetry.noiseDb > 75} />
                    {mine.telemetry.methanePct != null && (
                      <TelemetryRow icon={Thermometer} label="CH₄ (Methane)" value={mine.telemetry.methanePct} unit="%" alert={mine.telemetry.methanePct > 0.5} />
                    )}
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono border-t border-slate-200 pt-2">
                    <div>Manager: {mine.manager}</div>
                    <div>Safety Officer: {mine.safetyOfficer}</div>
                    <div>Lat: {mine.lat}° N · Lng: {mine.lng}° E</div>
                  </div>
                </div>
              );
            })()}

            {/* VIOLATION DETAIL */}
            {selectedFeature?.type === "violation" && (() => {
              const v = selectedFeature.data;
              return (
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-red-700 font-bold">{v.id}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${v.severity === "Critical" ? "bg-red-50 text-red-700 border-red-200" : v.severity === "High" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                        {v.severity}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-slate-900 text-sm leading-tight">{v.clause}</h4>
                    <p className="text-slate-500 font-mono text-[10px] mt-0.5">{v.mineName} · {v.subsidiary}</p>
                  </div>

                  <p className="text-slate-700 leading-relaxed text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2.5">{v.description}</p>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between"><span className="text-slate-500">Authority</span><span className="font-bold text-slate-900">{v.issuingAuthority}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-bold text-slate-900">{v.status.replace(/_/g, " ")}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Deadline</span><span className="font-bold text-red-700">{v.statutoryDeadline}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Notice Ref</span><span className="text-slate-700 text-[9px]">{v.noticeRef}</span></div>
                    {v.geoTag && <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="text-slate-700">{v.geoTag.bench}</span></div>}
                  </div>

                  {v.actionTaken && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-emerald-800 text-[11px]">
                      <p className="font-mono font-bold text-[9px] uppercase text-emerald-900 mb-1">Action Taken:</p>
                      {v.actionTaken}
                    </div>
                  )}

                  {onInspectViolation && (
                    <button
                      onClick={() => onInspectViolation(v)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-[#FF4D00] hover:bg-[#e04400] text-white font-mono font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      Analyse in AI Sentinel &amp; Draft ATR
                    </button>
                  )}
                </div>
              );
            })()}

            {/* SENSOR DETAIL */}
            {selectedFeature?.type === "sensor" && (() => {
              const s = selectedFeature.data;
              return (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-teal-600" />
                    <h4 className="font-serif font-bold text-slate-900 text-sm">CAAQMS Station</h4>
                  </div>
                  <p className="text-slate-600 font-mono text-[10px]">{s.mineName}</p>

                  <div className="space-y-1.5">
                    <TelemetryRow icon={Activity} label="PM10 Dust" value={s.pm10} unit="µg/m³" alert={s.pm10 > 100} />
                    <TelemetryRow icon={Droplets} label="Water pH" value={s.waterPh} unit="pH" alert={s.waterPh < 6.5} />
                    <TelemetryRow icon={Volume2} label="Noise" value={s.noise} unit="dB" alert={s.noise > 75} />
                    <TelemetryRow icon={BarChart2} label="Slope Disp." value={s.slope} unit="mm/hr" alert={s.slope > 10} />
                    {s.methane != null && <TelemetryRow icon={Thermometer} label="CH₄" value={s.methane} unit="%" alert={s.methane > 0.5} />}
                  </div>

                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-2.5 text-teal-800 text-[10px] font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                    Telemetry updates every 15 seconds · CPCB Central Server sync active
                  </div>
                  {s.pm10 > 100 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-red-700 text-[10px] font-mono">
                      <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                      PM10 exceeds NAAQS 24-hr limit of 100 µg/m³!
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <div className="border-t border-slate-200 p-3 text-[10px] text-slate-500 font-mono shrink-0">
            DGMS Approved Digital Survey · Scale 1:10,000 · WGS 84
          </div>
        </div>
      </div>

      {/* Stats bar below map */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Mines Monitored", value: MINE_SITES.length, sub: "CIL Pan-India", color: "text-slate-900" },
          { label: "Active Violations", value: MINE_SITES.reduce((a, m) => a + m.activeViolations, 0), sub: "Across all sites", color: "text-red-600" },
          { label: "Avg. Compliance", value: (MINE_SITES.reduce((a, m) => a + m.complianceScore, 0) / MINE_SITES.length).toFixed(1) + "%", sub: "CIL portfolio avg", color: "text-emerald-600" },
          { label: "Selected Mine", value: selectedMine.complianceScore + "%", sub: selectedMine.name.split(" ").slice(0, 2).join(" "), color: "text-[#FF4D00]" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};