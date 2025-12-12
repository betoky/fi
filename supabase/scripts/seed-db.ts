import mockAuth from './seed-auth';
import mockExpensesCategories from './seed-exp-categories';
import mockExpensesItems from './seed-exp-items';
import mockExpenses from './seed-expenses';
import mockUsersData from './seed-users-data';

async function main() {
  await mockAuth();
  const [_, homes] = await mockUsersData();
  await mockExpensesCategories(homes);
  await mockExpensesItems(homes);
  await mockExpenses(homes);
  console.log('Seeding complete.');
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
