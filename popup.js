document.getElementById('run-script').addEventListener('click', () => {
  const scriptName = prompt('Enter the script name to run:');
  chrome.runtime.sendMessage({ action: 'runScript', scriptName: scriptName }, response => {
    if (response.error) {
      alert('Error: ' + response.error);
    } else {
      alert('Result: ' + response.result);
    }
  });
});

