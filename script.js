//canvas
let canvas = document.getElementById('c1');
let ctx = canvas.getContext('2d');
window.onload = create;

// images
var img0 = new Image();
img0.src = 'sprite.png';

var myFont = new FontFace('Junction Regular', 'emulogic.ttf');

//son
var eat = document.querySelector('#s1');
var die = document.querySelector('#s2');
var ready = document.querySelector('#s3');
var waza = document.querySelector('#s4');
var eatf = document.querySelector('#s5');
var life = document.querySelector('#s6');
var bonus = document.querySelector('#s7');
var fruit = document.querySelector('#s8');

function loadSave(){
  if(localStorage.getItem('var1')) {
    score.best = parseInt(localStorage.getItem('var1'),10);
  } else {
    localStorage.setItem('var1',0);
    loadSave();
  }
}

function Save(){
  localStorage.setItem('var1',score.best);
}

function ResetSave(){
  localStorage.setItem('var1',0);
  loadSave();
}

// -----------------------------------------------------------------------------

// variables
var x;
var y;
var score;
var depart;
var combo;
var Case;
var pacman = {
    vie : 3,
}
pacman.vie = 3;

var niveau = 1;

var score = {
  pl : 0,
  current : 0,
  best : 0,

  x : 0,
  y : 0,
  time : Date.now(),
  tick : 1500,
  test : 0,

  add : function(s) {
    score.current += s;

    if (s > 51) {
      score.time = Date.now();
      score.x = pacman.posX;
      score.y = pacman.posY;
      score.pl = s;
      score.test = 1;
    }

    if (score.current > score.best) {
      score.best = score.current;
      Save();
    }

  },

  aff : function (){

    if (Date.now() - score.time < score.tick) {
      ctx.font = 'bold 15px Calibri';
      ctx.fillStyle = 'rgb(0,255,0)';
      ctx.textAlign = 'center';
      ctx.fillText(score.pl, x+score.x, y+score.y);
    } else {
      score.test = 0;
    }

  }
}

loadSave();

// -----------------------------------------------------------------------------

function start() {

testff = 1;
x = (window.innerWidth/2)-223;
y = (window.innerHeight/2)-247;

depart = 0;

Case = [];
allCreation();

Fantome = [];
new FantomeCreation(222,182,13,173,'rouge',0);
new FantomeCreation(222,230,13,213,'rose',5000);
new FantomeCreation(190,230,13,253,'bleu',10000);
new FantomeCreation(254,230,13,293,'orange',15000);

pacman = {
    posX : 0,
    posY : 0,

    posXmax : 0,
    posYmax : 0,

    ori : 'droite',
    priori : 'droite',

    px : 0,
    py : 0,
    lx : 25,
    ly : 27,

    vitesse : 2,
    anim : 1,

    time : 0,
    tick : 100,
    vie : pacman.vie,
    deplacement : function() {

      if (pacman.ori == 'gauche') {
        if (testPos(-16,0) == 1) { pacman.posXmax -= 16; } else { pacman.anim = 0; }
      }

      if (pacman.ori == 'droite') {
          if (testPos(16,0) == 1) { pacman.posXmax += 16; } else { pacman.anim = 0; }
      }

      if (pacman.ori == 'bas') {
        if (testPos(0,16) == 1) { pacman.posYmax += 16; } else { pacman.anim = 0; }
      }

      if (pacman.ori == 'haut') {
        if (testPos(0,-16) == 1) { pacman.posYmax -= 16; } else { pacman.anim = 0; }
      }

      if (pacman.posYmax == 230){
        if (pacman.posXmax == -10) {
          pacman.posXmax = 438;
          pacman.posX = 438;
        }
        if (pacman.posXmax == 454)  {
          pacman.posXmax = 6;
          pacman.posX = 6;
        }
      }
    },

    mort : function(){
      depart = 2;
      Fantome.splice(0,Fantome.length);
      new FantomeCreation(222,182,13,173,'rouge',0);
      new FantomeCreation(222,230,13,213,'rose',5000);
      new FantomeCreation(190,230,13,253,'bleu',10000);
      new FantomeCreation(254,230,13,293,'orange',15000);

      for(var p=0; p < Fantome.length; p++){ Fantome[p].time = Date.now(); }

      die.play();
      pacman.time = Date.now();
      pacman.anim = 12;

    }

}

}

// -----------------------------------------------------------------------------

function FantomeCreation(x, y, px, py, id, time){
  this.posX = x;
  this.posY = y;

  this.couleur = id; // Rouge - Bleu - Vert - Orange
  this.depart = time;
  this.vitesse = 1.6; // 1 - 1.6 - 2 - 4 - 8 - 16

  this.posXmax = x;
  this.posYmax = y;

  this.px = px;
  this.py = py;
  this.lx = 30;
  this.ly = 29;

  this.last = 0;
  this.anim = 1;

  this.mode = 4;
  this.time = 0;
  this.tick = 0;
  this.ori = 'haut';

  this.deplacement = function(p) {
      Fantome[p].tx = 0;
      Fantome[p].txx = 0;
      Fantome[p].ty = 0;
      Fantome[p].tyy = 0;

      decision(p);

      if (Fantome[p].posYmax == 230){
        if (Fantome[p].posXmax == -10) {
          Fantome[p].posXmax = 438;
          Fantome[p].posX = 438;
        }
        if (Fantome[p].posXmax == 454)  {
          Fantome[p].posXmax = 6;
          Fantome[p].posX = 6;
        }
      }

  };

	Fantome.push(this);
};

function decision(p) {
  var a = Random(1,2);

  // anti bug
  if (Fantome[p].tx == 1 && Fantome[p].ty == 1) {
    if (a == 1) { xmoins(p); } else { ymoins(p); }
    return;
  }

  if (Fantome[p].tx == 1 && Fantome[p].tyy == 1) {
    if (a == 1) { xmoins(p); } else { yplus(p); }
    return;
  }

  if (Fantome[p].txx == 1 && Fantome[p].ty == 1) {
    if (a == 1) { xplus(p); } else { ymoins(p); }
    return;
  }

  if (Fantome[p].txx == 1 && Fantome[p].tyy == 1) {
    if (a == 1) { xplus(p); } else { yplus(p); }
    return;
  }

  //

  if (Fantome[p].tx == 1 && Fantome[p].ty == 1 && Fantome[p].tyy) {
    xmoins(p)
    return;
  }

  if (Fantome[p].txx == 1 && Fantome[p].ty == 1 && Fantome[p].tyy) {
    xplus(p)
    return;
  }

  if (Fantome[p].txx == 1 && Fantome[p].tx == 1 && Fantome[p].tyy) {
    yplus(p)
    return;
  }

  if (Fantome[p].txx == 1 && Fantome[p].tx == 1 && Fantome[p].ty) {
    ymoins(p)
    return;
  }

  // choix aléatoire
  if (a == 1) { mooveX(p); } else { mooveY(p); }
}

function mooveX(p) {
  if (Fantome[p].mode == 0) {

    if (Fantome[p].posXmax > pacman.posXmax) {

      if (Fantome[p].last !== 1) { xmoins(p); } else {
        Fantome[p].txx = 1;
        decision(p);
      }

      } else {

      if (Fantome[p].last !== 2) { xplus(p); } else {
        Fantome[p].tx = 1;
        decision(p);
      }

    }

 }

 if (Fantome[p].mode == 3) {

   if (Fantome[p].posXmax > 230) {

     if (Fantome[p].last !== 1) { xmoins(p); } else {
       Fantome[p].txx = 1;
       decision(p);
     }

     } else {

     if (Fantome[p].last !== 2) { xplus(p); } else {
       Fantome[p].tx = 1;
       decision(p);
     }

   }

}

 if (Fantome[p].mode == 1 || Fantome[p].mode == 2) {

   if (Fantome[p].posXmax < pacman.posXmax) {

     if (Fantome[p].last !== 1) { xmoins(p); } else {
       Fantome[p].txx = 1;
       decision(p);
     }

     } else {

     if (Fantome[p].last !== 2) { xplus(p); } else {
       Fantome[p].tx = 1;
       decision(p);
     }

   }

}


}

function mooveY(p) {

if (Fantome[p].mode == 0) {
  if (Fantome[p].posYmax > pacman.posYmax) {

    if (Fantome[p].last !== 3) { ymoins(p); } else {
      Fantome[p].tyy = 1;
      decision(p);
    }

    } else {

    if (Fantome[p].last !== 4) { yplus(p); } else {
      Fantome[p].ty = 1;
      decision(p);
    }

  }
}

if (Fantome[p].mode == 3) {
  if (Fantome[p].posYmax > 182) {

    if (Fantome[p].last !== 3) { ymoins(p); } else {
      Fantome[p].tyy = 1;
      decision(p);
    }

    } else {

    if (Fantome[p].last !== 4) { yplus(p); } else {
      Fantome[p].ty = 1;
      decision(p);
    }

  }
}

if (Fantome[p].mode == 1 || Fantome[p].mode == 2) {

  if (Fantome[p].posYmax < pacman.posYmax) {

    if (Fantome[p].last !== 3) { ymoins(p); } else {
      Fantome[p].tyy = 1;
      decision(p);
    }

    } else {

    if (Fantome[p].last !== 4) { yplus(p); } else {
      Fantome[p].ty = 1;
      decision(p);
    }

  }

}

}

function xplus(p) {
    if ( testPoss(16,0,p) == 1) {
      Fantome[p].posXmax += 16;
      Fantome[p].last = 1;
      Fantome[p].ori = 'droite';
    } else {
      Fantome[p].tx = 1;
      decision(p);
    }
}
function xmoins(p) {
    if (testPoss(-16,0,p) == 1) {
      Fantome[p].posXmax -= 16;
      Fantome[p].last = 2;
      Fantome[p].ori = 'gauche';
    } else {
      Fantome[p].txx = 1;
      decision(p);
     }
}
function yplus(p) {
    if (testPoss(0,16,p) == 1) {
      Fantome[p].posYmax += 16;
      Fantome[p].last = 3;
      Fantome[p].ori = 'bas';
    } else {
      Fantome[p].ty = 1;
      decision(p);
    }
}
function ymoins(p) {
    if (testPoss(0,-16,p) == 1) {
      Fantome[p].posYmax -= 16;
      Fantome[p].last = 4;
      Fantome[p].ori = 'haut';
    } else {
      Fantome[p].tyy = 1;
      decision(p);
    }
}

//

var testff = 1;
function updateFantome() {
  testf = 4;
  for(var p=0; p < Fantome.length; p++){

    // debut
    if (Fantome[p].mode == 4) {

      if (Date.now() - Fantome[p].time > Fantome[p].depart) {
        Fantome[p].posXmax = 230;
        Fantome[p].posYmax = 182;
        Fantome[p].mode = 0;
      }

    } else {
      testf -= 1;
      if (Fantome[p].posYmax == Fantome[p].posY) {
        if (Fantome[p].posXmax == Fantome[p].posX) {
          Fantome[p].deplacement(p);
        }
      }

    if (Fantome[p].posXmax > Fantome[p].posX) { Fantome[p].posX += Fantome[p].vitesse; }
    if (Fantome[p].posXmax < Fantome[p].posX) { Fantome[p].posX -= Fantome[p].vitesse; }
    if (Fantome[p].posYmax > Fantome[p].posY) { Fantome[p].posY += Fantome[p].vitesse; }
    if (Fantome[p].posYmax < Fantome[p].posY) { Fantome[p].posY -= Fantome[p].vitesse; }

    Fantome[p].posX = roundDecimal(Fantome[p].posX,1);
    Fantome[p].posY = roundDecimal(Fantome[p].posY,1);

    // normal
    if (Fantome[p].mode == 0) {
      if (Fantome[p].posYmax == Fantome[p].posY) {
        if (Fantome[p].posXmax == Fantome[p].posX) {
          Fantome[p].vitesse = 1.6;
        }
      }

      if (Fantome[p].couleur == 'rouge') { Fantome[p].py = 173;}
      if (Fantome[p].couleur == 'rose') { Fantome[p].py = 213;}
      if (Fantome[p].couleur == 'bleu') { Fantome[p].py = 253;}
      if (Fantome[p].couleur == 'orange') { Fantome[p].py = 293;}

      if (Fantome[p].ori == 'gauche') {
        Fantome[p].px = 173;
      }

      if (Fantome[p].ori == 'droite') {
        Fantome[p].px = 253;
      }

      if (Fantome[p].ori == 'haut') {
        Fantome[p].px = 13;
      }

      if (Fantome[p].ori == 'bas') {
        Fantome[p].px = 93;
      }

      if (Fantome[p].anim >= 5) { Fantome[p].px += 40; }

      if (Fantome[p].posXmax == pacman.posXmax) {
          if (Fantome[p].posYmax == pacman.posYmax) {
            pacman.mort();
            return;
          }
      }
    }

    // peureux
    if (Fantome[p].mode == 1) {
      if (Fantome[p].posYmax == Fantome[p].posY) {
        if (Fantome[p].posXmax == Fantome[p].posX) {
          Fantome[p].vitesse = 1;
        }
      }

      Fantome[p].px = 13;
      Fantome[p].py = 333;

      if (Fantome[p].anim >= 5) { Fantome[p].px += 40; }

      if (Date.now() - Fantome[p].time > Fantome[p].tick/1.3) {
        Fantome[p].mode = 2;
      }
    }

    // fin peureux
    if (Fantome[p].mode == 2) {

      Fantome[p].px = 13;
      Fantome[p].py = 333;

      if (Fantome[p].anim >= 2) { Fantome[p].px = 93; }
      if (Fantome[p].anim >= 4) { Fantome[p].px = 133; }
      if (Fantome[p].anim >= 6) { Fantome[p].px = 53; }


      if (Date.now() - Fantome[p].time > Fantome[p].tick) {
        Fantome[p].mode = 0;
        Fantome[p].last = 0;
      }
    }

    if (Fantome[p].anim == 8) { Fantome[p].anim = 1; } else { Fantome[p].anim += 0.5; }

    }

    if (Fantome[p].mode == 3) {
      if (Fantome[p].posYmax == Fantome[p].posY) {
        if (Fantome[p].posXmax == Fantome[p].posX) {
          Fantome[p].vitesse = 4;
        }
      }

      Fantome[p].py = 138;

      if (Fantome[p].ori == 'gauche') {
        Fantome[p].px = 213;
      }

      if (Fantome[p].ori == 'droite') {
        Fantome[p].px = 253;
      }

      if (Fantome[p].ori == 'haut') {
        Fantome[p].px = 133;
      }

      if (Fantome[p].ori == 'bas') {
        Fantome[p].px = 173;
      }

      if (Fantome[p].posY == 182) {
        if (Fantome[p].posX == 230) {

            Fantome[p].posX = 230;
            Fantome[p].posY = 222;

            Fantome[p].posXmax = 230;
            Fantome[p].posYmax = 182;

            Fantome[p].vitesse = 1;

            Fantome[p].mode = 0;
            Fantome[p].last = 0;
        }
      }

    }

    if (Fantome[p].mode == 1 || Fantome[p].mode == 2) {
      if (Fantome[p].posXmax == pacman.posXmax) {
          if (Fantome[p].posYmax == pacman.posYmax) {
            combo += 1;
            if (combo == 1) { score.add(200); }
            if (combo == 2) { score.add(400); }
            if (combo == 3) { score.add(800); }
            if (combo == 4) { score.add(1600); }

            Fantome[p].mode = 3;
            Fantome[p].last = 0;
            eatf.play();
          }
        }
    }


  		ctx.drawImage(img0, Fantome[p].px, Fantome[p].py, Fantome[p].lx, Fantome[p].ly, x+Fantome[p].posX-12, y+Fantome[p].posY-12, Fantome[p].lx, Fantome[p].ly);



  }

  if (testf == 0 && testff == 1) {
    for(var p=0; p < Case.length; p++){
      if (Case[p].posX == 214 && Case[p].posY == 278) { Case[p].id = 4; }
    }
    testff = 0;
  }

}

function testPoss(vx,vy,p) {

  var test = 0;

  for(var q=0; q < Case.length; q++){
      if (Case[q].posX == Fantome[p].posXmax+vx) {
        if (Case[q].posY == Fantome[p].posYmax+vy) {
            test = 1;
        }
      }
  }

  return test;

}

// -----------------------------------------------------------------------------

function updatePacman() {

  // prochaine direction
  if (pacman.priori == 'gauche') {
    if (testPos(-16,0) == 1) { pacman.ori = pacman.priori; }
  }

  if (pacman.priori == 'droite') {
      if (testPos(16,0) == 1) { pacman.ori = pacman.priori; }
  }

  if (pacman.priori == 'bas') {
    if (testPos(0,16) == 1) { pacman.ori = pacman.priori; }
  }

  if (pacman.priori == 'haut') {
    if (testPos(0,-16) == 1) { pacman.ori = pacman.priori; }
  }

  // variables du sprite
  if (pacman.ori == 'gauche') {
    pacman.py = 13;
    pacman.lx = 25;
    pacman.ly = 27;
  }

  if (pacman.ori == 'droite') {
    pacman.py = 53;
    pacman.lx = 25;
    pacman.ly = 27;
  }

  if (pacman.ori == 'haut') {
    pacman.py = 95;
    pacman.lx = 27;
    pacman.ly = 25;
  }

  if (pacman.ori == 'bas') {
    pacman.py = 133;
    pacman.lx = 27;
    pacman.ly = 25;
  }

  if (pacman.anim >= 5) { pacman.px = 53; } else { pacman.px = 13; }
  if (pacman.anim == 8) { pacman.anim = 1; } else { pacman.anim += 0.5; }

  // animation du déplacement
  if (pacman.posXmax > pacman.posX) { pacman.posX += pacman.vitesse; }
  if (pacman.posXmax < pacman.posX) { pacman.posX -= pacman.vitesse; }
  if (pacman.posYmax > pacman.posY) { pacman.posY += pacman.vitesse; }
  if (pacman.posYmax < pacman.posY) { pacman.posY -= pacman.vitesse; }

  // calcul du déplacement
  if (pacman.posYmax == pacman.posY) {
    if (pacman.posXmax == pacman.posX) {
      pacman.deplacement();
    }
  }

  // affichage pacman

		ctx.drawImage(img0, pacman.px, pacman.py, pacman.lx, pacman.ly, x+pacman.posX-12, y+pacman.posY-12, pacman.lx, pacman.ly);



}

function testPos(vx,vy) {

  var test = 0;

    for(var p=0; p < Case.length; p++){
      if (Case[p].posX == pacman.posXmax+vx) {
        if (Case[p].posY == pacman.posYmax+vy) {
            test = 1;
        }
      }
    }

  return test;

}

// -----------------------------------------------------------------------------

// -- clavier --
document.onkeydown = function(event) {

  if (depart == 0) {

    if (event.keyCode == 37) {
        pacman.priori = 'gauche';
        pacman.ori = 'gauche';
        pacman.posX = 214;
        pacman.posY = 374;
        depart = 1;
        for(var p=0; p < Fantome.length; p++){ Fantome[p].time = Date.now(); }
        ready.play();
    }

    // droite
    if (event.keyCode == 39) {
        pacman.priori = 'droite';
        pacman.ori = 'droite';
        pacman.posX = 230;
        pacman.posY = 374;
        depart = 1;

        for(var p=0; p < Fantome.length; p++){ Fantome[p].time = Date.now(); }
        ready.play();
    }

    pacman.posXmax = pacman.posX;
    pacman.posYmax = pacman.posY;

  } else {

 // triche
  if (event.keyCode == 32) {
    niveau += 1;
    start();
  }

  // reset
   if (event.keyCode == 82) {
     ResetSave()
   }

  // gauche
    if (event.keyCode == 37) {
        pacman.priori = 'gauche';
        if (testPos(-16,0) == 1) { pacman.ori = 'gauche'; }
    }

    // droite
    if (event.keyCode == 39) {
        pacman.priori = 'droite';
        if (testPos(16,0) == 1) { pacman.ori = 'droite'; }
    }

    // haut
    if (event.keyCode == 38) {
        pacman.priori = 'haut';
        if (testPos(0,-16) == 1) { pacman.ori = 'haut'; }
    }

    // bas
    if (event.keyCode == 40){
      pacman.priori = 'bas';
      if (testPos(0,16) == 1) { pacman.ori = 'bas'; }
    }

  }

}

// -----------------------------------------------------------------------------

function create(){
  start();
	updatef();

}

// -- fonction principale --

function updatef(){
  window.requestAnimationFrame(updatef);

  //fond
	ctx.fillStyle = 'rgb(0,0,0)';
	ctx.fillRect(0, 0, window.innerWidth,window.innerHeight);

  ctx.drawImage(img0, 332, 0, 448, 496, x, y, 448, 496);

  ctx.font = 'bold 20px Calibri';
  ctx.fillStyle = 'rgb(255,255,255)';

  ctx.textAlign = 'left';
  ctx.fillText('HIGH SCORE', x, y-10);

  ctx.textAlign = 'right';
  ctx.fillText(score.best, x+200, y-10);
  ctx.fillText(' | ' + niveau + ' |', x + 330, y-10);

  ctx.fillText(score.current, x+448, y-10);


    var xx = 0;
    for(var p=0; p < pacman.vie; p++){
      ctx.drawImage(img0, 13, 53, 25, 27, x+xx, y+506, 25, 27);
      xx += 35;
    }



  ctx.drawImage(img0, 296, 7, 25, 25, x+418, y+506, 25, 25);

  if (score.test == 1) { score.aff(); }

  var testt = 0;
  //point
  for(var p=0; p < Case.length; p++){

    if (Case[p].id === 1) {
      ctx.fillStyle = 'rgb(255,184,151)';
      ctx.fillRect(x+Case[p].posX, y+Case[p].posY, 4, 4);
      testt = 1;

      if (Case[p].posX == pacman.posX) {
          if (Case[p].posY == pacman.posY) {
            Case[p].id = 0;
            score.add(10);
          }
        }
    }

    if (Case[p].id === 3) {
      ctx.drawImage(img0, 12, 391, 17, 17, x+Case[p].posX-7, y+Case[p].posY-7, 17, 17);

      if (Case[p].posX == pacman.posX) {
        if (Case[p].posY == pacman.posY) {
          Case[p].id = 0;
          score.add(50);
          combo = 0;
          for(var p=0; p < Fantome.length; p++) {
            if (Fantome[p].mode !== 4) {
              Fantome[p].mode = 1;
              Fantome[p].time = Date.now();
              Fantome[p].tick = 10000;
            }
          }
          bonus.play();
        }
      }

    }

    if (Case[p].id === 4) {
      var n;
      var b;
      if (niveau == 1) {
        n = 0;
        b = 100;
      }
      if (niveau == 2) {
        n = 33;
        b = 300;
      }
      if (niveau >= 3) {
        n = 66;
        b = 500;
      }
      if (niveau >= 5) {
        n = 96;
        b = 700;
      }
      if (niveau >= 7) {
        n = 130;
        b = 1000;
      }
      if (niveau >= 9) {
        n = 160;
        b = 2000;
      }
      if (niveau >= 11) {
        n = 193;
        b = 3000;
      }
      if (niveau >= 13) {
        n = 226;
        b = 5000;
      }
      ctx.drawImage(img0, 13+n, 422, 27, 25, x+Case[p].posX-7+8, y+Case[p].posY-7-4, 27, 25);

      if (Case[p].posY == pacman.posY) {
         if (Case[p].posX == pacman.posX || Case[p].posX+8 == pacman.posX) {
           score.add(b);
           bonus.play();
           Case[p].id = 0;
         }
      }

    }

  }

  if (testt == 0) {
    niveau += 1;
    start();
  }

  if (depart == 0) {

    ctx.drawImage(img0, 93, 13, 27, 27, x+210, y+362, 27, 27);
    for(var p=0; p < Fantome.length; p++){

      		ctx.drawImage(img0, Fantome[p].px, Fantome[p].py, Fantome[p].lx, Fantome[p].ly, x+Fantome[p].posX-12, y+Fantome[p].posY-12, Fantome[p].lx, Fantome[p].ly);

    }

  }

  if (depart == 1) {

    // pacman
    updatePacman();
    // fantome
    updateFantome();

  }

  if (depart == 2) {

    if (Date.now() - pacman.time > pacman.tick) {
      pacman.time = Date.now();
      pacman.anim += 40;

      if (pacman.anim > 420) {
        depart = 0;
        pacman.anim = 1;

        pacman.vie -= 1;
        if (pacman.vie == 0) {
          niveau = 1;
          score.current = 0;
          pacman.vie = 3;
          start();
        }
      }

    }
    if (depart == 2) { ctx.drawImage(img0, pacman.anim, 500, pacman.lx+4, pacman.ly, x+pacman.posX-12, y+pacman.posY-12, pacman.lx, pacman.ly); }
  }


}

// -----------------------------------------------------------------------------

// objet case
function CaseCreation(a, b, c){
  this.posX = a;
  this.posY = b;
	this.id = c; // 0 = vide - 1 = point

	Case.push(this);
};

function allCreation() {

  for(var p=22; p <= 198; p+=16){ new CaseCreation(p,22,1); }
  for(var p=38; p <= 134; p+=16){ new CaseCreation(22,p,1); }
  for(var p=38; p <= 86; p+=16){ new CaseCreation(p,134,1); }
  for(var p=22; p <= 422; p+=16){ new CaseCreation(102,p,1); }
  for(var p=22; p <= 406; p+=16){ new CaseCreation(p,86,1); }
  for(var p=22; p <= 422; p+=16){ new CaseCreation(342,p,1); }
  for(var p=22; p <= 422; p+=16){ new CaseCreation(p,470,1); }
  for(var p=118; p <= 342; p+=16){ new CaseCreation(p,374,1); }
  for(var p=22; p <= 198; p+=16){ new CaseCreation(p,326,1); }
  for(var p=422; p <= 454; p+=16){ new CaseCreation(22,p,1); }
  for(var p=38; p <= 86; p+=16){ new CaseCreation(p,422,1); }
  for(var p=246; p <= 422; p+=16){ new CaseCreation(p,22,1); }
  for(var p=246; p <= 422; p+=16){ new CaseCreation(p,326,1); }
  for(var p=38; p <= 134; p+=16){ new CaseCreation(422,p,1); }
  for(var p=38; p <= 70; p+=16){ new CaseCreation(198,p,1); }
  for(var p=38; p <= 70; p+=16){ new CaseCreation(246,p,1); }
  for(var p=102; p <= 134; p+=16){ new CaseCreation(150,p,1);}
  for(var p=102; p <= 134; p+=16){ new CaseCreation(294,p,1); }
  for(var p=166; p <= 198; p+=16){ new CaseCreation(p,134,1); }
  for(var p=246; p <= 278; p+=16){ new CaseCreation(p,134,1); }
  for(var p=358; p <= 406; p+=16){ new CaseCreation(p,134,1); }
  for(var p=342; p <= 374; p+=16){ new CaseCreation(22,p,1); }
  for(var p=150; p <= 198; p+=16){ new CaseCreation(p,422,1); }
  for(var p=246; p <= 294; p+=16){ new CaseCreation(p,422,1); }
  for(var p=358; p <= 422; p+=16){ new CaseCreation(p,422,1); }
  for(var p=374; p <= 406; p+=16){ new CaseCreation(54,p,1); }
  for(var p=374; p <= 406; p+=16){ new CaseCreation(390,p,1); }
  for(var p=342; p <= 374; p+=16){ new CaseCreation(422,p,1); }

  new CaseCreation(38,374,1);
  new CaseCreation(198,342,1);
  new CaseCreation(198,358,1);
  new CaseCreation(246,342,1);
  new CaseCreation(246,358,1);
  new CaseCreation(150,390,1);
  new CaseCreation(150,406,1);
  new CaseCreation(294,390,1);
  new CaseCreation(294,406,1);
  new CaseCreation(198,438,1);
  new CaseCreation(198,454,1);
  new CaseCreation(246,438,1);
  new CaseCreation(246,454,1);
  new CaseCreation(422,438,1);
  new CaseCreation(422,454,1);
  new CaseCreation(406,374,1);

  //

 for(var p=-10; p <= 86; p+=16) { new CaseCreation(p,230,0); }
 for(var p=358; p <= 454; p+=16) { new CaseCreation(p,230,0); }

 for(var p=118; p <= 150; p+=16) { new CaseCreation(p,230,0); }
 for(var p=182; p <= 310; p+=16) { new CaseCreation(150,p,0); }
 for(var p=182; p <= 310; p+=16) { new CaseCreation(294,p,0); }

 for(var p=166; p <= 278; p+=16) { new CaseCreation(p,278,0); }
 for(var p=166; p <= 278; p+=16) { new CaseCreation(p,182,0); }

 new CaseCreation(246,150,0);
 new CaseCreation(246,166,0);
 new CaseCreation(198,150,0);
 new CaseCreation(198,166,0);
 new CaseCreation(310,230,0);
 new CaseCreation(326,230,0);

 //

 for(var p=0; p < Case.length; p++){

   if (Case[p].posX == 22 && Case[p].posY == 374) { Case[p].id = 3; }
   if (Case[p].posX == 22 && Case[p].posY == 54) { Case[p].id = 3; }
   if (Case[p].posX == 422 && Case[p].posY == 374) { Case[p].id = 3; }
   if (Case[p].posX == 422 && Case[p].posY == 54) { Case[p].id = 3; }

 }

}

function Random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

function roundDecimal(nombre, precision){
    var precision = precision || 2;
    var tmp = Math.pow(10, precision);
    return Math.round( nombre*tmp )/tmp;
}
