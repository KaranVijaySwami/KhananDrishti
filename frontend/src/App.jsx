import React, { useState, useEffect } from "react";








import {
  MINE_SITES,
  STATUTORY_VIOLATIONS,
  INSPECTION_RECORDS } from
"./data/mockData";

import { LoginPage } from "./components/LoginPage";
import { Header } from "./components/Header";
import { CommandHub } from "./components/CommandHub";
import { GisMineMap } from "./components/GisMineMap";
import { FieldInspection } from "./components/FieldInspection";
import { StatutoryRegisters } from "./components/StatutoryRegisters";
import { AiSentinelOcr } from "./components/AiSentinelOcr";
import { ContractorPortal } from "./components/ContractorPortal";
import { WorkflowAuditTrail } from "./components/WorkflowAuditTrail";

export const App = () => {
  // Authentication State: null means user is on dedicated Login Page
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState("mine_official");
  const [selectedSubsidiary, setSelectedSubsidiary] = useState("ALL");
  const [mines, setMines] = useState(MINE_SITES);
  const [selectedMine, setSelectedMine] = useState(MINE_SITES[0]);
  const [activeTab, setActiveTab] = useState("command_hub");

  const [violations, setViolations] = useState(
    STATUTORY_VIOLATIONS
  );
  const [inspections, setInspections] = useState(
    INSPECTION_RECORDS
  );

  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.subsidiary && user.subsidiary !== "CIL_HQ") {
      setSelectedSubsidiary(user.subsidiary);
      const match = mines.find((m) => m.subsidiary === user.subsidiary);
      if (match) setSelectedMine(match);
    }
    // Set appropriate initial tab based on role
    if (user.role === "safety_officer") {
      setActiveTab("field_inspection");
    } else if (user.role === "contractor_supervisor") {
      setActiveTab("contractor_labour");
    } else {
      setActiveTab("command_hub");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
  };

  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.subsidiary && user.subsidiary !== "CIL_HQ") {
      setSelectedSubsidiary(user.subsidiary);
      const match = mines.find((m) => m.subsidiary === user.subsidiary);
      if (match) setSelectedMine(match);
    }
  };

  const handleAddInspection = (newRecord) => {
    setInspections((prev) => [newRecord, ...prev]);
    if (!isOnline) {
      setOfflineQueueCount((c) => c + 1);
    }
  };

  const handleInspectViolation = (violation) => {
    setActiveTab("ai_sentinel");
  };

  // If no user is authenticated, render the dedicated Role-Based Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#FF4D00] selection:text-white">
      {/* Top Header & Context Switcher */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
        currentRole={currentRole}
        setRole={setCurrentRole}
        selectedSubsidiary={selectedSubsidiary}
        setSubsidiary={(sub) => {
          setSelectedSubsidiary(sub);
          if (sub !== "ALL") {
            const match = mines.find((m) => m.subsidiary === sub);
            if (match) setSelectedMine(match);
          }
        }}
        selectedMine={selectedMine}
        setSelectedMineId={(id) => {
          const m = mines.find((mine) => mine.id === id);
          if (m) setSelectedMine(m);
        }}
        allMines={mines}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        offlineQueueCount={offlineQueueCount} />
      

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {(activeTab === "command_hub" || activeTab === "command") &&
        <CommandHub
          selectedMine={selectedMine}
          allMines={mines}
          violations={violations}
          currentRole={currentRole}
          onSelectMine={(mineId) => {
            const m = mines.find((x) => x.id === mineId);
            if (m) setSelectedMine(m);
          }}
          onNavigateTab={setActiveTab} />

        }

        {(activeTab === "gis_map" || activeTab === "gis") &&
        <GisMineMap
          selectedMine={selectedMine}
          violations={violations}
          inspections={inspections}
          onInspectViolation={handleInspectViolation} />

        }

        {activeTab === "field_inspection" &&
        <FieldInspection
          selectedMine={selectedMine}
          isOnline={isOnline}
          offlineQueueCount={offlineQueueCount}
          onAddInspection={handleAddInspection}
          inspections={inspections} />

        }

        {(activeTab === "statutory_registers" || activeTab === "registers") &&
        <StatutoryRegisters selectedMine={selectedMine} />
        }

        {activeTab === "ai_sentinel" &&
        <AiSentinelOcr
          selectedMine={selectedMine}
          violations={violations} />

        }

        {(activeTab === "contractor_labour" || activeTab === "contractors") &&
        <ContractorPortal selectedMine={selectedMine} />
        }

        {(activeTab === "workflow_audit" || activeTab === "audit_trail") &&
        <WorkflowAuditTrail violations={violations} />
        }

        {activeTab === "backend_guide" &&
        <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-slate-500">Infrastructure Specs</span>
                <h2 className="font-serif italic text-3xl mt-1 text-slate-900">Full-Stack Backend Architecture</h2>
              </div>
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-[10px] uppercase font-mono text-emerald-700 font-bold rounded">
                Node.js • Express • Gemini AI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 border-l-4 border-[#FF4D00] rounded-r-xl space-y-3 border border-slate-200">
                <p className="text-[10px] text-[#FF4D00] uppercase font-bold tracking-widest">Active API Endpoints</p>
                <h3 className="font-serif italic text-xl text-slate-900">Statutory AI Services</h3>
                <ul className="space-y-2 text-xs text-slate-600 font-mono">
                  <li><strong className="text-slate-900">POST /api/ai/ocr-doc</strong> - DGMS Notice OCR & Citation Extractor</li>
                  <li><strong className="text-slate-900">POST /api/ai/analyze-risk</strong> - Slope radar & gas predictive index</li>
                  <li><strong className="text-slate-900">POST /api/ai/generate-atr</strong> - Formal legal Action Taken Report drafting</li>
                  <li><strong className="text-slate-900">POST /api/ai/chat-copilot</strong> - CMR 2017 & Mines Act statutory advisor</li>
                </ul>
              </div>

              <div className="p-6 bg-slate-50 border-l-4 border-emerald-500 rounded-r-xl space-y-3 border border-slate-200">
                <p className="text-[10px] text-emerald-700 uppercase font-bold tracking-widest">Data Synchronization</p>
                <h3 className="font-serif italic text-xl text-slate-900">Offline First Field Pipeline</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Field observations captured deep inside opencast quarry benches or underground galleries are stored in encrypted client-side storage with SHA-256 digital signatures, auto-syncing upon network restoration.
                </p>
              </div>
            </div>
          </div>
        }
      </main>

      {/* Editorial Footer */}
      <footer className="h-10 bg-white border-t border-slate-200 flex items-center px-4 sm:px-8 justify-between text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">
        <span>Integrated Smart Governance Framework • Ministry of Coal / DGMS / CIL</span>
        <span className="font-mono text-slate-500 hidden sm:inline">SHA-256 CRYPTOGRAPHIC AUDIT LOGS ACTIVE</span>
      </footer>
    </div>);

};

export default App;