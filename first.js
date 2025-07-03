
const dropdowns = document.querySelectorAll("select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector("select[name='from']");
const toCurr = document.querySelector("select[name='to']");
const msg = document.querySelector(".msg");

// 🔁 Load dropdowns on page load
window.addEventListener("load", () => {
  loadDropdowns();
  updateRate();
});

// 🎯 Convert when clicking button
btn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Convert clicked");
  updateRate();
});

// 🔃 Fill dropdowns with countryList
function loadDropdowns() {
  for (let select of dropdowns) {
    select.innerHTML = "";

    for (let code in countryList) {
      let option = document.createElement("option");
      option.value = code;
      option.innerText = code;

      if (select.name === "from" && code === "USD") option.selected = true;
      if (select.name === "to" && code === "INR") option.selected = true;

      select.appendChild(option);
    }

    select.addEventListener("change", (e) => {
      updateFlag(e.target);
    });

    updateFlag(select);
  }
}

// 🏳️ Update flag image
function updateFlag(selectElement) {
  const currencyCode = selectElement.value;
  const countryCode = countryList[currencyCode];
  let img = selectElement.parentElement.querySelector("img");

  if (img) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  } else {
    img = document.createElement("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    selectElement.parentElement.appendChild(img);
  }
}

// 💱 Fetch and show exchange rate
async function updateRate() {
  const amountInput = document.querySelector("input");
  let amount = parseFloat(amountInput.value);
  if (!amount || amount <= 0) {
    amount = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

   const url = `https://api.exchangerate-api.com/v4/latest/${from}`;
  


  try {
    const res = await fetch(url);
    const data = await res.json();


    const rate = data?.rates?.[to];

    if (rate) {
      const total = (amount * rate).toFixed(2);
      msg.innerText = `${amount} ${from} = ${total} ${to}`;
    } else {
      msg.innerText = `Rate not found for ${from} to ${to}`;
    }
  } catch (err) {
    msg.innerText = "Error fetching exchange rate.";
    console.error(err);
  }
}
