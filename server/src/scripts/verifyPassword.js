/**
 * Utility script to verify a user's password
 * Usage: node server/src/scripts/verifyPassword.js <email> <password>
 * Or: npm run verify-password <email> <password>
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import connectDB from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

const verifyPassword = async () => {
  try {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.error("❌ Usage: node verifyPassword.js <email> <password>");
      console.error(
        "   Example: node verifyPassword.js user@example.com mypassword123"
      );
      process.exit(1);
    }

    console.log("🔗 Connecting to database...");
    await connectDB();

    console.log(`🔍 Looking for user with email: ${email}...`);
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.error(`❌ User with email "${email}" not found!`);
      process.exit(1);
    }

    console.log(`✅ User found: ${user.username} (ID: ${user._id})`);
    console.log("🔐 Verifying password...");

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      console.log("✅ Password is CORRECT!");
      console.log(`\n📋 User Details:`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user._id}`);
    } else {
      console.log("❌ Password is INCORRECT!");
    }

    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed.");
    process.exit(isMatch ? 0 : 1);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

verifyPassword();
