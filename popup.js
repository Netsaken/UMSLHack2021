document.addEventListener(
  "DOMContentLoaded",
  function () {
    let checkPageButton = document.getElementById("checkPage");
    checkPageButton.addEventListener(
      "click",
      async () => {
        let [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: main,
        });
      },
      false
    );
  },
  false
);

/*
Chrome Extensions only allowed the running of a single function on click. It does
not allow importing function or files. This requires that everything that needs 
to be done, be done in one main function. The primary callouts are at the top and 
all of the function definitions are below the callouts.
*/
async function main() {
  let searchText = "";
  let claims;

  //Gathers the text that was selected for fact check.
  searchText =selectText();

  //Only runs if text is in required length range
  if (searchText.length > 0 && searchText.length < 50) {
  
    //Runs the Google Fact Check API and returns the results
    claims = await searchQuery(searchText);

    //Takes the claims and generates all HTML to be displayed
    generateHTML(claims, searchText)
  } 
 
  /*
  Function detects what was selected from current tab and stores it. It does some basic processing
  and determines length. Gives alerts if length outside of acceptable range. Return final processed
  text.
  */
  function selectText() {
    
    //if Fact Check Modal Already exists, does not do anything.
    if (!document.getElementById("FactCheck_Modal")) {
      let text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
      }

      //Processes text, removes anything not a letter or number.
      text = text.replace(/[^a-zA-Z0-9 ]/g, "");
      //Removes white space from beginning and end of string.
      text = text.trim();
      
      //Filter response based on length of text selected.
      if (text.length < 1) {
        alert("Nothing selected. Please select again");
        return ""
      } else if (text.length > 50) {
        alert("Selection is too long. Max length of 50 characters. Please select again");
        return ""
      } else {
        
        //Loads CSS into tab.
        let styleCSS = createStyle();
        document.head.appendChild(styleCSS);

        return text;

      }
    }
  }

  //Function to call Google Fact Check API and dynamically display search results.
  async function searchQuery(inputString) {
    
    let lang = "languageCode=en-US";
    let age = "&maxAgeDays=1825";
    let query = "&query=" + inputString;
    let key = "&key=AIzaSyAkhSFIbJ568Dv6xcIMB2wAi2DoVA2Gd7k";

    let combinedEntry = lang + age + query + key;

    let res = await fetch(
      "https://factchecktools.googleapis.com/v1alpha1/claims:search?" +
        combinedEntry
    );

    let results = await res.json();
    let claims = results.claims;

    return claims;

  }

  //Main function generate all HTML for fact checking extenstion.
  function generateHTML(claims, inputString) {
    let resultsDivs;

    //Determines if there are any results from API call
    if (typeof claims == "object") {
      resultsDivs = generateClaimsHTML(claims);
    } else {
      resultsDivs = createFindFailure();
    }
    
    let modalDiv = document.createElement("div");
    modalDiv.id = "FactCheck_Modal";

    contentDiv = createModal(inputString);
    moreSitesDiv = moreWebsites(inputString);

    contentDiv.appendChild(resultsDivs);
    contentDiv.appendChild(moreSitesDiv);

    modalDiv.appendChild(contentDiv);

    document.body.appendChild(modalDiv);
  }

  //Generates HTML objects if nothing was returned from API
  function createFindFailure() {
    zeroDiv = document.createElement("p");
    zeroDiv.innerHTML =
      "<strong>NO RESULTS FOUND. PLEASE TRY ANOTHER SELECTION</strong>";
    zeroDiv.classList.add("FactCheck_Modal-more");

    resultsDivs = document.createElement("div");
    resultsDivs.id = "FactCheck_Modal-buffer";
    resultsDivs.appendChild(zeroDiv);

    return resultsDivs;
  }

  /*Large function to generate HTML objects for known fact check sites.
  Links generate a search on the sites of selected text. 
  */
  function moreWebsites(text) {
    queryText = text.replace(" ", "+");

    searchMoreDiv = document.createElement("p");
    searchMoreDiv.innerHTML = "Or try searching these websites yourself: ";
    searchMoreDiv.classList.add("FactCheck_Modal-more");

    // Politifact search element
    poltifactDiv = document.createElement("p");
    politifact_url = "https://www.politifact.com/search/?q=" + queryText;
    poltifactDiv.innerHTML =
      "<a href='" + politifact_url + "' target='_blank'>Politifact</a>";
    poltifactDiv.classList.add("FactCheck_Modal-list");
    poltifactDiv.classList.add("FactCheck_Modal-bold");

    //Snopes search element
    snopesDiv = document.createElement("p");
    snopes_URL = "https://www.snopes.com/?s=" + queryText;
    snopesDiv.innerHTML =
      "<a href='" + snopes_URL + "' target='_blank'>Snopes</a>";
    snopesDiv.classList.add("FactCheck_Modal-list");
    snopesDiv.classList.add("FactCheck_Modal-bold");

    //FactCheck.org search element
    factcheckDiv = document.createElement("p");
    factcheck_URL =
      "https://www.factcheck.org/search/#gsc.tab=0&gsc.q=" +
      text +
      "&gsc.sort=";
    factcheckDiv.innerHTML =
      "<a href='" + factcheck_URL + "' target='_blank'>FactCheck.org</a>";
    factcheckDiv.classList.add("FactCheck_Modal-list");
    factcheckDiv.classList.add("FactCheck_Modal-bold");

    //Washington Post Fact Checker search element
    WPDiv = document.createElement("p");
    WashPost_URL = "https://www.washingtonpost.com/search?query=" + text;
    WPDiv.innerHTML =
      "<a href='" + WashPost_URL + "'>Washington Post Fact Checker</a>";
    WPDiv.classList.add("FactCheck_Modal-list");
    WPDiv.classList.add("FactCheck_Modal-bold");

    moreDiv = document.createElement("p");
    moreDiv.innerHTML =
      "Even more sites at: <a class='FactCheck_Modal-bold' href='https://library.csi.cuny.edu/c.php?g=619342&p=4310783#s-lg-box-13619375'>College of Staten Island</a>";
    moreDiv.classList.add("FactCheck_Modal-list");

    placeHolderDiv = document.createElement("div");

    //Apends all objects into parent object.
    placeHolderDiv.appendChild(searchMoreDiv);
    placeHolderDiv.appendChild(poltifactDiv);
    placeHolderDiv.appendChild(snopesDiv);
    placeHolderDiv.appendChild(factcheckDiv);
    placeHolderDiv.appendChild(WPDiv);
    placeHolderDiv.appendChild(moreDiv);

    return placeHolderDiv;
  }
 
 
  /* 
  Function creates HTML parent object to hold all info displayed in modal*/
  function createModal(searchText) {
    
    //Creates parent HTML object to hold all HTML objects in Modal
    let contentDiv = document.createElement("div");
    contentDiv.id = "FactCheck_Modal-content";
    
    //Creates Text at top of Modal
    let defaulttext = document.createElement("p");
    defaulttext.id = "FactCheck_Modal-defaulttext";
    defaulttext.innerText = "Fact Checking Selection:";

    //Creates object to hold and display text that as being fact checked.
    let searchtext = document.createElement("p");
    searchtext.id = "FactCheck_Modal-searchtext";
    searchtext.innerHTML =
      "<strong>Original Text:  '</strong>" + searchText + "'";

    //Creates a close button for the modal. 
    let exitbtn = document.createElement("button");
    exitbtn.id = "FactCheck_Modal-exitbtn";
    exitbtn.innerText = "CLOSE";
    
    //Adds function to the on click action of HTML object. Calls deleteModal()
    exitbtn.addEventListener("click", deleteModal);

    //Appends all created objects into parent object.
    contentDiv.appendChild(exitbtn);
    contentDiv.appendChild(defaulttext);
    contentDiv.appendChild(searchtext);
    ;

    return contentDiv;
  };

  /* Function grabs the entire created modal HTML object and deletes it. */
  function deleteModal() {
    modal = document.getElementById("FactCheck_Modal");
    modal.remove();
  }

  /*  
  Input API search results and dynamically generates the HTML to display results.
  Function returns combined HTML object.
  */
  function generateClaimsHTML(results) {
    
    //Create parent HTML object to hold all of the created HTML objects
    let cardHolder = document.createElement("div");
    cardHolder.id = "FactCheck_Modal-cardHolder";
    
    //Loops through all results
    for (let i = 0; i < results.length; i++) {
      
      //Creates HTML of div to hold all info of this result.
      let card = document.createElement("div");
      //Assigns card the HTML class: FactCheck_Modal-card
      card.classList.add("FactCheck_Modal-card");
      
      //Pulls out all info from results to be displayed
      reviews = results[i].claimReview[0];
      let text = results[i].text;
      let reviewTitle = reviews.title;
      let rating = reviews.textualRating;
      let url = reviews.url;
      let claimDate = results[i].claimDate;

      //Creates HTML objects for info pulled out
      //The claim text.
      let divTitle = document.createElement("p");
      divTitle.innerHTML = "<strong>Title: </strong>" + text;

      //The date that the claim was made.
      let divClaimDate = document.createElement("p");
      divClaimDate.innerHTML = "<strong>Claim Date: </strong>" + claimDate;

      //Textual rating of claim.
      let divRating = document.createElement("p");
      divRating.innerHTML = "<strong>Rating: </strong>" + rating;
      if (rating == "False") {
        divRating.classList.add("FactCheck_Modal-False");
      } else if (rating == "True") {
        divRating.classList.add("FactCheck_Modal-True");
      }

      //The title of this claim review, if it can be determined.
      let divReviewTitle = document.createElement("p");
      divReviewTitle.innerHTML =
        "<strong>Review Title: </strong>" + reviewTitle;

      //The URL of this claim review.
      let divUrl = document.createElement("p");
      divUrl.innerHTML =
        "<strong>Review URL: </strong><a href='" +
        url +
        "' target='_blank'>" +
        url +
        "</a>";

      //Appends all HTML objects into card. Order Matters, top first.
      card.appendChild(divTitle);
      card.appendChild(divClaimDate);
      card.appendChild(divRating);
      card.appendChild(divReviewTitle);
      card.appendChild(divUrl);

      //Appends card opbject into the cardHolder object.
      cardHolder.appendChild(card);
    }
    return cardHolder;
  }

  /*  Function loads CSS into active tab. This CSS controls all of the formatting for
  the injected HTML. It has long, unique class and id names, to not interfere with
  tab native CSS.*/
  function createStyle() {
    const style = document.createElement("style");
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
      padding: 0px 30px 10px 30px;
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
    margin-top: 0px;
    margin-right: -100%;
    position: relative;
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

    return style;
  }

}


