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
    
    // Update the UI with calculated values
    
    // 1. Property Value Card
    document.getElementById('property-value').textContent = `₹${formatNumber(currentValue)}`;
    document.getElementById('property-multiplier').textContent = `${totalReturn.toFixed(1)}x`;
    document.getElementById('property-subtext').textContent = `${cagr.toFixed(1)}% annual growth`;
    
    // 2. Property with Rental Card
    document.getElementById('rental-value').textContent = `₹${formatNumber(initialValue + totalGain)}`;
    document.getElementById('rental-multiplier').textContent = `${totalMultiplier.toFixed(1)}x`;
    document.getElementById('rental-subtext').textContent = `${effectiveAnnualReturn.toFixed(1)}% effective annual return`;
    
    // Rental details calculations
    document.getElementById('property-value-gain').textContent = `₹${formatNumber(propertyValueGain)}`;
    document.getElementById('total-rental-income').textContent = `₹${formatNumber(totalRentalIncome)}`;
    document.getElementById('total-expenses').textContent = `₹${formatNumber(totalExpenses)}`;
    document.getElementById('rental-net-return').textContent = `₹${formatNumber(propertyValueGain + netRentalIncome)}`;
    
    // Update rental inputs
    document.querySelector('.edit-rental').value = monthlyRentalIncome;
    document.querySelector('.edit-rental-growth').value = rentalGrowth;
    document.querySelector('.edit-expenses').value = annualExpenses;
    
    // 3. Equity Investment Card
    document.getElementById('equity-value').textContent = `₹${formatNumber(equityFinalValue)}`;
    document.getElementById('equity-multiplier').textContent = `${equityMultiplier.toFixed(1)}x`;
    document.getElementById('equity-subtext').textContent = `${equityRate}% annual return`;
    document.querySelector('.edit-equity-rate').value = equityRate;
    
    // 4. Fixed Deposit Card
    document.getElementById('fd-value').textContent = `₹${formatNumber(fdFinalValue)}`;
    document.getElementById('fd-multiplier').textContent = `${fdMultiplier.toFixed(1)}x`;
    document.getElementById('fd-subtext').textContent = `${fdRate}% annual interest`;
    document.querySelector('.edit-fd-rate').value = fdRate;
    
    // 5. Renting + Invest Card
    document.getElementById('rent-invest-value').textContent = `₹${formatNumber(rentingInvestTotal)}`;
    document.getElementById('rent-invest-multiplier').textContent = `${rentingInvestMultiplier.toFixed(1)}x return`;
    document.getElementById('rent-invest-subtext').textContent = `${rentingInvestCAGR.toFixed(1)}% annual growth`;
    
    // Update rent + invest details
    document.getElementById('equity-split-label').textContent = `Equity: ${equitySplit}%`;
    document.getElementById('fd-split-label').textContent = `FD: ${fdSplit}%`;
    document.getElementById('equity-amount').textContent = `₹${formatNumber(equityAmount)} in Equity`;
    document.getElementById('fd-amount').textContent = `₹${formatNumber(fdAmount)} in FD`;
    document.getElementById('property-final-value').textContent = `₹${formatNumber(currentValue)}`;
    
    // Update return calculations
    document.getElementById('equity-return-label').textContent = `Equity Return (${equityRate}%)`;
    document.getElementById('fd-return-label').textContent = `FD Return (${fdRate}%)`;
    document.getElementById('equity-return-value').textContent = `₹${formatNumber(equityReturn)}`;
    document.getElementById('fd-return-value').textContent = `₹${formatNumber(fdReturn)}`;
    document.getElementById('total-investment-returns').textContent = `₹${formatNumber(combinedFinalValue)}`;
    document.getElementById('total-rent-paid').textContent = `₹${formatNumber(totalRentPaid)}`;
    document.getElementById('rent-invest-net-return').textContent = `₹${formatNumber(rentingInvestTotal)}`;
    
    // Update rent inputs
    document.querySelector('.edit-rent').value = monthlyRent;
    document.querySelector('.edit-rent-growth').value = rentAppreciation;
    
    // Update final monthly rent display
    const finalMonthlyRent = monthlyRent * Math.pow(1 + rentAppreciation/100, years);
    document.getElementById('final-monthly-rent').textContent = `₹${formatNumber(finalMonthlyRent)}`;
    
    // Set range slider value
    document.getElementById('invest-split').value = equitySplit;
    
    // Setup event listeners
    setupEventListeners();
  }
  
  // Function to setup all event listeners
  function setupEventListeners() {
    // Setup edit icons for showing/hiding rate edit menus
    const editIcons = document.querySelectorAll('.edit-icon');
    editIcons.forEach(icon => {
      if (!icon.hasAttribute('data-listener-attached')) {
        icon.setAttribute('data-listener-attached', 'true');
        icon.addEventListener('click', function(e) {
          e.preventDefault();
          const editMenu = this.closest('.relative').querySelector('.rate-edit-menu');
          if (editMenu) {
            editMenu.classList.toggle('hidden');
          }
        });
      }
    });
    
    // Setup details toggles
    const detailsToggles = document.querySelectorAll('.details-toggle');
    detailsToggles.forEach(toggle => {
      if (!toggle.hasAttribute('data-listener-attached')) {
        toggle.setAttribute('data-listener-attached', 'true');
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
      }
    });
    
    // Setup rate update buttons
    const updateEquityBtn = document.querySelector('.update-equity-btn');
    if (updateEquityBtn && !updateEquityBtn.hasAttribute('data-listener-attached')) {
      updateEquityBtn.setAttribute('data-listener-attached', 'true');
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
    
    const updateFdBtn = document.querySelector('.update-fd-btn');
    if (updateFdBtn && !updateFdBtn.hasAttribute('data-listener-attached')) {
      updateFdBtn.setAttribute('data-listener-attached', 'true');
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
    
    // Setup rental update button
    const updateRentalBtn = document.querySelector('.update-rental-btn');
    if (updateRentalBtn && !updateRentalBtn.hasAttribute('data-listener-attached')) {
      updateRentalBtn.setAttribute('data-listener-attached', 'true');
      updateRentalBtn.addEventListener('click', function() {
        const newRental = parseFloat(this.closest('.details-calculation').querySelector('.edit-rental').value);
        const newGrowth = parseFloat(this.closest('.details-calculation').querySelector('.edit-rental-growth').value);
        const newExpenses = parseFloat(this.closest('.details-calculation').querySelector('.edit-expenses').value);
        
        if (isNaN(newRental) || isNaN(newGrowth) || isNaN(newExpenses)) {
          alert('Please enter valid numbers');
          return;
        }
        
        // Update the input fields
        document.getElementById('monthly-rental-income').value = newRental;
        document.getElementById('rental-income-growth').value = newGrowth;
        document.getElementById('annual-expenses').value = newExpenses;
        
        // Recalculate with new values
        updateAllCalculations();
      });
    }
    
    // Setup rent update button
    const updateRentBtn = document.querySelector('.update-rent-btn');
    if (updateRentBtn && !updateRentBtn.hasAttribute('data-listener-attached')) {
      updateRentBtn.setAttribute('data-listener-attached', 'true');
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
    
    // Setup investment split slider
    setupInvestmentSplitControls();
  }
  
  // Function to setup investment split controls
  function setupInvestmentSplitControls() {
    const investSplitSlider = document.getElementById('invest-split');
    if (investSplitSlider && !investSplitSlider.hasAttribute('data-listener-attached')) {
      investSplitSlider.setAttribute('data-listener-attached', 'true');
      
      investSplitSlider.addEventListener('input', function() {
        // Get values needed for calculation
        const initialValue = parseFloat(document.getElementById('main-initial-value').value) * 100000;
        const years = parseFloat(document.getElementById('main-years').value);
        const fdRate = parseFloat(document.getElementById('fd-rate').value) || 7;
        const equityRate = parseFloat(document.getElementById('equity-rate').value) || 12;
        const totalRentPaidText = document.getElementById('total-rent-paid').textContent;
        const totalRentPaid = parseFloat(totalRentPaidText.replace(/[^\d.]/g, '')) * 100000;
        
        updateInvestmentSplit(this, initialValue, years, totalRentPaid, equityRate, fdRate, false);
      });
      
      // Add event listener for apply split button
      const updateSplitBtn = document.querySelector('.update-split-btn');
      if (updateSplitBtn && !updateSplitBtn.hasAttribute('data-listener-attached')) {
        updateSplitBtn.setAttribute('data-listener-attached', 'true');
        
        updateSplitBtn.addEventListener('click', function() {
          const slider = document.getElementById('invest-split');
          
          // Get values needed for calculation
          const initialValue = parseFloat(document.getElementById('main-initial-value').value) * 100000;
          const years = parseFloat(document.getElementById('main-years').value);
          const fdRate = parseFloat(document.getElementById('fd-rate').value) || 7;
          const equityRate = parseFloat(document.getElementById('equity-rate').value) || 12;
          const totalRentPaidText = document.getElementById('total-rent-paid').textContent;
          const totalRentPaid = parseFloat(totalRentPaidText.replace(/[^\d.]/g, '')) * 100000;
          
          updateInvestmentSplit(slider, initialValue, years, totalRentPaid, equityRate, fdRate, true);
        });
      }
    }
  }
  
  // Helper function to update investment split values
  function updateInvestmentSplit(slider, initialValue, years, totalRentPaid, equityRate, fdRate, applyToMainCard) {
    const equitySplitValue = parseInt(slider.value);
    const fdSplitValue = 100 - equitySplitValue;
    
    // Calculate investment amounts
    const equityAmount = initialValue * (equitySplitValue/100);
    const fdAmount = initialValue * (fdSplitValue/100);
    
    // Update the split display
    document.getElementById('equity-split-label').textContent = `Equity: ${equitySplitValue}%`;
    document.getElementById('fd-split-label').textContent = `FD: ${fdSplitValue}%`;
    
    // Update the amounts display
    document.getElementById('equity-amount').textContent = `₹${formatNumber(equityAmount)} in Equity`;
    document.getElementById('fd-amount').textContent = `₹${formatNumber(fdAmount)} in FD`;
    
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
    
    // Update return values in the details section
    document.getElementById('equity-return-label').textContent = `Equity Return (${equityRate}%)`;
    document.getElementById('equity-return-value').textContent = `₹${formatNumber(equityReturn)}`;
    
    document.getElementById('fd-return-label').textContent = `FD Return (${fdRate}%)`;
    document.getElementById('fd-return-value').textContent = `₹${formatNumber(fdReturn)}`;
    
    document.getElementById('total-investment-returns').textContent = `₹${formatNumber(totalInvestmentReturn)}`;
    document.getElementById('rent-invest-net-return').textContent = `₹${formatNumber(netReturn)}`;
    
    // If apply to main card, update the main display too
    if (applyToMainCard) {
      document.getElementById('rent-invest-value').textContent = `₹${formatNumber(netReturn)}`;
      document.getElementById('rent-invest-multiplier').textContent = `${rentingInvestMultiplier.toFixed(1)}x return`;
      document.getElementById('rent-invest-subtext').textContent = `${rentingInvestCAGR.toFixed(1)}% annual growth`;
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