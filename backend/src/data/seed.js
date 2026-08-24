import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { config } from "../config/index.js";

const seedUsers = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const users = [
    {
      id: "USR-001",
      name: "Er. Alok Kumar Sharma",
      designation: "General Manager / Mines Manager (1st Class FMC)",
      role: "mine_official",
      subsidiary: "SECL",
      mineId: "MINE-SECL-001",
      mineName: "Gevra Mega Opencast Project",
      department: "Colliery Mine Management & Operations",
      employeeCode: "EIS-90214432",
      password: hashedPassword,
      statutoryCertNo: "FMC-1ST-9821",
      dscKeyId: "DSC-MGR-01",
      allowedTabs: ["command_hub", "gis_map", "field_inspection", "statutory_registers"]
    },
    {
      id: "USR-002",
      name: "Shri V. K. Mukherjee",
      designation: "Director (Technical) / CIL Apex Command",
      role: "corporate_hq",
      subsidiary: "CIL_HQ",
      department: "Coal India Corporate Secretariat",
      employeeCode: "EIS-80012904",
      password: hashedPassword,
      dscKeyId: "DSC-CIL-HQ-01",
      allowedTabs: ["command_hub", "gis_map", "workflow_audit"]
    }];


    await User.insertMany(users);
    console.log(`Seeded ${users.length} users successfully`);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding users:", err);
    process.exit(1);
  }
};

seedUsers();