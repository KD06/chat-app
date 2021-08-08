const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form');
const $messaageFormInput = $messageForm .querySelector('input');
const $messaageFormButton = $messageForm.querySelector('button');
const $sendLocation = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;

socket.on('message', (message) => {
    console.log("Message : ", message);
    const html = Mustache.render(messageTemplate, {message}); // compiling html
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (url) => {
    console.log("Location : ", url);
    const html = Mustache.render(locationMessageTemplate, {url}); // compiling html
    $messages.insertAdjacentHTML('beforeend', html);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messaageFormButton.setAttribute("disabled", "disabled");

    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, error => {
        $messaageFormButton.removeAttribute("disabled");
        $messaageFormInput.value = "";
        $messaageFormInput.focus();

        if(error){
            return console.log(error);
        }    
        console.log("Message Received...!")
    });
});

$sendLocation.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geo location is not supported by your browser')
    }
    
    $sendLocation.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', 
        {"lat": position.coords.latitude, "long": position.coords.longitude},
        ()=>{
            $sendLocation.removeAttribute('disabled');
            console.log("Location Sharedd");
        });
    })
})

socket.on('sendLocation', (location)=> console.log(location));