const chatform=document.getElementById('chat-form')
const chatMessages=document.querySelector('.chat-messages')
const roomName=document.getElementById('room-name')
const userList=document.getElementById('users')


//Get username and room from url
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})


const socket=io()

//Join to the chat room
socket.emit('joinRoom',{username,room})

//Get users and room 
socket.on('roomusers',({room,users})=>{
    outputRoomName(room)
    outputUsers(users)
})

//Message From Server
socket.on('message',message=>{
    console.log(message)
    outputMessage(message)

    //scrool down
    chatMessages.scrollTop=chatMessages.scrollHeight
})

//Message submit
chatform.addEventListener('submit',e=>{
    e.preventDefault()
    
    //Get message text
    const msg=e.target.elements.msg.value

    //Emit message to server
    socket.emit('chatMessage',msg)

    //Clear input
    e.target.elements.msg.value=''
    e.target.elements.msg.focus()
})

//Emit message to server
const outputMessage=(message)=>{
    const div=document.createElement('div')
    div.classList.add('message')
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`

    document.querySelector('.chat-messages').appendChild(div)
}

//Add room name of the chat
const outputRoomName=(room)=>{
    roomName.innerText=room
}

//Add users to the chat List
const outputUsers=(users)=>{
    userList.innerHTML=`${users.map(user=>`<li>${user.username}</li>`).join('')}`
}