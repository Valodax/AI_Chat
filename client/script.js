import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
    element.textContent = "";
    loadInterval = setInterval(() => {
        element.textContent += ".";

        if (element.textContent.length === 4) {
            element.textContent = "";
        }
    }, 300);
}

function typeText(element, text) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 5);
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return `
      <div class="wrapper ${isAi && "ai"}">
          <div class="chat">
              <div class="profile">
                  <img 
                    src=${isAi ? bot : user} 
                    alt="${isAi ? "bot" : "user"}" 
                  />
              </div>
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
  `;
}

async function handleSubmit(e) {
    e.preventDefault();
    console.log("handleSubmit");
    const data = new FormData(form);
    chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

    form.reset();

    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);

    // fetch data from server -> bot's respose
    const response = await fetch("https://ai-chat-aqo9.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: data.get("prompt") }),
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = "";

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();

        console.log({ parsedData });
        typeText(messageDiv, parsedData);
    } else {
        const err = await response.text();

        messageDiv.innerHTML = "Something went wrong!";
        alert(err);
    }

    return false;
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
        handleSubmit(e);
    }
});
