# Real Estate Return Calculator

A responsive web application for calculating and comparing real estate returns with alternative investment options. Make informed financial decisions for your future with comprehensive analysis of real estate investments.

## Features

- **Property Value Appreciation**: Calculate CAGR (Compound Annual Growth Rate) for property investments
- **Rental Income Analysis**: Evaluate property returns including rental income and expenses
- **Alternative Investment Comparison**: Compare property returns against Fixed Deposit and Equity investments
- **Rent vs. Buy Analysis**: Compare the financial outcomes of renting versus buying property
- **Investment Split Optimization**: Adjust equity vs fixed deposit investment ratio for optimal returns
- **Real-time Calculation**: Instant updates as you modify inputs
- **Visual Charts**: Graphical representation of investment growth over time

## Key Metrics

- **Property Value Growth**: CAGR and total return on property value
- **Property with Rental Income**: Effective annual return including rental income minus expenses
- **Equity Investment Returns**: Returns based on customizable equity interest rates
- **Fixed Deposit Returns**: Returns based on customizable FD interest rates
- **Rent + Invest Strategy**: Analysis of renting a property while investing the purchase amount

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS
- Chart.js for data visualization
- Font Awesome for icons

## How to Use

1. Open `index.html` in a web browser
2. Enter your property details:
   - Initial property value
   - Current property value
   - Ownership period in years
3. Results are automatically calculated and displayed
4. Access additional options for each investment type:
   - Customize interest rates for FD and equity
   - Adjust rental income and growth rate
   - Modify monthly rent and appreciation rate

## Calculation Methods

### Property Value Growth
- CAGR = ((Current Value / Initial Value) ^ (1 / Years)) - 1
- Total Return = Current Value / Initial Value

### Property with Rental Income
- Includes rental income (with annual growth) minus expenses
- Effective Annual Return = ((Total Gain + Property Value) / Initial Value) ^ (1/Years) - 1

### Alternative Investments
- Fixed Deposit: Compounds at specified interest rate (default 7%)
- Equity: Compounds at specified interest rate (default 12%)

### Rent + Invest Strategy
- Calculates total rent paid with annual rent appreciation
- Invests the property purchase amount in a customizable split between equity and FD
- Final value = Investment returns - Total rent paid

## UI Features

- Responsive design for all screen sizes
- Real-time calculations without page reloads
- Interactive charts for visual comparison
- Expandable sections for additional details
- Animated transitions for smooth user experience
- Hover effects for intuitive interaction

## License

MIT 