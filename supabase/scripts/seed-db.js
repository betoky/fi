import mockAuth from "./seed-auth.js";

async function main() {
  await mockAuth();
  console.log('Seeding complete.');
}

main().catch(err => {
  console.log(err);
  process.exit(1);
});