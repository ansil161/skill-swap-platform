const socket = new WebSocket(
  "ws://127.0.0.1:8000/ws/chat/15/"
)

socket.onmessage = function(event){
   const data = JSON.parse(event.data)
   console.log(data.message)
}

function sendMessage(msg){
   socket.send(JSON.stringify({
   message: msg,
   sender: userId
}))
}