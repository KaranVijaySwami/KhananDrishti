
import { getGeminiClient } from "../config/gemini.js";

// POST /api/ai/analyze-risk
export const analyzeRisk = async (req, res) => {
  try {
    const { mineData, violations, environmentalMetrics } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true, isSimulated: true,
        riskScore: 74, hazardLevel: "High",
        summary: "Elevated OB dump slope displacement (14.2mm) and 2 overdue DGMS ventilation audits in Seam IV.",
        highRiskAreas: [{ area: "East Flank Bench #4", hazard: "Slope stability < 1.15", severity: "Critical", recommendedAction: "Restrict dumper haulage.", statutoryReference: "CMR 2017 Reg 106" }],
        predictiveTrends: ["PM10 breach NAAQS within 48hrs without dust suppression."],
        complianceForecastScore: 81
      });
    }
    const prompt = `You are the Chief Safety & Environmental Governance Officer for Coal India Limited. Analyze:\nMINE: ${JSON.stringify(mineData)}\nVIOLATIONS: ${JSON.stringify(violations)}\nTELEMETRY: ${JSON.stringify(environmentalMetrics)}\nRespond ONLY with valid JSON: { riskScore, hazardLevel, summary, highRiskAreas: [{area, hazard, severity, recommendedAction, statutoryReference}], predictiveTrends, complianceForecastScore }`;
    const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt, config: { responseMimeType: "application/json", temperature: 0.2 } });
    res.json({ success: true, isSimulated: false, ...JSON.parse(response.text || "{}") });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/ai/ocr-doc
export const ocrDocument = async (req, res) => {
  try {
    const { documentBase64, mimeType = "image/png", documentText, docType } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true, isSimulated: true,
        extractedData: {
          issuingAuthority: "DGMS South Eastern Zone", referenceNumber: "DGMS/SEZ/2026/S-22(3)/884",
          subject: "Notice under Section 22(3) — Haul Road gradient & OB dump berm heights",
          issueDate: "2026-08-15", statutoryDeadline: "2026-09-14", riskRating: "High",
          covenants: [{ clause: "CMR 2017 Reg 107", requirement: "Gradient not to exceed 1 in 16.", status: "Non-Compliant" }],
          actionItems: [{ task: "Regrade Ramp 3 to 1 in 16.", assignedTo: "Colliery Engineer", targetDate: "2026-08-30", priority: "Critical" }]
        }
      });
    }
    const parts = [];
    if (documentBase64) parts.push({ inlineData: { mimeType, data: documentBase64 } });
    parts.push({ text: `Parse this ${docType || "mining statutory"} document and return JSON: { extractedData: { issuingAuthority, referenceNumber, subject, issueDate, statutoryDeadline, riskRating, covenants: [{clause, requirement, status}], actionItems: [{task, assignedTo, targetDate, priority}] } }. Input text: ${documentText || ""}` });
    const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: { parts }, config: { responseMimeType: "application/json", temperature: 0.1 } });
    res.json({ success: true, isSimulated: false, ...JSON.parse(response.text || "{}") });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/ai/generate-atr
export const generateATR = async (req, res) => {
  try {
    const { mineName, subsidiary, violationRef, observations, correctiveActionsTaken } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true, isSimulated: true,
        atrReport: {
          title: `STATUTORY ATR — ${subsidiary?.toUpperCase()} / ${mineName?.toUpperCase()}`,
          refNumber: `CIL/${subsidiary}/ATR/2026/${Date.now().toString().slice(-5)}`,
          submissionDate: new Date().toISOString().split("T")[0],
          executiveSummary: `ATR against ${violationRef}. All remedial works executed per CMR 2017.`,
          statutoryProvisionsComplied: ["CMR 2017 Reg 106 & 107", "Mines Act 1952 Sec 22(3)"],
          tableOfActions: [{ observation: "Haul road gradient exceeded 1 in 16", actionTaken: "Regraded to 1 in 16.5 and verified.", verificationStatus: "Certified by Safety Officer", complianceDate: "2026-08-20" }],
          managerDeclaration: "I declare all corrective measures have been executed under my supervision per Section 17, Mines Act 1952."
        }
      });
    }
    const prompt = `Draft an official ATR for DGMS submission. Mine: ${mineName}, Subsidiary: ${subsidiary}, Ref: ${violationRef}, Observations: ${JSON.stringify(observations)}, Actions: ${JSON.stringify(correctiveActionsTaken)}. Return JSON: { atrReport: { title, refNumber, submissionDate, executiveSummary, statutoryProvisionsComplied, tableOfActions: [{observation, actionTaken, verificationStatus, complianceDate}], managerDeclaration } }`;
    const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt, config: { responseMimeType: "application/json", temperature: 0.2 } });
    res.json({ success: true, isSimulated: false, ...JSON.parse(response.text || "{}") });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/ai/chat-copilot
export const chatCopilot = async (req, res) => {
  try {
    const { messages, currentContext } = req.body;
    const ai = getGeminiClient();
    const lastMsg = messages?.length ? messages[messages.length - 1].content : "";
    if (!ai) {
      return res.json({
        success: true, isSimulated: true,
        reply: `**KhananDrishti AI Statutory Advisory**:\n\nRegarding "${lastMsg.slice(0, 80)}":\n\n1. Under **CMR 2017 Reg 106 & 107**, haul road gradient shall not exceed **1 in 16** with continuous parapet berms equal to the largest wheel diameter (3.5m).\n2. DGMS Tech Circular 04/2020 mandates real-time slope stability radar for all highwall dumps >30m.\n3. Record all observations in Form IV register within 2 hours.`
      });
    }
    const history = (messages || []).map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`).join("\n");
    const prompt = `You are KhananDrishti AI — expert statutory advisor for Indian coal mining under CMR 2017, Mines Act 1952, DGMS Circulars, and MoEFCC EC conditions.\nContext: ${JSON.stringify(currentContext || {})}\n\n${history}\n\nAI:`;
    const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt, config: { temperature: 0.25 } });
    res.json({ success: true, isSimulated: false, reply: response.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};