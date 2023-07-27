function addMessageFromUser(message) {
    const chatMessages = document.getElementById('chatMessages');
    const userMessageElement = document.createElement('me');
    userMessageElement.textContent = 'You: ' + message;
    chatMessages.appendChild(userMessageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatMessages.innerHTML +=`<br><br>` // spacing
    localStorage.setItem("last", `${chatMessages.innerHTML}`); // saving last sessions
}

function addMessageFromModel(message) {
    const chatMessages = document.getElementById('chatMessages');
    const modelMessageElement = document.createElement('bot');
    modelMessageElement.textContent = 'ChatGPT: ' + message;
    chatMessages.appendChild(modelMessageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatMessages.innerHTML +=`<br><br>` //spacing
    localStorage.setItem("last", `${chatMessages.innerHTML}`); // saving last sessions
}

async function handleUserInput() {
    let inputMessage = document.getElementById('inputMessage');
    let userMessage = inputMessage.value.trim();
    if(userMessage.length!=0){ // new condition
        userMessage=JSON.stringify(userMessage); //stringify
        addMessageFromUser(userMessage);
        // const apiKey = `${process.env.OPEN_AI_API_1}` ; // env
        const apiKey = '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' ; //new api key
        const endpoint = 'https://api.openai.com/v1/engines/text-davinci-003/completions'; //new model
        const data = {
            prompt: userMessage,
            max_tokens: 100,
            temperature: 1, // response quality
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

//on click chat
const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', handleUserInput);

// on enter caht
const inputMessage = document.getElementById('inputMessage');
inputMessage.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleUserInput();
    }
});


//for loading last sessions
window.onload = () =>{
    const chatMessages = document.getElementById('chatMessages');
    let last = localStorage.getItem("last");
    if(last!=null) {
        chatMessages.innerHTML=last;
    }
}

//for clearing last sessions
const clear = document.getElementById('clear');
clear.onclick = () => {
    localStorage.setItem("last", ``);
    chatMessages.innerHTML="";
};