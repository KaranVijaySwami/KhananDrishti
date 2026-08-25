import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { config } from "../config/index.js";

dotenv.config();

const inspectors = [
  {
    id: "INSP-SECL-001",
    name: "Er. Rajesh Verma",
    email: "rajesh.verma@secl.com",
    employeeCode: "INSP-SECL-001",
    password: "inspect123",
    role: "safety_officer",
    subsidiary: "SECL",
  },
  {
    id: "INSP-SECL-002",
    name: "Er. S. N. Mishra",
    email: "sn.mishra@secl.com",
    employeeCode: "INSP-SECL-002",
    password: "inspect123",
    role: "safety_officer",
    subsidiary: "SECL",
  },
  {
    id: "INSP-ECL-001",
    name: "Er. Tanmay Ghosh",
    email: "t.ghosh@ecl.com",
    employeeCode: "INSP-ECL-001",
    password: "inspect123",
    role: "safety_officer",
    subsidiary: "ECL",
  },
  {
    id: "INSP-BCCL-001",
    name: "Er. K. D. Pandey",
    email: "kd.pandey@bccl.com",
    employeeCode: "INSP-BCCL-001",
    password: "inspect123",
    role: "safety_officer",
    subsidiary: "BCCL",
  },
];

const seedInspectors = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to DB...");

    for (const inspector of inspectors) {
      const existing = await User.findOne({ employeeCode: inspector.employeeCode });
      if (!existing) {
        await User.create(inspector);
        console.log(`Created: ${inspector.employeeCode}`);
      } else {
        console.log(`Already exists: ${inspector.employeeCode}`);
      }
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding inspectors:", error);
    process.exit(1);
  }
};

seedInspectors();
