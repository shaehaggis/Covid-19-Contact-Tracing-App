//filter checkin history results - user
function refineSearchUser()
{

    var venueName = document.getElementById("vname").value;
    var date = document.getElementById("date").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;
    var streetNumber = document.getElementById("stNum").value;
    var streetName = document.getElementById("stName").value;
    var suburb = document.getElementById("suburb").value;
    var postcode = document.getElementById("postcode").value;

    var state = document.getElementById("states").value;
    if(state == "Please Select an Option:"){
      state = "";
    }

    var table = document.getElementsByTagName("tbody")[0];
    var queryString = "";



    if (venueName.length > 0 && date.length > 0 && startTime.length > 0 && endTime.length > 0 && streetNumber.length > 0 && streetName.length > 0 && suburb.length > 0 && postcode.length > 0 && state.length > 0)
    {
      queryString = `users/checkInsUser?vname=${venueName}&date=${date}&sTime=${startTime}&eTime=${endTime}&stNum=${streetNumber}&stName=${streetName}&suburb=${suburb}&postcode=${postcode}&state=${state}`;
    }

    else if (venueName.length > 0 && date.length <= 0 && startTime.length <= 0 && endTime.length <= 0 && streetNumber.length <= 0 && streetName.length <= 0 && suburb.length <= 0 && postcode.length <= 0 && state.length <= 0)
    {
      queryString = `users/checkInsUser?vname=${venueName}`;
    }

    else if (venueName.length > 0 && date.length > 0 && startTime.length <= 0 && endTime.length <= 0 && streetNumber.length <= 0 && streetName.length <= 0 && suburb.length <= 0 && postcode.length <= 0 && state.length <= 0)
    {
      queryString = `users/checkInsUser?vname=${venueName}&date=${date}`;
    }

    else if (venueName.length > 0 && date.length > 0 && startTime.length > 0 && endTime.length > 0 && streetNumber.length <= 0 && streetName.length <= 0 && suburb.length <= 0 && postcode.length <= 0 && state.length <= 0)
    {
      queryString = `users/checkInsUser?vname=${venueName}&date=${date}&sTime=${startTime}&eTime=${endTime}`;
    }
    else if (venueName.length <= 0 && date.length > 0 && startTime.length <= 0 && endTime.length <= 0 && streetNumber.length <= 0 && streetName.length <= 0 && suburb.length <= 0 && postcode.length <= 0 && state.length <= 0)
    {
      queryString = `users/checkInsUser?date=${date}`;
    }
    else if (venueName.length <= 0 && date.length <= 0 && startTime.length <= 0 && endTime.length <= 0 && streetNumber.length > 0 && streetName.length > 0 && suburb.length <= 0 && postcode.length <= 0 && state.length <= 0)
    {
      queryString = `users/checkInsUser?stNum=${streetNumber}&stName=${streetName}`;
    }
    else if (venueName.length <= 0 && date.length <= 0 && startTime.length <= 0 && endTime.length <= 0 && streetNumber.length <= 0 && streetName.length > 0 && suburb.length <= 0 && postcode.length <= 0 && state.length <= 0)
    {
      queryString = `users/checkInsUser?stName=${streetName}`;
    }
    else if (venueName.length <= 0 && date.length <= 0 && startTime.length <= 0 && endTime.length <= 0 && streetNumber.length <= 0 && streetName.length > 0 && suburb.length > 0 && postcode.length <= 0 && state.length <= 0)
    {
      queryString = `users/checkInsUser?stName=${streetName}&suburb=${suburb}`;
    }
    else if (venueName.length <= 0 && date.length <= 0 && startTime.length <= 0 && endTime.length <= 0 && streetNumber.length <= 0 && streetName.length > 0 && suburb.length <= 0 && postcode.length > 0 && state.length <= 0)
    {
      queryString = `users/checkInsUser?stName=${streetName}&postcode=${postcode}`;
    }

    else if (venueName.length <= 0 && date.length <= 0 && startTime.length <= 0 && endTime.length <= 0 && streetNumber.length <= 0 && streetName.length <= 0 && suburb.length <= 0 && postcode.length > 0 && state.length <= 0)
    {
      queryString = `users/checkInsUser?postcode=${postcode}`;
    }

    else if (venueName.length <= 0 && date.length <= 0 && startTime.length <= 0 && endTime.length <= 0 && streetNumber.length <= 0 && streetName.length <= 0 && suburb.length <= 0 && postcode.length <= 0 && state.length > 0)
    {
      queryString = `users/checkInsUser?state=${state}`;
    }
    else if (venueName.length <= 0 && date.length > 0 && startTime.length <= 0 && endTime.length <= 0 && streetNumber.length <= 0 && streetName.length <= 0 && suburb.length <= 0 && postcode.length <= 0 && state.length > 0)
    {
      queryString = `users/checkInsUser?date=${date}&state=${state}`;
    }
    else if (venueName.length <= 0 && date.length > 0 && startTime.length > 0 && endTime.length > 0 && streetNumber.length <= 0 && streetName.length <= 0 && suburb.length <= 0 && postcode.length > 0 && state.length <= 0)
    {
      queryString = `users/checkInsUser?date=${date}&sTime=${startTime}&eTime=${endTime}&postcode=${postcode}`;
    }
    else {

      if (document.getElementById("no-results") !== null){
        let nrRow = document.getElementById("no-results-row");
        nrRow.remove();
      }

      let tr = document.createElement("tr");
      tr.setAttribute("id", "no-results-row");
      let td = document.createElement("td");
      td.setAttribute("id", "no-results");
      let noResults = document.createTextNode("No results found. Please Change Toggles");
      td.appendChild(noResults);
      td.setAttribute("colspan", "5");
      tr.appendChild(td);
      table.appendChild(tr);
      return;
    }

    var xhttp = new XMLHttpRequest;

    xhttp.onreadystatechange = function()
          {
            if (this.readyState == 4 && this.status == 200)
            {

              console.log(document.getElementsByClassName("table-data").length);
              while (document.getElementsByClassName("table-data").length !== 0)
              {
                  let temp = document.getElementsByClassName("table-data")[0];
                  temp.remove();
              }

              if (document.getElementById("no-results") !== null)
              {
                let nrRow = document.getElementById("no-results-row");
                nrRow.remove();
              }

              var checkinHistoryUser = JSON.parse(this.responseText);
              if (checkinHistoryUser.length <= 0)
              {

                if (document.getElementById("no-results") !== null){
                  let nrRow = document.getElementById("no-results-row");
                  nrRow.remove();
                }

                let tr = document.createElement("tr");
                tr.setAttribute("id", "no-results-row");
                let td = document.createElement("td");
                td.setAttribute("id", "no-results");
                let noResults = document.createTextNode("No results found. Please change filters");
                td.appendChild(noResults);
                td.setAttribute("colspan", "5");
                tr.appendChild(td);
                table.appendChild(tr);
                return;
              }

              var numberofRows = checkinHistoryUser.length;
              var addresses = [];
              var convertedDates = [];

              for (let i = 0; i < numberofRows; i++)
              {
                addresses.push(checkinHistoryUser[i].street_number + " " + checkinHistoryUser[i].street_name + ", " + checkinHistoryUser[i].suburb + ", " + checkinHistoryUser[i].state + ", " + checkinHistoryUser[i].postcode);
                convertedDates.push(checkinHistoryUser[i].checkindate.toString());
                convertedDates[i] = convertedDates[i].slice(0, -14);
              }

              for (let i=0; i < checkinHistoryUser.length; i++)
              {
                let tr = document.createElement("tr");
                tr.setAttribute("class", "table-data");
                for (let j = 0; j < 5; j++)
                {
                  let td = document.createElement("td");
                  if (j === 0)
                  {
                    let data = document.createTextNode(checkinHistoryUser[i].venue_name);
                    td.appendChild(data);
                    tr.appendChild(td);
                  }

                  else if (j === 1)
                  {
                    let data = document.createTextNode(addresses[i]);
                    td.appendChild(data);
                    tr.appendChild(td);
                  }

                  else if (j === 2)
                  {
                    let data = document.createTextNode(checkinHistoryUser[i].contact_number);
                    td.appendChild(data);
                    tr.appendChild(td);
                  }

                  else if (j === 3)
                  {
                    let data = document.createTextNode(convertedDates[i]);
                    td.appendChild(data);
                    tr.appendChild(td);
                  }

                  else if (j === 4)
                  {
                    let data = document.createTextNode(checkinHistoryUser[i].checkintime);
                    td.appendChild(data);
                    tr.appendChild(td);
                  }
                }

                table.appendChild(tr);
              }
            }
          };

          xhttp.open("GET", queryString,  true);
          xhttp.send();
}

//filter checkin history results - venue

//filter hotspots

//hide toggles
function showHideToggles(){
  var addressToggles = document.getElementsByClassName("hidden")[0];
  var toggles = document.getElementsByClassName("not-hidden")[0];

  if (addressToggles.style.display == "none")
  {
      toggles.style.display = "none";
      addressToggles.style.display = "block";
      document.getElementById("toggle-button").innerText = "Search by Name";
  }
  else
  {
      toggles.style.display = "block";
      addressToggles.style.display = "none";
      document.getElementById("toggle-button").innerText = "Search by Address";
  }
}

function showHideTogglesAdmin(){
  var addressToggles = document.getElementsByClassName("hidden")[0];
  var toggles = document.getElementsByClassName("not-hidden")[0];

  if (addressToggles.style.display == "none")
  {
      toggles.style.display = "none";
      addressToggles.style.display = "block";
      document.getElementById("toggle-button-admin").innerText = "Search by Name";
  }
  else
  {
      toggles.style.display = "block";
      addressToggles.style.display = "none";
      document.getElementById("toggle-button-admin").innerText = "Search by Address";
  }
}


