 // ── BMI categories ──
  const bmiCategories = {
    Underweight: { color: '#1A3A6B', bg: '#E3EBF8', border: '#9DBAE0' },
    Normal:      { color: '#2D5016', bg: '#EBF2E2', border: '#B8D9A0' },
    Overweight:  { color: '#7A4A08', bg: '#FDF3E0', border: '#E8C87A' },
    Obese:       { color: '#8B1F1F', bg: '#FDEAEA', border: '#E8bcb8' },
  };

  function bmiLabel(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25)   return 'Normal';
    if (bmi < 30)   return 'Overweight';
    return 'Obese';
  }

  // ── BMI auto-calculate ──
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
      badge.style.background = cfg.bg;
      badge.style.borderColor = cfg.border;
    } else {
      display.textContent = '—';
      badge.style.display = 'none';
    }
  }

  document.getElementById('weight').addEventListener('input', updateBMI);
  document.getElementById('height').addEventListener('input', updateBMI);

  // Store result for timetable navigation
  let lastResult = {};

  // ── Predict ──
  async function predictDiet() {
    const age      = document.getElementById('age').value;
    const gender   = document.getElementById('gender').value;
    const weight   = document.getElementById('weight').value;
    const height   = document.getElementById('height').value;
    const activity = document.getElementById('activity').value;
    const health   = document.getElementById('health').value;
    const calories = document.getElementById('calories').value;
    const errorBox = document.getElementById('error-box');
    const btn      = document.getElementById('submit-btn');

    errorBox.className = 'error-box';

    if (!age || !weight || !height || !calories) {
      errorBox.className = 'error-box visible';
      return;
    }

   const height_m = parseFloat(height) * 0.3048;
   const bmi = parseFloat(weight) / (height_m ** 2);

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Predicting…`;

    try {
      const response = await fetch('/diet_plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age, gender, weight, height,
          bmi, activity_level: activity,
          health_condition: health,
          calorie_target: calories
        })
      });

      const result = await response.json();

      // Save for timetable
      lastResult = {
        diet:          result.diet,
        bmi:           result.bmi,
        obesity_level: bmiLabel(result.bmi)
      };

      showResult(result);

    } catch (err) {
      errorBox.textContent = 'Could not connect to server. Make sure app.py is running.';
      errorBox.className = 'error-box visible';
    } finally {
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
        Generate Diet Plan`;
    }
  }

  function showResult(result) {
    const bmi = result.bmi;
    const lbl = bmiLabel(bmi);
    const cfg = bmiCategories[lbl];

    // Result card header colour
    document.getElementById('result-header-el').style.background = cfg.bg;

    // Diet name
    document.getElementById('diet-result').textContent = result.diet;
    document.getElementById('diet-result').style.color = cfg.color;

    // Chips
    document.getElementById('bmi-chip').textContent = `BMI ${bmi}`;
    document.getElementById('category-chip').innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      </svg>
      ${lbl}`;

    document.getElementById('result-area').className = 'result-card visible';

    // Scroll to result
    document.getElementById('result-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Navigate to timetable with ML results ──
  async function goToTimetable() {
    if (!lastResult.diet) return;

    const res = await fetch('/exercise_timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        obesity_level: lastResult.obesity_level,
        diet_plan:     lastResult.diet,
        bmi:           lastResult.bmi
      })
    });

    const html = await res.text();
    document.open();
    document.write(html);
    document.close();
  }
  document.addEventListener('DOMContentLoaded', function () {
    updateBMI();
});