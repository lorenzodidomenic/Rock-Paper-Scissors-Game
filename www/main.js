
const socket = io();

loginBtn = document.getElementById("loginBtn")
randomBtn = document.getElementById("randomBtn")
randomMatch = false;

usernameText = document.getElementById("username_text")
loginDiv = document.getElementById("signin")
gameDiv = document.getElementById("gamediv")
player1header = document.getElementById("player1header")
player2header = document.getElementById("player2header")



player1container = document.getElementById("player1")
player2container = document.getElementById("player2")

player2move = document.getElementById("player2move")
player2btn = document.getElementById("player2btn")


player1move = document.getElementById("player1move")
player1btn = document.getElementById("player1btn")

my_moves = document.getElementsByClassName("my_moves")
against_moves = document.getElementsByClassName("against_moves")

miamossa = null;
mossacontro = null;
currentdiv = null;

wp1 = document.getElementById("wp1")
wp2 = document.getElementById("wp2")
lp1 = document.getElementById("losep1")
lp2 = document.getElementById("losep2")
vittorePlayer1 = 0;
vittorePlayer2 = 0;
sconfittePlayer1 = 0;
sconfittePlayer2 = 0;

this.loginBtn.addEventListener("click",()=>{

    loginDiv.style.display = "none"
    gameDiv.style.display = "block"
    player1header.innerHTML = this.usernameText.value
    player2header.innerHTML = "IN ATTESA..."

    player2move.style.opacity = "0%"
    player2btn.style.opacity = "0%"



    socket.emit("login",{username:  this.usernameText.value})
    //player2container.innerHTML = ' <div class="inputGame"> <h3 style="color:coral;padding-bottom: 20px">In attesa di un giocatore... </h3> <select>'


})

this.randomBtn.addEventListener("click",()=>{
    loginDiv.style.display = "none"
    gameDiv.style.display = "block"
    player1header.innerHTML = this.usernameText.value
    player2header.innerHTML = "ROBOT "

    player2move.style.opacity = "0%"
    player2btn.style.opacity = "0%"



    socket.emit("RandomLogin",{username:  this.usernameText.value})
    randomMatch = true;
})


socket.on("beginMatch",(message)=>{

    this.player1move.style.display = "inline"
    this.player1btn.style.display = "inline"
    if(!randomMatch){
    if(message[0].nickname == this.usernameText.value){
    player1header.innerHTML = message[0].nickname
    player2header.innerHTML = message[1].nickname
    }else{
        player1header.innerHTML = message[1].nickname
    player2header.innerHTML = message[0].nickname
    }
    }else{
        player1header.innerHTML = username
    }

})


array_mosse = {"CARTA" : 128196, "FORBICE" : 9988 , "SASSO":129521}

player1btn.addEventListener("click",()=>{


    this.player1move.style.display = "none"
    this.player1btn.style.display = "none"

    this.miamossa = this.player1move.value;
    this.numero_mosse_mie++;

    if(!randomMatch)
    socket.emit("action",{username: this.usernameText.value, move: this.miamossa })
    else
    socket.emit("randomAction",{username: this.usernameText.value, move: this.miamossa },)

    div_move = document.createElement("div")
    div_move.innreHTML = "MOSSA: &#"+array_mosse[this.miamossa]
    div_move.classList = ["move_player1"]
    this.currentdiv = div_move;

    this.my_moves[0].innerHTML = this.my_moves[0].innerHTML +  '<div style="text-align:center" id="move_player1"> MOSSA:     &#'+ array_mosse[this.miamossa] + '</div>'
    console.log(this.my_moves[0])

   
    el = document.getElementsByClassName("move_player2")
    el[this.numero_mosse_sue].style.display= "block"
    
  
    if(!randomMatch){
    if(this.mossacontro != null){
        //nel server lo faccio pure per vedere chi ha vinto la partita
        if((this.miamossa == "SASSO") && (this.mossacontro=="CARTA")){
            vittorePlayer2++;
            this.wp2.innerHTML = "WIN:  "+vittorePlayer2
            sconfittePlayer1++;
            this.lp1.innerHTML = "LOSE:  "+sconfittePlayer1
            this.miamossa = null;
            this.mossacontro = null;
        }
        else  if((this.miamossa == "SASSO") && (this.mossacontro=="FORBICE")){
            vittorePlayer1++;
            this.wp1.innerHTML = "WIN:  "+vittorePlayer1
            sconfittePlayer2++;
            this.lp2.innerHTML = "LOSE:  "+sconfittePlayer2
            this.miamossa = null;
            this.mossacontro = null;
        }else if((this.miamossa == "CARTA") && (this.mossacontro=="FORBICE")){
            vittorePlayer2++;
            this.wp2.innerHTML = "WIN:  "+vittorePlayer2
            sconfittePlayer1++;
            this.lp1.innerHTML = "LOSE:  "+sconfittePlayer1
            this.miamossa = null;
            this.mossacontro = null;
        }else  if((this.miamossa == "CARTA") && (this.mossacontro=="SASSO")){
            vittorePlayer1++;
            this.wp1.innerHTML = "WIN:  "+vittorePlayer1
            sconfittePlayer2++;
             this.lp2.innerHTML = "LOSE:  "+sconfittePlayer2
            this.miamossa = null;
            this.mossacontro = null;
        }else if((this.miamossa == "FORBICE") && (this.mossacontro=="CARTA")){
            vittorePlayer1++;
            this.wp1.innerHTML = "WIN:  "+ vittorePlayer1
            sconfittePlayer2++;
            this.lp2.innerHTML = "LOSE:  "+sconfittePlayer2
            this.miamossa = null;
            this.mossacontro = null;
        }else if((this.miamossa == "FORBICE") && (this.mossacontro=="SASSO")){
            vittorePlayer2++;
            this.wp2.innerHTML = "WIN:  "+vittorePlayer2
            sconfittePlayer1++;
            this.lp1.innerHTML = "LOSE:  "+sconfittePlayer1
            this.miamossa = null;
            this.mossacontro = null;
        }else{
            this.miamossa = null;
            this.mossacontro = null;
        }
    }
    }
    
})

numero_mosse_mie = -1;
numero_mosse_sue = -1;
socket.on("againstMove",(message)=>{
    
     this.player1move.style.display = "inline"
    this.player1btn.style.display = "inline"

    this.numero_mosse_sue++;
    this.mossacontro = message.move;
    console.log("mossa contro" +mossacontro);

    console.log(this.numero_mosse_mie,this.numero_mosse_sue)
    

    div_move = document.createElement("div")
    div_move.innerHTML = "MOSSA: "+message.move
    div_move.classList = ["move_player2"]
       
    this.against_moves[0].innerHTML = this.against_moves[0].innerHTML +  '<div id="move_player2" class="move_player2"> MOSSA: &#'+array_mosse[message.move]+ '</div>'

    if(this.miamossa == null && (this.numero_mosse_mie!=this.numero_mosse_sue)){
        el = document.getElementsByClassName("move_player2")
        el[this.numero_mosse_sue].style.display= "none"
    }else{
         el = document.getElementsByClassName("move_player2")
        el[this.numero_mosse_sue].style.display= "block"
    }


    //da qui mi calcolo se ho vinto oppure no

    if(this.miamossa != null){
    //nel server lo faccio pure per vedere chi ha vinto la partita
    if((this.miamossa == "SASSO") && (this.mossacontro=="CARTA")){
        vittorePlayer2++;
        this.wp2.innerHTML = "WIN:  "+vittorePlayer2
        sconfittePlayer1++;
            this.lp1.innerHTML = "LOSE:  "+sconfittePlayer1
        this.miamossa = null;
        this.mossacontro = null;
    }else  if((this.miamossa == "SASSO") && (this.mossacontro=="FORBICE")){
        vittorePlayer1++;
        this.wp1.innerHTML = "WIN:  "+vittorePlayer1
        sconfittePlayer2++;
        this.lp2.innerHTML = "LOSE:  "+sconfittePlayer2
        this.miamossa = null;
        this.mossacontro = null;
    }else if((this.miamossa == "CARTA") && (this.mossacontro=="FORBICE")){
        vittorePlayer2++;
        this.wp2.innerHTML = "WIN:  "+vittorePlayer2
        sconfittePlayer1++;
        this.lp1.innerHTML = "LOSE:  "+sconfittePlayer1
        
        this.miamossa = null;
            this.mossacontro = null;
    }else  if((this.miamossa == "CARTA") && (this.mossacontro=="SASSO")){
        vittorePlayer1++;
        this.wp1.innerHTML = "WIN:  "+vittorePlayer1
        sconfittePlayer2++;
        this.lp2.innerHTML = "LOSE:  "+sconfittePlayer2
        this.miamossa = null;
        this.mossacontro = null;
    }else if((this.miamossa == "FORBICE") && (this.mossacontro=="CARTA")){
        vittorePlayer1++;
        this.wp1.innerHTML = "WIN:  "+vittorePlayer1
        sconfittePlayer2++;
        this.lp2.innerHTML = "LOSE:  "+sconfittePlayer2
        this.miamossa = null;
            this.mossacontro = null;
    }else if((this.miamossa == "FORBICE") && (this.mossacontro=="SASSO")){
        vittorePlayer2++;
        this.wp2.innerHTML = "WIN:  "+vittorePlayer2
        sconfittePlayer1++;
        this.lp1.innerHTML = "LOSE:  "+sconfittePlayer1
        this.miamossa = null;
            this.mossacontro = null;
    }else{
        this.miamossa = null;
        this.mossacontro = null;
    }
}

})



socket.on("win_partita",()=>{
    alert("HAI VINTO");
})


socket.on("lose_partita",()=>{
    alert("HAI PERSO");
})