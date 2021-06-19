const users=[]

//Join user to the chat
const joinUser=(id,username,room)=>{
    const user={id,username,room}

    users.push(user)
    return user
}
//Get current user

const getCurrentUser=(id)=>{
    return users.find(user=>user.id===id)
}

//User leaves the messaging 
const userLeave=(id)=>{
    const index=users.findIndex(user=>user.id===id)
    if(index !==-1){
        return users.splice(index,1)[0]
    }
}

//Get users of room
const getRoomUser=(room)=>{
    return users.filter(user=>user.room===room)
}
module.exports={joinUser,getCurrentUser,userLeave,getRoomUser}