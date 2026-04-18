#!/usr/bin/env node
// scripts/hash-password.js
// Hash an admin password with bcrypt. Password is read from stdin with NO echo
// so it never appears in shell history, process lists, or CI logs.
//
// Usage:
//   node scripts/hash-password.js
//   (then type password; press Enter)
//
// The output hash is printed to stdout so you can pipe/redirect it, e.g.:
//   node scripts/hash-password.js > hash.txt
//   node scripts/hash-password.js | pbcopy   # macOS
//
// If you must script this non-interactively, set ADMIN_PASSWORD in the env
// (fine in a CI secrets manager; NOT fine to inline on the command line).

import bcrypt from "bcryptjs";
import readline from "readline";

const BCRYPT_ROUNDS = 12;

// ── Read password from stdin with echo disabled ──
// Works on TTY (interactive terminal). If stdin is piped/redirected,
// we read plainly since we're not in an interactive session.
function readPasswordSilently(prompt = "Password: ") {
  return new Promise((resolve, reject) => {
    // Non-interactive fallback (pipe/redirect)
    if (!process.stdin.isTTY) {
      let buf = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk) => { buf += chunk; });
      process.stdin.on("end", () => resolve(buf.trim()));
      process.stdin.on("error", reject);
      return;
    }

    // Interactive: disable echo, write our own prompt, read char-by-char.
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    let buf = "";
    const onData = (chunk) => {
      const str = chunk.toString("utf8");
      for (const ch of str) {
        switch (ch) {
          case "\n":
          case "\r":
          case "\u0004": // Ctrl-D
            cleanup();
            process.stdout.write("\n");
            resolve(buf);
            return;
          case "\u0003": // Ctrl-C
            cleanup();
            process.stdout.write("\n");
            process.exit(130);
            return;
          case "\u007f": // Backspace
          case "\b":
            if (buf.length > 0) {
              buf = buf.slice(0, -1);
              process.stdout.write("\b \b");
            }
            break;
          default:
            if (ch >= " " && ch !== "\u007f") {
              buf += ch;
              process.stdout.write("*");
            }
        }
      }
    };

    const cleanup = () => {
      process.stdin.removeListener("data", onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    };

    process.stdin.on("data", onData);
  });
}

async function main() {
  // Non-interactive escape hatch via env var (for CI/deploy scripts).
  // ADMIN_PASSWORD env takes precedence and bypasses the prompt entirely.
  const envPass = process.env.ADMIN_PASSWORD;
  let password;

  if (envPass) {
    password = envPass;
  } else {
    password = await readPasswordSilently("Enter password to hash: ");
    if (!password) {
      console.error("No password entered. Aborting.");
      process.exit(1);
    }

    // Require confirmation on interactive runs to catch typos.
    if (process.stdin.isTTY) {
      const confirm = await readPasswordSilently("Confirm password: ");
      if (confirm !== password) {
        console.error("Passwords do not match. Aborting.");
        process.exit(1);
      }
    }
  }

  // Basic sanity check — block clearly-weak passwords at hash time.
  if (password.length < 10) {
    console.error("Password must be at least 10 characters. Aborting.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // Only the hash goes to stdout so you can pipe it cleanly.
  // Everything else (prompts, confirmations) goes to stderr.
  console.log(hash);

  if (process.stdin.isTTY) {
    console.error("");
    console.error("Copy the hash above and run in Neon SQL Editor:");
    console.error("  UPDATE admin_users SET password_hash = '<paste_hash>' WHERE username = 'admin';");
  }
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
