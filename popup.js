document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        document.body.style.backgroundColor = "red";
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: setPageBackgroundColor,
        });
      
        
    //     chrome.tabs.getSelected(null, function(tab) {
    //     d = document;
  
    //     var f = d.createElement('form');
    //     f.action = 'http://gtmetrix.com/analyze.html?bm';
    //     f.method = 'post';
    //     var i = d.createElement('input');
    //     i.type = 'hidden';
    //     i.name = 'url';
    //     i.value = tab.url;
    //     f.appendChild(i);
    //     d.body.appendChild(f);
    //     f.submit();
    //   });
    }, false);
  }, false);

function setPageBackgroundColor() {
        document.body.style.backgroundColor = "red";
        console.log("Test")
    }

  function logClicked() {
    console.log("Clicked")
  }