function main() {
  async function searchQuery(inputString) {
    
    inputString = cleanText(inputString)
    let inputString2 = "Trump real president"; 
    let lang = "languageCode=en-US";
    let age = "&maxAgeDays=365";
    let query = "&query=" + inputString2;
    let key = "&key=AIzaSyAkhSFIbJ568Dv6xcIMB2wAi2DoVA2Gd7k";

    let combinedEntry = lang + age + query + key;

    let res = await fetch('https://factchecktools.googleapis.com/v1alpha1/claims:search?' + combinedEntry);
    let results = await res.json()
    
    let claims = results.claims

    contentDiv = createModal(inputString)
    resultsDivs = generateAPIHTML(claims);

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
  
    let searchtext = document.createElement("p");
    searchtext.id = "FactCheck_Modal-searchtext";
    searchtext.innerHTML = "<strong>Original Text:  '</strong>" + searchText + "'"

    cleanedText = cleanText(searchText);
    let cleanedtext = document.createElement("p");
    cleanedtext.id = "FactCheck_Modal-cleanedText";
    cleanedtext.innerHTML = "<strong>Cleaned Text:  '</strong>" + cleanedText + "'"

    let exitbtn = document.createElement("button");
    exitbtn.id = "FactCheck_Modal-exitbtn";
    exitbtn.innerText = "X";
    exitbtn.addEventListener("click", deleteModal);

    contentDiv.appendChild(defaulttext)
    contentDiv.appendChild(searchtext)
    contentDiv.appendChild(cleanedtext)
    contentDiv.appendChild(exitbtn)
    
  
    return contentDiv
  }

  function generateAPIHTML(results) {  
    let cardHolder = document.createElement("div");
    cardHolder.id = "FactCheck_Modal-cardHolder"
    for (let i = 0; i < results.length; i++ ) {
      let card = document.createElement("div");
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
      
      let divReviewTitle = document.createElement("p")
      divReviewTitle.innerHTML = "<strong>Review Title: </strong>" + reviewTitle

      let divUrl = document.createElement("p")
      divUrl.innerHTML = "<strong>Review URL: </strong>" + url
      
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
          background-color: #fefefe;
          padding: 30px 30px 10px 30px;
          border: 5px solid #0086F1;
          width: 80%;
          text-align: center;
          min-height: 400px;
          margin: 100px auto; 
      }

      #FactCheck_Modal-exitbtn {
        line-height: 12px;
        width: 20px;
        font-size: 10pt;
        font-family: tahoma;
        margin-top: 105px;
        margin-right: 11%;
        position: absolute;
        top:0;
        right:0;
        color: red;
        background-color: white;
        border-radius: 100%;
        border: 1px solid red;
        text-align: center;
      }

      #FactCheck_Modal-defaulttext {
        line-height: 18px;
        font-size: 18px;
        font-weight: bold;
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
        text = "Nothing selected. Please select again"
        
        console.log("Nothing selected. Please select again")
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


