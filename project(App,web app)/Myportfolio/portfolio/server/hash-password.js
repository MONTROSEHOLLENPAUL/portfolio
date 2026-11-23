import crypto from "node:crypto";
import readline from "node:readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
let muted = false;
rl._writeToOutput = (s) => {
  if (!muted || /[\r\n]/.test(s)) rl.output.write(s);
  else rl.output.write("*");
};

process.stdout.write("Nouveau mot de passe admin : ");
muted = true;
rl.question("", (pwd) => {
  muted = false;
  rl.close();
  if (pwd.length < 8) {
    console.error("\nMot de passe trop court (8 caractères minimum).");
    process.exit(1);
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(pwd, salt, 64).toString("hex");
  console.log("\n\nMettez cette ligne dans server/.env (et dans les variables Railway) :\n");
  console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}`);
  console.log("\nPuis supprimez la ligne ADMIN_PASSWORD.");
});

//node hash-password.js