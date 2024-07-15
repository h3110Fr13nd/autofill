async function startStreamingMeaning(text, pos) {
  const canCreate = await window.ai.canCreateTextSession();
  if (canCreate !== "no") {
      const session = await window.ai.createTextSession();
      const stream = session.promptStreaming(`Explain the meaning or Summarize the following text in very few words : ${text}`);
      // create a box to display the meaning at the end of the selected text
      var previousMeaningBox = document.getElementById('meaning-box');
      if (previousMeaningBox) {
        previousMeaningBox.remove();
      }
      const meaningBox = document.createElement('div');
      meaningBox.id = 'meaning-box';
      meaningBox.style.position = 'absolute';
      meaningBox.style.top = `${pos.top + window.scrollY + 10}px`;
      meaningBox.style.left = `${pos.right + window.scrollX + 10}px`;
      meaningBox.style.width = '500px';
      // meaningBox.style.height = '200px';
      meaningBox.style.backgroundColor = 'white';
      meaningBox.style.border = '1px solid black';
      meaningBox.style.zIndex = '1000';
      meaningBox.style.overflow = 'auto';
      meaningBox.style.padding = '10px';
      meaningBox.style.color = 'black';

      document.body.appendChild(meaningBox);
      
      for await (const chunk of stream) {
        meaningBox.innerHTML = chunk;
        console.log('Meaning:', chunk);
      }
  }
}

let timeoutId;

document.addEventListener('selectionchange', () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    console.log('Selected text:', selectedText);
    if (selection.rangeCount > 0) {
      var position = selection.getRangeAt(0).getBoundingClientRect();
      // You can now safely use 'position' for your needs
    } else {
        console.log('No selection or range available.');
    }
    if (selectedText) {
      startStreamingMeaning(selectedText, position);
    }
  }, 300);
});