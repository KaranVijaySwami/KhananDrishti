import React, { useState, useEffect, useMemo } from "react";

import { CONTRACTOR_REGISTRY, STATUTORY_FORM_B_DATA } from "../data/mockData";
import {
  Users,
  ShieldCheck,
  AlertTriangle,

  Truck,

  Lock,

  Phone,

  Search,

  PlusCircle,
  Download,



  UserPlus,
  RefreshCw,

  Building,


  Sparkles } from

"lucide-react";
















export const ContractorPortal = ({
  selectedMine
}) => {
  const [contractors, setContractors] = useState(CONTRACTOR_REGISTRY);
  const [workers, setWorkers] = useState(STATUTORY_FORM_B_DATA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [mineFilterMode, setMineFilterMode] = useState("current_mine");

  // Selected contractor state
  const [selectedContractorId, setSelectedContractorId] = useState(() => {
    const matched = CONTRACTOR_REGISTRY.find((c) => c.mineId === selectedMine.id);
    return matched ? matched.id : CONTRACTOR_REGISTRY[0].id;
  });

  // Selected detail sub-tab
  const [activeDetailTab, setActiveDetailTab] = useState(

    "scorecard");

  // Worker roster filters
  const [workerSearch, setWorkerSearch] = useState("");
  const [workerStatusFilter, setWorkerStatusFilter] = useState("ALL");

  // Modals
  const [showAddContractorModal, setShowAddContractorModal] = useState(false);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showIssueNoticeModal, setShowIssueNoticeModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  // New contractor form state
  const [newContractor, setNewContractor] = useState({
    contractorName: "",
    contractCode: "",
    subsidiary: selectedMine.subsidiary,
    totalWorkers: 150,
    supervisorName: "",
    contactNumber: "+91 "
  });

  // New worker form state
  const [newWorker, setNewWorker] = useState(





    {
      name: "",
      category: "HEMM_Operator",
      aadhaarMasked: "XXXX-XXXX-",
      pmeDate: new Date().toISOString().split("T")[0],
      vtcCertificateNo: `VTC/${selectedMine.id.slice(4)}/2026/`
    });

  // New notice form state
  const [noticeData, setNoticeData] = useState({
    clause: "CMR 2017 Reg 107 - Safety Berm & PPE Compliance",
    severity: "Warning_Notice",
    remarks: "Mandatory PME medical re-examination required for workers within 7 days."
  });

  // Mock machinery fleet database mapped by contractor
  const [machineryFleet, setMachineryFleet] = useState({
    "CONT-001": [
    { id: "EQ-CAT-793-01", type: "240T Off-Highway Dumper", regNo: "CG-12-MK-9912", model: "Caterpillar 793D", afdssStatus: "Operational", fitnessCertExpiry: "2027-02-15", operatorAssigned: "Birendra Kumar Soni", category: "Dumper" },
    { id: "EQ-KOM-PC3000-02", type: "Hydraulic Shovel (15m³)", regNo: "CG-12-MK-8840", model: "Komatsu PC3000", afdssStatus: "Operational", fitnessCertExpiry: "2026-11-20", operatorAssigned: "Rameshwar Prasad Sahu", category: "Excavator" },
    { id: "EQ-CAT-16M-03", type: "Heavy Motor Grader", regNo: "CG-12-MK-7721", model: "CAT 16M (16ft Blade)", afdssStatus: "Operational", fitnessCertExpiry: "2027-04-10", operatorAssigned: "Dharmendra Singh", category: "Grader" },
    { id: "EQ-TAT-WB-04", type: "Pressurized Water Bowser (28KL)", regNo: "CG-12-MK-4402", model: "Tata Prima 3128", afdssStatus: "Maintenance_Due", fitnessCertExpiry: "2026-09-30", operatorAssigned: "Santosh Kumar", category: "Water_Bowser" }],

    "CONT-002": [
    { id: "EQ-CAT-793-11", type: "240T Off-Highway Dumper", regNo: "CG-12-BG-1001", model: "Caterpillar 793F", afdssStatus: "Operational", fitnessCertExpiry: "2027-05-18", operatorAssigned: "Devendra Singh Gond", category: "Dumper" },
    { id: "EQ-KOM-PC4000-12", type: "Heavy Excavator (22m³)", regNo: "CG-12-BG-1002", model: "Komatsu PC4000", afdssStatus: "Operational", fitnessCertExpiry: "2027-03-22", operatorAssigned: "Rameshwar Prasad Sahu", category: "Excavator" },
    { id: "EQ-EPI-DRL-13", type: "Blast Hole Rotary Drill Rig", regNo: "CG-12-BG-1003", model: "Epiroc Pit Viper 271", afdssStatus: "Operational", fitnessCertExpiry: "2026-12-14", operatorAssigned: "Mukesh Kumar Kewat", category: "Drill" },
    { id: "EQ-VOL-WB-14", type: "High-Pressure Water Tanker (40KL)", regNo: "CG-12-BG-1004", model: "Volvo FMX 460", afdssStatus: "Operational", fitnessCertExpiry: "2027-01-30", operatorAssigned: "Pramod Kumar Yadav", category: "Water_Bowser" }],

    "CONT-003": [
    { id: "EQ-BEL-DMP-21", type: "100T Rear Dumper", regNo: "JH-17-ML-3301", model: "BEML BH100M", afdssStatus: "Maintenance_Due", fitnessCertExpiry: "2026-09-10", operatorAssigned: "Ganesh Chandra Murmu", category: "Dumper" },
    { id: "EQ-HYU-EXC-22", type: "Hydraulic Excavator (6.5m³)", regNo: "JH-17-ML-3302", model: "Hyundai Robex 520", afdssStatus: "Fault_Flagged", fitnessCertExpiry: "2026-08-30", operatorAssigned: "Sanatan Marandi", category: "Excavator" }],

    "CONT-005": [
    { id: "EQ-CAT-793-51", type: "240T Off-Highway Dumper", regNo: "CG-12-MC-501", model: "Caterpillar 793D", afdssStatus: "Operational", fitnessCertExpiry: "2027-06-15", operatorAssigned: "Santosh Kumar Patel", category: "Dumper" },
    { id: "EQ-KOM-PC2000-52", type: "Hydraulic Excavator (12m³)", regNo: "CG-12-MC-502", model: "Komatsu PC2000", afdssStatus: "Operational", fitnessCertExpiry: "2027-02-28", operatorAssigned: "Rajesh Kumar Rathore", category: "Excavator" }]

  });

  // When selectedMine changes, auto-select a contractor matching this mine if in current_mine filter mode
  useEffect(() => {
    if (mineFilterMode === "current_mine") {
      const matched = contractors.find((c) => c.mineId === selectedMine.id);
      if (matched) {
        setSelectedContractorId(matched.id);
      }
    }
  }, [selectedMine.id, mineFilterMode, contractors]);

  // Filtered contractor list
  const filteredContractors = useMemo(() => {
    return contractors.filter((c) => {
      const matchMine = mineFilterMode === "all_mines" || c.mineId === selectedMine.id;
      const matchSearch =
      c.contractorName.toLowerCase().includes(search.toLowerCase()) ||
      c.contractCode.toLowerCase().includes(search.toLowerCase()) ||
      c.supervisorName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
      return matchMine && matchSearch && matchStatus;
    });
  }, [contractors, mineFilterMode, selectedMine.id, search, statusFilter]);

  // Selected contractor object
  const selectedContractor = useMemo(() => {
    return (
      contractors.find((c) => c.id === selectedContractorId) ||
      filteredContractors[0] ||
      contractors[0]);

  }, [contractors, selectedContractorId, filteredContractors]);

  // Selected contractor workers list
  const contractorWorkers = useMemo(() => {
    if (!selectedContractor) return [];
    return workers.filter((w) => {
      const matchContractor = w.contractorId === selectedContractor.id;
      const matchSearch =
      w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
      w.workerId.toLowerCase().includes(workerSearch.toLowerCase()) ||
      w.category.toLowerCase().includes(workerSearch.toLowerCase());
      const matchStatus =
      workerStatusFilter === "ALL" || w.status === workerStatusFilter;
      return matchContractor && matchSearch && matchStatus;
    });
  }, [workers, selectedContractor, workerSearch, workerStatusFilter]);

  // Aggregate metrics
  const totalWorkforce = useMemo(() => {
    return filteredContractors.reduce((acc, c) => acc + c.totalWorkers, 0);
  }, [filteredContractors]);

  const avgPmeCompliance = useMemo(() => {
    if (!filteredContractors.length) return 0;
    return Math.round(
      filteredContractors.reduce((acc, c) => acc + c.pmeValidPct, 0) /
      filteredContractors.length
    );
  }, [filteredContractors]);

  const showToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  // Toggle worker biometric gate pass
  const handleToggleWorkerGatePass = (workerId) => {
    setWorkers((prev) =>
    prev.map((w) => {
      if (w.workerId === workerId) {
        const nextStatus =
        w.status === "Active_Authorized" ?
        "PME_Overdue_Blocked" :
        "Active_Authorized";
        showToast(
          nextStatus === "Active_Authorized" ?
          `Biometric turnstile gate access GRANTED for ${w.name} (${w.workerId}).` :
          `Biometric turnstile gate access REVOKED / LOCKED for ${w.name} (${w.workerId}).`
        );
        return { ...w, status: nextStatus };
      }
      return w;
    })
    );
  };

  // Renew worker PME
  const handleRenewWorkerPme = (workerId) => {
    const today = new Date();
    const nextDue = new Date();
    nextDue.setFullYear(today.getFullYear() + 3);
    const nextDueStr = nextDue.toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];

    setWorkers((prev) =>
    prev.map((w) => {
      if (w.workerId === workerId) {
        showToast(
          `Periodic Medical Examination (PME) certified for ${w.name}. Next due: ${nextDueStr}. Gate pass authorized.`
        );
        return {
          ...w,
          pmeDate: todayStr,
          pmeNextDue: nextDueStr,
          status: "Active_Authorized"
        };
      }
      return w;
    })
    );
  };

  // Add new contractor
  const handleAddContractorSubmit = (e) => {
    e.preventDefault();
    if (!newContractor.contractorName || !newContractor.contractCode) return;

    const id = `CONT-${String(contractors.length + 1).padStart(3, "0")}`;
    const added = {
      id,
      contractorName: newContractor.contractorName,
      contractCode: newContractor.contractCode,
      subsidiary: newContractor.subsidiary,
      mineId: selectedMine.id,
      totalWorkers: Number(newContractor.totalWorkers) || 100,
      formBCompliantPct: 100.0,
      pmeValidPct: 100.0,
      vtcCertifiedPct: 100.0,
      safetyInductionScore: 98,
      activeMachineryCount: 12,
      safetyViolationsLast90Days: 0,
      status: "Compliant",
      supervisorName: newContractor.supervisorName || "Colliery Field In-Charge",
      contactNumber: newContractor.contactNumber || "+91 94370 00000"
    };

    setContractors((prev) => [added, ...prev]);
    setSelectedContractorId(added.id);
    setShowAddContractorModal(false);
    showToast(`Contractor agency "${added.contractorName}" successfully registered for ${selectedMine.name}!`);
  };

  // Add new worker
  const handleAddWorkerSubmit = (e) => {
    e.preventDefault();
    if (!newWorker.name || !selectedContractor) return;

    const workerId = `W-${selectedContractor.subsidiary}-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date();
    const nextDue = new Date();
    nextDue.setFullYear(today.getFullYear() + 3);

    const addedWorker = {
      workerId,
      name: newWorker.name,
      category: newWorker.category,
      contractorId: selectedContractor.id,
      contractorName: selectedContractor.contractorName,
      aadhaarMasked: newWorker.aadhaarMasked.length > 8 ? newWorker.aadhaarMasked : `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
      pmeDate: newWorker.pmeDate,
      pmeNextDue: nextDue.toISOString().split("T")[0],
      vtcCertificateNo: newWorker.vtcCertificateNo || `VTC/${selectedMine.id.slice(4)}/2026/${Math.floor(100 + Math.random() * 900)}`,
      attendancePct: 96.0,
      safetyInductionDate: newWorker.pmeDate,
      status: "Active_Authorized"
    };

    setWorkers((prev) => [addedWorker, ...prev]);
    setShowAddWorkerModal(false);
    showToast(`Worker ${addedWorker.name} (${addedWorker.workerId}) added to Form-B register with Biometric RFID Gate Pass.`);
  };

  // Issue Statutory Notice / Change Status
  const handleIssueNoticeSubmit = (e) => {
    e.preventDefault();
    if (!selectedContractor) return;

    setContractors((prev) =>
    prev.map((c) => {
      if (c.id === selectedContractor.id) {
        return {
          ...c,
          status: noticeData.severity,
          safetyViolationsLast90Days: c.safetyViolationsLast90Days + 1,
          safetyInductionScore: Math.max(50, c.safetyInductionScore - 8)
        };
      }
      return c;
    })
    );

    setShowIssueNoticeModal(false);
    showToast(
      `Statutory Notice issued to ${selectedContractor.contractorName}. Status updated to "${noticeData.severity.replace("_", " ")}".`
    );
  };

  // Audit AFDSS
  const handleAuditAfdss = (equipId) => {
    if (!selectedContractor) return;
    setMachineryFleet((prev) => {
      const fleet = prev[selectedContractor.id] || [];
      const updated = fleet.map((eq) =>
      eq.id === equipId ? { ...eq, afdssStatus: "Operational" } : eq
      );
      return { ...prev, [selectedContractor.id]: updated };
    });
    showToast(`AFDSS Nitrogen pressure and sprinkler nozzle verified operational for ${equipId}.`);
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notificationToast &&
      <div className="fixed top-20 right-6 z-50 p-4 bg-white border border-[#FF4D00] rounded-xl text-slate-900 text-xs shadow-xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-[#FF4D00] shrink-0" />
          <span className="font-mono">{notificationToast}</span>
          <button
          onClick={() => setNotificationToast(null)}
          className="text-slate-400 hover:text-slate-700 ml-2 text-sm">
          
            ✕
          </button>
        </div>
      }

      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-[#E64A19]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono tracking-widest text-[#E64A19] uppercase font-bold">
                Contract Labour & Safety Governance Desk
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-mono font-bold">
                CLRA Act 1970 • Mines Rules 1955
              </span>
            </div>
            <h2 className="text-xl font-serif italic text-slate-900 mt-1">
              Contractor Safety Scorecards, Form-B Roster & Biometric Gate Control
            </h2>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Live biometric RFID turnstile authorization, Periodic Medical Examination (PME) tracking, and HEMM machine AFDSS certification for{" "}
              <strong className="text-slate-900 font-semibold">{selectedMine.name} ({selectedMine.subsidiary})</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddContractorModal(true)}
            className="flex items-center space-x-2 bg-[#FF4D00] hover:bg-[#e04400] text-white font-mono font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-xs cursor-pointer">
            
            <PlusCircle className="w-4 h-4" />
            <span>Onboard Agency</span>
          </button>
          <div className="flex items-center space-x-2 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-700">
              Workforce: <strong className="text-slate-900">{totalWorkforce.toLocaleString()} Personnel</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Contractor List & Detailed Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Contractor List (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-serif font-semibold text-slate-900">Registered Contractor Agencies</h3>
                <p className="text-[10px] font-mono text-slate-500">
                  {mineFilterMode === "current_mine" ? `Filtered: ${selectedMine.name}` : "All CIL Subsidiaries"}
                </p>
              </div>
              <span className="text-xs text-[#E64A19] font-mono font-bold">
                {filteredContractors.length} Agencies
              </span>
            </div>

            {/* Mine Filter Toggle Mode */}
            <div className="flex bg-slate-50 p-1 border border-slate-200 rounded-lg text-xs font-mono">
              <button
                onClick={() => setMineFilterMode("current_mine")}
                className={`flex-1 py-1 px-2 rounded-md text-[11px] font-semibold transition-all ${
                mineFilterMode === "current_mine" ?
                "bg-white text-[#E64A19] font-bold shadow-xs" :
                "text-slate-600 hover:text-slate-900"}`
                }>
                
                Current Mine ({selectedMine.subsidiary})
              </button>
              <button
                onClick={() => setMineFilterMode("all_mines")}
                className={`flex-1 py-1 px-2 rounded-md text-[11px] font-semibold transition-all ${
                mineFilterMode === "all_mines" ?
                "bg-white text-[#E64A19] font-bold shadow-xs" :
                "text-slate-600 hover:text-slate-900"}`
                }>
                
                All Pan-CIL ({contractors.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search agency, code or supervisor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#FF4D00] shadow-2xs" />
              
            </div>

            {/* Status Filter Badges */}
            <div className="flex items-center space-x-1 overflow-x-auto text-[10px] font-mono pb-1">
              {["ALL", "Compliant", "Warning_Notice", "Suspended"].map((st) =>
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap font-bold ${
                statusFilter === st ?
                "bg-orange-50 text-[#E64A19] border border-orange-300" :
                "bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900"}`
                }>
                
                  {st === "ALL" ? "All Status" : st.replace("_", " ")}
                </button>
              )}
            </div>

            {/* Contractors List */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredContractors.length > 0 ?
              filteredContractors.map((c) => {
                const isSelected = selectedContractor?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedContractorId(c.id);
                      setActiveDetailTab("scorecard");
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected ?
                    "bg-orange-50/50 border-[#FF4D00] shadow-xs" :
                    "bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs"}`
                    }>
                    
                      <div className="flex justify-between items-start">
                        <span className="font-serif font-semibold text-slate-900 text-xs truncate max-w-[190px]">
                          {c.contractorName}
                        </span>
                        <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                        c.status === "Compliant" ?
                        "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        c.status === "Warning_Notice" ?
                        "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-red-50 text-red-700 border-red-200"}`
                        }>
                        
                          {c.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500 mt-1">
                        <span className="text-[#E64A19] font-bold">{c.contractCode}</span>
                        <span>•</span>
                        <span>{c.subsidiary}</span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-mono">
                        <span className="text-slate-600 font-medium">{c.totalWorkers} Workers</span>
                        <span
                        className={`font-bold ${
                        c.safetyInductionScore >= 90 ?
                        "text-emerald-700" :
                        c.safetyInductionScore >= 80 ?
                        "text-amber-700" :
                        "text-red-700"}`
                        }>
                        
                          Safety: {c.safetyInductionScore}%
                        </span>
                      </div>
                    </div>);

              }) :

              <div className="text-center py-12 text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-lg">
                  <Users className="w-7 h-7 mx-auto text-slate-400" />
                  <p className="text-xs">No contractor agencies match current search or filters.</p>
                  <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("ALL");
                    setMineFilterMode("all_mines");
                  }}
                  className="text-xs text-[#E64A19] font-bold hover:underline font-mono">
                  
                    Reset all filters
                  </button>
                </div>
              }
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-600 flex items-center justify-between">
            <span>Avg PME Validity:</span>
            <strong className="text-emerald-700 font-bold">{avgPmeCompliance}% Across Fleet</strong>
          </div>
        </div>

        {/* Right 8 Cols: Detailed Contractor Profile & Interactive Tabs */}
        {selectedContractor ?
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            {/* Contractor Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono text-[#E64A19] font-bold">
                    {selectedContractor.contractCode}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.2 rounded font-mono font-bold">
                    {selectedContractor.subsidiary} • Mine ID: {selectedContractor.mineId}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 mt-1">
                  {selectedContractor.contractorName}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-3">
                  <span>Supervisor: <strong className="text-slate-800">{selectedContractor.supervisorName}</strong></span>
                  <span>•</span>
                  <span className="flex items-center text-slate-700">
                    <Phone className="w-3.5 h-3.5 mr-1 text-[#E64A19]" />
                    {selectedContractor.contactNumber}
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                onClick={() => setShowIssueNoticeModal(true)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-mono font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs">
                
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Issue Statutory Notice</span>
                </button>
                <button
                onClick={() => {
                  showToast(
                    `CLRA Form-V & Gate Clearance Certificate exported for ${selectedContractor.contractorName}. Digital signature verified.`
                  );
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-mono font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs">
                
                  <Download className="w-3.5 h-3.5 text-[#E64A19]" />
                  <span>Form-V PDF</span>
                </button>
                <span
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                selectedContractor.status === "Compliant" ?
                "bg-emerald-50 text-emerald-700 border-emerald-200" :
                selectedContractor.status === "Warning_Notice" ?
                "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-red-50 text-red-700 border-red-200"}`
                }>
                
                  {selectedContractor.status === "Compliant" ?
                "Gate Authorized" :
                selectedContractor.status === "Warning_Notice" ?
                "Warning: Notice Active" :
                "Suspended / Cordoned"}
                </span>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-mono">
              {[
            { id: "scorecard", label: "Compliance Scorecard", icon: ShieldCheck },
            { id: "workers", label: `Form-B Workforce (${workers.filter((w) => w.contractorId === selectedContractor.id).length})`, icon: Users },
            { id: "machinery", label: `HEMM Machinery Fleet (${machineryFleet[selectedContractor.id]?.length || selectedContractor.activeMachineryCount})`, icon: Truck },
            { id: "violations", label: `Violations (${selectedContractor.safetyViolationsLast90Days})`, icon: AlertTriangle }].
            map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDetailTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDetailTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive ?
                  "bg-[#FF4D00] text-white shadow-xs" :
                  "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`
                  }>
                  
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>);

            })}
            </div>

            {/* Tab 1: Compliance Scorecard */}
            {activeDetailTab === "scorecard" &&
          <div className="space-y-6 animate-in fade-in">
                {/* 4 Compliance Meters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px] font-bold">Form-B Compliance</span>
                    <span className="text-2xl font-bold text-slate-900 mt-1 block">
                      {selectedContractor.formBCompliantPct}%
                    </span>
                    <span className="text-emerald-700 text-[11px] font-semibold">Aadhaar / KYC Verified</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px] font-bold">PME Medical Valid</span>
                    <span className={`text-2xl font-bold mt-1 block ${selectedContractor.pmeValidPct < 85 ? "text-amber-700" : "text-emerald-700"}`}>
                      {selectedContractor.pmeValidPct}%
                    </span>
                    <span className="text-slate-500 text-[11px]">Periodic Health Check</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px] font-bold">VTC Training Cert</span>
                    <span className="text-2xl font-bold text-blue-700 mt-1 block">
                      {selectedContractor.vtcCertifiedPct}%
                    </span>
                    <span className="text-slate-500 text-[11px]">Vocational Centre</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px] font-bold">Active Machinery</span>
                    <span className="text-2xl font-bold text-amber-700 mt-1 block">
                      {selectedContractor.activeMachineryCount} Units
                    </span>
                    <span className="text-slate-500 text-[11px]">AFDSS Fitted</span>
                  </div>
                </div>

                {/* Gate Pass Enforcement Widget */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#FF4D00]" />
                    <span>Biometric Turnstile Gate-Pass Automation</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    If a worker's Periodic Medical Examination (PME) expires or safety induction is incomplete, their RFID turnstile gate access is automatically blocked at the colliery security entry gate.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-[11px] font-bold">
                      ✓ 100% EPF / ESIC Remittance Verified
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-[11px] font-bold">
                      ✓ Minimum Wage Direct Bank Credit Verified
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-[11px] font-bold">
                      ✓ DGMS Safety Inductions Completed
                    </span>
                  </div>
                </div>
              </div>
          }

            {/* Tab 2: Form-B Deployed Workforce Roster */}
            {activeDetailTab === "workers" &&
          <div className="space-y-4 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-slate-900">
                      Form-B Personnel Register ({selectedContractor.contractorName})
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Statutory worker database with real-time biometric RFID turnstile gate access status.
                    </p>
                  </div>

                  <button
                onClick={() => setShowAddWorkerModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#FF4D00] hover:bg-[#e04400] text-white font-mono font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs">
                
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register New Worker</span>
                  </button>
                </div>

                {/* Worker Search & Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                  type="text"
                  placeholder="Search worker by name, ID or trade..."
                  value={workerSearch}
                  onChange={(e) => setWorkerSearch(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
                
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-mono w-full sm:w-auto">
                    {["ALL", "Active_Authorized", "PME_Overdue_Blocked", "Training_Lapse"].map((st) =>
                <button
                  key={st}
                  onClick={() => setWorkerStatusFilter(st)}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap text-[10px] font-bold ${
                  workerStatusFilter === st ?
                  "bg-orange-50 text-[#E64A19] border border-orange-300" :
                  "bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900"}`
                  }>
                  
                        {st === "ALL" ? "All" : st.replace("_", " ")}
                      </button>
                )}
                  </div>
                </div>

                {/* Worker Table */}
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-mono text-[11px] border-b border-slate-200 font-bold">
                        <th className="p-3">Worker ID</th>
                        <th className="p-3">Worker Name</th>
                        <th className="p-3">Category / Trade</th>
                        <th className="p-3">Aadhaar</th>
                        <th className="p-3">PME Health Expiry</th>
                        <th className="p-3">VTC Certificate</th>
                        <th className="p-3">Gate Pass Status</th>
                        <th className="p-3 text-right">Statutory Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {contractorWorkers.length > 0 ?
                  contractorWorkers.map((w) =>
                  <tr key={w.workerId} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono font-bold text-[#E64A19]">{w.workerId}</td>
                            <td className="p-3 font-serif font-semibold text-slate-900">{w.name}</td>
                            <td className="p-3 text-slate-700">{w.category.replace("_", " ")}</td>
                            <td className="p-3 font-mono text-slate-500">{w.aadhaarMasked}</td>
                            <td className="p-3 font-mono">
                              <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        w.status === "PME_Overdue_Blocked" ?
                        "bg-red-50 text-red-700 border-red-200" :
                        "bg-slate-50 text-slate-700 border-slate-200"}`
                        }>
                        
                                {w.pmeNextDue}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-slate-500 text-[11px]">
                              {w.vtcCertificateNo}
                            </td>
                            <td className="p-3">
                              <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        w.status === "Active_Authorized" ?
                        "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        "bg-red-50 text-red-700 border-red-200"}`
                        }>
                        
                                {w.status === "Active_Authorized" ? "Authorized" : "Blocked (PME Expired)"}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end space-x-1.5 font-mono">
                                {w.status === "PME_Overdue_Blocked" ?
                        <button
                          onClick={() => handleRenewWorkerPme(w.workerId)}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded text-[10px] flex items-center space-x-1 transition-colors cursor-pointer font-bold"
                          title="Renew Periodic Medical Examination">
                          
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Certify PME</span>
                                  </button> :

                        <button
                          onClick={() => handleToggleWorkerGatePass(w.workerId)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-[10px] flex items-center space-x-1 transition-colors cursor-pointer font-bold"
                          title="Lock Biometric RFID Turnstile Gate Access">
                          
                                    <Lock className="w-3 h-3" />
                                    <span>Lock Gate</span>
                                  </button>
                        }
                              </div>
                            </td>
                          </tr>
                  ) :

                  <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-500 font-sans">
                            No Form-B workers registered under current filter criteria.
                          </td>
                        </tr>
                  }
                    </tbody>
                  </table>
                </div>
              </div>
          }

            {/* Tab 3: Heavy Earthmoving Machinery (HEMM) Fleet */}
            {activeDetailTab === "machinery" &&
          <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-slate-900">
                      HEMM Machinery Fleet & Safety Devices (AFDSS)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Auto Fire Detection and Suppression Systems (AFDSS), audio-visual reverse alarms, and fitness certificates.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-50 text-[#E64A19] border border-slate-200 text-xs font-mono font-bold">
                    {machineryFleet[selectedContractor.id]?.length || selectedContractor.activeMachineryCount} Units Deployed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(machineryFleet[selectedContractor.id] || []).map((equip) =>
              <div
                key={equip.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono text-[#E64A19] font-bold text-xs">{equip.id}</span>
                          <h5 className="font-serif font-bold text-slate-900 text-sm">{equip.type}</h5>
                          <span className="text-[11px] font-mono text-slate-500">{equip.model} • Reg: {equip.regNo}</span>
                        </div>
                        <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                    equip.afdssStatus === "Operational" ?
                    "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    "bg-amber-50 text-amber-700 border-amber-200"}`
                    }>
                    
                          AFDSS: {equip.afdssStatus.replace("_", " ")}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px] font-mono text-slate-600">
                        <span>Assigned: <strong className="text-slate-800">{equip.operatorAssigned}</strong></span>
                        <span>Fitness: <strong className="text-slate-800">{equip.fitnessCertExpiry}</strong></span>
                      </div>

                      {equip.afdssStatus !== "Operational" &&
                <button
                  onClick={() => handleAuditAfdss(equip.id)}
                  className="w-full mt-2 py-1.5 bg-[#FF4D00] hover:bg-[#e04400] text-white font-mono font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1">
                  
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Certify AFDSS Nitrogen Pressure</span>
                        </button>
                }
                    </div>
              )}
                </div>
              </div>
          }

            {/* Tab 4: Statutory Violations & Show Cause */}
            {activeDetailTab === "violations" &&
          <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-slate-900">
                      Statutory Violations & Show-Cause Log (Last 90 Days)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Notices issued under Coal Mines Regulations 2017 & Mines Act 1952.
                    </p>
                  </div>
                  <button
                onClick={() => setShowIssueNoticeModal(true)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg text-xs font-mono font-bold cursor-pointer">
                
                    + Issue DGMS Notice
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-[#E64A19]">DGMS/SECL/CONT-AUDIT/2026/89</span>
                      <span className="text-red-700 font-bold">Issued: 12-AUG-2026</span>
                    </div>
                    <strong className="text-slate-900 block font-serif">
                      Mines Rules 1955 Rule 29B - Periodic Medical Examination Grace Period
                    </strong>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      42 contract workers engaged in excavation had PME validity expired beyond 90-day grace period. Special medical examination camp ordered.
                    </p>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] font-mono text-emerald-700 font-bold">
                      <span>Status: Rectification Underway (38 Cleared)</span>
                      <span>Assigned: Area Medical Officer</span>
                    </div>
                  </div>
                </div>
              </div>
          }
          </div> :
        null}
      </div>

      {/* Modal 1: Onboard Contractor Agency */}
      {showAddContractorModal &&
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#FF4D00]" />
                <span>Onboard New Contractor Agency</span>
              </h3>
              <button
              onClick={() => setShowAddContractorModal(false)}
              className="text-slate-400 hover:text-slate-700 text-lg">
              
                ✕
              </button>
            </div>

            <form onSubmit={handleAddContractorSubmit} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Company / Agency Name</label>
                <input
                type="text"
                required
                placeholder="e.g. M/s Singrauli Earthmovers Pvt Ltd"
                value={newContractor.contractorName}
                onChange={(e) => setNewContractor({ ...newContractor, contractorName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
              
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Contract Agreement Code</label>
                  <input
                  type="text"
                  required
                  placeholder="e.g. SECL/GEV/OB/2026/99"
                  value={newContractor.contractCode}
                  onChange={(e) => setNewContractor({ ...newContractor, contractCode: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
                
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Sanctioned Workforce</label>
                  <input
                  type="number"
                  required
                  value={newContractor.totalWorkers}
                  onChange={(e) => setNewContractor({ ...newContractor, totalWorkers: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
                
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Supervisor Name</label>
                  <input
                  type="text"
                  placeholder="e.g. Er. Vinod Sharma"
                  value={newContractor.supervisorName}
                  onChange={(e) => setNewContractor({ ...newContractor, supervisorName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
                
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Supervisor Phone</label>
                  <input
                  type="text"
                  placeholder="+91 94370 12345"
                  value={newContractor.contactNumber}
                  onChange={(e) => setNewContractor({ ...newContractor, contactNumber: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
                
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                type="button"
                onClick={() => setShowAddContractorModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:text-slate-900">
                
                  Cancel
                </button>
                <button
                type="submit"
                className="px-5 py-2 bg-[#FF4D00] hover:bg-[#e04400] text-white font-bold rounded-lg text-xs">
                
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      {/* Modal 2: Register New Worker */}
      {showAddWorkerModal &&
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#FF4D00]" />
                <span>Register Form-B Worker</span>
              </h3>
              <button
              onClick={() => setShowAddWorkerModal(false)}
              className="text-slate-400 hover:text-slate-700 text-lg">
              
                ✕
              </button>
            </div>

            <form onSubmit={handleAddWorkerSubmit} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Worker Full Name</label>
                <input
                type="text"
                required
                placeholder="e.g. Rameshwar Sahu"
                value={newWorker.name}
                onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
              
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Designated Trade / Category</label>
                  <select
                  value={newWorker.category}
                  onChange={(e) => setNewWorker({ ...newWorker, category: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]">
                  
                    <option value="HEMM_Operator">HEMM Operator</option>
                    <option value="Blaster">Blaster</option>
                    <option value="Driller">Driller</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Mining_Sirdar">Mining Sirdar</option>
                    <option value="General_Labour">General Labour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Aadhaar (Masked)</label>
                  <input
                  type="text"
                  placeholder="XXXX-XXXX-8921"
                  value={newWorker.aadhaarMasked}
                  onChange={(e) => setNewWorker({ ...newWorker, aadhaarMasked: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
                
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">PME Medical Check Date</label>
                  <input
                  type="date"
                  required
                  value={newWorker.pmeDate}
                  onChange={(e) => setNewWorker({ ...newWorker, pmeDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
                
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">VTC Certificate No.</label>
                  <input
                  type="text"
                  value={newWorker.vtcCertificateNo}
                  onChange={(e) => setNewWorker({ ...newWorker, vtcCertificateNo: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
                
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                type="button"
                onClick={() => setShowAddWorkerModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:text-slate-900">
                
                  Cancel
                </button>
                <button
                type="submit"
                className="px-5 py-2 bg-[#FF4D00] hover:bg-[#e04400] text-white font-bold rounded-lg text-xs">
                
                  Authorize Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      {/* Modal 3: Issue Statutory Notice */}
      {showIssueNoticeModal &&
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-serif font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Issue DGMS / Colliery Safety Show-Cause</span>
              </h3>
              <button
              onClick={() => setShowIssueNoticeModal(false)}
              className="text-slate-400 hover:text-slate-700 text-lg">
              
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueNoticeSubmit} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Target Contractor Agency</label>
                <input
                type="text"
                disabled
                value={selectedContractor?.contractorName}
                className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-semibold" />
              
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Statutory Clause & Ref</label>
                <input
                type="text"
                value={noticeData.clause}
                onChange={(e) => setNoticeData({ ...noticeData, clause: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
              
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Action Severity / Gate Status</label>
                <select
                value={noticeData.severity}
                onChange={(e) => setNoticeData({ ...noticeData, severity: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#FF4D00]">
                
                  <option value="Warning_Notice">Warning Notice (7 Days Compliance Cure Period)</option>
                  <option value="Suspended">Suspended (Immediate Gate Blockade & Work Stop)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Observations & Remediation Directives</label>
                <textarea
                rows={3}
                value={noticeData.remarks}
                onChange={(e) => setNoticeData({ ...noticeData, remarks: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-[#FF4D00]" />
              
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                type="button"
                onClick={() => setShowIssueNoticeModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:text-slate-900">
                
                  Cancel
                </button>
                <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs">
                
                  Issue Formal Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>);

};