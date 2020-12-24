const chat = document.getElementById('chat-form');
const chatmessage = document.querySelector('.chat-messages');

const socket = io();

socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // scroll down
  chatmessage.scrollTop = chatmessage.scrollHeight;
});

chat.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;

  socket.emit('chatmsg', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus;
});

function outputMessage (message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} </p>
    <p class="text">
        ${message.text}
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}
