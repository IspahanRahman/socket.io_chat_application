const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const formatMessage=require('./utils/messages')
const {joinUser,getCurrentUser,userLeave,getRoomUser}=require('./utils/users')
const port=process.env.PORT || 8080

const app=express()
const server=http.createServer(app)
const io=socketio(server)

app.use(express.static(path.join(__dirname,'public')))

const medium='Chat Application Bot'
//Run when client connects
io.on('connection',socket=>{
    socket.on('joinRoom',({username,room})=>{
        const user=joinUser(socket.id,username,room)

        socket.join(user.room)

        //Welcome current user to the chat
    socket.emit('message',formatMessage(medium,'Welcome to the chat application'))

    //Broadcast when user connects 
    socket.broadcast.to(user.room).emit('message',formatMessage(medium,`${user.username} has connected to the chat`))

    //Send users and room info
    io.to(user.room).emit('roomusers',{room:user.room,users:getRoomUser(user.room)})

    })

   //Doing the chat with message
    socket.on('chatMessage',msg=>{
        const user=getCurrentUser(socket.id)
       io.to(user.room).emit('message',formatMessage(user.username,msg))

       
    })

    //Runs when user is disconnected
    socket.on('disconnect',()=>{
        //Inform all when user is disconnected
        const user=userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage(medium,`${user.username} has left the chat`)) 
            
            //Send users and room info
            io.to(user.room).emit('roomusers',{room:user.room,users:getRoomUser(user.room)}) 
        }
        
    })
    
})
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)

})
