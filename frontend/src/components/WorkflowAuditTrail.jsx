import React, { useState } from "react";

import { AUDIT_TRAIL_LOGS } from "../data/mockData";
import {
  GitCommit,
  ShieldCheck,
  Lock,
  CheckCircle2,


  Clock,
  KeyRound } from


"lucide-react";





export const WorkflowAuditTrail = ({
  violations
}) => {
  const [logs, setLogs] = useState(AUDIT_TRAIL_LOGS);
  const [selectedLog, setSelectedLog] = useState(logs[0]);
  const [selectedViolationId, setSelectedViolationId] = useState(
    violations[0]?.id || "VIOL-2026-881"
  );
  const [isSigning, setIsSigning] = useState(false);
  const [signedNoticeId, setSignedNoticeId] = useState(null);

  const handleDigitalSign = (violationId) => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setSignedNoticeId(violationId);
      const newHash = `sha256-${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
      const targetNotice = violations.find((v) => v.id === violationId);
      const newEntry = {
        id: `LOG-SHA-${Date.now().toString().slice(-5)}`,
        timestamp: `${new Date().toISOString().split("T")[0]} ${new Date().toLocaleTimeString()} IST`,
        actor: "Er. Alok Kumar Sharma (Statutory Colliery Manager)",
        role: "Mine Official",
        action: `Cryptographically counter-signed Action Taken Report (ATR) for notice ${violationId}${targetNotice ? ` (${targetNotice.mineName})` : ""}`,
        targetRef: violationId,
        tamperProofHash: newHash,
        previousHash: logs[0]?.tamperProofHash || "root",
        verified: true
      };
      setLogs([newEntry, ...logs]);
      setSelectedLog(newEntry);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-[#E64A19]">
            <GitCommit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono tracking-widest text-[#E64A19] uppercase font-bold">
                Tamper-Evident Digital Governance
              </span>
              <span className="text-[9px] bg-slate-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                SHA-256 Hash Chain
              </span>
            </div>
            <h2 className="text-xl font-serif italic text-slate-900 mt-1">
              Automated Escalations, CAPA Workflow & Blockchain Audit Trail
            </h2>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Guaranteed accountability with non-repudiation digital signatures and multi-tier escalation triggers.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-700">All Audit Hashes: <strong className="text-emerald-700 font-bold">100% Cryptographically Verified</strong></span>
        </div>
      </div>

      {/* 3-Tier Escalation Workflow Visualizer */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#FF4D00]" />
          <span>Statutory CAPA Escalation Hierarchy & Timers</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Level 1 */}
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider">
                Level 1: Colliery Level
              </span>
              <span className="text-[10px] bg-white text-emerald-800 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                0 - 7 Days
              </span>
            </div>
            <p className="text-slate-900 font-serif font-bold mt-2">Colliery Safety Officer & Mines Manager</p>
            <p className="text-slate-600 font-sans text-[11px] mt-1 leading-relaxed">
              Immediate hazard cordon, engineering remediation, and preliminary Action Taken Report (ATR) drafting.
            </p>
          </div>

          {/* Level 2 */}
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider">
                Level 2: Subsidiary HQ
              </span>
              <span className="text-[10px] bg-white text-amber-800 px-2 py-0.5 rounded font-mono font-bold border border-amber-200">
                8 - 14 Days
              </span>
            </div>
            <p className="text-slate-900 font-serif font-bold mt-2">Area General Manager & Director (Technical)</p>
            <p className="text-slate-600 font-sans text-[11px] mt-1 leading-relaxed">
              Automated SMS/Email escalation triggers; emergency fleet and civil contractors reallocated.
            </p>
          </div>

          {/* Level 3 */}
          <div className="bg-red-50/50 p-4 rounded-xl border border-red-200 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-red-800 uppercase tracking-wider">
                Level 3: Regulatory Red Alert
              </span>
              <span className="text-[10px] bg-white text-red-800 px-2 py-0.5 rounded font-mono font-bold border border-red-200">
                &gt; 14 Days Overdue
              </span>
            </div>
            <p className="text-slate-900 font-serif font-bold mt-2">DGMS Regional Office & Ministry of Coal</p>
            <p className="text-slate-600 font-sans text-[11px] mt-1 leading-relaxed">
              Statutory prohibition notices, Star Rating penalty deduction, and physical joint re-inspection.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Log Chain & Digital Signature Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Immutable Audit Log List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FF4D00]" />
              <span>Immutable Hash-Chained Audit Stream</span>
            </h3>
            <span className="text-xs font-mono text-slate-500 font-bold">{logs.length} Blocks</span>
          </div>

          <div className="space-y-3">
            {logs.map((log) => {
              const isSelected = selectedLog?.id === log.id;
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected ?
                  "bg-orange-50/40 border-[#FF4D00] shadow-xs" :
                  "bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs"}`
                  }>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#E64A19]">{log.id}</span>
                      <span className="text-slate-400 text-[11px]">{log.timestamp}</span>
                    </div>
                    <span className="text-emerald-700 text-[11px] font-bold flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified Block
                    </span>
                  </div>

                  <p className="text-slate-900 text-xs font-semibold mt-2 font-sans">{log.action}</p>

                  <div className="mt-2 text-[11px] text-slate-500 font-mono flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <span>Actor: <strong className="text-slate-800 font-sans font-semibold">{log.actor}</strong></span>
                    <span className="text-slate-400 truncate max-w-[200px]">
                      Hash: {log.tamperProofHash.slice(0, 16)}...
                    </span>
                  </div>
                </div>);

            })}
          </div>
        </div>

        {/* Right Col: Digital Signature Sign-Off Console */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
            <KeyRound className="w-4 h-4 text-[#FF4D00]" />
            <span>Digital Certificate Sign-Off</span>
          </h3>

          <div className="text-xs space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block text-[11px] font-mono font-bold">Authorized Certificate:</span>
              <strong className="text-slate-900 block font-serif font-bold">Class-3 DSC (Mine Manager - Er. Alok Sharma)</strong>
              <span className="text-slate-500 font-mono text-[10px]">Valid Until: 31-DEC-2027</span>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-mono text-[11px] font-bold">Select Pending Notice for Sign-Off</label>
              <select
                value={selectedViolationId}
                onChange={(e) => setSelectedViolationId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:border-[#FF4D00]">
                
                {violations.map((v) =>
                <option key={v.id} value={v.id}>
                    {v.id} - {v.mineName} ({v.clause})
                  </option>
                )}
              </select>
            </div>

            <button
              onClick={() => handleDigitalSign(selectedViolationId)}
              disabled={isSigning}
              className="w-full flex items-center justify-center space-x-2 bg-[#FF4D00] hover:bg-[#e04400] text-white font-mono font-bold py-2.5 rounded-lg text-xs shadow-md transition-all cursor-pointer disabled:opacity-50">
              
              <KeyRound className="w-4 h-4" />
              <span>{isSigning ? "Signing & Hashing Block..." : "Sign Action Taken Report (DSC)"}</span>
            </button>

            {signedNoticeId &&
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-mono font-semibold">
                ✓ Cryptographic signature appended for {signedNoticeId}. Audit record propagated across CIL node network.
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

};