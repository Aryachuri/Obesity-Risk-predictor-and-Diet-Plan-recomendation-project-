 const riskConfig = {
    Underweight: { color: '#1A3A6B', bg: '#E3EBF8', iconBg: '#daeaf7', barColor: '#378ADD' },
    Normal:      { color: '#2D5016', bg: '#EBF2E2', iconBg: '#d5eccc', barColor: '#5DCAA5' },
    Overweight:  { color: '#7A4A08', bg: '#FDF3E0', iconBg: '#fae8c0', barColor: '#EF9F27' },
    Obese:       { color: '#8B1F1F', bg: '#FDEAEA', iconBg: '#f8d5d5', barColor: '#E24B4A' },
  };

  const bmiCategories = {
    Underweight: { color: '#1A3A6B', bg: '#E3EBF8', border: '#9DBAE0' },
    Normal:      { color: '#2D5016', bg: '#EBF2E2', border: '#B8D9A0' },
    Overweight:  { color: '#7A4A08', bg: '#FDF3E0', border: '#E8C87A' },
    Obese:       { color: '#8B1F1F', bg: '#FDEAEA', border: '#e8bcb8' },
  };

  function bmiLabel(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25)   return 'Normal';
    if (bmi < 30)   return 'Overweight';
    return 'Obese';
  }

  document.getElementById('weight').addEventListener('input', updateBMI);
  document.getElementById('height').addEventListener('input', updateBMI);

  function updateBMI() {
    const w = parseFloat(document.getElementById('weight').value);
    const h = parseFloat(document.getElementById('height').value);
    const display = document.getElementById('bmi-display');
    const badge   = document.getElementById('bmi-badge');

    if (w && h) {
        const height_m = h * 0.3048;

        const bmi = w / (height_m ** 2);

      const lbl = bmiLabel(bmi);
      const cfg = bmiCategories[lbl];
      display.textContent = bmi.toFixed(1);
      badge.textContent   = lbl;
      badge.style.display = 'inline-block';
      badge.style.color   = cfg.color;
      badge.style.background  = cfg.bg;
      badge.style.borderColor = cfg.border;
    } else {
      display.textContent = '—';
      badge.style.display = 'none';
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
    btn.innerHTML = '<span class="spinner"></span> Predicting…';

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
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        Predict Risk Level`;
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
      <div class="section-label" style="margin-top:8px;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Prediction result
      </div>

      <div class="result-card">
        <!-- Header -->
        <div class="result-header" style="background:${cfg.bg};">
          <div class="result-header-left">
            <div class="result-icon" style="background:${cfg.iconBg}; color:${cfg.color};">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div class="result-header-text">
              <h3>Prediction Complete</h3>
              <p>Random Forest classifier result</p>
            </div>
          </div>
          <span class="result-badge"
            style="color:${cfg.color}; background:${cfg.bg}; border-color:${cfg.color}33;">
            ${data.prediction}
          </span>
        </div>

        <!-- Stats -->
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

        <!-- Probability bars -->
        <div class="probs">
          <div class="probs-title">Confidence by class</div>
          ${barsHTML}
        </div>

        <!-- Diet Planner CTA -->
        <a class="diet-cta" href="/diet">
          <div class="cta-left">
            <div class="cta-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
            </div>
            <div class="cta-text">
              <strong>Get Your Diet Plan</strong>
              <span>Use these results in the AI Diet Planner →</span>
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${cfg.color}" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>`;
  }