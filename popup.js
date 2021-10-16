function main() {
  const createModal = (searchText) => {
    let modalDiv = document.createElement("div");
    modalDiv.id = "FactCheck_Modal";

    let contentDiv = document.createElement("div");
    contentDiv.id = "FactCheck_Modal-content";
    let defaulttext = document.createElement("p");
    defaulttext.id = "FactCheck_Modal-defaulttext";
    defaulttext.innerText = "Fact Checking Selection:"

    let searchtext = document.createElement("p");
    searchtext.id = "FactCheck_Modal-searchtext";
    defaulttext.innerText = searchText

    contentDiv.appendChild(defaulttext)
    contentDiv.appendChild(searchtext)
    modalDiv.appendChild(contentDiv)

    return modalDiv
  }

  function selectText() {
    let text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    if (text.length < 5) {
      console.log("Nothing selected. Please select again")
    } else {
      console.log(text);

      const style = document.createElement('style');
      style.innerHTML = `
        #FactCheck_Modal {
          display: block; 
          position: fixed; 
          z-index: 1000; 
          left: 0;
          top: 0;
          width: 100%; 
          height: 100%; 
          overflow: auto; 
          background-color: rgb(0,0,0);
          background-color: rgba(0,0,0,0.8);
        }
  
        #FactCheck_Modal-content {
          display:block;
          background-color: #fefefe;
          padding: 30px 30px 10px 30px;
          border: 5px solid #0086F1;
          width: 80%;
          text-align: center;
          min-height: 400px;
          margin: 100px auto; 
      }
      `;

      document.head.appendChild(style);
      let modalDiv = createModal(text);
      document.body.appendChild(modalDiv)
    }
  }

  function searchQuery(inputString) {
    let lang = "languageCode=en-US";
    let age = "&maxAgeDays=365";
    let query = "&query=" + inputString;
    let key = "&key=AIzaSyAkhSFIbJ568Dv6xcIMB2wAi2DoVA2Gd7k";

    let combinedEntry = lang + age + query + key;
    
    fetch('https://factchecktools.googleapis.com/v1alpha1/claims:search?' + combinedEntry)
      .then(response => {
        return response.json();
      })
      .then(users => {
        console.log(users);
      });
  }

  let exampleString = "bigfoot";

  searchQuery(exampleString);

  selectText();
}

document.addEventListener('DOMContentLoaded', function () {


  let checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: main,
    });


  }, false);
}, false);


