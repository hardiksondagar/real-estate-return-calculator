document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded - initializing calculator");
  
  // Main calculation button
  const calculateAllBtn = document.getElementById('calculate-all');
  console.log("Calculate All button reference:", calculateAllBtn);

  // Individual calculate buttons
  const rentCalculateBtn = document.getElementById('rent-calculate');
  
  // Edit toggles
  const editToggles = document.querySelectorAll('.edit-toggle');
  
  // Chart instances
  let basicChart = null;
  let rentChart = null;
  let rentalChart = null;
  
  // Setup input event listeners for real-time calculation
  document.getElementById('main-initial-value').addEventListener('input', updateAllCalculations);
  document.getElementById('main-current-value').addEventListener('input', updateAllCalculations);
  document.getElementById('main-years').addEventListener('input', updateAllCalculations);
  document.getElementById('fd-rate').addEventListener('input', updateAllCalculations);
  document.getElementById('equity-rate').addEventListener('input', updateAllCalculations);
  
  // Initial calculation on page load
  setTimeout(updateAllCalculations, 500);
  
  // Function to update all calculations
  function updateAllCalculations() {
    const initialValue = parseFloat(document.getElementById('main-initial-value').value) * 100000;
    const currentValue = parseFloat(document.getElementById('main-current-value').value) * 100000;
    const years = parseFloat(document.getElementById('main-years').value);
    const fdRate = parseFloat(document.getElementById('fd-rate').value) || 7;
    const equityRate = parseFloat(document.getElementById('equity-rate').value) || 12;
    
    if (initialValue && currentValue && years) {
      // Calculate combined returns - merged view
      const monthlyRentalIncome = parseFloat(document.getElementById('monthly-rental-income').value) || initialValue * 0.005; // 0.5% of property value
      const rentalGrowth = parseFloat(document.getElementById('rental-income-growth').value) || 5;
      const expenses = parseFloat(document.getElementById('annual-expenses').value) || initialValue * 0.01; // 1% of property value
      
      // For rent, assume rent is 0.5% of property value monthly
      const monthlyRent = parseFloat(document.getElementById('monthly-rent').value) || initialValue * 0.005;
      const rentAppreciation = parseFloat(document.getElementById('rent-appreciation').value) || 5;
      
      // Calculate all metrics
      displayAllResults(initialValue, currentValue, years, monthlyRentalIncome, rentalGrowth, expenses, monthlyRent, rentAppreciation, fdRate, equityRate);
    }
  }
  
  // Toggle custom inputs
  editToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const card = this.closest('.scenario-card') || this.closest('.bg-white');
      const customInputs = card.querySelector('.custom-inputs');
      const editText = this.querySelector('.edit-text');
      
      if (customInputs.classList.contains('visible')) {
        // Hide inputs
        customInputs.classList.remove('visible');
        setTimeout(() => {
          customInputs.classList.add('hidden');
        }, 250); // Match this with the CSS transition duration
        
        editText.textContent = editText.textContent.includes('Rates') ? 'Edit Rates' : 'Edit Inputs';
        this.classList.remove('active');
      } else {
        // Show inputs
        customInputs.classList.add('visible');
        customInputs.classList.remove('hidden');
        editText.textContent = 'Hide Inputs';
        this.classList.add('active');
        
        // Don't populate if this is the rates inputs
        if (!editText.textContent.includes('Rates')) {
          // Copy main values to this card's inputs
          const initialValue = parseFloat(document.getElementById('main-initial-value').value) || 0;
          const currentValue = parseFloat(document.getElementById('main-current-value').value) || 0;
          const years = parseFloat(document.getElementById('main-years').value) || 0;
          
          // Populate common fields if they exist in this card
          populateCardInputs(card, initialValue, currentValue, years);
        }
      }
    });
  });

  // Calculate all scenarios
  if (calculateAllBtn) {
    calculateAllBtn.addEventListener('click', updateAllCalculations);
  } else {
    console.warn("Calculate All button not found in the DOM - this is expected in the new UI design");
  }
  
  // Helper function to populate card inputs from main inputs
  function populateCardInputs(card, initialValue, currentValue, years) {
    const cardId = card.id;
    
    switch (cardId) {
      case 'basic-scenario':
        // Update the comparison text
        document.getElementById('fd-rate').value = 7;
        document.getElementById('equity-rate').value = 12;
        document.getElementById('monthly-rental-income').value = initialValue * 0.005; // 0.5% of property value monthly
        document.getElementById('annual-expenses').value = initialValue * 0.01; // 1% of property value annually
        break;
        
      case 'rent-scenario':
        document.getElementById('rent-initial-value').value = initialValue / 100000;
        document.getElementById('rent-current-value').value = currentValue / 100000;
        document.getElementById('rent-years').value = years;
        document.getElementById('monthly-rent').value = initialValue * 0.005; // 0.5% of property value monthly
        break;
    }
  }
  
  // New function to display all results in one section
  function displayAllResults(initialValue, currentValue, years, monthlyRentalIncome, rentalGrowth, annualExpenses, monthlyRent, rentAppreciation, fdRate, equityRate) {
    // Calculate CAGR and Total Return for property value
    const cagr = (Math.pow(currentValue / initialValue, 1 / years) - 1) * 100;
    const totalReturn = currentValue / initialValue;
    
    // Calculate total rental income with rental growth
    let totalRentalIncome = 0;
    let currentMonthlyRental = monthlyRentalIncome;
    
    for (let i = 0; i < years; i++) {
      totalRentalIncome += currentMonthlyRental * 12;
      currentMonthlyRental *= (1 + rentalGrowth / 100);
    }
    
    // Calculate total expenses over the years
    let totalExpenses = 0;
    let currentAnnualExpenses = annualExpenses;
    
    for (let i = 0; i < years; i++) {
      totalExpenses += currentAnnualExpenses;
      currentAnnualExpenses *= 1.05; // Assume 5% increase in expenses annually
    }
    
    // Net rental income
    const netRentalIncome = totalRentalIncome - totalExpenses;
    
    // Total return including rental income
    const propertyValueGain = currentValue - initialValue;
    const totalGain = propertyValueGain + netRentalIncome;
    const effectiveAnnualReturn = (Math.pow(1 + totalGain / initialValue, 1 / years) - 1) * 100;
    
    // Calculate alternative investments
    const fdFinalValue = initialValue * Math.pow(1 + fdRate/100, years);
    const equityFinalValue = initialValue * Math.pow(1 + equityRate/100, years);
    
    // Format values for display
    const totalMultiplier = (initialValue + totalGain) / initialValue;
    const fdMultiplier = fdFinalValue / initialValue;
    const equityMultiplier = equityFinalValue / initialValue;
    
    // Calculate Renting + Investing metrics
    // Calculate total rent paid with appreciation
    let totalRentPaid = 0;
    let currentMonthlyRent = monthlyRent;
    
    for (let i = 0; i < years; i++) {
      totalRentPaid += currentMonthlyRent * 12;
      currentMonthlyRent *= (1 + rentAppreciation / 100);
    }
    
    // Default split ratio (50% equity, 50% FD)
    let equitySplit = 50;
    let fdSplit = 50;
    
    // Calculate investment amounts based on split
    const equityAmount = initialValue * (equitySplit/100);
    const fdAmount = initialValue * (fdSplit/100);
    
    // Calculate investment returns
    const equityReturn = equityAmount * Math.pow(1 + equityRate/100, years);
    const fdReturn = fdAmount * Math.pow(1 + fdRate/100, years);
    
    // Calculate combined final value
    const combinedFinalValue = equityReturn + fdReturn;
    
    // Renting + Investing metrics
    const rentingInvestTotal = combinedFinalValue - totalRentPaid;
    const rentingInvestMultiplier = rentingInvestTotal / initialValue;
    const rentingInvestCAGR = (Math.pow(rentingInvestTotal / initialValue, 1 / years) - 1) * 100;
    
    // Create all 5 result cards
    const results = [
      { 
        label: 'Property Value', 
        value: `₹${formatNumber(currentValue)}`,
        subtext: `${cagr.toFixed(1)}% annual growth`,
        color: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-700',
        multiplier: `${totalReturn.toFixed(1)}x`
      },
      { 
        label: 'Property with Rental', 
        value: `₹${formatNumber(initialValue + totalGain)}`,
        subtext: `${effectiveAnnualReturn.toFixed(1)}% effective annual return`,
        color: 'bg-green-50 border-green-200',
        textColor: 'text-green-700',
        multiplier: `${totalMultiplier.toFixed(1)}x`,
        details: {
          propertyValueGain,
          netRentalIncome,
          totalRentalIncome,
          totalExpenses,
          monthlyRental: monthlyRentalIncome,
          rentalGrowth: rentalGrowth,
          expenses: annualExpenses
        }
      },
      { 
        label: `Equity Investment`, 
        value: `₹${formatNumber(equityFinalValue)}`,
        subtext: `${equityRate}% annual return`,
        color: 'bg-purple-50 border-purple-200',
        textColor: 'text-purple-700',
        multiplier: `${equityMultiplier.toFixed(1)}x`,
        editOptions: {
          rate: equityRate
        }
      },
      { 
        label: 'Fixed Deposit', 
        value: `₹${formatNumber(fdFinalValue)}`,
        subtext: `${fdRate}% annual interest`,
        color: 'bg-amber-200 border-amber-300',
        textColor: 'text-amber-800',
        multiplier: `${fdMultiplier.toFixed(1)}x`,
        editOptions: {
          rate: fdRate
        }
      },
      {
        label: 'Renting + Invest', 
        value: `₹${formatNumber(rentingInvestTotal)}`,
        subtext: `${rentingInvestCAGR.toFixed(1)}% annual growth`,
        color: 'bg-purple-50 border-purple-200',
        textColor: 'text-purple-700',
        multiplier: `${rentingInvestMultiplier.toFixed(1)}x return`,
        details: {
          equityFinalValue,
          fdFinalValue,
          totalRentPaid,
          initialInvestment: initialValue,
          equitySplit: equitySplit,
          fdSplit: fdSplit,
          equityRate: equityRate,
          fdRate: fdRate,
          equityAmount: equityAmount,
          fdAmount: fdAmount,
          equityReturn: equityReturn,
          fdReturn: fdReturn,
          monthlyRent: monthlyRent,
          rentAppreciation: rentAppreciation,
          finalMonthlyRent: monthlyRent * Math.pow(1 + rentAppreciation/100, years),
          propertyFinalValue: currentValue,
          propertyCagr: cagr
        }
      },
      {
        label: 'Home Is Where The Heart Is', 
        value: `Priceless`,
        subtext: `Beyond financial calculations`,
        color: 'bg-pink-50 border-pink-200',
        textColor: 'text-pink-700',
        multiplier: `∞ lifetime value`,
        isHeartfelt: true
      }
    ];
    
    // Display all results in the combined results section
    const resultsDiv = document.getElementById('combined-results');
    const resultsDataDiv = resultsDiv.querySelector('.results-data');
    
    // Clear previous results
    resultsDataDiv.innerHTML = '';
    
    // Display results in custom format
    resultsDataDiv.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${results.map(item => `
          <div class="${item.color} p-6 rounded-xl border shadow-md relative hover-effect">
            ${item.editOptions ? `
              <a href="#" class="edit-icon absolute top-4 right-4 text-gray-400 hover:text-blue-600">
                <i class="fas fa-pencil-alt"></i>
              </a>
            ` : ''}
            ${item.details ? `
              <a href="#" class="details-toggle absolute top-4 right-4 text-gray-400 hover:text-blue-600">
                <i class="fas fa-chevron-down"></i>
              </a>
            ` : ''}
            <div class="flex items-center mb-3">
              ${getIconForCard(item.label)}
              <div class="ml-3 text-lg font-semibold text-gray-700">${item.label}</div>
            </div>
            <div class="text-3xl font-bold ${item.textColor} mb-2">${item.value}</div>
            <div class="text-lg font-bold ${item.textColor} mb-3">${item.multiplier}</div>
            <div class="text-sm text-gray-600 mb-4">${item.subtext}</div>
            ${item.isHeartfelt ? `
              <div class="heartfelt-text ${item.textColor} italic mt-4">
                A home's value isn't just financial—it's morning coffee on your porch and laughter with family. The best investment might simply be your happiness.
              </div>
            ` : `
              <div class="text-sm text-gray-500 description-text border-t pt-3">
                ${getDescriptionForCard(item.label)}
              </div>
            `}
            ${item.editOptions && item.label === 'Equity Investment' ? `
              <div class="rate-edit-menu mt-3 hidden">
                <div class="rate-options p-2 bg-gray-50 rounded-md border border-gray-200">
                  <div class="mb-2">
                    <label class="block text-xs text-gray-500 mb-1">Equity Return Rate (%)</label>
                    <input type="number" class="edit-equity-rate w-full px-2 py-1 text-sm border rounded" value="${item.editOptions.rate}">
                  </div>
                  <button class="update-equity-btn bg-purple-500 text-white text-xs py-1 px-2 rounded mt-1 hover:bg-purple-600">Update</button>
                </div>
              </div>
            ` : ''}
            ${item.editOptions && item.label === 'Fixed Deposit' ? `
              <div class="rate-edit-menu mt-3 hidden">
                <div class="rate-options p-2 bg-gray-50 rounded-md border border-gray-200">
                  <div class="mb-2">
                    <label class="block text-xs text-gray-500 mb-1">FD Interest Rate (%)</label>
                    <input type="number" class="edit-fd-rate w-full px-2 py-1 text-sm border rounded" value="${item.editOptions.rate}">
                  </div>
                  <button class="update-fd-btn bg-amber-500 text-white text-xs py-1 px-2 rounded mt-1 hover:bg-amber-600">Update</button>
                </div>
              </div>
            ` : ''}
            ${item.details && item.label === 'Property with Rental' ? `
              <div class="property-details mt-3 hidden">
                <div class="details-calculation p-1">
                  <div class="text-sm font-medium mb-3">Rental Settings:</div>
                  <div class="mb-2">
                    <label class="block text-xs text-gray-500 mb-1">Monthly Rental Income (₹)</label>
                    <input type="number" class="edit-rental w-full px-2 py-1 text-sm border rounded" value="${item.details.monthlyRental}">
                  </div>
                  <div class="mb-2">
                    <label class="block text-xs text-gray-500 mb-1">Annual Growth (%)</label>
                    <input type="number" class="edit-rental-growth w-full px-2 py-1 text-sm border rounded" value="${item.details.rentalGrowth}">
                  </div>
                  <div class="mb-2">
                    <label class="block text-xs text-gray-500 mb-1">Annual Expenses (₹)</label>
                    <input type="number" class="edit-expenses w-full px-2 py-1 text-sm border rounded" value="${item.details.expenses}">
                  </div>
                  <button class="update-rental-btn bg-green-500 text-white text-xs py-1 px-2 rounded mt-1 hover:bg-green-600">Update</button>
                  
                  <div class="text-sm font-medium mt-4 mb-3">Total Return Calculation:</div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-700">Property Value Gain</span>
                    <span class="font-medium text-gray-900">₹${formatNumber(item.details.propertyValueGain)}</span>
                  </div>
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-700">+ Total Rental Income</span>
                    <span class="font-medium text-gray-900">₹${formatNumber(item.details.totalRentalIncome)}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 mb-1">
                    <span class="text-gray-700">− Total Expenses</span>
                    <span class="font-medium text-gray-900">₹${formatNumber(item.details.totalExpenses)}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-t border-gray-200 pt-3 mt-1">
                    <span class="text-gray-900 font-medium">= Net Return</span>
                    <span class="font-semibold text-green-700">₹${formatNumber(item.details.propertyValueGain + item.details.netRentalIncome)}</span>
                  </div>
                </div>
              </div>
            ` : ''}
            ${item.details && item.label === 'Renting + Invest' ? `
              <div class="property-details mt-3 hidden">
                <div class="details-calculation p-1">
                  <div class="text-sm font-medium mb-3">Rent Settings:</div>
                  
                  <div class="mb-4">
                    <div class="mb-2">
                      <label class="block text-xs text-gray-500 mb-1">Monthly Rent (₹)</label>
                      <input type="number" class="edit-rent w-full px-2 py-1 text-sm border rounded" value="${item.details.monthlyRent}">
                    </div>
                    <div class="mb-2">
                      <label class="block text-xs text-gray-500 mb-1">Annual Growth (%)</label>
                      <input type="number" class="edit-rent-growth w-full px-2 py-1 text-sm border rounded" value="${item.details.rentAppreciation}">
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      Final monthly rent: ₹${formatNumber(item.details.finalMonthlyRent)}
                    </div>
                    <button class="update-rent-btn mt-2 bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600">Update Rent</button>
                  </div>
                  
                  <div class="text-sm font-medium mb-3">Investment Split:</div>
                  
                  <div class="mb-4">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-purple-700 text-sm font-medium">Equity: ${item.details.equitySplit}%</span>
                      <span class="text-amber-700 text-sm font-medium">FD: ${item.details.fdSplit}%</span>
                    </div>
                    <input type="range" id="invest-split" class="w-full" min="0" max="100" value="${item.details.equitySplit}">
                    <div class="flex justify-between items-center mt-1 text-xs">
                      <span>₹${formatNumber(item.details.equityAmount)} in Equity</span>
                      <span>₹${formatNumber(item.details.fdAmount)} in FD</span>
                    </div>
                  </div>
                  
                  <div class="flex justify-between items-center py-2 bg-blue-50 p-2 rounded-md mb-3">
                    <span class="text-blue-700 text-sm font-medium">Property Final Value</span>
                    <span class="font-medium text-blue-700">₹${formatNumber(item.details.propertyFinalValue)}</span>
                  </div>
                  
                  <div class="text-sm font-medium mb-3">Total Return Calculation:</div>
                  
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-700">Equity Return (${item.details.equityRate}%)</span>
                    <span class="font-medium text-purple-700">₹${formatNumber(item.details.equitySplit === 0 ? 0 : item.details.equityReturn)}</span>
                  </div>
                  
                  <div class="flex justify-between items-center py-2">
                    <span class="text-gray-700">FD Return (${item.details.fdRate}%)</span>
                    <span class="font-medium text-amber-700">₹${formatNumber(item.details.fdSplit === 0 ? 0 : item.details.fdReturn)}</span>
                  </div>
                  
                  <div class="flex justify-between items-center py-2 border-t border-gray-200 pt-3">
                    <span class="text-gray-700">Total Investment Returns</span>
                    <span class="font-medium text-gray-900">₹${formatNumber(item.details.equityReturn + item.details.fdReturn)}</span>
                  </div>
                  
                  <div class="flex justify-between items-center py-2 mb-1">
                    <span class="text-gray-700">− Total Rent Paid</span>
                    <span class="font-medium text-gray-900">₹${formatNumber(item.details.totalRentPaid)}</span>
                  </div>
                  
                  <div class="flex justify-between items-center py-2 border-t border-gray-200 pt-3 mt-1">
                    <span class="text-gray-900 font-medium">= Net Return</span>
                    <span class="font-semibold text-purple-700">₹${formatNumber((item.details.equityReturn + item.details.fdReturn) - item.details.totalRentPaid)}</span>
                  </div>
                  
                  <button class="update-split-btn mt-4 w-full bg-purple-500 text-white py-1.5 px-3 rounded hover:bg-purple-600 text-sm">Apply Split</button>
                </div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
    
    // Add helper function to get icon based on card label
    function getIconForCard(label) {
      switch(label) {
        case 'Property Value':
          return '<div class="icon-container bg-blue-100 text-blue-600 p-3 rounded-full"><i class="fas fa-home fa-lg"></i></div>';
        case 'Property with Rental':
          return '<div class="icon-container bg-green-100 text-green-600 p-3 rounded-full"><i class="fas fa-money-bill-wave fa-lg"></i></div>';
        case 'Equity Investment':
          return '<div class="icon-container bg-purple-100 text-purple-600 p-3 rounded-full"><i class="fas fa-chart-line fa-lg"></i></div>';
        case 'Fixed Deposit':
          return '<div class="icon-container bg-amber-100 text-amber-600 p-3 rounded-full"><i class="fas fa-piggy-bank fa-lg"></i></div>';
        case 'Renting + Invest':
          return '<div class="icon-container bg-purple-100 text-purple-600 p-3 rounded-full"><i class="fas fa-hand-holding-usd fa-lg"></i></div>';
        case 'Home Is Where The Heart Is':
          return '<div class="icon-container bg-pink-100 text-pink-600 p-3 rounded-full"><i class="fas fa-heart fa-lg"></i></div>';
        default:
          return '<div class="icon-container bg-gray-100 text-gray-600 p-3 rounded-full"><i class="fas fa-calculator fa-lg"></i></div>';
      }
    }
    
    // Add helper function to get description text based on card label
    function getDescriptionForCard(label) {
      switch(label) {
        case 'Property Value':
          return 'Shows pure property appreciation without rental income. This is what your property is worth now.';
        case 'Property with Rental':
          return 'Complete property investment return including both appreciation and rental income after expenses.';
        case 'Equity Investment':
          return 'What would happen if you invested the same amount in the stock market instead.';
        case 'Fixed Deposit':
          return 'Low-risk alternative showing returns if you put your money in fixed deposits instead.';
        case 'Renting + Invest':
          return 'Scenario where you rent a home and invest the money that would have gone to purchasing.';
        case 'Home Is Where The Heart Is':
          return 'A heartfelt message expressing the value of home and family beyond financial calculations.';
        default:
          return '';
      }
    }
    
    // Add event listeners for edit icons
    const editIcons = resultsDiv.querySelectorAll('.edit-icon');
    editIcons.forEach(icon => {
      icon.addEventListener('click', function(e) {
        e.preventDefault();
        const editMenu = this.closest('.relative').querySelector('.rate-edit-menu');
        if (editMenu) {
          editMenu.classList.toggle('hidden');
        }
      });
    });
    
    // Add event listener for details toggle
    const detailsToggles = resultsDiv.querySelectorAll('.details-toggle');
    detailsToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const propertyDetails = this.closest('.relative').querySelector('.property-details');
        propertyDetails.classList.toggle('hidden');
        
        // Toggle the icon
        const icon = this.querySelector('i');
        if (propertyDetails.classList.contains('hidden')) {
          icon.classList.remove('fa-chevron-up');
          icon.classList.add('fa-chevron-down');
        } else {
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-up');
        }
      });
    });
    
    // Add event listener for equity update button
    const updateEquityBtn = resultsDiv.querySelector('.update-equity-btn');
    if (updateEquityBtn) {
      updateEquityBtn.addEventListener('click', function() {
        const newRate = parseFloat(this.closest('.rate-options').querySelector('.edit-equity-rate').value);
        
        if (isNaN(newRate)) {
          alert('Please enter a valid rate');
          return;
        }
        
        // Update the main equity rate input
        document.getElementById('equity-rate').value = newRate;
        
        // Recalculate with new value
        updateAllCalculations();
      });
    }
    
    // Add event listener for FD update button
    const updateFdBtn = resultsDiv.querySelector('.update-fd-btn');
    if (updateFdBtn) {
      updateFdBtn.addEventListener('click', function() {
        const newRate = parseFloat(this.closest('.rate-options').querySelector('.edit-fd-rate').value);
        
        if (isNaN(newRate)) {
          alert('Please enter a valid rate');
          return;
        }
        
        // Update the main FD rate input
        document.getElementById('fd-rate').value = newRate;
        
        // Recalculate with new value
        updateAllCalculations();
      });
    }
    
    // Add event listener for rental update button
    const updateRentalBtn = resultsDiv.querySelector('.update-rental-btn');
    if (updateRentalBtn) {
      updateRentalBtn.addEventListener('click', function() {
        const newRental = parseFloat(this.closest('.details-calculation').querySelector('.edit-rental').value);
        const newGrowth = parseFloat(this.closest('.details-calculation').querySelector('.edit-rental-growth').value);
        const newExpenses = parseFloat(this.closest('.details-calculation').querySelector('.edit-expenses').value);
        
        if (isNaN(newRental) || isNaN(newGrowth) || isNaN(newExpenses)) {
          alert('Please enter valid numbers');
          return;
        }
        
        // Update the input fields if they exist
        const rentalIncomeInput = document.getElementById('monthly-rental-income');
        if (rentalIncomeInput) rentalIncomeInput.value = newRental;
        
        const rentalGrowthInput = document.getElementById('rental-income-growth');
        if (rentalGrowthInput) rentalGrowthInput.value = newGrowth;
        
        const expensesInput = document.getElementById('annual-expenses');
        if (expensesInput) expensesInput.value = newExpenses;
        
        // Recalculate with new values
        updateAllCalculations();
      });
    }
    
    // Add event listener for rent update
    const updateRentBtn = resultsDiv.querySelector('.update-rent-btn');
    if (updateRentBtn) {
      updateRentBtn.addEventListener('click', function() {
        const newRent = parseFloat(this.closest('.details-calculation').querySelector('.edit-rent').value);
        const newGrowth = parseFloat(this.closest('.details-calculation').querySelector('.edit-rent-growth').value);
        
        if (isNaN(newRent) || isNaN(newGrowth)) {
          alert('Please enter valid numbers');
          return;
        }
        
        // Update the input fields
        document.getElementById('monthly-rent').value = newRent;
        document.getElementById('rent-appreciation').value = newGrowth;
        
        // Recalculate with new values
        updateAllCalculations();
      });
    }
    
    // Add event listener for invest split slider
    setupInvestmentSplitControls(resultsDiv, initialValue, years, totalRentPaid, equityRate, fdRate);
  }
  
  // Function to setup investment split controls
  function setupInvestmentSplitControls(resultsDiv, initialValue, years, totalRentPaid, equityRate, fdRate) {
    // Add event listener for invest split slider
    const investSplitSlider = resultsDiv.querySelector('#invest-split');
    if (!investSplitSlider) return;
    
    investSplitSlider.addEventListener('input', function() {
      // Set to true to update main card values in real-time during slider interaction
      updateInvestmentSplit(this, resultsDiv, initialValue, years, totalRentPaid, equityRate, fdRate, true);
    });
    
    // Add event listener for apply split button
    const updateSplitBtn = resultsDiv.querySelector('.update-split-btn');
    if (updateSplitBtn) {
      updateSplitBtn.addEventListener('click', function() {
        const slider = resultsDiv.querySelector('#invest-split');
        updateInvestmentSplit(slider, resultsDiv, initialValue, years, totalRentPaid, equityRate, fdRate, true);
      });
    }
  }
  
  // Helper function to update investment split values
  function updateInvestmentSplit(slider, resultsDiv, initialValue, years, totalRentPaid, equityRate, fdRate, applyToMainCard) {
    const equitySplitValue = parseInt(slider.value);
    const fdSplitValue = 100 - equitySplitValue;
    
    // Calculate investment amounts
    const equityAmount = initialValue * (equitySplitValue/100);
    const fdAmount = initialValue * (fdSplitValue/100);
    
    // Update the split display
    const splitLabels = slider.parentElement.querySelector('.flex');
    splitLabels.innerHTML = `
      <span class="text-purple-700 text-sm font-medium">Equity: ${equitySplitValue}%</span>
      <span class="text-amber-700 text-sm font-medium">FD: ${fdSplitValue}%</span>
    `;
    
    // Update the amounts display
    const amountsDisplay = slider.parentElement.querySelector('.flex.justify-between.items-center.mt-1');
    amountsDisplay.innerHTML = `
      <span>₹${formatNumber(equityAmount)} in Equity</span>
      <span>₹${formatNumber(fdAmount)} in FD</span>
    `;
    
    // Calculate investment returns with proper zero handling
    const equityReturn = equitySplitValue === 0 ? 0 : equityAmount * Math.pow(1 + equityRate/100, years);
    const fdReturn = fdSplitValue === 0 ? 0 : fdAmount * Math.pow(1 + fdRate/100, years);
    
    // Calculate combined return
    const totalInvestmentReturn = equityReturn + fdReturn;
    const netReturn = totalInvestmentReturn - totalRentPaid;
    
    // Calculate multiplier
    const rentingInvestMultiplier = netReturn / initialValue;
    
    // Calculate new CAGR
    const rentingInvestCAGR = (Math.pow((netReturn) / initialValue, 1 / years) - 1) * 100;
    
    // Update the return values in the details section
    const detailsDiv = slider.closest('.property-details');
    
    // Find the equity row by looking for text content containing "Equity Return"
    const equityRow = Array.from(detailsDiv.querySelectorAll('.flex')).find(row => 
      row.textContent.includes('Equity Return')
    );
    if (equityRow) {
      const equityReturnElement = equityRow.querySelector('.font-medium');
      if (equityReturnElement) {
        equityReturnElement.textContent = `₹${formatNumber(equityReturn)}`;
      }
    }
    
    // Find the FD row by looking for text content containing "FD Return"
    const fdRow = Array.from(detailsDiv.querySelectorAll('.flex')).find(row => 
      row.textContent.includes('FD Return')
    );
    if (fdRow) {
      const fdReturnElement = fdRow.querySelector('.font-medium');
      if (fdReturnElement) {
        fdReturnElement.textContent = `₹${formatNumber(fdReturn)}`;
      }
    }
    
    // Update total investment return - find by "Total Investment Returns" text
    const totalInvestmentRow = Array.from(detailsDiv.querySelectorAll('.flex')).find(row => 
      row.textContent.includes('Total Investment Returns')
    );
    if (totalInvestmentRow) {
      const totalInvestmentElement = totalInvestmentRow.querySelector('.font-medium');
      if (totalInvestmentElement) {
        totalInvestmentElement.textContent = `₹${formatNumber(totalInvestmentReturn)}`;
      }
    }
    
    // Update net return - find by "Net Return" text
    const netReturnRow = Array.from(detailsDiv.querySelectorAll('.flex')).find(row => 
      row.textContent.includes('Net Return')
    );
    if (netReturnRow) {
      const netReturnElement = netReturnRow.querySelector('.font-semibold');
      if (netReturnElement) {
        netReturnElement.textContent = `₹${formatNumber(netReturn)}`;
      }
    }
    
    // If apply to main card, update the main display too
    if (applyToMainCard) {
      // Find the Renting + Invest card
      const rentingCard = Array.from(resultsDiv.querySelectorAll('.rounded-xl')).find(card => 
        card.querySelector('.text-gray-600').textContent === 'Renting + Invest'
      );
      
      if (rentingCard) {
        // Update main value
        const mainValue = rentingCard.querySelector('.text-2xl');
        if (mainValue) {
          mainValue.textContent = `₹${formatNumber(netReturn)}`;
        }
        
        // Update multiplier
        const multiplierElement = rentingCard.querySelector('.text-lg');
        if (multiplierElement) {
          multiplierElement.textContent = `${rentingInvestMultiplier.toFixed(1)}x return`;
        }
        
        // Update CAGR
        const subtextElement = rentingCard.querySelector('.text-sm.text-gray-500');
        if (subtextElement) {
          subtextElement.textContent = `${rentingInvestCAGR.toFixed(1)}% annual growth`;
        }
      }
    }
  }
  
  function formatNumber(num) {
    if (num >= 10000000) {
      // Convert to crores (≥ 1 crore)
      return (num / 10000000).toFixed(2) + ' Cr';
    } else if (num >= 100000) {
      // Convert to lakhs (≥ 1 lakh) without decimals
      return Math.round(num / 100000) + ' L';
    } else {
      // Regular formatting for smaller numbers
      return num.toLocaleString('en-IN');
    }
  }
}); 