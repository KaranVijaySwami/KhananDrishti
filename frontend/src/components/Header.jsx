import React, { useState } from "react";

import { MOCK_USER_PERSONAS } from "../data/mockUsers";
import {


  HardHat,

  Wifi,
  WifiOff,
  MapPin,
  FileText,
  Bot,
  Users,
  GitCommit,
  Server,
  Layers,
  LogOut,
  ChevronDown,
  UserCheck,


  CheckCircle2 } from
"lucide-react";



















export const Header = ({
  currentUser,
  onLogout,
  onSwitchUser,
  currentRole,
  setRole,
  selectedSubsidiary,
  setSubsidiary,
  selectedMine,
  setSelectedMineId,
  allMines,
  activeTab,
  setActiveTab,
  isOnline,
  setIsOnline,
  offlineQueueCount
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const filteredMines =
  selectedSubsidiary === "ALL" ?
  allMines :
  allMines.filter((m) => m.subsidiary === selectedSubsidiary);

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "mine_official":
        return "border-[#FF4D00]/40 text-[#E64A19] bg-orange-50";
      case "corporate_hq":
        return "border-amber-400/50 text-amber-700 bg-amber-50";
      case "regulatory_authority":
        return "border-red-400/50 text-red-700 bg-red-50";
      case "safety_officer":
        return "border-emerald-400/50 text-emerald-700 bg-emerald-50";
      case "contractor_supervisor":
        return "border-sky-400/50 text-sky-700 bg-sky-50";
      default:
        return "border-slate-300 text-slate-700 bg-slate-100";
    }
  };

  const navTabs = [
  { id: "command_hub", label: "Central Command", icon: Layers },
  { id: "gis_map", label: "GIS Spatial Map", icon: MapPin },
  { id: "field_inspection", label: "Field Inspection", icon: HardHat, badge: offlineQueueCount > 0 ? `${offlineQueueCount}` : undefined },
  { id: "statutory_registers", label: "Statutory Registers", icon: FileText },
  { id: "ai_sentinel", label: "AI Sentinel & OCR", icon: Bot, isNew: true },
  { id: "contractor_labour", label: "Contractor & Form-B", icon: Users },
  { id: "workflow_audit", label: "CAPA & Audit Trail", icon: GitCommit },
  { id: "backend_guide", label: "System Architecture", icon: Server }];


  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Editorial Ticker Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="flex items-center space-x-1.5 font-bold text-[#E64A19] shrink-0 uppercase tracking-[0.2em] text-[10px]">
            <span className="w-2 h-2 rounded-full bg-[#FF4D00] animate-pulse"></span>
            <span>Statutory Bulletin</span>
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <p className="truncate text-slate-600 text-[11px] font-sans">
            <span className="text-slate-900 font-mono font-semibold">[DGMS/2026/S-22(3)]:</span> Rajmahal OCP East Flank haul gradient rectified to 1:16 • Slope stability radar online in Gevra & Kusmunda • CIL Multi-Mine Star Rating 2025-26 active.
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0 text-[10px]">
          {/* Network Simulator Status */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 border text-[10px] uppercase font-mono font-semibold rounded tracking-wider transition-colors cursor-pointer ${
            isOnline ?
            "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100" :
            "bg-red-50 border-red-300 text-red-700 animate-pulse"}`
            }
            title="Toggle Network Simulation (Tests Field App Offline Sync)">
            
            {isOnline ?
            <>
                <Wifi className="w-3 h-3 text-emerald-600" />
                <span>Sync: Active</span>
              </> :

            <>
                <WifiOff className="w-3 h-3 text-red-600" />
                <span>Offline ({offlineQueueCount} queued)</span>
              </>
            }
          </button>

          <span className="text-slate-500 font-mono uppercase tracking-widest hidden md:inline font-semibold">
            IST {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Masthead Branding */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <span className="font-serif italic font-bold text-[#FF4D00] text-xl">ख</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] tracking-[0.25em] font-bold text-slate-500 uppercase">
                  Coal India Ltd. • Ministry of Coal
                </span>
                <span className="px-1.5 py-0.2 text-[9px] uppercase tracking-widest border border-slate-300 bg-slate-100 text-slate-700 font-mono font-semibold rounded">
                  v2.4
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-serif italic text-slate-900 tracking-tight flex items-baseline gap-2">
                <span>खाननदृष्टि</span>
                <span className="font-sans text-xs not-italic text-slate-500 font-normal tracking-widest uppercase">
                  (KhananDrishti • MineSmart)
                </span>
              </h1>
            </div>
          </div>

          {/* Controls: Subsidiary, Colliery & Authenticated Role Profile */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Subsidiary Filter */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Subsidiary:</span>
              <select
                value={selectedSubsidiary}
                onChange={(e) => {
                  const val = e.target.value;
                  setSubsidiary(val);
                  const firstMine =
                  val === "ALL" ?
                  allMines[0] :
                  allMines.find((m) => m.subsidiary === val) || allMines[0];
                  setSelectedMineId(firstMine.id);
                }}
                className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer text-xs">
                
                <option value="ALL">All (CIL Pan-India)</option>
                <option value="SECL">SECL (South Eastern)</option>
                <option value="ECL">ECL (Eastern Coalfields)</option>
                <option value="BCCL">BCCL (Bharat Coking)</option>
                <option value="CCL">CCL (Central Coalfields)</option>
                <option value="NCL">NCL (Northern Coalfields)</option>
                <option value="MCL">MCL (Mahanadi Coalfields)</option>
                <option value="WCL">WCL (Western Coalfields)</option>
              </select>
            </div>

            {/* Mine Project Selector */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Colliery:</span>
              <select
                value={selectedMine.id}
                onChange={(e) => setSelectedMineId(e.target.value)}
                className="bg-transparent text-[#E64A19] font-bold focus:outline-none cursor-pointer text-xs max-w-[150px] truncate">
                
                {filteredMines.map((mine) =>
                <option key={mine.id} value={mine.id}>
                    {mine.name} ({mine.subsidiary})
                  </option>
                )}
              </select>
            </div>

            {/* Authenticated User Session Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer shadow-2xs">
                
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-serif font-semibold text-slate-900 text-[11px] leading-tight">
                      {currentUser.name}
                    </span>
                    <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border ${getRoleBadgeStyle(currentUser.role)}`}>
                      {currentUser.role.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block leading-tight">
                    {currentUser.employeeCode}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
              </button>

              {/* Role & Session Switcher Dropdown Modal */}
              {showUserMenu &&
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 space-y-3 font-sans animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span className="font-serif font-semibold text-slate-900 text-sm">
                          {currentUser.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-sans mt-0.5 font-medium">
                        {currentUser.designation}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {currentUser.department}
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Statutory Cert:</span>
                      <span className="text-slate-800 font-semibold">{currentUser.statutoryCertNo || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DSC Key Token:</span>
                      <span className="text-emerald-700 font-semibold">Attached (Active)</span>
                    </div>
                  </div>

                  {/* Switch Role Quick Links */}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block mb-2 font-bold">
                      Switch Mining Role Persona:
                    </span>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {MOCK_USER_PERSONAS.map((persona) => {
                      const isCurrent = persona.user.id === currentUser.id;
                      return (
                        <button
                          key={persona.user.id}
                          onClick={() => {
                            onSwitchUser(persona.user);
                            setRole(persona.user.role);
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isCurrent ?
                          "bg-orange-50 border border-[#FF4D00] text-slate-900 font-medium" :
                          "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"}`
                          }>
                          
                            <div>
                              <div className="font-medium font-serif leading-tight text-slate-900">
                                {persona.user.name}
                              </div>
                              <div className="text-[10px] font-mono text-slate-500">
                                {persona.user.role.replace("_", " ").toUpperCase()} • {persona.user.employeeCode}
                              </div>
                            </div>
                            {isCurrent &&
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4D00]" />
                          }
                          </button>);

                    })}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 py-2 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer">
                    
                      <LogOut className="w-3.5 h-3.5 text-red-600" />
                      <span>Log Out to Statutory Login Gateway</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        {/* Editorial Navigation Tabs */}
        <nav className="flex items-center space-x-1 mt-3 overflow-x-auto pb-1 text-xs border-t border-slate-200 pt-2.5">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 text-xs transition-all whitespace-nowrap cursor-pointer rounded-lg ${
                isActive ?
                "bg-[#FF4D00] text-white font-bold shadow-xs" :
                "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"}`
                }>
                
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {tab.isNew &&
                <span className={`px-1.5 py-0.2 text-[9px] uppercase tracking-wider font-bold rounded ${
                isActive ? "bg-white text-[#FF4D00]" : "bg-orange-100 text-[#E64A19]"}`
                }>
                    AI
                  </span>
                }
                {tab.badge &&
                <span className="px-1.5 py-0.2 bg-red-100 text-red-700 border border-red-300 text-[9px] font-mono font-bold rounded">
                    {tab.badge}
                  </span>
                }
              </button>);

          })}
        </nav>
      </div>
    </header>);

};