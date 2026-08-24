import React, { useState } from "react";

import {
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  Award,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sparkles,

  HardHat,
  Eye } from
"lucide-react";










export const CommandHub = ({
  currentRole,
  selectedMine,
  allMines,
  violations,
  onSelectMine,
  onNavigateTab
}) => {
  const [filterCategory, setFilterCategory] = useState("ALL");

  // Calculate aggregates
  const totalProduction = allMines.reduce((acc, m) => acc + m.currentProductionMT, 0);
  const totalEcCap = allMines.reduce((acc, m) => acc + m.ecCapMTPA, 0);
  const avgCompliance = Math.round(
    allMines.reduce((acc, m) => acc + m.complianceScore, 0) / allMines.length
  );
  const openViolationsCount = violations.filter(
    (v) => v.status === "Open" || v.status === "Escalated_Level2" || v.status === "Escalated_Level3"
  ).length;
  const criticalViolations = violations.filter((v) => v.severity === "Critical");

  const filteredViolations =
  filterCategory === "ALL" ?
  violations :
  violations.filter((v) => v.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Editorial Lead Section Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#E64A19]">
              {currentRole === "mine_official" && "Colliery Operational Authority"}
              {currentRole === "corporate_hq" && "Corporate Governance Division"}
              {currentRole === "regulatory_authority" && "DGMS Statutory Surveillance Desk"}
              {currentRole === "safety_officer" && "Lead Safety & Audit Directorate"}
              {currentRole === "contractor_supervisor" && "Contractor Operations Desk"}
            </span>
            <span className="w-2 h-2 bg-[#FF4D00] rounded-full animate-pulse"></span>
          </div>

          <h2 className="font-serif italic text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {currentRole === "mine_official" ?
            `${selectedMine.name} (${selectedMine.subsidiary}) — Statutory Safety & Production Health` :
            "Pan-India Coal Mining Governance & Statutory Compliance Index"}
          </h2>

          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            Zero fatal incident mandate, 100% biometric Form-B digital registers, continuous CAAQMS environmental telemetry, and real-time EC extraction cap adherence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab("field_inspection")}
            className="px-4 py-2.5 bg-[#FF4D00] hover:bg-[#e04400] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center space-x-2 shadow-xs">
            
            <HardHat className="w-4 h-4" />
            <span>Launch Geo-Inspection</span>
          </button>
          <button
            onClick={() => onNavigateTab("ai_sentinel")}
            className="px-4 py-2.5 bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center space-x-2 shadow-2xs">
            
            <Sparkles className="w-4 h-4 text-[#E64A19]" />
            <span>AI Risk Radar</span>
          </button>
        </div>
      </div>

      {/* 4 Core Editorial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Statutory Compliance
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-serif italic text-3xl font-bold text-slate-900">
              {currentRole === "mine_official" ? selectedMine.complianceScore : avgCompliance}%
            </span>
            <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +2.8% MoM
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between font-medium">
            <span>Ministry Star Rating:</span>
            <div className="flex items-center text-amber-500">
              {Array.from({ length: selectedMine.starRating }).map((_, i) =>
              <Award key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              )}
              <span className="ml-1 text-[11px] font-mono font-bold text-slate-800">
                ({selectedMine.starRating}-Star)
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-red-500 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Statutory Notices
            </span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-serif italic text-3xl font-bold text-slate-900">
              {currentRole === "mine_official" ? selectedMine.activeViolations : openViolationsCount}
            </span>
            <span className="text-[11px] font-mono text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
              {criticalViolations.length} Critical
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between font-medium">
            <span>Action Taken Reports:</span>
            <span className="text-[#E64A19] font-mono font-bold">2 ATRs due &lt; 7d</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-[#FF4D00] rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Production / EC Cap
            </span>
            <Activity className="w-5 h-5 text-[#E64A19]" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="font-serif italic text-3xl font-bold text-slate-900">
              {currentRole === "mine_official" ?
              `${selectedMine.currentProductionMT} MT` :
              `${totalProduction.toFixed(1)} MT`}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / {currentRole === "mine_official" ? selectedMine.ecCapMTPA : totalEcCap} MTPA
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between font-medium">
            <span>Capacity Util:</span>
            <span className="text-emerald-700 font-mono font-bold">
              {Math.round(
                (currentRole === "mine_official" ? selectedMine.currentProductionMT : totalProduction) / (
                currentRole === "mine_official" ? selectedMine.ecCapMTPA : totalEcCap) *
                100
              )}
              % (Compliant)
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              Pit Sensors Telemetry
            </span>
            <Flame className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">Dust PM10</span>
              <span className="font-mono font-bold text-slate-900">
                {selectedMine.telemetry.dustPm10} µg/m³
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">Slope Radar</span>
              <span
                className={`font-mono font-bold ${
                selectedMine.telemetry.slopeDisplacementMm > 10 ? "text-red-700 font-extrabold" : "text-emerald-700"}`
                }>
                
                {selectedMine.telemetry.slopeDisplacementMm} mm
              </span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between font-mono font-semibold">
            <span>pH: {selectedMine.telemetry.waterPh}</span>
            <span>Noise: {selectedMine.telemetry.noiseDb} dB</span>
          </div>
        </div>
      </div>

      {/* Grid: Benchmarking League Table + Statutory Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table View */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-serif italic text-2xl text-slate-900">
                  Subsidiary & Colliery Benchmark Index
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audit ranks based on DGMS notices, MoEFCC compliance filings, and Ministry 5-Star parameters.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("gis_map")}
                className="text-[10px] uppercase tracking-wider border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 hover:bg-slate-100 transition-all flex items-center space-x-1 font-bold shadow-2xs">
                
                <span>GIS Spatial View</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-[#FF4D00]" />
              </button>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    <th className="pb-3">Colliery</th>
                    <th className="pb-3">Subsidiary</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Star Rating</th>
                    <th className="pb-3">Compliance</th>
                    <th className="pb-3">Notices</th>
                    <th className="pb-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100">
                  {allMines.map((mine) => {
                    const isSelected = mine.id === selectedMine.id;
                    return (
                      <tr
                        key={mine.id}
                        onClick={() => onSelectMine(mine.id)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        isSelected ? "bg-orange-50/70" : ""}`
                        }>
                        
                        <td className="py-3.5 font-medium text-slate-900 flex items-center space-x-2.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                            mine.status === "Operational" ?
                            "bg-emerald-500" :
                            mine.status === "Restricted_Notice" ?
                            "bg-red-500 animate-pulse" :
                            "bg-[#FF4D00]"}`
                            } />
                          
                          <span className="truncate max-w-[160px] font-semibold">{mine.name}</span>
                        </td>
                        <td className="py-3 font-mono text-[11px] text-slate-600 font-medium">
                          {mine.subsidiary}
                        </td>
                        <td className="py-3 text-slate-500 font-medium">{mine.type}</td>
                        <td className="py-3 font-mono text-amber-600 font-bold">
                          {mine.starRating}★
                        </td>
                        <td className="py-3 font-mono font-bold text-slate-900">
                          {mine.complianceScore}%
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded border ${
                            mine.activeViolations === 0 ?
                            "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            mine.activeViolations > 3 ?
                            "bg-red-50 text-red-700 border-red-200" :
                            "bg-amber-50 text-amber-700 border-amber-200"}`
                            }>
                            
                            {mine.activeViolations} Active
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectMine(mine.id);
                              onNavigateTab("gis_map");
                            }}
                            className="p-1 hover:text-[#FF4D00] text-slate-400 hover:bg-slate-100 rounded transition-colors">
                            
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>);

                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] font-medium">8 Subsidiaries Monitored</span>
            <button
              onClick={() => onNavigateTab("statutory_registers")}
              className="text-[#E64A19] hover:underline font-mono text-[11px] font-bold">
              
              Open Form IV / IX Registers →
            </button>
          </div>
        </div>

        {/* Right Side: Legal Timers */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-serif italic text-2xl text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FF4D00]" />
                <span>Statutory Expiries</span>
              </h3>
              <span className="text-[9px] uppercase tracking-widest text-red-700 font-bold border border-red-200 bg-red-50 px-2 py-0.5 rounded">
                Strict Timers
              </span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="p-4 bg-slate-50 border-l-4 border-red-500 rounded-r-xl border border-slate-200">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-red-700 uppercase font-bold tracking-widest">DGMS Sec 22(3)</span>
                  <span className="font-mono text-red-700 font-bold">14 Days Due</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  Rajmahal OCP: Haul Road 1:16 Gradient Rectification ATR
                </p>
                <p className="text-xs text-slate-600 mt-1 font-sans">
                  Assigned: Er. Subroto Mukherjee • Requires drone orthophoto survey submission.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border-l-4 border-amber-500 rounded-r-xl border border-slate-200">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-amber-800 uppercase font-bold tracking-widest">MoEFCC EC Clearance</span>
                  <span className="font-mono text-amber-800 font-bold">6 Days Due</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  Gevra Mega OC: CAAQMS 6-Month Telemetry Audit
                </p>
                <p className="text-xs text-slate-600 mt-1 font-sans">
                  Assigned: Nodal Environment Officer (SECL) • PARIVESH upload pending.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border-l-4 border-blue-500 rounded-r-xl border border-slate-200">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-blue-800 uppercase font-bold tracking-widest">SPCB CTO Renewal</span>
                  <span className="font-mono text-blue-800 font-bold">28 Days</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  Kusmunda OCP: Effluent Discharge ETP Quality Test
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={() => onNavigateTab("workflow_audit")}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all shadow-2xs">
              
              View Escalation Matrix & CAPA Logs
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Live Violations & Corrective Action Feed */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-serif italic text-2xl text-slate-900">
              Statutory Hazards & Corrective Actions Feed
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live geo-tagged observation entries under Coal Mines Regulations 2017 & Mines Act 1952.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 border border-slate-200 rounded-lg p-1 bg-slate-50 text-xs">
            {["ALL", "Safety_DGMS", "Environment_MoEFCC", "Labour_MinesAct"].map((cat) =>
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded transition-all ${
              filterCategory === cat ?
              "bg-[#FF4D00] text-white shadow-2xs" :
              "text-slate-600 hover:text-slate-900"}`
              }>
              
                {cat === "ALL" ? `All (${violations.length})` : cat.replace("_", " ")}
              </button>
            )}
          </div>
        </div>

        {/* Violations Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredViolations.map((v) =>
          <div
            key={v.id}
            className={`p-5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs ${
            v.severity === "Critical" ?
            "border-l-4 border-l-red-500" :
            v.severity === "High" ?
            "border-l-4 border-l-amber-500" :
            "border-l-4 border-l-blue-500"}`
            }>
            
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500 text-[11px] font-bold">{v.id}</span>
                  <span
                  className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                  v.severity === "Critical" ?
                  "text-red-700 bg-red-50 border-red-200" :
                  v.severity === "High" ?
                  "text-amber-700 bg-amber-50 border-amber-200" :
                  "text-blue-700 bg-blue-50 border-blue-200"}`
                  }>
                  
                    {v.severity}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-2 font-serif">
                  {v.mineName} ({v.subsidiary})
                </h4>
                <div className="text-xs font-mono text-[#E64A19] font-bold mt-0.5">
                  {v.clause}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-sans">
                  {v.description}
                </p>

                {v.actionTaken &&
              <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs">
                    <span className="text-emerald-800 block font-bold text-[11px] uppercase tracking-wider">
                      ATR Status:
                    </span>
                    <span className="text-slate-700 font-sans text-xs">{v.actionTaken}</span>
                  </div>
              }
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] flex items-center justify-between text-slate-500">
                <span>Due: <strong className="text-slate-900 font-mono">{v.statutoryDeadline}</strong></span>
                <span
                className={`font-bold ${
                v.status === "Verified_Closed" ?
                "text-emerald-700" :
                v.status === "ATR_Submitted" ?
                "text-blue-700" :
                "text-red-700"}`
                }>
                
                  {v.status.replace("_", " ")}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

};