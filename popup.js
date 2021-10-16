function main() {
  async function searchQuery(inputString) {
    
    inputString = cleanText(inputString)
    let inputString2 = "Trump real president"; 
    let lang = "languageCode=en-US";
    let age = "&maxAgeDays=365";
    let query = "&query=" + inputString;
    let key = "&key=AIzaSyAkhSFIbJ568Dv6xcIMB2wAi2DoVA2Gd7k";

    let combinedEntry = lang + age + query + key;

    let res = await fetch('https://factchecktools.googleapis.com/v1alpha1/claims:search?' + combinedEntry);
    let results = await res.json()
    
    let claims = results.claims

    console.log(typeof(claims), claims);

    let resultsDivs;

    if (typeof(claims)=="object"){
      console.log(claims.length)
      resultsDivs = generateAPIHTML(claims);
    } else {
      resultsDivs = document.createElement("p")
      resultsDivs.innerHTML = "<strong>NO RESULTS FOUND. PLEASE TRY ANOTHER STRING</strong>"
    }

    contentDiv = createModal(inputString)
    

    let modalDiv = document.createElement("div");
    modalDiv.id = "FactCheck_Modal";

    contentDiv.appendChild(resultsDivs)
    modalDiv.appendChild(contentDiv)
    document.body.appendChild(modalDiv)
  }
  
  const createModal = (searchText)  => {
    
    let contentDiv = document.createElement("div");
    contentDiv.id = "FactCheck_Modal-content";
    let defaulttext = document.createElement("p");
    defaulttext.id = "FactCheck_Modal-defaulttext";
    defaulttext.innerText = "Fact Checking Selection:"
  
    cleanedText = cleanText(searchText);
    let searchtext = document.createElement("p");
    searchtext.id = "FactCheck_Modal-searchtext";
    searchtext.innerHTML = "<strong>Original Text:  '</strong>" + cleanedText + "'"

    let exitbtn = document.createElement("button");
    exitbtn.id = "FactCheck_Modal-exitbtn";
    exitbtn.innerText = "CLOSE";
    exitbtn.addEventListener("click", deleteModal);

    contentDiv.appendChild(defaulttext)
    contentDiv.appendChild(searchtext)
    contentDiv.appendChild(exitbtn)
    
  
    return contentDiv
  }

  function generateAPIHTML(results) {  
    let cardHolder = document.createElement("div");
    cardHolder.id = "FactCheck_Modal-cardHolder"
    for (let i = 0; i < results.length; i++ ) {
      let card = document.createElement("div");
      card.classList.add("FactCheck_Modal-card");
      reviews = results[i].claimReview[0]
      let text = results[i].text;
      let reviewTitle = reviews.title;
      let rating = reviews.textualRating;
      let url = reviews.url;
      let claimDate = results[i].claimDate

      let divTitle = document.createElement("p")
      divTitle.innerHTML = "<strong>Title: </strong>" + text
      
      let divClaimDate = document.createElement("p")
      divClaimDate.innerHTML = "<strong>Claim Date: </strong>" + claimDate

      let divRating = document.createElement("p")
      divRating.innerHTML = "<strong>Rating: </strong>" + rating
      if (rating == "False") {
        divRating.classList.add("FactCheck_Modal-False")
      } else if (rating == "True") {
        divRating.classList.add("FactCheck_Modal-True")
      }
      
      let divReviewTitle = document.createElement("p")
      divReviewTitle.innerHTML = "<strong>Review Title: </strong>" + reviewTitle

      let divUrl = document.createElement("p")
      divUrl.innerHTML = "<strong>Review URL: </strong><a href='" + url + "' target='_blank'>" + url + "</a>"
      
      card.appendChild(divTitle)
      card.appendChild(divClaimDate)
      card.appendChild(divRating)
      card.appendChild(divReviewTitle)
      card.appendChild(divUrl)

      cardHolder.appendChild(card);

    }
    return cardHolder;
  }

  function createStyle() {
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
          color: black;
          background-color: #fefefe;
          padding: 30px 30px 10px 30px;
          border: 5px solid #0086F1;
          width: 80%;
          text-align: center;
          min-height: 400px;
          margin: 100px auto; 
      }

      #FactCheck_Modal-exitbtn {
        line-height: 10px;
        width: 55px;
        font-size: 10pt;
        font-family: tahoma;
        margin-top: 110px;
        margin-right: 9%;
        position: absolute;
        top:0;
        right:0;
        color: red;
        background-color: white;
        border-radius: 25%;
        border: 2px solid red;
        text-align: center;
      }

      #FactCheck_Modal-exitbtn:hover {
        cursor: pointer;
      }
      
      #FactCheck_Modal-exitbtn:active {
        background: red;
      }

      #FactCheck_Modal-defaulttext {
        color: black;
        line-height: 22px;
        font-size: 22px;
        font-weight: bold;
      }

      #FactCheck_Modal-searchtext {
        color: black;
        line-height: 20px;
        font-size: 20px;
        font-weight: bold;
      }
      .FactCheck_Modal-card {
        border: 2px solid black;
        color: black;
        margin: 5px;
        line-height: 16px;
        font-size: 16px;
        padding: 5px;
      }

      .FactCheck_Modal-False {
        color:red;
      }
      
      .FactCheck_Modal-True {
        color:green;
      }
      
      a:hover {
        cursor: pointer;
      }

      `;  

      return style
  }

  function deleteModal() {
    modal = document.getElementById("FactCheck_Modal");
    modal.remove();
  }

  function cleanText(text) {
    cleanedText = text.replace(/[^a-zA-Z0-9 ]/g, "")

    return cleanedText
  }

  function selectText() {
    if (!document.getElementById("FactCheck_Modal")) {
      let text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
      }
  
  
      if (text.length < 5) {       
        alert("Nothing selected. Please select again")
      } else {
                
        let styleCSS = createStyle(); 
        document.head.appendChild(styleCSS);
        
        searchQuery(text)
      } 
    } 
  }

  

  selectText();
}


  










document.addEventListener('DOMContentLoaded', function() {

  
  let checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: main,
        });
      

    }, false);
  }, false);


