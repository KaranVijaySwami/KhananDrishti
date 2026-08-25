import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FieldInspection } from "./FieldInspection";
import { ShieldAlert, ShieldCheck, MapPin } from "lucide-react";

export const InspectorDashboard = ({ selectedMine, isOnline, offlineQueueCount, inspections, onAddInspection }) => {
  const { user } = useContext(AuthContext);

  const mineInspections = inspections.filter(i => i.mineId === selectedMine.id);
  const compliantCount = mineInspections.filter(i => i.overallVerdict === "Compliant").length;
  const nonCompliantCount = mineInspections.length - compliantCount;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif italic text-slate-900">
            Welcome, {user?.name || "Inspector"}
          </h2>
          <p className="text-xs text-slate-600 font-sans mt-0.5">
            {user?.role === "safety_officer" ? "Safety Officer / Mine Inspector" : "Inspector"} • {user?.employeeCode}
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Assigned Mine: <strong className="text-slate-900">{selectedMine?.name || user?.subsidiary}</strong></span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Total Inspections</p>
          <p className="text-2xl font-bold mt-1 text-slate-900">{mineInspections.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Compliant</p>
          </div>
          <p className="text-2xl font-bold mt-1 text-emerald-600">{compliantCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Non-Compliant</p>
          </div>
          <p className="text-2xl font-bold mt-1 text-red-600">{nonCompliantCount}</p>
        </div>
      </div>

      {/* Field Inspection Component */}
      <div className="pt-4">
        <FieldInspection 
          selectedMine={selectedMine}
          isOnline={isOnline}
          offlineQueueCount={offlineQueueCount}
          onAddInspection={onAddInspection}
          inspections={mineInspections}
        />
      </div>
    </div>
  );
};
