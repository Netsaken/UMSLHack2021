function main() {
  async function searchQuery(inputString) {
    
    inputString = cleanText(inputString)
    inputString = inputString.trim(); 
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
      resultsDivs = createFindFailure();
    }

    
    let modalDiv = document.createElement("div");
    modalDiv.id = "FactCheck_Modal";

    contentDiv = createModal(inputString)
    moreSitesDiv = moreWebsites(inputString);

    contentDiv.appendChild(resultsDivs)
    contentDiv.appendChild(moreSitesDiv)

    modalDiv.appendChild(contentDiv)
    
    
    document.body.appendChild(modalDiv)
  }
  
  function createFindFailure() {
    zeroDiv = document.createElement("p")     
    zeroDiv.innerHTML = "<strong>NO RESULTS FOUND. PLEASE TRY ANOTHER STRING</strong>"
    zeroDiv.classList.add("FactCheck_Modal-more")

    resultsDivs= document.createElement("div")
    resultsDivs.id = "FactCheck_Modal-buffer"
    resultsDivs.appendChild(zeroDiv)

    return resultsDivs
  }

  function moreWebsites(text) {
    
    queryText = text.replace(" ", "+");
    
    searchMoreDiv = document.createElement("p")     
    searchMoreDiv.innerHTML = "Or try searching these websites yourself: "
    searchMoreDiv.classList.add("FactCheck_Modal-more")

    // Politifact search element
    poltifactDiv = document.createElement("p")
    politifact_url = 'https://www.politifact.com/search/?q='+ queryText
    poltifactDiv.innerHTML = "<a href='" + politifact_url +"' target='_blank'>Politifact</a>"
    poltifactDiv.classList.add("FactCheck_Modal-list")
    poltifactDiv.classList.add("FactCheck_Modal-bold")

    //Snopes search element
    snopesDiv = document.createElement("p")
    snopes_URL = "https://www.snopes.com/?s=" + queryText
    snopesDiv.innerHTML = "<a href='" + snopes_URL + "' target='_blank'>Snopes</a>"
    snopesDiv.classList.add("FactCheck_Modal-list")
    snopesDiv.classList.add("FactCheck_Modal-bold")

    //FactCheck.org search element
    factcheckDiv = document.createElement("p")
    factcheck_URL = "https://www.factcheck.org/search/#gsc.tab=0&gsc.q=" + text + "&gsc.sort="
    factcheckDiv.innerHTML = "<a href='" + factcheck_URL + "' target='_blank'>FactCheck.org</a>"
    factcheckDiv.classList.add("FactCheck_Modal-list")
    factcheckDiv.classList.add("FactCheck_Modal-bold")

    //Washington Post Fact Checker search element
    WPDiv = document.createElement("p")
    WashPost_URL = "https://www.washingtonpost.com/search?query=" + text
    WPDiv.innerHTML = "<a href='" + WashPost_URL + "'>Washington Post Fact Checker</a>"
    WPDiv.classList.add("FactCheck_Modal-list")
    WPDiv.classList.add("FactCheck_Modal-bold")

    moreDiv = document.createElement("p")
    moreDiv.innerHTML = "Even more sites at: <a class='FactCheck_Modal-bold' href='https://library.csi.cuny.edu/c.php?g=619342&p=4310783#s-lg-box-13619375'>College of Staten Island</a>"
    moreDiv.classList.add("FactCheck_Modal-list")
    
    placeHolderDiv = document.createElement("div")
    
    placeHolderDiv.appendChild(searchMoreDiv)
    placeHolderDiv.appendChild(poltifactDiv)
    placeHolderDiv.appendChild(snopesDiv)
    placeHolderDiv.appendChild(factcheckDiv)
    placeHolderDiv.appendChild(WPDiv)
    placeHolderDiv.appendChild(moreDiv)

    return placeHolderDiv
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
        
        #FactCheck_Modal strong {
          font-weight: bold;
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
        margin: 5px;
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
      
      #FactCheck_Modal a:hover {
        cursor: pointer;
      }

      .FactCheck_Modal-list {
        line-height: 20px;
        font-size: 20px;
        margin: 10px 50px 10px 50px;
        text-align: center;
      }

    
      .FactCheck_Modal-more {
        line-height: 18px;
        font-size: 18px;
        margin: 10px;
      }

      #FactCheck_Modal-buffer {
        margin: 30px;
      }

      .FactCheck_Modal-bold {
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


