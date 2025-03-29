# Real Estate Return Calculator

A responsive web application for calculating and comparing real estate returns with other investment options.

## Features

- Calculate property appreciation using CAGR (Compound Annual Growth Rate)
- Compare property returns with Fixed Deposit and Equity investments
- Multiple calculation scenarios:
  - Basic Property Appreciation
  - Down Payment + Loan Analysis
  - Renting vs. Buying Comparison
  - Property as Investment (including rental income)
  - Property Flipping

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS

## How to Use

1. Open `index.html` in a web browser
2. Select a calculation scenario using the buttons at the top
3. Fill in the required information in the form
4. Click "Calculate" to see the results
5. View the comparison with other investment options

## Calculation Methods

### Basic Property Appreciation
- CAGR = ((Current Value / Initial Value) ^ (1 / Number of Years)) - 1
- Total Return = ((Current Value - Initial Value) / Initial Value) * 100%

### Alternative Investments
- Fixed Deposit (FD): 5% p.a. return on investment
- Mutual Fund/Equity: 10% p.a. return on investment

### Loan Analysis
- Calculates EMI and total interest paid over loan term
- Compares returns on down payment with other investment options

### Renting vs. Buying
- Calculates total rent paid with annual rent appreciation
- Compares net gain from buying property vs. investing the amount

### Property as Investment
- Includes rental income with appreciation over time
- Factors in maintenance costs and other expenses
- Calculates net return from both appreciation and rental income

### Property Flipping
- Analyzes return on short-term property investment
- Includes renovation costs and holding period
- Calculates annualized ROI and compares with other investments

## License

MIT 