import React, { useState } from "react";

import { STATUTORY_FORM_B_DATA } from "../data/mockData";
import {
  FileText,
  Users,
  HardHat,
  ShieldCheck,
  Leaf,
  Award,
  Download,
  Search } from






"lucide-react";





export const StatutoryRegisters = ({
  selectedMine
}) => {
  const [activeRegister, setActiveRegister] = useState(

    "form_b");

  const [searchQuery, setSearchQuery] = useState("");

  // 5-Star rating parameter sliders state
  const [starParameters, setStarParameters] = useState({
    miningPlanAdherence: 95,
    environmentalProtection: 88,
    rehabilitationAfforestation: 82,
    communityWelfareCsr: 90,
    safetyRecordAccidentFree: 96
  });

  const overallStarScore = Math.round(
    Object.values(starParameters).reduce((a, b) => a + b, 0) / 5
  );

  const calculatedStars =
  overallStarScore >= 90 ? 5 : overallStarScore >= 80 ? 4 : overallStarScore >= 70 ? 3 : 2;

  const filteredFormB = STATUTORY_FORM_B_DATA.filter(
    (w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-[#E64A19]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono tracking-widest text-[#E64A19] uppercase font-bold">
                Paperless Statutory Mining Governance
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                Mines Act 1952 / CMR 2017
              </span>
            </div>
            <h2 className="text-xl font-serif italic text-slate-900 mt-1">
              Digital Statutory Registers & Ministry Returns
            </h2>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Mandatory digital logs replacing physical leather-bound colliery ledgers with cryptographic auditability for{" "}
              <strong className="text-slate-900 font-semibold">{selectedMine.name} ({selectedMine.subsidiary})</strong>.
            </p>
          </div>
        </div>

        {/* Export / Download Button */}
        <button
          onClick={() => {
            alert(
              `Statutory Digital Register (${activeRegister.toUpperCase()}) compiled for ${selectedMine.name}. Signed with Digital Key.`
            );
          }}
          className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 px-4 py-2 rounded-lg text-xs font-mono font-bold shadow-2xs transition-all cursor-pointer">
          
          <Download className="w-4 h-4 text-[#E64A19]" />
          <span>Export DGMS Form PDF</span>
        </button>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-mono">
        {[
        { id: "form_b", label: "Form B (Worker & PME Register)", icon: Users },
        { id: "form_iv", label: "Form IV (Accidents & Occurrences)", icon: HardHat },
        { id: "form_ix", label: "Form IX (Statutory Inspection Register)", icon: ShieldCheck },
        { id: "moefcc_enviro", label: "MoEFCC Half-Yearly Environmental ATR", icon: Leaf },
        { id: "star_rating", label: "Ministry 5-Star Rating Self-Evaluation", icon: Award }].
        map((tab) => {
          const Icon = tab.icon;
          const isActive = activeRegister === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveRegister(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
              isActive ?
              "bg-[#FF4D00] text-white shadow-xs" :
              "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`
              }>
              
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>);

        })}
      </div>

      {/* Dynamic Content Views */}
      {activeRegister === "form_b" &&
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-serif font-semibold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF4D00]" />
                <span>Form B: Digital Register of Mine Employees & Contractor Labour</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Rule 48 & 77 of Mines Rules 1955. Real-time verification of PME medical validity, VTC safety certificates, and biometric entry authorization.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
              type="text"
              placeholder="Search worker by name, ID or trade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#FF4D00] w-64 shadow-2xs" />
            
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 font-mono text-[11px] border-b border-slate-200 font-bold">
                  <th className="pb-3">Worker ID</th>
                  <th className="pb-3">Full Name</th>
                  <th className="pb-3">Category / Trade</th>
                  <th className="pb-3">Contractor Agency</th>
                  <th className="pb-3">Aadhaar (Masked)</th>
                  <th className="pb-3">PME Validity</th>
                  <th className="pb-3">VTC Safety Cert</th>
                  <th className="pb-3">Gate Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFormB.map((w) =>
              <tr key={w.workerId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#E64A19]">{w.workerId}</td>
                    <td className="py-3 font-medium text-slate-900 font-serif">{w.name}</td>
                    <td className="py-3 text-slate-700">{w.category.replace("_", " ")}</td>
                    <td className="py-3 text-slate-600">{w.contractorName}</td>
                    <td className="py-3 font-mono text-slate-500">{w.aadhaarMasked}</td>
                    <td className="py-3 font-mono">
                      <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                    w.status === "PME_Overdue_Blocked" ?
                    "bg-red-50 text-red-700 border-red-200" :
                    "bg-slate-50 text-slate-700 border-slate-200"}`
                    }>
                    
                        Due: {w.pmeNextDue}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-600">{w.vtcCertificateNo}</td>
                    <td className="py-3">
                      <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                    w.status === "Active_Authorized" ?
                    "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    "bg-red-50 text-red-700 border-red-200"}`
                    }>
                    
                        {w.status === "Active_Authorized" ? "Authorized" : "Blocked (PME Expired)"}
                      </span>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      }

      {activeRegister === "form_iv" &&
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-serif font-semibold text-slate-900 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-[#FF4D00]" />
                <span>Form IV: Register of Accidents, Dangerous Occurrences & Near Misses</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Coal Mines Regulations 2017 (CMR 2017) Regulation 8 & 9. Statutory notification within 24 hours to DGMS.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
              Zero Fatalities Recorded in 2026
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-[#E64A19]">INC-2026-0819-NM (Near Miss)</span>
                <span className="text-slate-500">Date: 19-AUG-2026 14:15 IST</span>
              </div>
              <strong className="text-slate-900 block font-serif text-sm">
                Rerouted Haul Dumper (240T CAT-793) Berm Contact during Monsoon Slush
              </strong>
              <p className="text-slate-600 leading-relaxed font-sans">
                Rear left tyre touched safety parapet berm on East Ramp #4. No personnel injury, zero structural damage. 
                Investigation confirmed speed within 18 km/h limit. Additional gravel capping laid immediately.
              </p>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] font-mono text-emerald-700 font-bold">
                <span>Inquiry Officer: Er. S. P. Bagchi (DGMS Certified Manager)</span>
                <span>Status: Formal Root-Cause Closed</span>
              </div>
            </div>
          </div>
        </div>
      }

      {activeRegister === "form_ix" &&
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-serif font-semibold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF4D00]" />
                <span>Form IX: Statutory Register of Inspections by Official Workpersons & Inspectors</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Rule 29Q of Mines Rules 1955. Counter-signed by Mine Agent and Statutory Manager with SHA-256 digital seals.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-300 text-xs font-mono font-bold">
              100% Counter-Signed
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-[#E64A19]">INSP-DGMS-CZ-2026-104</span>
                <span className="text-slate-500">Date: 14-AUG-2026</span>
              </div>
              <strong className="text-slate-900 block font-serif text-sm">
                Statutory Half-Yearly Safety Audit — DGMS Central Zone Directorate
              </strong>
              <p className="text-slate-600 leading-relaxed font-sans">
                Inspected highwall benches, electrical substation grounding (IS 3043 standard), explosive magazine lightning conductors, and worker vocational training centre.
              </p>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] font-mono text-slate-500">
                <span>Inspector: Shri A. K. Mandal, Dy. Director of Mines Safety</span>
                <span className="text-emerald-700 font-bold">Cryptographically Countersigned (Class-3 DSC)</span>
              </div>
            </div>
          </div>
        </div>
      }

      {activeRegister === "moefcc_enviro" &&
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-serif font-semibold text-slate-900 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>MoEFCC Environmental Clearance (EC) Half-Yearly Compliance ATR</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                EIA Notification 2006 compliance return. Real-time telemetry linkage with Central Pollution Control Board (CPCB) server.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
              EC Cap: {selectedMine.ecCapMTPA} MTPA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-700 font-mono">Specific Condition #1</span>
              <h4 className="font-serif font-semibold text-slate-900">Green Belt Plantation & Compensatory Afforestation</h4>
              <p className="text-slate-600 text-xs leading-relaxed font-sans">
                2,50,000 saplings planted along external overburden dump slopes and 50m peripheral lease boundary. Native species survival rate verified at 86.4%.
              </p>
              <div className="font-mono text-[11px] text-emerald-700 font-bold pt-1">
                ✓ Verified by State Forest Dept GIS Drone Survey
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-700 font-mono">Specific Condition #2</span>
              <h4 className="font-serif font-semibold text-slate-900">Continuous Ambient Air Quality Monitoring (CAAQMS)</h4>
              <p className="text-slate-600 text-xs leading-relaxed font-sans">
                4 continuous automated monitoring stations operating 24x7 with live telemetry feed to SPCB/CPCB portal. PM10 maintained under 100 µg/m³.
              </p>
              <div className="font-mono text-[11px] text-emerald-700 font-bold pt-1">
                ✓ 99.4% Uptime Recorded on Server Link
              </div>
            </div>
          </div>
        </div>
      }

      {activeRegister === "star_rating" &&
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-serif font-semibold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Ministry of Coal 5-Star Rating Digital Self-Evaluation</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Annual star rating module for sustainable mining under the Ministry of Coal guidelines.
              </p>
            </div>

            {/* Calculated Stars Box */}
            <div className="flex items-center space-x-3 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-xs font-mono">
              <div className="flex text-amber-500">
                {Array.from({ length: calculatedStars }).map((_, i) =>
              <Award key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              )}
              </div>
              <span className="font-bold text-slate-900 text-sm">
                Score: {overallStarScore}% ({calculatedStars}-Star Projected)
              </span>
            </div>
          </div>

          {/* Interactive Parameters Sliders */}
          <div className="space-y-4 text-xs font-mono">
            {Object.entries(starParameters).map(([key, value]) => {
            const label = key.
            replace(/([A-Z])/g, " $1").
            replace(/^./, (str) => str.toUpperCase());

            return (
              <div key={key} className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{label}</span>
                    <span className="text-[#E64A19]">{value}%</span>
                  </div>
                  <input
                  type="range"
                  min="40"
                  max="100"
                  value={value}
                  onChange={(e) =>
                  setStarParameters({ ...starParameters, [key]: Number(e.target.value) })
                  }
                  className="w-full accent-[#FF4D00] cursor-pointer" />
                
                </div>);

          })}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 flex items-center justify-between">
            <span>Official Portal Sync Status: Ready for Annual Evaluation Upload</span>
            <button
            onClick={() => alert("Star Rating self-evaluation submission signed and queued for Ministry validation.")}
            className="px-4 py-1.5 bg-[#FF4D00] hover:bg-[#e04400] text-white font-bold rounded-lg transition-colors cursor-pointer shadow-2xs">
            
              Submit Evaluation Return
            </button>
          </div>
        </div>
      }
    </div>);

};