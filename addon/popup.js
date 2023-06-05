// import { getBrowser } from './utils';
// `import` nor `require` didn't seem to work in Firefox nor Chrome. Will have to do repetitive code.
function getBrowser() {
    if (typeof browser !== 'undefined') {
        return browser; // Firefox
    } else if (typeof chrome !== 'undefined') {
        return chrome; // Chrome or Edge
    } else {
        throw new Error('Unable to find browser API');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copy');
    const outputDiv = document.getElementById('output');

    let allCheckbox = document.getElementById('all');
    let levelCheckboxes = document.querySelectorAll('.level');

    allCheckbox.addEventListener('change', () => {
        for (let checkbox of levelCheckboxes) {
            checkbox.checked = allCheckbox.checked;
        }
        updateDisplay();
    });

    for (let checkbox of levelCheckboxes) {
        checkbox.addEventListener('change', () => {
            if (!checkbox.checked) {
                allCheckbox.checked = false;
            } else {
                let allChecked = Array.from(levelCheckboxes).every(checkbox => checkbox.checked);
                allCheckbox.checked = allChecked;
            }
            updateDisplay();
        });
    }

    function updateDisplay() {
        let checkedBoxes = Array.from(document.querySelectorAll('input[type=checkbox]:checked'));
        let checkedLevels = checkedBoxes.map(checkbox => checkbox.value);

        getBrowser().tabs.query({ active: true, currentWindow: true }, tabs => {
            // Chrome doesn't support promises
            //getBrowser().tabs.sendMessage(tabs[0].id, checkedLevels).then(response => {
            getBrowser().tabs.sendMessage(tabs[0].id, checkedLevels, (response) => {
                let outputText = '';
                for (let heading of response) {
                    outputText += '<p><strong>' + heading.level + ':</strong> ' + heading.text + '</p>';
                }
                outputDiv.innerHTML = outputText;
            });
        });
    }

    copyButton.addEventListener('click', () => {
        let lines = outputDiv.innerText.split('\n');
        lines = lines.map(line => line.replace(/H\d+: /, ''));
        let textToCopy = lines.join('\n');
        /*let tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');   // .execCommand() is deprecated
        document.body.removeChild(tempTextArea);*/
        navigator.clipboard.writeText(textToCopy);

        // Change the button color to green
        copyButton.style.backgroundColor = 'green';

        // Change the button color back to its original color after 0.5 seconds
        setTimeout(() => {
            copyButton.style.backgroundColor = '';
        }, 500);
    });

    // Run the update function initially when the popup is opened
    updateDisplay();
});
