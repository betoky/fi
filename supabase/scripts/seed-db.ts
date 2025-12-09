import mockAuth from "./seed-auth";
import mockUsersData from "./seed-users-data";

async function main() {
  await mockAuth();
  await mockUsersData();
  console.log('Seeding complete.');
}

main().catch(err => {
  console.log(err);
  process.exit(1);
});