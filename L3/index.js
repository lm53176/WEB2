let c;
let ctx;
let cWidth=(Math.ceil(window.innerWidth/10)*10)-40;  //racunanje sirine i visine prozora
let cHeight=(Math.ceil(window.innerHeight/10)*10)-80;

let daska= {        //definiranje koordinata daske od koje se odbija loptica
x:cWidth/2-50,
y:cHeight-40

}
let brzina=4;           //brzinu odreduje pomicanje lopte za definiran broj u x i y smjeru, kut kojim ce se pomicat loptica nasumicnim odabirom (nagib pravca se mijenja, brzina ostaje ista)
let randBr= Math.floor(Math.random()*(brzina-2)+1);

let lopta={  //definiranje pocetnih koordinata loptice i pomake u smjeru x i y osi
x:cWidth/2,
y:cHeight-50,
brzinaX: randBr,
brzinaY: brzina-randBr

}

let cigle=[];    //definiranje atributa cigle 
let sirinaC=100;
let visinaC=20;
let stupci=cWidth/(sirinaC+10)-1;
let redovi = 2;
let ukupnoC=0;

let CX=10;      //CX i CY odreduju pocetne koordinate od kojih pocinje crtanje cigli
let CY=60;
let rezultat=0;
let highScore=0;
let smjer=false;  
let gameOver=false;

if(localStorage) {          //odredujem pocetnu vrijednost u lokalnom spremistu za najveci rezultat
    localStorage.setItem("currentScore", highScore);}
function start(){

c= document.getElementById("myC");  //canvas
c.height=cHeight;
c.width=cWidth;

ctx= c.getContext("2d");

ctx.fillStyle="white"; 
ctx.fillRect(daska.x, daska.y, 100, 20);        //iscrtavam dasku na pocetnoj poziciji
ctx.fillStyle="pink";
ctx.beginPath();
ctx.arc(lopta.x, lopta.y, 10, 0, 2*Math.PI);    //iscrtavam loptu na pocetnoj poziciji
ctx.stroke();

lopta.x=lopta.x+lopta.brzinaX;          //odredujem pocetno gibanje lopte
lopta.y=lopta.y-lopta.brzinaY;
requestAnimationFrame(moveRefresh);         //pozivam funkciju za osvjezavanje ekrana
document.addEventListener("keydown", moveBoard);    //slusam koje tipke su pritisnute i kako utjecu

createWall();       //stvaram zid cigli
}

function moveRefresh(){         //funkcija koja konstantno iscrtava nova stanja igre
    
requestAnimationFrame(moveRefresh);
if(gameOver)return;             //ako je game over, ne iscrtavamo nova stanja

ctx.clearRect(0,0, cWidth, cHeight);  //brisemo prethodno stanje kako bismo iscrtali novo
ctx.shadowBlur = 10;
ctx.shadowColor = "white";
ctx.fillStyle="white";
ctx.fillRect(daska.x, daska.y, 100, 20)
ctx.shadowBlur = 0;
moveBall();
lopta.x=lopta.x+lopta.brzinaX;
lopta.y=lopta.y-lopta.brzinaY;
ctx.fillStyle="lightblue";
ctx.beginPath();
ctx.arc(lopta.x, lopta.y, 10, 0, 2*Math.PI);
ctx.fill();
ctx.stroke();

if(lopta.y+10==daska.y){            //provjeravam jel lopta dosla do daske, ako je, odbija se
    if(lopta.x>=daska.x-10 && lopta.x<=daska.x+110)
        lopta.brzinaY*=-1;
}


if(rezultat==ukupnoC){          //ako su sve cigle razbijenje prikazuje se prikladan tekst i mogucnost za ponovnim igranjem
    ctx.fillStyle="white";
    ctx.font="20px ariel";
    textWidth=ctx.measureText("GAME FINISHED!").width;
    ctx.fillText("GAME FINISHED!", (cWidth/2)-(textWidth/2), cHeight/2);
    textWidth=ctx.measureText("Press space to play again.").width;
     ctx.fillText("Press space to play again.", (cWidth/2)-(textWidth/2), cHeight/2+30);
    gameOver=true;
    if(localStorage) {
        var score = localStorage.getItem("currentScore");       //najveci rezultat se azurira
        if(score<rezultat){
            highScore=rezultat;
        localStorage.setItem("currentScore", highScore);
        console.debug("spremljeno");
        }
        }
    return;
}

for(let i=0; i< cigle.length; i++){     //iscrtavam cigle sa sjencanjem ruba
    if(i%2==0){ctx.fillStyle=" rgb(250, 147, 224)";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgb(204, 147, 250)";
    }
    else {ctx.fillStyle="rgb(204, 147, 250)"
        ctx.shadowBlur = 10;
ctx.shadowColor = " rgb(250, 147, 224)";
    };
 let crtamC= cigle[i];
 if(!crtamC.razbijeno)   //provjeravam je li cigla vec razbijena, ako je, ne iscrtava se

    ctx.fillRect(crtamC.x, crtamC.y, sirinaC, visinaC);

}
detectColision();       //pozivam funkciju za detekciju sudara
ctx.shadowBlur = 0;

ctx.fillStyle="white";
ctx.font="15px ariel";
ctx.fillText("CURRENT POINTS: ", cWidth-200, 20);   //ispisujem trenutne bodove i najveci rezultat
ctx.fillText(rezultat, cWidth-50, 20);
ctx.fillText("HIGHSCORE: ", cWidth-200, 40);
ctx.fillText(highScore, cWidth-50, 40);

     
}

function moveBoard(e){          //funkcija u kojoj je definirano pomicanje daske pomocu strelica lijevo i desno

var brzina=15;
    if(gameOver){           //ako je igra gotova moguce ju je ponovno igrati pritiskom na rastavnicu
        if(e.code=="Space"){
            resetGame();
        }
    }

    if(e.code== "ArrowLeft") {      //pomicanje daske u lijevo s provjerom da ne izade van canvasa
        var check_left=daska.x-brzina;
        var check_right=check_left+100;
        if(check_left>=0 && check_right<=cWidth)
            daska.x=daska.x-brzina;


    } 

    else if(e.code== "ArrowRight") {        //pomicanje daske u desno s provjerom da ne izade van canvasa
        var check_left=daska.x+brzina;
        var check_right=check_left+100;
        if(check_left>=0 && check_right<=cWidth)
            daska.x=daska.x+brzina;

    }  

}

function moveBall(){   //funkcija koja definira odbijanje lopte u rubove 


if(lopta.y-10<=0){  //odbijanje od gornjeg djela canvasa
    lopta.brzinaY*=-1;
}

else if((lopta.x-10)<=0 || (lopta.x+10)>= cWidth){ //odbijanje od lijevog i desnog ruba
    lopta.brzinaX*=-1;
}

else if((lopta.y+10>daska.y+20)){       //ako se donji rub loptice nalazi ispod povrsine daske, igra se prekida, azurira se najbolji rezultat i prikazuje se poruka
    //game over
    if(localStorage) {
        var score = localStorage.getItem("currentScore");
        if(score<rezultat){
            highScore=rezultat;
        localStorage.setItem("currentScore", highScore);
        console.debug("spremljeno");
        }
        }
       
    ctx.font="20px ariel";
    ctx.fillStyle="white";
    textWidth=ctx.measureText("GAME OVER!").width;
    ctx.fillText("GAME OVER!", (cWidth/2)-(textWidth/2), cHeight/2);
    textWidth=ctx.measureText("Press space to play again.").width;          //moguce je ponovno igrati pritiskom na rastavnicu
     ctx.fillText("Press space to play again.", (cWidth/2)-(textWidth/2), cHeight/2+30);
    gameOver=true;
}


}


function createWall(){      //funkcija za generiranje cigli

cigle=[];

for(let i=0; i<stupci; i++){
for(let j=0; j<redovi; j++){

    
    let cigla={         //x i y polozaju dodaje se i velicina razmaka
        x: CX + i*sirinaC + i*10,
        y: CY + j*visinaC + j*10,
        sirina: sirinaC,
        visina: visinaC,
        razbijeno: false
    }

    cigle.push(cigla);
}

}
for(let i=0; i<cigle.length; i++){
ukupnoC=cigle.length;}

}



function detectColision(){          //funkcija za detektiranje sudara
    
    for(let i=0; i<cigle.length; i++){
        let crtamC= cigle[i];
        if(!crtamC.razbijeno){      //provjeravamo da cigla vec nije razbijena


if((lopta.x-10<= crtamC.x+sirinaC&& lopta.x-10>=crtamC.x+98) || (lopta.x+10>= crtamC.x && lopta.x+10<=crtamC.x+2)){  //provjeravaju se uvjeti za sudar s rubovima
    
    if(lopta.y>= crtamC.y -5&& lopta.y<=crtamC.y+25){
            crtamC.razbijeno=true;
           lopta.brzinaX*=-1;               //ako je doslo do sudara, zapisuje se da je cigla razbijena, broje se bodovi i mijenja se smjer kretanja loptice
           rezultat++;
       }
   
   
   }

if((lopta.y-10 <=crtamC.y+20 && lopta.y-10>=crtamC.y+18) || (lopta.y+10>= crtamC.y&&lopta.y+10<=crtamC.y+2)){           //provjeravaju se uvjeti za sudar s vrhom i dnom
    
    if(lopta.x>= crtamC.x-10 && lopta.x <= crtamC.x+sirinaC+10){
        crtamC.razbijeno=true;
        lopta.brzinaY*=-1;
        rezultat++;
    }
}
 







}
    }
}
function resetGame(){       //funkcija za definiranje pocetnih vrijednosti svih elemenata igre prilikom ponovnog pokretanja
    console.debug("rst");
gameOver=false;
daska.x=cWidth/2-50;
daska.y=cHeight-40;
lopta.x=cWidth/2;
lopta.y=cHeight-50;
randBr= Math.floor(Math.random()*(brzina-2)+1);
lopta.brzinaX=randBr;
lopta.brzinaY=brzina-randBr;

if(!smjer){
    lopta.brzinaX*=-1;
    smjer=true;
    console.log("mijenjam");
}
else smjer=false;

lopta.x=lopta.x+lopta.brzinaX;
lopta.y=lopta.y-lopta.brzinaY;
rezultat=0;
cigle=[];
createWall();

gameOver=false;



}



function gumb(number){      //funkcija pomocu koje je moguce mijenjati broj redova cigli
 redovi=number;
 highScore=0;               //ako se mijenja broj redova, brise se prethodan najbolji rezultat
 localStorage.setItem("currentScore", highScore);
 resetGame();
for(let i=1; i<=4; i++){
var str=i.toString();
str="btn"+str;
 let gmb=document.getElementById(str);
if(i==number){
    gmb.disabled=true;
}
else gmb.disabled=false;
}



}
function gumb2(number){     //funkcija pomocu koje je moguce mijenjati brzinu
  
    brzina=number;
    let num;
   if(number==4){
    num=1;

   }
   if(number==6){
    num=2;

   }
   
   resetGame();
   for(let i=1; i<=2; i++){
    var str=i.toString();
    str="btns"+str;
     let gmb=document.getElementById(str);
    if(i==num){
        gmb.disabled=true;
    }
    else gmb.disabled=false;
    }
    
  
    
  
   

   
   
   }