chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "runScript") {
    console.log('Received runScript action with scriptName:', request.scriptName); // Debug log
    fetch('http://localhost:5001/run-script', {  // Change port to 5001
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ script_name: request.scriptName })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Response from server:', data); // Debug log
      sendResponse(data);
    })
    .catch(error => {
      console.error('Error fetching script:', error); // Debug log
      sendResponse({ error: error.toString() });
    });
    return true;  // Will respond asynchronously.
  } else {
    console.log('Received unknown action:', request.action); // Debug log
  }
});
