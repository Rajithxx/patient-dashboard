const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";

let chartInstance = null;

async function fetchData() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        "Authorization": "Basic " + btoa("coalition:skills-test")
      }
    });

    const data = await res.json();
    console.log("DATA:", data);

    const p = data.find(x => x.name === "Jessica Taylor");

    if (!p) {
      console.error("Jessica not found");
      return;
    }

    updateUI(p);
    updateVitals(p);
    updateBP(p);
    updateChart(p);
    updateDiagnostics(p);
    updateLabs(p);

  } catch (err) {
    console.error("API ERROR:", err);
  }
}

fetchData();


function updateUI(p) {
  document.getElementById("name").textContent = p.name;
  document.getElementById("gender").textContent = p.gender;
  document.getElementById("phone").textContent = p.phone_number;
  document.getElementById("insurance").textContent = p.insurance_type;

  document.getElementById("dob").textContent =
    new Date(p.date_of_birth).toLocaleDateString();

  document.getElementById("profile-img").src = p.profile_picture;

  document.getElementById("gender-icon").src =
    p.gender.toLowerCase() === "male"
      ? "assets/male.svg"
      : "assets/female.svg";
}


function updateVitals(p) {
  const latest = p.diagnosis_history.slice(-1)[0];

  document.getElementById("respiratory").textContent =
    latest.respiratory_rate.value + " bpm";

  document.getElementById("temperature").textContent =
    latest.temperature.value + "°F";

  document.getElementById("heart").textContent =
    latest.heart_rate.value + " bpm";
}


function updateBP(p) {
  const latest = p.diagnosis_history.slice(-1)[0];

  document.getElementById("systolic-value").textContent =
    latest.blood_pressure.systolic.value;

  document.getElementById("diastolic-value").textContent =
    latest.blood_pressure.diastolic.value;
}


function updateChart(p) {
  const labels = p.diagnosis_history.map(item => item.month);

  const systolic = p.diagnosis_history.map(item => item.blood_pressure.systolic.value);
  const diastolic = p.diagnosis_history.map(item => item.blood_pressure.diastolic.value);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(document.getElementById("bpChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Systolic", data: systolic, borderColor: "#3b82f6", tension: 0.4 },
        { label: "Diastolic", data: diastolic, borderColor: "#ef4444", tension: 0.4 }
      ]
    }
  });
}


function updateDiagnostics(p) {
  const el = document.getElementById("diagnostic-body");
  el.innerHTML = "";

  p.diagnostic_list.forEach(item => {
    el.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>${item.status}</td>
      </tr>`;
  });
}


function updateLabs(p) {
  const el = document.getElementById("lab-list");
  el.innerHTML = "";

  p.lab_results.forEach(item => {
    el.innerHTML += `<li>${item}</li>`;
  });
}