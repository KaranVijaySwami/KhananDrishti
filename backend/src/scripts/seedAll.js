/**
 * KhananDrishti — Master Seed Script
 * Seeds ALL collections with realistic Coal India mock data.
 * Run: node backend/src/scripts/seedAll.js
 */

import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { User }               from "../models/User.js";
import { MineSite }           from "../models/MineSite.js";
import { StatutoryViolation } from "../models/StatutoryViolation.js";
import { ContractorRecord }   from "../models/ContractorRecord.js";
import { FormBWorker }        from "../models/FormBWorker.js";

const users = [
  { id:"USR-001", name:"Er. Alok Kumar Sharma", email:"alok.sharma@secl.com", designation:"General Manager / Mines Manager (1st Class FMC)", role:"mine_official", subsidiary:"SECL", mineId:"MINE-SECL-001", mineName:"Gevra Mega Opencast Project", department:"Colliery Mine Management & Operations", employeeCode:"EIS-90214432", password:"password123", statutoryCertNo:"FMC-1ST-9821", dscKeyId:"DSC-MGR-01", allowedTabs:["command_hub","gis_map","field_inspection","statutory_registers"] },
  { id:"USR-002", name:"Shri V. K. Mukherjee", email:"vk.mukherjee@coalindia.in", designation:"Director (Technical) / CIL Apex Command", role:"corporate_hq", subsidiary:"CIL_HQ", department:"Coal India Corporate Secretariat", employeeCode:"EIS-80012904", password:"password123", dscKeyId:"DSC-CIL-HQ-01", allowedTabs:["command_hub","gis_map","workflow_audit"] },
  { id:"INSP-SECL-001", name:"Er. Rajesh Verma", email:"rajesh.verma@secl.com", designation:"Safety Officer (Mining)", role:"safety_officer", subsidiary:"SECL", department:"Safety & Environment", employeeCode:"INSP-SECL-001", password:"inspect123", allowedTabs:["field_inspection","statutory_registers","gis_map"] },
  { id:"INSP-SECL-002", name:"Er. S. N. Mishra", email:"sn.mishra@secl.com", designation:"Assistant Safety Officer", role:"safety_officer", subsidiary:"SECL", department:"Safety & Environment", employeeCode:"INSP-SECL-002", password:"inspect123", allowedTabs:["field_inspection","statutory_registers"] },
  { id:"INSP-ECL-001", name:"Er. Tanmay Ghosh", email:"t.ghosh@ecl.com", designation:"Safety Officer (Mining)", role:"safety_officer", subsidiary:"ECL", department:"Safety & Environment", employeeCode:"INSP-ECL-001", password:"inspect123", allowedTabs:["field_inspection","statutory_registers","gis_map"] },
  { id:"INSP-BCCL-001", name:"Er. K. D. Pandey", email:"kd.pandey@bccl.com", designation:"Chief Safety Officer", role:"safety_officer", subsidiary:"BCCL", department:"Safety & Environment", employeeCode:"INSP-BCCL-001", password:"inspect123", allowedTabs:["field_inspection","statutory_registers","gis_map","command_hub"] },
];

const mineSites = [
  { id:"MINE-SECL-001", name:"Gevra Mega Opencast Project", subsidiary:"SECL", state:"Chhattisgarh", district:"Korba", type:"Opencast", capacityMTPA:52.5, currentProductionMT:48.2, ecCapMTPA:55.0, complianceScore:87, starRating:4, lat:22.3925, lng:82.7245, manager:"Er. Alok Kumar Sharma", safetyOfficer:"Er. Rajesh Verma", activeViolations:3, highRiskHazards:1, lastInspectionDate:"2026-08-10", status:"Operational", telemetry:{ methanePct:0.12, coPpm:18, dustPm10:142, waterPh:7.1, slopeDisplacementMm:3.2, noiseDb:87 } },
  { id:"MINE-SECL-002", name:"Kusmunda Opencast Mine", subsidiary:"SECL", state:"Chhattisgarh", district:"Korba", type:"Opencast", capacityMTPA:35.0, currentProductionMT:31.8, ecCapMTPA:37.5, complianceScore:79, starRating:3, lat:22.4712, lng:82.7938, manager:"Er. P. K. Gupta", safetyOfficer:"Er. S. N. Mishra", activeViolations:7, highRiskHazards:3, lastInspectionDate:"2026-08-15", status:"Restricted_Notice", telemetry:{ methanePct:0.08, coPpm:22, dustPm10:198, waterPh:6.8, slopeDisplacementMm:8.7, noiseDb:91 } },
  { id:"MINE-BCCL-001", name:"Jharia Coalfield - Block II UG", subsidiary:"BCCL", state:"Jharkhand", district:"Dhanbad", type:"Underground", capacityMTPA:8.5, currentProductionMT:6.9, ecCapMTPA:9.0, complianceScore:62, starRating:2, lat:23.7819, lng:86.4208, manager:"Er. Suresh Tiwari", safetyOfficer:"Er. K. D. Pandey", activeViolations:14, highRiskHazards:6, lastInspectionDate:"2026-08-01", status:"Restricted_Notice", telemetry:{ methanePct:1.45, coPpm:78, dustPm10:312, waterPh:6.2, slopeDisplacementMm:0.0, noiseDb:94 } },
  { id:"MINE-ECL-001", name:"Rajmahal OC Project", subsidiary:"ECL", state:"Jharkhand", district:"Sahibganj", type:"Opencast", capacityMTPA:15.0, currentProductionMT:13.4, ecCapMTPA:16.0, complianceScore:91, starRating:5, lat:25.0521, lng:87.8431, manager:"Er. Pradeep Roy", safetyOfficer:"Er. Tanmay Ghosh", activeViolations:1, highRiskHazards:0, lastInspectionDate:"2026-08-18", status:"Operational", telemetry:{ methanePct:0.05, coPpm:11, dustPm10:98, waterPh:7.4, slopeDisplacementMm:1.1, noiseDb:81 } },
  { id:"MINE-MCL-001", name:"Bharatpur OC Mine", subsidiary:"MCL", state:"Odisha", district:"Angul", type:"Opencast", capacityMTPA:26.0, currentProductionMT:24.1, ecCapMTPA:28.0, complianceScore:83, starRating:4, lat:20.8392, lng:85.1124, manager:"Er. Dipak Mohanty", safetyOfficer:"Er. A. K. Patra", activeViolations:4, highRiskHazards:2, lastInspectionDate:"2026-08-12", status:"Operational", telemetry:{ methanePct:0.09, coPpm:14, dustPm10:165, waterPh:7.0, slopeDisplacementMm:4.5, noiseDb:88 } },
];

const violations = [
  { id:"VIO-2026-001", mineId:"MINE-SECL-001", mineName:"Gevra Mega Opencast Project", subsidiary:"SECL", category:"Slope Stability", clause:"CMR Reg. 106(1)", description:"Bench slope angle exceeding 60 degrees in sector D-7. Measured at 68 degrees on 3 occasions.", severity:"High", dateIssued:"2026-07-22", statutoryDeadline:"2026-08-22", issuingAuthority:"DGMS Regional Office, Bilaspur", issuingOfficer:"Sh. A. R. Misra, Dy. DGMS", noticeRef:"DGMS/BLP/2026/NOV-0441", status:"ATR_Submitted", assignedPerson:"Er. Alok Kumar Sharma", actionTaken:"Bench re-dressed to 58 degrees and geotechnical assessment commissioned.", geoTag:{ lat:22.3941, lng:82.7261, bench:"D-7 Bench", seam:"Seam-II" } },
  { id:"VIO-2026-002", mineId:"MINE-SECL-001", mineName:"Gevra Mega Opencast Project", subsidiary:"SECL", category:"Dust Control", clause:"MCHWR Rule 11", description:"PM10 dust levels exceeding 150 ug/m3 near crushing station C-3 on 5 consecutive days.", severity:"Medium", dateIssued:"2026-08-05", statutoryDeadline:"2026-09-05", issuingAuthority:"State Pollution Control Board, CG", issuingOfficer:"Ms. Preeti Nair, EO", noticeRef:"CPCB/CG/2026/DT-0892", status:"Open", assignedPerson:"Er. Rajesh Verma", actionTaken:"", geoTag:{ lat:22.3915, lng:82.7229, bench:"Surface Level", seam:"Surface" } },
  { id:"VIO-2026-003", mineId:"MINE-SECL-002", mineName:"Kusmunda Opencast Mine", subsidiary:"SECL", category:"Haul Road Safety", clause:"CMR Reg. 82(3)", description:"Haul road width less than 2.5x maximum dump width at junction J-12. No crash barrier installed.", severity:"Critical", dateIssued:"2026-07-30", statutoryDeadline:"2026-08-14", issuingAuthority:"DGMS Regional Office, Bilaspur", issuingOfficer:"Sh. R. K. Yadav, DGMS Inspector", noticeRef:"DGMS/BLP/2026/NOV-0389", status:"Escalated_Level2", assignedPerson:"Er. P. K. Gupta", actionTaken:"Road widening partially complete. Escalated to Area GM.", geoTag:{ lat:22.4730, lng:82.7952, bench:"Haul Road Level", seam:"Surface" } },
  { id:"VIO-2026-004", mineId:"MINE-BCCL-001", mineName:"Jharia Coalfield - Block II UG", subsidiary:"BCCL", category:"Gas Management", clause:"CMR Reg. 162(1)", description:"Methane concentration exceeding 1.25% at return airway RW-4A. Gas monitoring sensors non-functional.", severity:"Critical", dateIssued:"2026-08-02", statutoryDeadline:"2026-08-09", issuingAuthority:"DGMS Eastern Zone, Dhanbad", issuingOfficer:"Sh. B. N. Sinha, Sr. DGMS", noticeRef:"DGMS/DHN/2026/NOV-0521", status:"Escalated_Level3", assignedPerson:"Er. K. D. Pandey", actionTaken:"Section evacuated. Sensors replaced but calibration pending.", geoTag:{ lat:23.7824, lng:86.4213, bench:"Level -300m", seam:"Rani Seam" } },
  { id:"VIO-2026-005", mineId:"MINE-BCCL-001", mineName:"Jharia Coalfield - Block II UG", subsidiary:"BCCL", category:"Worker Safety", clause:"CMSHA 1984 Sec. 19", description:"5 contract workers operating HEMM without valid VTC certification.", severity:"High", dateIssued:"2026-08-10", statutoryDeadline:"2026-08-25", issuingAuthority:"DGMS Eastern Zone, Dhanbad", issuingOfficer:"Sh. B. N. Sinha, Sr. DGMS", noticeRef:"DGMS/DHN/2026/NOV-0544", status:"Open", assignedPerson:"Er. Suresh Tiwari", actionTaken:"", geoTag:{ lat:23.7810, lng:86.4198, bench:"Surface Yard", seam:"Surface" } },
  { id:"VIO-2026-006", mineId:"MINE-ECL-001", mineName:"Rajmahal OC Project", subsidiary:"ECL", category:"Environmental", clause:"EC Condition 4.3", description:"Mine water discharge pH reading 5.8 at monitoring point MP-02, below permissible 6.0.", severity:"Low", dateIssued:"2026-08-14", statutoryDeadline:"2026-09-14", issuingAuthority:"State Pollution Control Board, JH", issuingOfficer:"Ms. S. Chatterjee, EO", noticeRef:"JSPCB/2026/EC-0211", status:"ATR_Submitted", assignedPerson:"Er. Tanmay Ghosh", actionTaken:"Neutralisation tank adjusted. pH now 6.4. ATR with lab report submitted.", geoTag:{ lat:25.0509, lng:87.8418, bench:"Surface Pond", seam:"Surface" } },
];

const contractors = [
  { id:"CONT-SECL-001", contractorName:"M/s Rungta Mines Ltd.", contractCode:"SECL/OC/CONT/2025-26/041", subsidiary:"SECL", mineId:"MINE-SECL-001", totalWorkers:284, formBCompliantPct:94.3, pmeValidPct:88.7, vtcCertifiedPct:91.2, safetyInductionScore:89, activeMachineryCount:22, safetyViolationsLast90Days:2, status:"Compliant", supervisorName:"Sh. Bharat Rungta", contactNumber:"9801234567" },
  { id:"CONT-SECL-002", contractorName:"M/s Thriveni Earthmovers Pvt Ltd", contractCode:"SECL/OC/CONT/2025-26/058", subsidiary:"SECL", mineId:"MINE-SECL-002", totalWorkers:412, formBCompliantPct:78.5, pmeValidPct:71.2, vtcCertifiedPct:82.4, safetyInductionScore:74, activeMachineryCount:35, safetyViolationsLast90Days:8, status:"Warning_Notice", supervisorName:"Sh. K. Krishnamurthy", contactNumber:"9876543210" },
  { id:"CONT-BCCL-001", contractorName:"M/s Eastern Coalfields Workers Co-op", contractCode:"BCCL/UG/CONT/2025-26/019", subsidiary:"BCCL", mineId:"MINE-BCCL-001", totalWorkers:156, formBCompliantPct:61.5, pmeValidPct:55.8, vtcCertifiedPct:48.1, safetyInductionScore:52, activeMachineryCount:8, safetyViolationsLast90Days:17, status:"Suspended", supervisorName:"Sh. Ramesh Dutta", contactNumber:"9434567890" },
  { id:"CONT-ECL-001", contractorName:"M/s SPML Infra Limited", contractCode:"ECL/OC/CONT/2025-26/033", subsidiary:"ECL", mineId:"MINE-ECL-001", totalWorkers:198, formBCompliantPct:97.1, pmeValidPct:96.4, vtcCertifiedPct:98.2, safetyInductionScore:95, activeMachineryCount:16, safetyViolationsLast90Days:0, status:"Compliant", supervisorName:"Sh. Vivek Agarwal", contactNumber:"9321456789" },
];

const workers = [
  { workerId:"WRK-SECL-001", name:"Ram Prasad Yadav", category:"Blasting", contractorId:"CONT-SECL-001", mineId:"MINE-SECL-001", subsidiary:"SECL", designation:"Shot Firer", pmeValidUntil:"2027-03-15", vtcCertified:true, safetyInductionDate:"2025-04-01", gatePassActive:true, rfidTag:"RF-0011-A", aadharLast4:"4821", joiningDate:"2023-08-12", status:"Active" },
  { workerId:"WRK-SECL-002", name:"Santosh Kumar Bind", category:"HEMM Operator", contractorId:"CONT-SECL-001", mineId:"MINE-SECL-001", subsidiary:"SECL", designation:"Dumper Operator", pmeValidUntil:"2026-06-30", vtcCertified:true, safetyInductionDate:"2025-04-01", gatePassActive:true, rfidTag:"RF-0012-A", aadharLast4:"7234", joiningDate:"2022-11-05", status:"Active" },
  { workerId:"WRK-SECL-003", name:"Sunil Patel", category:"Helper", contractorId:"CONT-SECL-001", mineId:"MINE-SECL-001", subsidiary:"SECL", designation:"Mining Helper", pmeValidUntil:"2025-12-01", vtcCertified:false, safetyInductionDate:"2025-04-01", gatePassActive:false, rfidTag:"RF-0013-A", aadharLast4:"9912", joiningDate:"2025-01-20", status:"PME_Expired" },
  { workerId:"WRK-SECL-004", name:"Mohan Lal Sahu", category:"HEMM Operator", contractorId:"CONT-SECL-002", mineId:"MINE-SECL-002", subsidiary:"SECL", designation:"Shovel Operator", pmeValidUntil:"2027-01-20", vtcCertified:true, safetyInductionDate:"2025-06-10", gatePassActive:true, rfidTag:"RF-0021-B", aadharLast4:"3341", joiningDate:"2021-03-14", status:"Active" },
  { workerId:"WRK-SECL-005", name:"Ghanshyam Verma", category:"Helper", contractorId:"CONT-SECL-002", mineId:"MINE-SECL-002", subsidiary:"SECL", designation:"Drill Helper", pmeValidUntil:"2026-09-10", vtcCertified:false, safetyInductionDate:"2025-06-10", gatePassActive:true, rfidTag:"RF-0022-B", aadharLast4:"8801", joiningDate:"2024-07-01", status:"Active" },
  { workerId:"WRK-BCCL-001", name:"Bijay Kumar Mahato", category:"UG Mining", contractorId:"CONT-BCCL-001", mineId:"MINE-BCCL-001", subsidiary:"BCCL", designation:"Mining Sirdar", pmeValidUntil:"2026-11-30", vtcCertified:true, safetyInductionDate:"2025-01-15", gatePassActive:true, rfidTag:"RF-0031-C", aadharLast4:"5512", joiningDate:"2019-06-22", status:"Active" },
  { workerId:"WRK-BCCL-002", name:"Arvind Paswan", category:"UG Mining", contractorId:"CONT-BCCL-001", mineId:"MINE-BCCL-001", subsidiary:"BCCL", designation:"Mining Worker", pmeValidUntil:"2025-07-01", vtcCertified:false, safetyInductionDate:"2024-12-01", gatePassActive:false, rfidTag:"RF-0032-C", aadharLast4:"1190", joiningDate:"2024-11-01", status:"Suspended" },
  { workerId:"WRK-ECL-001", name:"Partha Sarathi Das", category:"HEMM Operator", contractorId:"CONT-ECL-001", mineId:"MINE-ECL-001", subsidiary:"ECL", designation:"Grader Operator", pmeValidUntil:"2027-08-14", vtcCertified:true, safetyInductionDate:"2025-02-01", gatePassActive:true, rfidTag:"RF-0041-D", aadharLast4:"6623", joiningDate:"2020-08-14", status:"Active" },
  { workerId:"WRK-ECL-002", name:"Tapan Mondal", category:"Electrical", contractorId:"CONT-ECL-001", mineId:"MINE-ECL-001", subsidiary:"ECL", designation:"Electrician", pmeValidUntil:"2027-05-22", vtcCertified:true, safetyInductionDate:"2025-02-01", gatePassActive:true, rfidTag:"RF-0042-D", aadharLast4:"4410", joiningDate:"2021-05-22", status:"Active" },
];

async function seedAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log("Connected to MongoDB Atlas\n");

    let counts = { users:0, mines:0, violations:0, contractors:0, workers:0 };

    for (const u of users) {
      if (!await User.findOne({ employeeCode: u.employeeCode })) { await User.create(u); console.log(`  Created user:      ${u.employeeCode} - ${u.name}`); counts.users++; }
      else console.log(`  Exists user:       ${u.employeeCode}`);
    }
    for (const m of mineSites) {
      if (!await MineSite.findOne({ id: m.id })) { await MineSite.create(m); console.log(`  Created mine:      ${m.id} - ${m.name}`); counts.mines++; }
      else console.log(`  Exists mine:       ${m.id}`);
    }
    for (const v of violations) {
      if (!await StatutoryViolation.findOne({ id: v.id })) { await StatutoryViolation.create(v); console.log(`  Created violation: ${v.id} [${v.severity}]`); counts.violations++; }
      else console.log(`  Exists violation:  ${v.id}`);
    }
    for (const c of contractors) {
      if (!await ContractorRecord.findOne({ id: c.id })) { await ContractorRecord.create(c); console.log(`  Created contractor:${c.id} - ${c.contractorName}`); counts.contractors++; }
      else console.log(`  Exists contractor: ${c.id}`);
    }
    for (const w of workers) {
      if (!await FormBWorker.findOne({ workerId: w.workerId })) { await FormBWorker.create(w); console.log(`  Created worker:    ${w.workerId} - ${w.name}`); counts.workers++; }
      else console.log(`  Exists worker:     ${w.workerId}`);
    }

    console.log("\nSeeding complete!");
    console.log(`Users:${counts.users} | Mines:${counts.mines} | Violations:${counts.violations} | Contractors:${counts.contractors} | Workers:${counts.workers}`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err.message);
    process.exit(1);
  }
}

seedAll();
