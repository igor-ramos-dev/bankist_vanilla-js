'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 60],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90, -550],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Display movements on interface
const displayMovements = function (currentAccount) {
  containerMovements.innerHTML = '';

  currentAccount.movements.map((mov, index) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
      ${index + 1} ${type}
      </div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Calculate the balance for current account
const calcDisplayBalance = function (currentAccount) {
  currentAccount.balance = currentAccount.movements.reduce((a, cv) => {
    return a + cv;
  }, 0);
  labelBalance.textContent = `${currentAccount.balance} €`;
};

// Calculate the incomes, outcomes and interest
const calcDisplaySummary = function (currentAccount) {
  const incomes = currentAccount.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = incomes + '€';

  const outcomes = currentAccount.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = Math.abs(outcomes) + '€';

  const interest = currentAccount.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * currentAccount.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = interest.toFixed(2) + '€';
};

// Update interface of the application
const updateUI = function (currentAccount) {
  // Display all the movements in screen
  displayMovements(currentAccount);

  // Calculate the balance for the current account and display in screen
  calcDisplayBalance(currentAccount);

  // Calculate the incomes, outcomes and interest
  // for the current account and display in screen
  calcDisplaySummary(currentAccount);
};

// Create username login for each account
const createUsernames = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// Make login
let currentAccount;
btnLogin.addEventListener('click', event => {
  event.preventDefault();

  // Check if username exists
  // If not, display error message
  currentAccount = accounts.find(account => {
    return account.username === inputLoginUsername.value;
  });
  if (!currentAccount) return console.log('Username does not exists!');

  // Check if username's password is correct
  if (currentAccount.pin !== +inputLoginPin.value)
    return console.log('Incorrect Password!');

  // Display the UI and welcome message
  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(' ')[0]
  }!`;
  containerApp.style.opacity = '1';

  // When logged, clear username and pin fields
  inputLoginPin.value = inputLoginUsername.value = '';
  inputLoginPin.blur();

  // Update UI
  updateUI(currentAccount);

  console.log(currentAccount.movements);
});

// Transfer money
btnTransfer.addEventListener('click', event => {
  event.preventDefault();

  // Value to be transfer
  const amount = Number(inputTransferAmount.value);

  // Check if it's greater than 0
  if (amount <= 0) return console.log('Enter a positive number!');

  // Account which will receive the transfer
  const receiverAccount = accounts.find(acc => {
    return acc.username.toLowerCase() === inputTransferTo.value.toLowerCase();
  });
  if (!receiverAccount) return console.log('User does not exists!');

  // Check if current user has enough money
  if (amount > currentAccount.balance)
    return console.log('Not sufficient founds!');

  // If not, make the transfer
  receiverAccount.movements.push(amount);

  // Recalculate the balance for the current account
  currentAccount.movements.push(-amount);
  updateUI(currentAccount);

  // Clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

// Delete account
btnClose.addEventListener('click', event => {
  event.preventDefault();

  // Check if user to be deleted is the same as current user
  // if not, return error message
  const isCurrentUser = currentAccount.username === inputCloseUsername.value;
  const isCurrentPin = currentAccount.pin === Number(inputClosePin.value);
  if (!isCurrentUser && !isCurrentPin)
    return console.log('Wrong username and pin!');
  if (!isCurrentUser) return console.log('Wrong username!');
  if (!isCurrentPin) return console.log('Wrong pin!');

  // Index of account to be deleted
  const indexToBeDeleted = accounts.findIndex(
    acc => acc.username === inputCloseUsername.value
  );

  // Delete account
  accounts.splice(indexToBeDeleted, 1);
  console.log(accounts);

  // Clear fields
  inputCloseUsername.value = inputClosePin.value = '';

  // Log user out (remove UI)
  containerApp.style.opacity = '0';
});

// Get a loan
btnLoan.addEventListener('click', event => {
  event.preventDefault();

  // Store the request loan
  const loanAmount = Number(inputLoanAmount.value);

  // Check if there is at least one deposit with 10% of the value of the loan
  const thereIsTenPercentDeposit = currentAccount.movements.some(
    mov => loanAmount <= mov * 10
  );

  // If not, return error message
  if (thereIsTenPercentDeposit == false)
    return console.log(
      'Must have at least one deposit with 10% amount of the loan'
    );

  // Make the loan and store in the movements array
  currentAccount.movements.push(loanAmount);
  console.log(currentAccount.movements);
});

/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const eurToUsd = 1.1;

// Pipeline
const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, cur) => acc + cur, 0);
