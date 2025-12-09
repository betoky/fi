import mockAuth from "./seed-auth";
import mockExpensesCategories from "./seed-exp-categories";
import mockUsersData from "./seed-users-data";

async function main() {
  await mockAuth();
  await mockUsersData();
  await mockExpensesCategories();
  console.log('Seeding complete.');
}

main().catch(err => {
  console.log(err);
  process.exit(1);
});