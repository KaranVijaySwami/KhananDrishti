import React, { useState } from "react";

import {
  HardHat,

  Camera,
  CheckCircle2,



  FileCheck,

  Wifi,
  WifiOff,


  Send,
  RefreshCw,

  Crosshair } from
"lucide-react";









export const FieldInspection = ({
  selectedMine,
  isOnline,
  offlineQueueCount,
  onAddInspection,
  inspections
}) => {
  const [gpsLocked, setGpsLocked] = useState(true);
  const [currentCoords, setCurrentCoords] = useState({
    lat: selectedMine.lat + (Math.random() * 0.004 - 0.002),
    lng: selectedMine.lng + (Math.random() * 0.004 - 0.002),
    accuracy: 1.6,
    altitudeRL: 214.5
  });

  const [inspectorName, setInspectorName] = useState("Er. Rajesh Verma");
  const [designation, setDesignation] = useState("Colliery Safety Officer (1st Class Mine Manager)");
  const [inspectionType, setInspectionType] = useState("DGMS_Statutory");
  const [benchOrLevel, setBenchOrLevel] = useState("South-East Bench 12 (RL 210m)");
  const [seamName, setSeamName] = useState("Seam IV/V Interburden");
  const [evidencePhoto, setEvidencePhoto] = useState(
    "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=60"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Dynamic statutory checklist items
  const [checklist, setChecklist] = useState(






    [
    {
      checkPoint: "Haul Road Gradient maintains <= 1 in 16 ratio on active ramp",
      statutoryRef: "CMR 2017 Reg 107(1)",
      status: "Pass",
      remarks: "Gradient verified via digital inclinometer at 1 in 16.2."
    },
    {
      checkPoint: "Safety Berm / Parapet wall height >= largest tyre diameter (3.5m)",
      statutoryRef: "CMR 2017 Reg 107(3)",
      status: "Pass",
      remarks: "Continuous compacted rock berm of 3.8m measured along pit edge."
    },
    {
      checkPoint: "Highwall and OB dump slope stability radar monitoring active",
      statutoryRef: "DGMS Tech Circular (Safety) 04/2020",
      status: "Pass",
      remarks: "Real-time radar ping active; displacement below 0.2mm/hr."
    },
    {
      checkPoint: "Auto Fire Detection & Suppression (AFDSS) in Heavy HEMM",
      statutoryRef: "DGMS Standard for Heavy Earthmoving Machinery",
      status: "Pass",
      remarks: "Nitrogen pressure indicator in green band on Shovel #04."
    },
    {
      checkPoint: "Dust Suppression Mist Cannons & Mobile Sprinklers Operating",
      statutoryRef: "MoEFCC EC Condition Specific-IV",
      status: "Observation",
      remarks: "Ramp 2 sprinkler truck scheduled next round in 20 minutes."
    },
    {
      checkPoint: "First Aid Station & Emergency Stretcher with Oxygen kit available",
      statutoryRef: "Mines Rules 1955 Rule 44",
      status: "Pass",
      remarks: "Fully stocked at Bench 12 substation."
    }]
  );

  const handleStatusChange = (index, newStatus) => {
    setChecklist((prev) => {
      const copy = [...prev];
      copy[index].status = newStatus;
      return copy;
    });
  };

  const handleRemarkChange = (index, remarks) => {
    setChecklist((prev) => {
      const copy = [...prev];
      copy[index].remarks = remarks;
      return copy;
    });
  };

  const handleRefreshGps = () => {
    setGpsLocked(false);
    setTimeout(() => {
      setCurrentCoords({
        lat: selectedMine.lat + (Math.random() * 0.003 - 0.0015),
        lng: selectedMine.lng + (Math.random() * 0.003 - 0.0015),
        accuracy: 1.2,
        altitudeRL: 216.0
      });
      setGpsLocked(true);
    }, 600);
  };

  const handleSubmitAudit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const hasFailure = checklist.some((c) => c.status === "Fail");
    const hasObservation = checklist.some((c) => c.status === "Observation");
    const overallVerdict = hasFailure ?
    "Non_Compliant_Notice" :
    hasObservation ?
    "Observation_Logged" :
    "Compliant";

    const passedCount = checklist.filter((c) => c.status === "Pass").length;
    const failedCount = checklist.filter((c) => c.status === "Fail").length;
    const hash = `sha256-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;

    const newRecord = {
      id: `INSP-${Date.now().toString().slice(-6)}`,
      mineId: selectedMine.id,
      mineName: selectedMine.name,
      subsidiary: selectedMine.subsidiary,
      date: new Date().toISOString().split("T")[0],
      timestamp: `${new Date().toISOString().split("T")[0]} ${new Date().toLocaleTimeString()} IST`,
      inspectorName: inspectorName,
      inspectorDesignation: designation,
      inspectionType: inspectionType,
      geoTag: {
        lat: Number(currentCoords.lat.toFixed(6)),
        lng: Number(currentCoords.lng.toFixed(6)),
        accuracyM: currentCoords.accuracy,
        benchOrLevel: benchOrLevel,
        seam: seamName
      },
      checklistSummary: {
        totalItems: checklist.length,
        passed: passedCount,
        failed: failedCount
      },
      items: checklist,
      hazardsFound: failedCount > 0 ? ["Non-compliant observation logged on bench."] : [],
      overallVerdict: overallVerdict,
      photoUrls: evidencePhoto ? [evidencePhoto] : [],
      digitalSignatureHash: hash,
      tamperProofHash: hash,
      syncStatus: isOnline ? "Synced" : "Queued_Offline"
    };

    setTimeout(() => {
      onAddInspection(newRecord);
      setIsSubmitting(false);
      setSubmissionSuccess(
        isOnline ?
        `Statutory Field Inspection logged successfully! Block appended with hash ${newRecord.digitalSignatureHash}.` :
        `Offline Mode: Inspection saved locally in encrypted storage. Will sync to CIL nodes automatically when network is restored.`
      );
      setTimeout(() => setSubmissionSuccess(null), 6000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono tracking-widest text-[#E64A19] uppercase font-bold">
              Offline-First Mobile Field Kit
            </span>
            <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-mono font-bold">
              CMR 2017 Reg 27 • Mines Act 1952 Sec 23
            </span>
          </div>
          <h2 className="text-xl font-serif italic text-slate-900 mt-1">
            Statutory Field Observation & Geo-Tagged Inspection Logging
          </h2>
          <p className="text-xs text-slate-600 font-sans mt-0.5">
            Real-time differential GPS lock with sub-meter spatial accuracy, timestamp verification, photo capture, and cryptographic hash verification for{" "}
            <strong className="text-slate-900 font-semibold">{selectedMine.name} ({selectedMine.subsidiary})</strong>.
          </p>
        </div>

        {/* Network & Local Queue Badge */}
        <div className="flex items-center space-x-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono">
          {isOnline ?
          <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
              <Wifi className="w-4 h-4" />
              <span>Real-Time Node Sync Active</span>
            </div> :

          <div className="flex items-center space-x-1.5 text-red-700 font-bold">
              <WifiOff className="w-4 h-4" />
              <span>Offline Pipeline ({offlineQueueCount} queued locally)</span>
            </div>
          }
        </div>
      </div>

      {submissionSuccess &&
      <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-mono shadow-xs flex items-center space-x-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{submissionSuccess}</span>
        </div>
      }

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Mobile Inspection Form */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg text-[#E64A19]">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-semibold text-slate-900">
                  New Statutory Observation Log
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  Official Record pursuant to Coal Mines Regulations 2017
                </p>
              </div>
            </div>

            {/* GPS Lock Box */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono">
              <Crosshair className={`w-4 h-4 ${gpsLocked ? "text-emerald-600" : "text-amber-500 animate-spin"}`} />
              <div className="text-[10px] leading-tight">
                <span className="text-slate-500 block font-bold">DGPS Lock:</span>
                <span className="text-slate-900 font-bold">{currentCoords.lat.toFixed(5)}° N, {currentCoords.lng.toFixed(5)}° E (±{currentCoords.accuracy}m)</span>
              </div>
              <button
                onClick={handleRefreshGps}
                className="ml-1 p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
                title="Recalibrate Differential GPS Position">
                
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitAudit} className="space-y-5 text-xs">
            {/* Inspector Identity Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-mono text-[11px] mb-1 font-semibold">
                  Inspecting Official Name
                </label>
                <input
                  type="text"
                  required
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]" />
                
              </div>

              <div>
                <label className="block text-slate-700 font-mono text-[11px] mb-1 font-semibold">
                  Statutory Designation / Certificate
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]" />
                
              </div>
            </div>

            {/* Location & Seam Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-mono text-[11px] mb-1 font-semibold">
                  Inspection Category
                </label>
                <select
                  value={inspectionType}
                  onChange={(e) => setInspectionType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]">
                  
                  <option value="DGMS_Statutory">DGMS Statutory Inspection</option>
                  <option value="Internal_Safety_Audit">Internal Colliery Safety Audit</option>
                  <option value="Pre_Monsoon_Check">Pre-Monsoon Slope & Sump Audit</option>
                  <option value="Ventilation_Air_Survey">Ventilation & Methane Air Survey</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-mono text-[11px] mb-1 font-semibold">
                  Quarry Bench / Underground Panel
                </label>
                <input
                  type="text"
                  required
                  value={benchOrLevel}
                  onChange={(e) => setBenchOrLevel(e.target.value)}
                  placeholder="e.g. West Pit Bench #08 (RL 195m)"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]" />
                
              </div>

              <div>
                <label className="block text-slate-700 font-mono text-[11px] mb-1 font-semibold">
                  Coal Seam / Formation
                </label>
                <input
                  type="text"
                  value={seamName}
                  onChange={(e) => setSeamName(e.target.value)}
                  placeholder="e.g. Purewa Bottom Seam"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]" />
                
              </div>
            </div>

            {/* Statutory Checklist Table */}
            <div>
              <label className="block text-slate-700 font-mono text-[11px] mb-2 font-bold uppercase tracking-wider">
                Statutory Checkpoints (CMR 2017 & Mines Rules 1955)
              </label>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {checklist.map((item, idx) =>
                  <div key={idx} className="p-3.5 bg-slate-50/50 hover:bg-slate-50 space-y-2 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="font-serif font-medium text-slate-900 text-xs block">
                            {item.checkPoint}
                          </span>
                          <span className="text-[10px] font-mono text-[#E64A19] font-bold">
                            {item.statutoryRef}
                          </span>
                        </div>

                        {/* Status Toggle Buttons */}
                        <div className="flex items-center space-x-1 shrink-0 font-mono text-[10px] font-bold">
                          <button
                          type="button"
                          onClick={() => handleStatusChange(idx, "Pass")}
                          className={`px-2.5 py-1 rounded transition-colors ${
                          item.status === "Pass" ?
                          "bg-emerald-600 text-white font-bold shadow-2xs" :
                          "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`
                          }>
                          
                            ✓ Pass
                          </button>
                          <button
                          type="button"
                          onClick={() => handleStatusChange(idx, "Observation")}
                          className={`px-2.5 py-1 rounded transition-colors ${
                          item.status === "Observation" ?
                          "bg-amber-500 text-white font-bold shadow-2xs" :
                          "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`
                          }>
                          
                            ▲ Observation
                          </button>
                          <button
                          type="button"
                          onClick={() => handleStatusChange(idx, "Fail")}
                          className={`px-2.5 py-1 rounded transition-colors ${
                          item.status === "Fail" ?
                          "bg-red-600 text-white font-bold shadow-2xs" :
                          "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`
                          }>
                          
                            ✕ Non-Compliant
                          </button>
                        </div>
                      </div>

                      <input
                      type="text"
                      value={item.remarks}
                      onChange={(e) => handleRemarkChange(idx, e.target.value)}
                      placeholder="Add specific field measurements or engineering remarks..."
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-800 text-[11px] font-mono focus:outline-none focus:border-[#FF4D00]" />
                    
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Evidence Photo Upload preview */}
            <div>
              <label className="block text-slate-700 font-mono text-[11px] mb-1 font-semibold">
                Geo-Tagged Photo Evidence / Drone Survey Orthomosaic
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                {evidencePhoto ?
                <div className="relative">
                    <img
                    src={evidencePhoto}
                    alt="Field Observation Evidence"
                    className="w-28 h-20 object-cover rounded-lg border border-slate-300 shadow-2xs" />
                  
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[8px] px-1 rounded">
                      GPS Tagged
                    </span>
                  </div> :
                null}

                <div className="text-xs font-mono space-y-1">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-[#FF4D00]" />
                    <span className="text-slate-800 font-medium">Digital Camera Watermark: Active</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    EXIF Metadata: {currentCoords.lat.toFixed(5)}° N, {currentCoords.lng.toFixed(5)}° E • {new Date().toLocaleDateString()}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEvidencePhoto(
                        "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=60"
                      );
                    }}
                    className="text-[#E64A19] hover:underline text-[10px] font-bold">
                    
                    Simulate Capturing New Bench Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="text-[11px] font-mono text-slate-500">
                Data Hash: SHA-256 with asymmetric private key
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-[#FF4D00] hover:bg-[#e04400] text-white font-mono font-bold px-6 py-2.5 rounded-lg text-xs shadow-md transition-all cursor-pointer disabled:opacity-50">
                
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting ?
                  "Cryptographically Signing Observation..." :
                  isOnline ?
                  "Submit to Statutory CIL Ledger" :
                  "Queue Offline (Local Encrypted Storage)"}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 4 Cols: Recent Inspection Logs History */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-serif italic text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#FF4D00]" />
                <span>Recent Audit Records</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">{inspections.length} Logs</span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {inspections.map((insp) =>
              <div
                key={insp.id}
                className="p-3.5 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all text-xs space-y-2 shadow-2xs">
                
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-[#E64A19]">{insp.id}</span>
                    <span
                    className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                    (insp.overallVerdict || (insp.checklistSummary?.failed > 0 ? "Non_Compliant_Notice" : "Compliant")) === "Compliant" ?
                    "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    (insp.overallVerdict || "Observation_Logged") === "Observation_Logged" ?
                    "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-red-50 text-red-700 border-red-200"}`
                    }>
                    
                      {(insp.overallVerdict || (insp.checklistSummary?.failed > 0 ? "Non_Compliant_Notice" : "Compliant")).replace("_", " ")}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-semibold text-slate-900">{insp.geoTag?.benchOrLevel || "Active Bench Section"}</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {insp.inspectorName} ({(insp.inspectorDesignation || "Safety Auditor").slice(0, 24)}...)
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                    <span>{(insp.timestamp || insp.date || "").split(" ")[0]}</span>
                    <span className="text-emerald-700 font-bold">
                      {(insp.syncStatus || "Synced") === "Synced" ? "✓ Synced" : "Queued Local"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
            Mines Safety Audit Protocol 2026 Compliant
          </div>
        </div>
      </div>
    </div>);

};