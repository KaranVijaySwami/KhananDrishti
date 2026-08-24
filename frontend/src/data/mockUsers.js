











export const MOCK_USER_PERSONAS = [
{
  loginId: "SECL-MGR-4192",
  pin: "gevra2026",
  dscKey: "DSC-CIL-FMC-4192-CLASS3",
  badgeColor: "border-[#FF4D00] text-[#FF4D00]",
  authorityLevel: "Colliery Operational Authority (Mines Manager)",
  statutoryPowers: [
  "Mines Act 1952 Sec 17 Operational In-Charge",
  "Signatory for CMR 2017 Action Taken Reports (ATR)",
  "Authorization of Form-B & Biometric Smart Gate access",
  "Class-3 DSC Digital Token verification & closure"],

  user: {
    id: "usr_mgr_01",
    name: "Er. Alok Kumar Sharma",
    designation: "General Manager / Mines Manager (1st Class FMC)",
    role: "mine_official",
    subsidiary: "SECL",
    mineId: "M01-GEVRA",
    mineName: "Gevra Mega Opencast Project",
    department: "Colliery Mine Management & Operations",
    employeeCode: "EIS-90214432",
    statutoryCertNo: "DGMS/FMC/4192/2014",
    dscKeyId: "CERT-IN-DSC-90214432",
    allowedTabs: [
    "command_hub",
    "gis_map",
    "field_inspection",
    "statutory_registers",
    "ai_sentinel",
    "contractor_labour",
    "workflow_audit",
    "backend_guide"]

  }
},
{
  loginId: "CIL-DIR-HQ01",
  pin: "cilkolkata26",
  dscKey: "DSC-CIL-HQ-DIR-TECH-01",
  badgeColor: "border-amber-400 text-amber-400",
  authorityLevel: "Corporate Executive & Ministry Liaison (CIL Apex)",
  statutoryPowers: [
  "Pan-India CIL 8-Subsidiary Multi-Mine Oversight",
  "Ministry of Coal Star-Rating 50-parameter approval",
  "Capex & Escrow Closure Fund allocations (Rs. 412.8 Cr)",
  "High-level Escalation Level-2 CAPA Interventions"],

  user: {
    id: "usr_corp_02",
    name: "Shri V. K. Mukherjee",
    designation: "Director (Technical) / CIL Apex Command",
    role: "corporate_hq",
    subsidiary: "CIL_HQ",
    mineId: "M01-GEVRA",
    mineName: "Pan-India Colliery Fleet",
    department: "Coal India Corporate Secretariat, Kolkata",
    employeeCode: "EIS-80012984",
    statutoryCertNo: "CIL/BOARD/DIR-T/2022",
    dscKeyId: "CERT-IN-DSC-80012984",
    allowedTabs: [
    "command_hub",
    "gis_map",
    "statutory_registers",
    "workflow_audit",
    "backend_guide"]

  }
},
{
  loginId: "DGMS-SEZ-DDMS44",
  pin: "dgmsaudit26",
  dscKey: "DSC-GOI-DGMS-DDMS-4412",
  badgeColor: "border-red-500 text-red-400",
  authorityLevel: "Statutory Regulatory Authority (Govt. of India)",
  statutoryPowers: [
  "Mines Act 1952 Sec 22 & 22A Prohibition Powers",
  "Issuance of Form-IV & Section-22 Rectification Notices",
  "Mandatory unannounced Colliery Audits & Slope Scrutiny",
  "Ministry Star-Rating penalty and audit endorsements"],

  user: {
    id: "usr_dgms_03",
    name: "Er. S. Bhattacharya",
    designation: "Dy. Director of Mines Safety (DGMS South Eastern Zone)",
    role: "regulatory_authority",
    subsidiary: "SECL",
    mineId: "M01-GEVRA",
    mineName: "DGMS SEZ Jurisdiction (Bilaspur)",
    department: "Directorate General of Mines Safety, Ministry of Labour",
    employeeCode: "GOI-DGMS-4412",
    statutoryCertNo: "DGMS/DDMS/SEZ/4412",
    dscKeyId: "GOI-NIC-DSC-4412",
    allowedTabs: [
    "command_hub",
    "gis_map",
    "statutory_registers",
    "ai_sentinel",
    "workflow_audit",
    "backend_guide"]

  }
},
{
  loginId: "SECL-SFT-7718",
  pin: "safetyfirst",
  dscKey: "DSC-CIL-SO-7718",
  badgeColor: "border-emerald-400 text-emerald-400",
  authorityLevel: "Colliery Safety Officer & Lead Auditor",
  statutoryPowers: [
  "Daily Pit & Bench Hazard Logging & Gas Telemetry Audit",
  "Offline Field Inspection sync with GPS & timestamp locking",
  "HEMM Fitness & Lockout/Tagout (LOTO) validation",
  "Worker PME & VTC training compliance verification"],

  user: {
    id: "usr_sft_04",
    name: "Er. Rajesh Verma",
    designation: "Colliery Safety Officer & ISO-45001 Lead Auditor",
    role: "safety_officer",
    subsidiary: "SECL",
    mineId: "M01-GEVRA",
    mineName: "Gevra Mega Opencast Project",
    department: "Safety, Health & Environment (SHE) Cell",
    employeeCode: "EIS-91033211",
    statutoryCertNo: "DGMS/SFT/CERT/7718",
    dscKeyId: "CERT-IN-DSC-91033211",
    allowedTabs: [
    "field_inspection",
    "command_hub",
    "statutory_registers",
    "gis_map",
    "ai_sentinel"]

  }
},
{
  loginId: "CONT-SNG-9901",
  pin: "contractor26",
  dscKey: "DSC-EPFO-CONT-9901",
  badgeColor: "border-sky-400 text-sky-400",
  authorityLevel: "Authorized Contractor Representative",
  statutoryPowers: [
  "Form-B Digital Labour register submission (Mines Rules 1955)",
  "PME Medical Fitness & VTC vocational training certificate uploads",
  "HEMM Dumper/Excavator operator roster clearance",
  "Contractor safety violation remediation responses"],

  user: {
    id: "usr_cont_05",
    name: "Shri Sunil Singhal",
    designation: "Managing Partner, M/s Singhal Mining Logistics",
    role: "contractor_supervisor",
    subsidiary: "SECL",
    mineId: "M01-GEVRA",
    mineName: "Gevra Mega Opencast Project",
    department: "HEMM Operations & Coal Transportation Division",
    employeeCode: "CONT-GST-22AAACR1234",
    statutoryCertNo: "CIL/CONT/REG/2021/SECL-9901",
    dscKeyId: "GST-DSC-CONT-9901",
    allowedTabs: [
    "contractor_labour",
    "statutory_registers",
    "command_hub"]

  }
}];