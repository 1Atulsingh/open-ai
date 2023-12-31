const bot = "./assets/bot.svg";
const user = "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

//now for loader function 
let loaderInterval;

function loader(element) {
  element.textContent = "";

  loaderInterval= setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueID() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
      `
      <div class="wrapper ${isAi && 'ai' }">
          <div class="chat">
              <div class="profile">
                  <img 
                  src="${isAi ? bot : user}"
                  alt="${isAi ? 'bot' : 'user'}"
                  />
              </div>
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
      `
    )
  }

const handleSubmit= async (e) => {
    e.preventDefault();

    const data =new FormData(form);
    //user chatStrip
    chatContainer.innerHTML += chatStripe(false,data.get("prompt"));

    form.reset();

    //bot chatstrip
    const uniqueId=generateUniqueID();

    chatContainer.innerHTML +=chatStripe(true," ",uniqueId);

    chatContainer.scrollTop=chatContainer.scrollHeight;

    const messageDiv=document.getElementById(uniqueId);
    loader(messageDiv);

    //fetch data from server i.e ai response
   const response= await fetch("http://localhost:3000/",{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            prompt:data.get("prompt")
        })
   })

   clearInterval(loaderInterval);
   messageDiv.innerHTML=" "

   if(response.ok){
    const data=await response.json();
    const pasrsedDate=data.bot.trim();
    console,log(pasrsedDate);
    typeText(messageDiv,pasrsedDate);
   }else{
    const err=await response.text();
    messageDiv.innerHTML="something went wrong";
    alert(err);
   }
}

form.addEventListener("submit",handleSubmit);
form.addEventListener("keyup",(e) => {
    if(e.keyCode===13){
        handleSubmit(e);
    }
});