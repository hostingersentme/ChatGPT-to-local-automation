console.log("Content script loaded and running.");

// Function to detect command from ChatGPT interface
function detectCommand() {
  try {
    const assistantMessages = document.querySelectorAll('div[data-message-author-role="assistant"]');
    console.log('Assistant messages found:', assistantMessages.length); // Debug log

    if (assistantMessages.length === 0) {
      console.log('No assistant messages found.');
      return null;
    }

    const lastMessageElement = assistantMessages[assistantMessages.length - 1];
    const lastMessage = lastMessageElement.innerText || lastMessageElement.textContent;

    console.log('Last message:', lastMessage); // Debug log

    if (!lastMessage) {
      console.log('No innerText or textContent found in the last message.');
      return null;
    }

    // Check if the last message contains a specific command with !run
    if (lastMessage.startsWith('!run')) {
      const command = lastMessage.split(' ')[1];
      console.log('Detected command with !run:', command); // Debug log
      return command;
    }

    // Check if the last message contains a plugin command marked with *#*#*
    const pluginCommandMatch = lastMessage.match(/\*#\*#\*(.*?)\*#\*#\*/);
    if (pluginCommandMatch) {
      const command = pluginCommandMatch[1].trim();
      console.log('Detected plugin command with stars:', command); // Debug log
      return command;
    }

    // Check if the last message contains a plugin command marked with ##
    const hashCommandMatch = lastMessage.match(/##(.*?)##/);
    if (hashCommandMatch) {
      const command = hashCommandMatch[1].trim();
      console.log('Detected plugin command with hashes:', command); // Debug log
      return command;
    }

  } catch (error) {
    console.error('Error detecting command:', error);
  }
  return null;
}

setInterval(() => {
  const command = detectCommand();
  if (command) {
    console.log('Sending command to background script:', command); // Debug log
    chrome.runtime.sendMessage({ action: 'runScript', scriptName: command }, response => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message to background script:', chrome.runtime.lastError);
      } else {
        if (response.error) {
          console.error('Error in response:', response.error);
        } else {
          console.log('Script result:', response.result);
        }
      }
    });
  } else {
    console.log('No command detected to send to background script.');
  }
}, 5000); // Check every 5 seconds (adjust as needed)
