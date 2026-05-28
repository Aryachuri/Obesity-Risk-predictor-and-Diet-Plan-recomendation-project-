 /* ── bmi_to_label mirrors Python ── */
  function autoFillObesity(val) {
    const bmi = parseFloat(val);
    const sel  = document.getElementById('obesityLevel');
    const pill = document.getElementById('bmiPill');
    if (isNaN(bmi) || val === '') {
      pill.className = 'bmi-pill';
      pill.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Enter BMI above`;
      return;
    }
    let label, cls;
    if      (bmi < 18.5) { label = 'Underweight'; cls = 'underweight'; }
    else if (bmi < 25)   { label = 'Normal';       cls = 'normal';      }
    else if (bmi < 30)   { label = 'Overweight';   cls = 'overweight';  }
    else                 { label = 'Obese';         cls = 'obese';       }
    sel.value     = label;
    pill.className = `bmi-pill ${cls}`;
    pill.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> ${label}`;
  }

  /* ── diet_plan mirrors Python if/elif ── */
  function autoDetectDiet() {
    const bmi       = parseFloat(document.getElementById('bmiInput').value);
    const condition = document.getElementById('healthCondition').value;
    const activity  = document.getElementById('activityLevel').value;
    const dietSel   = document.getElementById('dietPlan');
    const result    = document.getElementById('dietDetectResult');

    if (isNaN(bmi)) {
      result.className = 'detect-result';
      result.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Enter BMI to auto-detect`;
      return;
    }

    let diet, reason, color;
    if (condition === 'Diabetes') {
      diet = 'Diabetic Diet';     reason = 'Health condition: Diabetes';    color = 'var(--red)';
    } else if (bmi >= 30) {
      diet = 'Weight Loss Diet';  reason = `BMI ${bmi.toFixed(1)} ≥ 30`;    color = 'var(--amber)';
    } else if (activity === 'High' && bmi < 25) {
      diet = 'Muscle Gain Diet';  reason = `Activity High + BMI < 25`;      color = 'var(--green)';
    } else if (bmi < 18.5) {
      diet = 'High-Protein Diet'; reason = `BMI ${bmi.toFixed(1)} < 18.5`;  color = 'var(--blue)';
    } else if (condition === 'Hypertension') {
      diet = 'Low-Carb Diet';     reason = 'Health condition: Hypertension'; color = 'var(--amber)';
    } else {
      diet = 'Balanced Diet';     reason = 'No special conditions';          color = 'var(--green)';
    }

    dietSel.value = diet;
    result.className = 'detect-result active';
    result.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <strong style="color:${color};">${diet}</strong>
      <span style="color:var(--muted);font-size:12px;margin-left:4px;">· ${reason}</span>`;
  }

  /* ── collapse ── */
  function toggleCollapse() {
    const body   = document.getElementById('collapseBody');
    const toggle = document.getElementById('collapseToggle');
    const open   = body.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.childNodes[2].textContent = open ? ' Hide additional details' : ' Additional details (optional)';
  }

  /* ── prompt builder ── */
  function buildPrompt() {
    const obesity   = document.getElementById('obesityLevel').value;
    const diet      = document.getElementById('dietPlan').value;
    const condition = document.getElementById('healthCondition').value;
    const activity  = document.getElementById('activityLevel').value;
    const age       = document.getElementById('ageRange').value;
    const gender    = document.getElementById('gender').value;
    const goal      = document.getElementById('fitnessGoal').value;
    const time      = document.getElementById('availableTime').value;
    const foodPref =document.getElementById('foodPrepered').value;

    const foodRule = foodPref === 'Vegetarian'
    ? `⚠️ STRICT RULE: This person is VEGETARIAN. You must NEVER suggest any meat, 
       chicken, fish, seafood, or any non-vegetarian food item anywhere in this plan. 
       All meals and diet tips must be 100% vegetarian.`
    : foodPref === 'Vegan'
    ? `⚠️ STRICT RULE: This person is VEGAN. You must NEVER suggest any animal products 
       including meat, fish, dairy, eggs, or honey. All meals must be 100% plant-based.`
    : foodPref === 'Eggetarian'
    ? `⚠️ STRICT RULE: This person is EGGETARIAN. They eat eggs but NO meat, chicken, 
       or seafood. Do not suggest any meat-based foods.`
    : `This person has no food restrictions. You may suggest any food.`;

  return `You are a certified fitness and nutrition coach.

${foodRule}

Create a detailed 7-day exercise timetable for a person with the following profile:
- Obesity Level: ${obesity}
- Diet Plan: ${diet}
- Food Preference: ${foodPref}
- Health Condition: ${condition}
- Activity Level: ${activity}
- Age Range: ${age}
- Gender: ${gender}
- Fitness Goal: ${goal}
- Available Time Per Day: ${time}

For each day (Monday to Sunday) include:
1. Day name and focus area
2. Warm-up (5–10 min)
3. Main workout with sets/reps or duration
4. Cool-down (5 min)
5. Diet tip of the day — must strictly follow the ${foodPref} food preference

Use clear formatting with headers for each day.`;
  }

  /* ── generate ── */
  async function generateTimetable() {
    const obesity = document.getElementById('obesityLevel').value;
    const diet    = document.getElementById('dietPlan').value;

    if (!obesity || !diet) {
      showError('<strong>Missing fields.</strong> Please select an Obesity Level and a Diet Plan before generating.');
      return;
    }

    const btn        = document.getElementById('generateBtn');
    const statusBar  = document.getElementById('statusBar');
    const errorBox   = document.getElementById('errorBox');
    const outputSec  = document.getElementById('outputSection');
    const outputDiv  = document.getElementById('timetableOutput');
    const statusText = document.getElementById('statusText');
    const planMeta   = document.getElementById('planMeta');

    btn.disabled = true;
    errorBox.className = 'error-box';
    outputSec.className = 'output-section';
    outputDiv.innerHTML = '';
    statusBar.className = 'status-bar visible';
    statusText.textContent = 'Connecting to Ollama · mistral:7b …';

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'mistral:7b', prompt: buildPrompt(), stream: true })
      });

      if (!res.ok) throw new Error(`Ollama returned HTTP ${res.status}`);

      statusText.textContent = 'Generating your personalised timetable …';
      outputSec.className = 'output-section visible';
      planMeta.textContent = `${obesity} · ${diet}`;

      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      outputDiv.appendChild(cursor);

      let fullText = '';
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true }).split('\n').filter(l => l.trim());
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              fullText += json.response;
              cursor.remove();
              outputDiv.innerHTML = renderMarkdown(fullText);
              outputDiv.appendChild(cursor);
            }
            if (json.done) { cursor.remove(); statusBar.className = 'status-bar'; btn.disabled = false; }
          } catch (_) {}
        }
      }
      cursor.remove();
      btn.disabled = false;
      statusBar.className = 'status-bar';

    } catch (err) {
      statusBar.className = 'status-bar';
      btn.disabled = false;
      let msg = err.message;
      if (err.name === 'TypeError' && err.message.includes('fetch'))
        msg = `<strong>Cannot reach Ollama.</strong><br>Make sure it's running: <code>ollama serve</code><br>Enable CORS: <code>OLLAMA_ORIGINS="*" ollama serve</code>`;
      else
        msg = `<strong>Error:</strong> ${msg}`;
      showError(msg);
    }
  }

  function showError(html) {
    const box = document.getElementById('errorBox');
    box.innerHTML = html;
    box.className = 'error-box visible';
  }

  function renderMarkdown(text) {
    return text
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/<strong>(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Day \d+)<\/strong>/gi,
        '<div class="day-block"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><strong>$1</strong></div>')
      .replace(/\n/g, '<br>');
  }

  async function copyOutput() {
    const text = document.getElementById('timetableOutput').innerText;
    try {
      await navigator.clipboard.writeText(text);
      const btn = document.getElementById('copyBtn');
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      btn.className = 'btn-copy copied';
      setTimeout(() => {
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
        btn.className = 'btn-copy';
      }, 2000);
    } catch (_) { alert('Copy failed – select and copy manually.'); }
  }