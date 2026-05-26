const riskConfig = {
    Underweight: { color: '#1A3A6B', bg: '#E3EBF8', barColor: '#378ADD' },
    Normal:      { color: '#2D5016', bg: '#EBF2E2', barColor: '#5DCAA5' },
    Overweight:  { color: '#7A4A08', bg: '#FDF3E0', barColor: '#EF9F27' },
    Obese:       { color: '#8B1F1F', bg: '#FDEAEA', barColor: '#E24B4A' },
  };
 
  document.getElementById('weight').addEventListener('input', updateBMI);
  document.getElementById('height').addEventListener('input', updateBMI);
 
  function updateBMI() {
    const w = parseFloat(document.getElementById('weight').value);
    const h = parseFloat(document.getElementById('height').value);
    if (w && h) {
      document.getElementById('bmi-display').textContent = (w / ((h / 100) ** 2)).toFixed(1);
    } else {
      document.getElementById('bmi-display').textContent = '—';
    }
  }
 
  async function predict() {
    const age    = document.getElementById('age').value.trim();
    const weight = document.getElementById('weight').value.trim();
    const height = document.getElementById('height').value.trim();
    const gender = document.getElementById('gender').value;
 
    document.getElementById('error-area').innerHTML = '';
    document.getElementById('result-area').innerHTML = '';
 
    if (!age || !weight || !height) {
      document.getElementById('error-area').innerHTML =
        '<div class="error-msg">Please fill in all fields before predicting.</div>';
      return;
    }
 
    const btn = document.getElementById('predict-btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>Predicting...';
 
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age, weight, height, gender })
      });
 
      if (!response.ok) throw new Error('Server error');
 
      const data = await response.json();
      renderResult(data, age, weight, height);
 
    } catch (err) {
      document.getElementById('error-area').innerHTML =
        '<div class="error-msg">Could not connect to the server. Make sure app.py is running.</div>';
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Predict risk level';
    }
  }
 
  function renderResult(data, age, weight, height) {
    const cfg   = riskConfig[data.prediction] || riskConfig['Normal'];
    const probs = data.probabilities;
 
    const barsHTML = Object.entries(probs).map(([cls, pct]) => {
      const c = (riskConfig[cls] || {}).barColor || '#888';
      return `
        <div class="prob-row">
          <div class="prob-meta">
            <span class="cls">${cls}</span>
            <span class="pct">${pct}%</span>
          </div>
          <div class="bar-bg">
            <div class="bar-fill" style="width:${pct}%; background:${c};"></div>
          </div>
        </div>`;
    }).join('');
 
    document.getElementById('result-area').innerHTML = `
      <div class="result">
        <div class="result-header" style="background:${cfg.bg};">
          <span class="label">Result</span>
          <span class="badge" style="background:${cfg.bg}; color:${cfg.color}; border:1px solid ${cfg.color}33;">
            ${data.prediction}
          </span>
        </div>
        <div class="stats-row">
          <div class="stat">
            <div class="s-label">BMI</div>
            <div class="s-val">${data.bmi}</div>
          </div>
          <div class="stat">
            <div class="s-label">Age</div>
            <div class="s-val">${age}</div>
          </div>
          <div class="stat">
            <div class="s-label">Weight</div>
            <div class="s-val">${weight} kg</div>
          </div>
        </div>
        <div class="probs">
          ${barsHTML}
        </div>
      </div>`;
  }