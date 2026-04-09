// scripts/hash-password.js
// Usage: node scripts/hash-password.js YourNewPassword
// Outputs a bcrypt hash you can paste into the Neon SQL editor

import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.js <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\n=== Bcrypt Hash ===");
console.log(hash);
console.log("\n=== SQL to update admin password ===");
console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE username = 'admin';`);
console.log("");
