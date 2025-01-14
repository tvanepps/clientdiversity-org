// var cdJson;

// hard-coded distribution until CORS issue is resolved 
var cdJson = { "Grandine": 26, "Lighthouse": 664, "Lodestar": 4, "Nimbus": 185, "Others": 1, "Prysm": 2349, "Teku": 321 }


async function getClientDistributionData() {
  // https://migalabs.es/api-documentation
  // example response:
  // {
  //     "Grandine": 26,
  //     "Lighthouse": 664,
  //     "Lodestar": 4,
  //     "Nimbus": 185,
  //     "Others": 1,
  //     "Prysm": 2349,
  //     "Teku": 321
  // }

  // commented out until CORS issue is resolved
  // const [cdResponse] = await Promise.all([
    // fetch("https://migalabs.es/api/v1/client-distribution?crawler=london")
  // ]);
  // const cdJson = await cdResponse.json();
  // console.log(cdJson);
  // return cdJson
  return
}

async function updateClientDistibutionChart() {
  var distribution = [];
  let sampleSize = 0;
  let chart = "";
  let dangerClient = "";
  let topClient = "";
  // create array of objects
  for (var key in cdJson) {
    distribution.push({ "name": key, "value": cdJson[key] });
  }
  // sort by value
  distribution.sort(function (a, b) {
    return b.value - a.value;
  });
  // get the total sample size to derive the marketshare
  distribution.forEach(function (item) {
    sampleSize += item["value"];
  });
  // get the most popular client
  topClient = distribution[0]["name"];
  // hide 66% majority comment if no 2/3 majority
  has66majorityCheck(distribution[0]["value"]/sampleSize);
  // create the chart
  distribution.forEach(function (item) {
    let client = item["name"][0].toUpperCase() + item["name"].substring(1);
    let marketshare = Math.round( item["value"] / sampleSize * 10000 )/100;
    let fontWeight = "fw-normal";
    let color = "success";
    if (marketshare > 50) {
      fontWeight = "fw-bold";
      color = "danger";
      dangerClient = client;
    } else if (marketshare > 33) {
      color = "warning";
    }
    let bar =  `
      <div class="my-2">
        <label class="form-label my-0 py-0 ${fontWeight}">${client} - ${marketshare}%</label>
        <div class="progress position-relative" style="height: 1.3rem;">
          <div class="progress-bar position-absolute bg-${color}" role="progressbar" style="width: ${marketshare}%; height: 1.25rem;" aria-valuenow="${marketshare}" aria-valuemin="0" aria-valuemax="100"></div>
          <div class="progress-bar bg-trans clientshare-success" role="progressbar" style="width: 33%; height: 1.25rem"></div>
          <div class="progress-bar bg-trans clientshare-warning" role="progressbar" style="width: 17%; height: 1.25rem"></div>
          <div class="progress-bar bg-trans clientshare-danger" role="progressbar" style="width: 50%; height: 1.25rem"></div>
        </div>
      </div>`;
    chart += bar;
  });
  document.getElementById("distributionBars").innerHTML = chart;
  // update/show the marketshare warning message if needed
  if (dangerClient.length > 0) {
    document.getElementById("dangerClients").innerHTML = dangerClient;
    let warningMessage = document.getElementById("marketshatWarning");
    warningMessage.classList.remove("d-none");
  }

  return topClient;
}

// hide 66% majority comment if no 2/3 majority
function has66majorityCheck(percent) {
  if (percent >= 0.66) {
    let comment = document.getElementById("has66majority");
    comment.classList.remove("d-none");
  }
}



