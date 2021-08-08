const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
const $messaageFormInput = $messageForm.querySelector("input");
const $messaageFormButton = $messageForm.querySelector("button");
const $sendLocation = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options
const {username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true}) //ignoreQueryPrefix wil remove query params

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight = $messages.scrollHeight

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
      $messages.scrollTop = $messages.scrollHeight
  }
}


socket.on("message", (message) => {
  console.log("Message : ", message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("hh:mm a"),
    username: message.username
  }); // compiling html
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (data) => {
  const html = Mustache.render(locationMessageTemplate, {
    url: data.url,
    createdAt: moment(data.createdAt).format("hh:mm a"),
    username: data.username
  }); // compiling html
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on('roomData', ({room, users}) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html;
})

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messaageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    $messaageFormButton.removeAttribute("disabled");
    $messaageFormInput.value = "";
    $messaageFormInput.focus();

    if (error) {
      return console.log(error);
    }
    console.log("Message Received...!");
  });
});

$sendLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geo location is not supported by your browser");
  }

  $sendLocation.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      { lat: position.coords.latitude, long: position.coords.longitude },
      () => {
        $sendLocation.removeAttribute("disabled");
        console.log("Location Sharedd");
      });
  });
});


socket.emit('join', { username, room }, (error) => {
  if (error) {
      alert(error)
      location.href = '/'
  }
})


