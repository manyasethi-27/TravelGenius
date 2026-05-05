/**
 * Simple Min Cash Flow algorithm to simplify debts.
 */

interface Balance {
  userId: string;
  amount: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export function simplifyDebts(balances: Record<string, number>): Settlement[] {
  // Convert map to array of non-zero balances
  const credit: Balance[] = [];
  const debit: Balance[] = [];

  for (const userId in balances) {
    if (balances[userId] > 0.01) {
      credit.push({ userId, amount: balances[userId] });
    } else if (balances[userId] < -0.01) {
      debit.push({ userId, amount: Math.abs(balances[userId]) });
    }
  }

  // Sort by amount descending to greedily settle
  credit.sort((a, b) => b.amount - a.amount);
  debit.sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let i = 0; // credit index
  let j = 0; // debit index

  while (i < credit.length && j < debit.length) {
    const settleAmount = Math.min(credit[i].amount, debit[j].amount);

    settlements.push({
      from: debit[j].userId,
      to: credit[i].userId,
      amount: settleAmount,
    });

    credit[i].amount -= settleAmount;
    debit[j].amount -= settleAmount;

    if (credit[i].amount < 0.01) i++;
    if (debit[j].amount < 0.01) j++;
  }

  return settlements;
}

export function calculateBalances(expenses: any[], members: any[]): Record<string, number> {
  const balances: Record<string, number> = {};

  // Initialize for all current members
  members.forEach(m => (balances[m.id] = 0));

  expenses.forEach(exp => {
    const totalAmount = Number(exp.amount) || 0;
    const paidBy = exp.paidBy;

    // Ensure we have an entry for the payer
    if (!(paidBy in balances)) balances[paidBy] = 0;

    // Amount paid By user - they get credit
    balances[paidBy] += totalAmount;

    // Amount owed by each person in split
    if (exp.type === 'equal') {
      const splitList = exp.splitBetween || [];
      if (splitList.length > 0) {
        const perPerson = totalAmount / splitList.length;
        splitList.forEach((uid: string) => {
          if (!(uid in balances)) balances[uid] = 0;
          balances[uid] -= perPerson;
        });
      }
    } else {
      // Unequal split
      const splitList = exp.splitBetween || [];
      splitList.forEach((uid: string) => {
        if (!(uid in balances)) balances[uid] = 0;
        const share = Number(exp.amounts?.[uid]) || 0;
        balances[uid] -= share;
      });
    }
  });

  return balances;
}
