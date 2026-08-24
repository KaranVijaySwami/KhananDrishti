import React, { useState } from "react";

import {
  Bot,
  FileSearch,
  Sparkles,
  Upload,
  Send,

  FileCheck2,
  Cpu,



  FileText,



  Download } from

"lucide-react";






export const AiSentinelOcr = ({
  selectedMine,
  violations
}) => {
  const [activeSubTab, setActiveSubTab] = useState("ocr");

  // OCR Document state
  const [docType, setDocType] = useState("DGMS_Section_22_Notice");
  const [sampleDocumentText, setSampleDocumentText] = useState(
    `GOVERNMENT OF INDIA
MINISTRY OF LABOUR & EMPLOYMENT
DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
SOUTH EASTERN ZONE, BILASPUR

No. DGMS/SEZ/SECL/Dipka-OC/2026/SEC-22(3)/884
Dated: 15th August 2026

To,
The Agent & General Manager,
Dipka / Gevra Opencast Project, SECL, Korba (C.G.)

SUBJECT: Notice under Section 22(3) of the Mines Act, 1952 regarding steep haul road gradient and overburden dump parapet walls.

Sir,
During the statutory inspection of your opencast workings on 12-08-2026, the following non-compliances were observed:

1. Regulation 107 of Coal Mines Regulations (CMR) 2017: The haul road gradient on Incline Ramp 3 measured at 1 in 11.5 against the maximum statutory limit of 1 in 16.
2. DGMS Tech Circular 02 of 2019: Overburden dump parapet berm height found at 2.1 meters, which is significantly lower than the largest tyre diameter of 3.5 meters.
3. You are hereby directed to rectify the above defects within 30 days (by 14-09-2026) and submit a certified Action Taken Report (ATR) with drone survey profile, failing which Section 22(1A) prohibition of transport machinery will be enforced.

Yours faithfully,
(Er. S. Bhattacharya)
Director of Mines Safety`
  );
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  // Risk Engine state
  const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState(null);

  // ATR Generator state
  const [atrForm, setAtrForm] = useState({
    violationRef: "DGMS/SEZ/SECL/Dipka-OC/2026/SEC-22(3)/884",
    observations: "Haul road gradient on Ramp 3 measured at 1 in 11.5, berm height at 2.1m",
    actionsTaken: "Regraded haul road with 16M CAT motor grader to 1 in 16.2 profile. Raised rock-fill berms to 3.9m along 2.4km perimeter with reflective delineators."
  });
  const [isGeneratingAtr, setIsGeneratingAtr] = useState(false);
  const [generatedAtr, setGeneratedAtr] = useState(null);

  // Copilot Chat state
  const [chatMessages, setChatMessages] = useState(

    [
    {
      role: "assistant",
      content: `**Namaste! I am KhananDrishti AI Sentinel**, your statutory advisor for Indian Coal Mining Regulations.
I can assist with:
- **Coal Mines Regulations, 2017 (CMR 2017)** statutory provisions (Reg 106, 107, 153, 169)
- **Mines Act, 1952** Section 22(3) & 22A notice rectifications
- **MoEFCC Environmental Clearance** condition compliance and CAAQMS air/water norms
- **Star Rating of Coal Mines** scoring parameters.

How can I assist your colliery compliance today?`,
      timestamp: "10:30 AM"
    }]
  );
  const [userInput, setUserInput] = useState("");
  const [isAiReplying, setIsAiReplying] = useState(false);

  // Run OCR
  const handleRunOcr = async () => {
    setIsProcessingOcr(true);
    try {
      const response = await fetch("/api/ai/ocr-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: sampleDocumentText,
          docType
        })
      });
      const data = await response.json();
      if (data.extractedData) {
        setOcrResult(data.extractedData);
      }
    } catch (err) {
      console.error("OCR error:", err);
    } finally {
      setIsProcessingOcr(false);
    }
  };

  // Run Risk Engine
  const handleAnalyzeRisk = async () => {
    setIsAnalyzingRisk(true);
    try {
      const response = await fetch("/api/ai/analyze-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mineData: selectedMine,
          violations: violations.filter((v) => v.mineId === selectedMine.id),
          environmentalMetrics: selectedMine.telemetry
        })
      });
      const data = await response.json();
      setRiskAnalysis(data);
    } catch (err) {
      console.error("Risk error:", err);
    } finally {
      setIsAnalyzingRisk(false);
    }
  };

  // Generate ATR
  const handleGenerateAtr = async () => {
    setIsGeneratingAtr(true);
    try {
      const response = await fetch("/api/ai/generate-atr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mineName: selectedMine.name,
          subsidiary: selectedMine.subsidiary,
          violationRef: atrForm.violationRef,
          observations: atrForm.observations,
          correctiveActionsTaken: atrForm.actionsTaken
        })
      });
      const data = await response.json();
      if (data.atrReport) {
        setGeneratedAtr(data.atrReport);
      }
    } catch (err) {
      console.error("ATR error:", err);
    } finally {
      setIsGeneratingAtr(false);
    }
  };

  // Send Chat message
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = {
      role: "user",
      content: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setUserInput("");
    setIsAiReplying(true);

    try {
      const response = await fetch("/api/ai/chat-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          currentContext: {
            mineName: selectedMine.name,
            subsidiary: selectedMine.subsidiary,
            telemetry: selectedMine.telemetry,
            activeViolationsCount: selectedMine.activeViolations
          }
        })
      });
      const data = await response.json();
      setChatMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.reply || "Unable to generate statutory advice.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]
      );
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsAiReplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-[#E64A19]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono tracking-widest text-[#E64A19] uppercase font-bold">
                AI Sentinel & Legal Intelligence Suite
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-300 font-mono font-bold px-2 py-0.5 rounded">
                Gemini 3.7 Core
              </span>
            </div>
            <h2 className="text-xl font-serif italic text-slate-900 mt-1">
              Statutory Notice OCR, Predictive Hazard Matrix & Regulatory Copilot
            </h2>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Transforming dense regulatory letters into automated compliance workflows and verified Action Taken Reports.
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs font-mono">
          <button
            onClick={() => setActiveSubTab("ocr")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
            activeSubTab === "ocr" ? "bg-[#FF4D00] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`
            }>
            
            OCR Digitizer
          </button>
          <button
            onClick={() => setActiveSubTab("risk_engine")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
            activeSubTab === "risk_engine" ? "bg-[#FF4D00] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`
            }>
            
            Risk Matrix
          </button>
          <button
            onClick={() => setActiveSubTab("atr_generator")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
            activeSubTab === "atr_generator" ? "bg-[#FF4D00] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`
            }>
            
            ATR Legal Drafter
          </button>
          <button
            onClick={() => setActiveSubTab("copilot")}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
            activeSubTab === "copilot" ? "bg-[#FF4D00] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`
            }>
            
            CMR Copilot Chat
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: OCR Digitizer */}
      {activeSubTab === "ocr" &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Document */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-serif italic font-semibold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#FF4D00]" />
                <span>Statutory Regulatory Letter / Show-Cause OCR</span>
              </h3>
              <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-800 focus:outline-none">
              
                <option value="DGMS_Section_22_Notice">DGMS Sec 22(3) / 22A Notice</option>
                <option value="MoEFCC_EC_Compliance">MoEFCC EC Show Cause</option>
                <option value="SPCB_Air_Water_Notice">State PCB Air/Water Direction</option>
              </select>
            </div>

            <textarea
            rows={13}
            value={sampleDocumentText}
            onChange={(e) => setSampleDocumentText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00]" />
          

            <button
            onClick={handleRunOcr}
            disabled={isProcessingOcr}
            className="w-full flex items-center justify-center space-x-2 bg-[#FF4D00] hover:bg-[#e04400] text-white font-mono font-bold py-2.5 rounded-lg text-xs shadow-md transition-all cursor-pointer disabled:opacity-50">
            
              <Cpu className="w-4 h-4" />
              <span>{isProcessingOcr ? "Extracting Legal Covenants via Gemini 3.7..." : "Run AI OCR & Citation Extractor"}</span>
            </button>
          </div>

          {/* OCR Extracted Output */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-serif italic font-semibold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Structured Statutory Extraction</span>
              </h3>
              {ocrResult &&
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  Confidence: 98.4%
                </span>
            }
            </div>

            {ocrResult ?
          <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Notice Ref No:</span>
                    <span className="text-[#E64A19] font-bold">{ocrResult.noticeNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issuing Authority:</span>
                    <span className="text-slate-800 font-medium">{ocrResult.issuingAuthority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date Issued:</span>
                    <span className="text-slate-800">{ocrResult.dateIssued}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Statutory Deadline:</span>
                    <span className="text-red-700 font-bold">{ocrResult.statutoryDeadline}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block mb-1">
                    Extracted Legal Violations & Mandates:
                  </span>
                  <div className="space-y-2">
                    {ocrResult.violationsExtracted?.map((viol, i) =>
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between font-mono">
                          <span className="text-red-700 font-bold">{viol.clause}</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
                            {viol.severity}
                          </span>
                        </div>
                        <p className="text-slate-700 font-sans text-xs">{viol.description}</p>
                        <p className="text-[10px] text-emerald-700 font-mono pt-1">
                          Directives: {viol.requiredAction}
                        </p>
                      </div>
                )}
                  </div>
                </div>
              </div> :

          <div className="text-center py-20 text-slate-500 space-y-2">
                <FileSearch className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-xs">Click "Run AI OCR" to automatically parse statutory references and generate CAPA tasks.</p>
              </div>
          }
          </div>
        </div>
      }

      {/* Sub-Tab 2: Predictive Hazard Risk Matrix */}
      {activeSubTab === "risk_engine" &&
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-serif italic text-2xl text-slate-900">
                Predictive Risk Engine & Incident Forecasting
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Multi-factor risk analysis combining pit radar telemetry, CAAQMS dust/gas sensors, and historical violation patterns.
              </p>
            </div>

            <button
            onClick={handleAnalyzeRisk}
            disabled={isAnalyzingRisk}
            className="px-5 py-2.5 bg-[#FF4D00] hover:bg-[#e04400] text-white font-mono font-bold rounded-lg text-xs transition-all shadow-md cursor-pointer disabled:opacity-50">
            
              {isAnalyzingRisk ? "Calculating Monte Carlo Vectors..." : "Recalculate Colliery Risk Index"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Highwall Slope Failure Risk</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-serif italic font-bold text-amber-600">Moderate (32%)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Radar telemetry on Bench 12 detects 0.2mm/hr displacement. Safe threshold is &lt; 0.5mm/hr.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Regulatory Prohibition Exposure</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-serif italic font-bold text-red-600">High (68%)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Notice 22(3) deadline is 14 days away. Failure to submit ATR triggers Sec 22(1A) stop order.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">Environmental Cap Penalty Risk</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-serif italic font-bold text-emerald-600">Low (8%)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Coal production is at 74% of approved EC threshold with 100% CAAQMS sensor uptime.
              </p>
            </div>
          </div>
        </div>
      }

      {/* Sub-Tab 3: Legal ATR Drafter */}
      {activeSubTab === "atr_generator" &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-serif italic font-semibold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-200">
              <FileText className="w-4 h-4 text-[#FF4D00]" />
              <span>Action Taken Report (ATR) Drafting Parameters</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-mono text-[11px] mb-1 font-semibold">
                  DGMS / Regulatory Notice Reference
                </label>
                <input
                type="text"
                value={atrForm.violationRef}
                onChange={(e) => setAtrForm({ ...atrForm, violationRef: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00]" />
              
              </div>

              <div>
                <label className="block text-slate-700 font-mono text-[11px] mb-1 font-semibold">
                  Statutory Non-Compliance Observations
                </label>
                <textarea
                rows={3}
                value={atrForm.observations}
                onChange={(e) => setAtrForm({ ...atrForm, observations: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00]" />
              
              </div>

              <div>
                <label className="block text-slate-700 font-mono text-[11px] mb-1 font-semibold">
                  Engineering Corrective Measures Executed on Ground
                </label>
                <textarea
                rows={4}
                value={atrForm.actionsTaken}
                onChange={(e) => setAtrForm({ ...atrForm, actionsTaken: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#FF4D00]" />
              
              </div>

              <button
              onClick={handleGenerateAtr}
              disabled={isGeneratingAtr}
              className="w-full flex items-center justify-center space-x-2 bg-[#FF4D00] hover:bg-[#e04400] text-white font-mono font-bold py-2.5 rounded-lg text-xs shadow-md transition-all cursor-pointer disabled:opacity-50">
              
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingAtr ? "Generating Formal Legal ATR..." : "Generate Formal DGMS ATR PDF Format"}</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-serif italic font-semibold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Generated Legal Action Taken Report (ATR)</span>
              </h3>
              {generatedAtr &&
            <button
              onClick={() => alert("Action Taken Report PDF generated and cryptographically signed.")}
              className="flex items-center space-x-1 text-xs font-mono text-[#E64A19] font-bold hover:underline">
              
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed PDF</span>
                </button>
            }
            </div>

            {generatedAtr ?
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
                <div className="text-center pb-2 border-b border-slate-200">
                  <h4 className="font-serif font-bold text-slate-900 text-sm">{generatedAtr.title || "ACTION TAKEN REPORT (ATR)"}</h4>
                  <span className="text-[10px] font-mono text-slate-500">SUBMITTED TO DIRECTORATE GENERAL OF MINES SAFETY</span>
                </div>
                <div className="space-y-2 text-slate-700 font-sans text-xs leading-relaxed">
                  <p><strong>Reference:</strong> {generatedAtr.reference || atrForm.violationRef}</p>
                  <p><strong>Colliery Project:</strong> {selectedMine.name}, {selectedMine.subsidiary}</p>
                  <p><strong>Compliance Affirmation:</strong> The engineering deficiencies specified in the statutory notice have been rectified in strict conformance with Coal Mines Regulations 2017.</p>
                  <div className="p-3 bg-white border border-slate-200 rounded text-slate-800 font-mono text-[11px]">
                    {generatedAtr.remedialSummary || atrForm.actionsTaken}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Class-3 Digital Signature Ready</span>
                  <span className="text-emerald-700 font-bold">✓ Certified by Statutory Mines Manager</span>
                </div>
              </div> :

          <div className="text-center py-20 text-slate-500 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-xs">Click "Generate Formal DGMS ATR" to draft an audit-ready legal submission.</p>
              </div>
          }
          </div>
        </div>
      }

      {/* Sub-Tab 4: CMR Copilot Chat */}
      {activeSubTab === "copilot" &&
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-[#FF4D00]" />
              <h3 className="font-serif italic font-semibold text-slate-900 text-base">
                CMR 2017 & Mines Act Statutory Advisory Copilot
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              Active Context: {selectedMine.name} ({selectedMine.subsidiary})
            </span>
          </div>

          {/* Chat message stream */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
            {chatMessages.map((msg, i) =>
          <div
            key={i}
            className={`flex flex-col ${
            msg.role === "user" ? "items-end" : "items-start"}`
            }>
            
                <div
              className={`max-w-[80%] p-3.5 rounded-xl ${
              msg.role === "user" ?
              "bg-slate-900 text-white font-mono text-xs rounded-tr-none shadow-xs" :
              "bg-slate-50 text-slate-900 border border-slate-200 rounded-tl-none space-y-1 shadow-2xs font-sans"}`
              }>
              
                  <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
          )}
            {isAiReplying &&
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D00] animate-spin" />
                <span>Consulting CMR 2017 statutory database...</span>
              </div>
          }
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendChat} className="pt-2 border-t border-slate-200 flex items-center space-x-2">
            <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about CMR 2017 clauses, haul road slopes, DGMS circulars, or EC conditions..."
            className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]" />
          
            <button
            type="submit"
            disabled={isAiReplying || !userInput.trim()}
            className="px-4 py-2.5 bg-[#FF4D00] hover:bg-[#e04400] text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-xs">
            
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      }
    </div>);

};