function addMessageFromUser(message) {
    const chatMessages = document.getElementById('chatMessages');
    const userMessageElement = document.createElement('p');
    userMessageElement.textContent = 'You: ' + message;
    chatMessages.appendChild(userMessageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessageFromModel(message) {
    const chatMessages = document.getElementById('chatMessages');
    const modelMessageElement = document.createElement('p');
    modelMessageElement.textContent = 'ChatGPT: ' + message;
    chatMessages.appendChild(modelMessageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleUserInput() {
    const inputMessage = document.getElementById('inputMessage');
    const userMessage = inputMessage.value.trim();

    if (userMessage !== '') {
        addMessageFromUser(userMessage);

        const apiKey = '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';
        const endpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';

        const data = {
            prompt: userMessage,
            max_tokens: 100,
        };
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(endpoint, requestOptions);
            const responseData = await response.json();
            console.log('Response Data:', responseData); // Log the response data to inspect it

            if (responseData.choices && responseData.choices.length > 0) {
                const modelResponse = responseData.choices[0].text.trim();
                addMessageFromModel(modelResponse);
            } else {
                console.error('Error: No response data or empty choices array from the GPT API.');
            }
        } catch (error) {
            console.error('Error:', error);
        }


        inputMessage.value = '';
    }
}

const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', handleUserInput);

const inputMessage = document.getElementById('inputMessage');
inputMessage.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleUserInput();
    }
});
