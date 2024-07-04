const express = require("express")
const {createServer} = require("http")
const {Server} = require("socket.io")



const app = express()
app.use(express.static("www"))

const httpServer = createServer(app)


const server = new Server(httpServer)


httpServer.listen(8081)

class Player{

    nickname;
    socket_id;
    constructor(nickname,socket_id){
        this.nickname = nickname;
        this.socket_id = socket_id;
    }
}

class Match{

    player1;
    player2;
    mossaPlayer1;
    mossaPlayer2;
    winplayer1;
    winplayer2;
    constructor(player1,player2){
        this.player1 = player1;
        this.player2 = player2;
        this.winplayer1 = 0;
        this.winplayer2 = 0;
    }
}


numero_giocatori_connessi = 0;
giocatori_connessi = []
match = null;
id_player = 0;
server.on("connection", (socket)=>{
 
    


      socket.on("login",(message)=>{
        player = new Player(message.username,socket.id)
        numero_giocatori_connessi ++;
        giocatori_connessi.push(player)

        if((numero_giocatori_connessi % 2) == 0){
 
            this.match = new Match(giocatori_connessi[numero_giocatori_connessi-2],giocatori_connessi[numero_giocatori_connessi-1])

            match_players = [giocatori_connessi[numero_giocatori_connessi-2],giocatori_connessi[numero_giocatori_connessi-1]]
            server.to(giocatori_connessi[numero_giocatori_connessi-2].socket_id).to(giocatori_connessi[numero_giocatori_connessi-1].socket_id).emit("beginMatch",match_players)
            console.log("Partita iniziata ", this.match.player1.nickname,this.match.player2.nickname)

        }
      })

      socket.on("RandomLogin",(message)=>{
        player = new Player(message.username,socket.id)
        robot = new Player("ROBOT","0000");
        this.match = new Match(player,robot)
        console.log("Partita iniziata ", this.match.player1.nickname,this.match.player2.nickname)
      })


      socket.on("randomAction",(message)=>{
        this.match.mossaPlayer1 = message.move


        random = Math.floor(Math.random() * 3)
        mossa_robot = null;
        console.log(random)
        if(random == 0){
            console.log("aa")
            mossa_robot = "CARTA"
        }else if(random == 1){
            console.log("aa")
            mossa_robot ="FORBICE"
        }else if(random == 2){
            console.log("aa")
            mossa_robot = "SASSO"
        }

        console.log(mossa_robot);
        server.to(this.match.player1.socket_id).emit("againstMove",{move: mossa_robot})

        if((this.match.mossaPlayer1!=null)&&(this.match.mossaPlayer2!=null)){
            if((this.match.mossaPlayer1 == "SASSO") && (this.match.mossaPlayer2=="CARTA")){
                this.match.winplayer2++;
                this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else  if((this.match.mossaPlayer1 == "SASSO") && (this.match.mossaPlayer2=="FORBICE")){
                this.match.winplayer1++;
            this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else if((this.match.mossaPlayer1 == "CARTA") && (this.match.mossaPlayer2=="FORBICE")){
                this.match.winplayer2++;
                this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else  if((this.match.mossaPlayer1 == "CARTA") && (this.match.mossaPlayer2=="SASSO")){
                this.match.winplayer1++;
            this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else if((this.match.mossaPlayer1 == "FORBICE") && (this.match.mossaPlayer2=="CARTA")){
                this.match.winplayer1++;
                this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else if((this.match.mossaPlayer1 == "FORBICE") && (this.match.mossaPlayer2=="SASSO")){
                this.match.winplayer2++;
                this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else{
                this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }
        }


        if((this.match.winplayer1 >= (this.match.winplayer2+2)) && (this.match.winplayer1>2)){
            server.to(this.match.player1.socket_id).emit("win_partita")
            server.to(this.match.player2.socket_id).emit("lose_partita")
        }else if((this.match.winplayer2 >= (this.match.winplayer1+2)) && (this.match.winplayer2>2)){
            server.to(this.match.player2.socket_id).emit("win_partita")
            server.to(this.match.player1.socket_id).emit("lose_partita")
        }

      })


      socket.on("action",(message)=>{
        
 
        
        if(message.username == this.match.player1.nickname){
            this.match.mossaPlayer1 = message.move
            /* e la mando all'opposto*/
            server.to(this.match.player2.socket_id).emit("againstMove",{move: message.move})
        }else if(message.username == this.match.player2.nickname){
            this.match.mossaPlayer2 = message.move
             /* e la mando all'opposto*/
             server.to(this.match.player1.socket_id).emit("againstMove",{move: message.move})
        }


        if((this.match.mossaPlayer1!=null)&&(this.match.mossaPlayer2!=null)){
            if((this.match.mossaPlayer1 == "SASSO") && (this.match.mossaPlayer2=="CARTA")){
                this.match.winplayer2++;
                this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else  if((this.match.mossaPlayer1 == "SASSO") && (this.match.mossaPlayer2=="FORBICE")){
                this.match.winplayer1++;
            this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else if((this.match.mossaPlayer1 == "CARTA") && (this.match.mossaPlayer2=="FORBICE")){
                this.match.winplayer2++;
                this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else  if((this.match.mossaPlayer1 == "CARTA") && (this.match.mossaPlayer2=="SASSO")){
                this.match.winplayer1++;
            this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else if((this.match.mossaPlayer1 == "FORBICE") && (this.match.mossaPlayer2=="CARTA")){
                this.match.winplayer1++;
                this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else if((this.match.mossaPlayer1 == "FORBICE") && (this.match.mossaPlayer2=="SASSO")){
                this.match.winplayer2++;
                this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }else{
                this.match.mossaPlayer1 = null;
                this.match.mossaPlayer2 = null;
            }
        }


        if((this.match.winplayer1 >= (this.match.winplayer2+2)) && (this.match.winplayer1>2)){
            server.to(this.match.player1.socket_id).emit("win_partita")
            server.to(this.match.player2.socket_id).emit("lose_partita")
        }else if((this.match.winplayer2 >= (this.match.winplayer1+2)) && (this.match.winplayer2>2)){
            server.to(this.match.player2.socket_id).emit("win_partita")
            server.to(this.match.player1.socket_id).emit("lose_partita")
        }
        
        


      })
})