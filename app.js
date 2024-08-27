const express = require('express')
const app = express();
const http = require('http'); // socket http ke server pe chlta hai
const path = require('path');
const socketio = require('socket.io');

// server bna rhe hai
const server = http.createServer(app); 
const io= socketio(server);   /// socketio function hai

app.use(express.static(path.join(__dirname, "public"))); /// static file like css, images use kr paaye uske liye ye kiye hai
// ejs setup kr rhe hai
app.set("view engine", "ejs");

io.on("connection", function(socket){

    
    socket.on('send-location', function(data){  // backend accept kiya
        // ab backend se frontend ko send krenge
         io.emit('receive-location', {id: socket.id, ...data});  // jo jo data me aaya tha sbko send kr denge longitude, latiude
    })
    // console.log("connected");
    // backend me Disconnect krenge
    socket.on('disconnect', ()=>{
        console.log("User disconnected: " + socket.id);
          // Broadcast the user disconnection event
        io.emit('user-disconnected', socket.id);
    })
})


app.get('/', (req, res)=> {
     res.render("index")
})


server.listen(3000, ()=> {
    console.log("Server run on 3000");
})