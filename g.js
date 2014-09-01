//costant
var TO_RADIANS = Math.PI/180; 

//global variables
var canvas;
var ctx;
var canvasW=800;
var canvasH=600;
var activeTask;
var level=0;//0 menu
var pg;
var Kpressed=[];
var string;
var offsetY=0;
var ostacoli=[];
var progressLevel=0;
var shooting;
var bullet;
var aliens=[];
var offsetWon=0;
var stars=[];
var particles=[];

//setup
canvas = document.getElementById("g");
ctx = canvas.getContext("2d");
pg=new Object();
pg.px=660;
pg.py=55;
pg.dx=0;
pg.dy=0;
pg.ax=0;
pg.ay=0;

window.addEventListener('keydown',keyDown,false);
window.addEventListener('keyup',keyUp,false);
activeTask=setInterval(run, 33);

//levelUp();levelUp();levelUp();levelUp();levelUp();levelUp();levelUp();//DEBUG!
function run()
{
	ctx.clearRect(0, 0, canvasW, canvasH);
    var grd=ctx.createLinearGradient(0,0,0,canvasH);
    grd.addColorStop(0,"#000000");
    grd.addColorStop(1,"#101010");

    ctx.fillStyle=grd;
    ctx.fillRect(0,0, canvasW, canvasH);
    if(level==0)
    {
        playStars();
    	//titolo
    	ctx.fillStyle="#00FF00";
    	ctx.font = "60px Arial";
        if(offsetWon>0) ctx.fillText(" The END of the WOR",50,100);
    	else ctx.fillText("The END of the WORL",50,100);
    	//alert(ctx.measureText("The END of the WORL").width);
    	drawPg();
    	ctx.fillStyle="#FFFFFF";
    	ctx.font = "20px Arial";
    	if(Kpressed[68])
    	{
    		pg.ay=0.5;
    		pg.ax=-0.3;
    	}
    	if(progressLevel%40<30) if(pg.ay==0) ctx.fillText("press D to start",300,400);
        ctx.font = "10px Arial";
        ctx.fillText("Made for JS13KGames competition",620,590);
        progressLevel++;
    	if(pg.py>canvasH) levelUp();
    }
    else if(level==1)
    {//vertical falling
    	//muri
    	ctx.fillStyle="#7B7B7B";
    	ctx.font = "30px Courier";
    	string="WALL";	//25px
    	for(i=0;i<=(canvasH/25)+string.length;i++)
    	{
    		ctx.fillText(string[i%string.length],2,i*25-offsetY);
    		ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25-offsetY);
    	}
    	if((offsetY+=8)>=string.length*25) offsetY-=string.length*25;

    	//ostacoli
        //ctx.fillRect(pg.px,pg.py,pg.width,pg.height);
        for(i=0;i<ostacoli.length;i++)
        {
            //ctx.fillRect(ostacoli[i].px,ostacoli[i].py,ostacoli[i].width,ostacoli[i].height);
            ostacoli[i].draw();
            if(pg.py+pg.height>ostacoli[i].py && pg.py<ostacoli[i].py+ostacoli[i].height && pg.px+pg.width>ostacoli[i].px && pg.px<ostacoli[i].px+ostacoli[i].width)
                gameover();
        }

        //sbatte contro i muri
    	if(pg.px<15 && pg.dx<0)
            {
                pg.dx=-pg.dx*0.6;
                hurtParticle(pg.px,pg.py+pg.height/2,"#00FF00");
            }
    	if(pg.px>canvasW-55 && pg.dx>0)
        {
            pg.dx=-pg.dx*0.6;
            hurtParticle(pg.px+pg.width,pg.py+pg.height/2,"#00FF00");
        }

        //spostamento
    	if(Kpressed[68]) pg.ax=0.8;
    	else pg.ax=-0.8;
    	//gravità
    	if(pg.py<100) pg.dy=2;
    	else pg.dy=0;

    	drawPg();
        progressLevel++;
        if(progressLevel>=1000) levelUp();
        drawParticle();
    }
    else if(level==2)
    {
        //muri
        ctx.fillStyle="#7B7B7B";
        ctx.font = "30px Courier";
        string="WALL";  //25px
        for(i=0;i<=(canvasH/25)+string.length;i++)
        {
            ctx.fillText(string[i%string.length],2,i*25);
            ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25);
        }

        drawPg();

        //la L
        ctx.fillStyle="#00FF00";
        ctx.font = "60px Arial";
        ctx.fillText("L",303,445);

        //acqua
        ctx.save();
        ctx.globalAlpha=0.8;
        ctx.fillStyle="#007eff";
        ctx.font = "30px Courier";
        string="WATER";
        for(k=0;k<10;k++)
        {
            ctx.globalAlpha-=0.06;
            for(i=0;i<(canvasW/15);i++)
                ctx.fillText(string[(i+k*3)%string.length],15*i,450+k*18);
        }
        ctx.fillRect(0,430,canvasW,170);
        ctx.restore();

        if(Math.abs(pg.py-400)<1 && Math.abs(pg.dy)<2)
        {
            pg.ay=0;
            pg.dy=0;
            levelUp();
            return;
        }
        if(pg.py>400)
        {
            if(pg.dy>2) pg.dy=pg.dy-2;
            pg.ay=-0.2;
            pg.ax=0;
            pg.dx=0;
            hurtParticle(pg.px+pg.width/2,pg.py+pg.height,"#007eff");
        }
        else if(pg.ax==0 && pg.py<400) pg.ay=0.5;
        //else if(pg.py<440) pg.ay=-0.2;
        //else pg.ay=0;
        //progressLevel++;
        drawParticle();
    }
    else if(level==3)
    {
        //muri
        ctx.fillStyle="#7B7B7B";
        ctx.font = "30px Courier";
        string="WALL";  //25px
        for(i=0;i<=(canvasH/25)+string.length;i++)
        {
            ctx.fillText(string[i%string.length],2,i*25);
            ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25);
        }

        //movimenti
        if(Kpressed[76]) pg.ax=-0.2;
        else if(Kpressed[68]) pg.ax=0.2;
        else pg.ax=0;
        //sbatte contro i muri
        if(pg.px<15 && pg.dx<0) pg.dx=-pg.dx*0.6;
        if(pg.px>canvasW-90 && pg.dx>0) pg.dx=-pg.dx*0.6;

        drawPg();

        //caduta rocce
        for(i=0;i<ostacoli.length;i++)
        {
            ostacoli[i].draw();
            if(pg.py+pg.height>ostacoli[i].py && pg.py<ostacoli[i].py+ostacoli[i].height && pg.px+pg.width>ostacoli[i].px && pg.px<ostacoli[i].px+ostacoli[i].width)
                gameover();
            if(ostacoli[i].py>370 && ostacoli[i].py<380)
            {
                ostacoli[i].dy=2;
                hurtParticle(ostacoli[i].px+ostacoli[i].width/2,ostacoli[i].py+ostacoli[i].height,"#007eff");
            }
            if(ostacoli[i].py>620) ostacoli.splice(i,1);
        }

        //acqua
        ctx.save();
        ctx.globalAlpha=0.8;
        ctx.fillStyle="#007eff";
        ctx.font = "30px Courier";
        string="WATER";
        for(k=0;k<10;k++)
        {
            ctx.globalAlpha-=0.06;
            for(i=0;i<(canvasW/15);i++)
                ctx.fillText(string[(i+k*3)%string.length],15*i,450+k*18);
        }
        ctx.fillRect(0,430,canvasW,170);
        ctx.restore();

        if(ostacoli.length<=0) levelUp();
        drawParticle();
    }
    else if(level==4)
    {
        //muri
        ctx.fillStyle="#7B7B7B";
        ctx.font = "30px Courier";
        string="WALL";  //25px
        for(i=0;i<=(canvasH/25)+string.length+5;i++)
        {
            ctx.fillText(string[i%string.length],2,i*25+progressLevel-200);
            ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25+progressLevel-200);
        }

        drawPg();
        ctx.fillStyle="#00FF00";
        ctx.font = "60px Arial";
        if(progressLevel<155) ctx.fillText("R",pg.px-42,canvasH+156-155/2-progressLevel/2);
        else ctx.fillText("R",pg.px-42,canvasH-1);

        //acqua
        ctx.save();
        ctx.globalAlpha=0.8;
        ctx.fillStyle="#007eff";
        ctx.font = "30px Courier";
        string="WATER";
        for(k=0;k<10;k++)
        {
            ctx.globalAlpha-=0.06;
            for(i=0;i<(canvasW/15);i++)
                ctx.fillText(string[(i+k*3)%string.length],15*i,450+k*18+progressLevel);
        }
        ctx.fillRect(0,430+progressLevel,canvasW,170);
        ctx.restore();

        if(progressLevel>170)
        {
            levelUp();
            return;
        }
        progressLevel+=2;
        if(progressLevel<155) pg.py+=2;
    }
    else if(level==5)
    {
        //muri
        ctx.fillStyle="#7B7B7B";
        ctx.font = "30px Courier";
        string="ALLW";  //25px
        for(i=0;i<=(canvasH/25)+string.length+5;i++)
        {
            ctx.fillText(string[i%string.length],2,i*25-200);
            ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25-200);
        }

        //movimento
        if(Kpressed[82]) pg.ax=-0.5;
        else if(Kpressed[68]) pg.ax=0.5;
        else
        {
            pg.ax=0;
            pg.dx=pg.dx/1.1;
        }
        //speed limit
        if(Math.abs(pg.dx)>5) pg.dx=5*pg.dx/Math.abs(pg.dx);
        //sbatte contro i muri
        if(pg.px<15 && pg.dx<0) pg.dx=-pg.dx*0.6;
        if(pg.px>canvasW-132 && pg.dx>0) pg.dx=-pg.dx*0.6;

        //i nemici, ALIENI
        ctx.fillStyle="#FFFFFF";
        ctx.font = "55px Courier";
        aliens.px=999;
        aliens.width=-999;
        for(i=0;i<aliens.length;i++)
        {
            ctx.fillText(aliens[i].txt,aliens[i].px,aliens[i].py);
            aliens[i].px+=aliens.dx;
            //collisioni
            if(bullet.py+5>aliens[i].py-35 && bullet.py<aliens[i].py+aliens[i].height-35 && bullet.px+3>aliens[i].px && bullet.px<aliens[i].px+aliens[i].width)
            {
                hurtParticle(aliens[i].px+aliens[i].width/2,aliens[i].py-aliens[i].height/2,"FFFFFF");
                hurtParticle(aliens[i].px+aliens[i].width/2,aliens[i].py-aliens[i].height/2,"FFFFFF");
                aliens.splice(i,1);
                bullet.px=-100;
                shooting=false;
                i=i-1;
                continue;
            }
            else if(pg.py+pg.height>aliens[i].py-35 && pg.py<aliens[i].py+aliens[i].height-35 && pg.px+pg.width>aliens[i].px && pg.px<aliens[i].px+aliens[i].width)
            {
                gameover();
                return;
            }
            if(aliens.px>aliens[i].px) aliens.px=aliens[i].px;
            if(aliens.px+aliens.width<aliens[i].px+aliens[i].width) aliens.width=aliens[i].px+aliens[i].width-aliens.px;
        }
        if(aliens.px<20 && aliens.dx<0)
        {
            aliens.dx=-aliens.dx;
            for(i=0;i<aliens.length;i++) aliens[i].py+=35;
        }
        else if(aliens.px+aliens.width>780 && aliens.dx>0)
        {
            aliens.dx=-aliens.dx;
            for(i=0;i<aliens.length;i++) aliens[i].py+=35;
        }

        //spara
        if(!shooting && Kpressed[76])
        {
            shooting=true;
            bullet.px=pg.px+48;
            bullet.py=555;
            bullet.dy=-12;
        }
        else if(shooting)
        {
            ctx.fillStyle="#FFFFFF";
            ctx.fillRect(bullet.px,bullet.py,3,5);
            bullet.py+=bullet.dy;
            if(bullet.py<-10) shooting=false;
        }

        drawPg();
        if(aliens.length==0) levelUp();
        drawParticle();
    }
    else if(level==6)
    {
        ctx.save();
        if(progressLevel<100) ctx.translate(rand(-1,2),rand(-2,2));
        if(progressLevel>200) ctx.translate(rand(-4,4),rand(-4,4));
        //muri
        ctx.fillStyle="#7B7B7B";
        ctx.font = "30px Courier";
        string="ALLW";  //25px
        for(i=0;i<=(canvasH/25)+string.length+5;i++)
        {
            ctx.fillText(string[i%string.length],2,i*25-200+progressLevel*10);
            if(progressLevel<200) ctx.fillText(string[(i+2)%string.length],canvasW-20,i*25-200);
        }
        drawPg();
        if(progressLevel>100)
        {//THE FIRE!
            ctx.font = "50px Courier";
            string="FIREWALL";
            for(k=0;k<5;k++)
            for(i=0;i<(canvasH/35);i++)
            {
                r=rand(0,4);
                if(r==0) ctx.fillStyle="#ff0000";
                else if(r==1) ctx.fillStyle="#ffcc00";
                else if(r==2) ctx.fillStyle="#ff4400";
                else if(r==3) ctx.fillStyle="#ff8800";
                else ctx.fillStyle="#ffaa00";
                ctx.fillText(string[(i+3*k)%string.length],progressLevel-140-k*30,i*35+35);          
            }
        }
        if(progressLevel>150)
        {//la O
            ctx.fillStyle="#00FF00";
            ctx.font = "60px Arial";
            ctx.fillText("O",(progressLevel-150)*15-200,pg.py+45);
            if((progressLevel-150)*15-150>pg.px)
            {
                pg.px+=15;
                pg.py-=4;
            }
        }
        ctx.restore();
        progressLevel++;
        if(progressLevel>230) levelUp();
    }
    else if(level==7)
    {
        playStars();

        //il goal
        ctx.fillStyle="#00FF00";
        ctx.font = "60px Arial";
        ctx.fillText("The END of the W____",850-(progressLevel/2),100);

        //movimento
        speed=5;
        if(Kpressed[79]) pg.dx=-speed;
        else if(Kpressed[68]) pg.dx=+speed;
        else pg.dx=0;
        if(Kpressed[82]) pg.dy=-speed;
        else if(Kpressed[76]) pg.dy=+speed;
        else pg.dy=0;
        if(pg.px>640 && pg.dx>0) pg.dx=0;
        if(pg.py>555 && pg.dy>0) pg.dy=0;
        if(pg.py<0 && pg.dy<0) pg.dy=0;
        //ostacoli
        for(i=0;i<ostacoli.length;i++)
        {
            if(pg.px+pg.width>ostacoli[i].px && pg.px<ostacoli[i].px+ostacoli[i].width && pg.py+pg.height>ostacoli[i].py && pg.py<ostacoli[i].py+ostacoli[i].height)
                pg.dx=ostacoli[i].dx;
            ostacoli[i].draw();
            if(ostacoli[i].px<-100)
            {
                ostacoli.splice(i,1);
                i=i-1;
            }
        }

        drawPg();

        //THE FIRE!
        ctx.font = "50px Courier";
        string="FIREWALL";
        for(k=0;k<20;k++)
            for(i=0;i<(canvasH/35);i++)
            {
                r=rand(0,4);
                if(r==0) ctx.fillStyle="#ff0000";
                else if(r==1) ctx.fillStyle="#ffcc00";
                else if(r==2) ctx.fillStyle="#ff4400";
                else if(r==3) ctx.fillStyle="#ff8800";
                else ctx.fillStyle="#ffaa00";
                ctx.fillText(string[(i+7*k)%string.length],(progressLevel/5)-30-k*30,i*35+35);          
            }
        if(pg.px+20<progressLevel/5) gameover();
        progressLevel++;
        if(progressLevel>1350)
        {
            if(pg.py>35 && pg.py<70 && pg.px>620-progressLevel/2+700 && pg.px<660-progressLevel/2+700)
            {
                offsetWon=progressLevel;
                levelUp();
            }
        }
    }
    else if(level==8)
    {//credits
        playStars();
        ctx.fillStyle="#00FF00";
        ctx.font = "60px Arial";
        ctx.fillText("The END of the WORLD",850-(offsetWon/2)-(progressLevel/8),100);

        //THE FIRE!
        ctx.font = "50px Courier";
        string="FIREWALL";
        for(k=0;k<20;k++)
            for(i=0;i<(canvasH/35);i++)
            {
                r=rand(0,4);
                if(r==0) ctx.fillStyle="#ff0000";
                else if(r==1) ctx.fillStyle="#ffcc00";
                else if(r==2) ctx.fillStyle="#ff4400";
                else if(r==3) ctx.fillStyle="#ff8800";
                else ctx.fillStyle="#ffaa00";
                ctx.fillText(string[(i+7*k)%string.length],(offsetWon/5)-30-k*30-progressLevel*3,i*35+35);          
            }
        if(progressLevel>250)
        {
            ctx.save();
            ctx.fillStyle="#FFFFFF";
            ctx.font = "50px Arial";
            if(progressLevel>600) ctx.globalAlpha=(700-progressLevel)/100;
            else ctx.globalAlpha=(progressLevel-250)/200;
            if(progressLevel>700) ctx.globalAlpha=0;
            ctx.fillText("A game by Infernet89",130,400);
            ctx.restore();
        }

        progressLevel++;
        if(progressLevel>1000)
        {
            level=-1;
            levelUp();
        }
    }
}
function gameover()
{
    //return;
    level--;
    levelUp();
}
function levelUp()
{
    while(particles.length>0) particles.pop();
    progressLevel=0;
	level++;
	if(level==1)
	{
		pg.px=400;
		pg.py=-90;
		pg.ax=0;
        pg.ay=0;
		pg.dx=10;
		pg.dy=0;
        pg.width=40;
        pg.height=45;
        offsetY=0;
        progressLevel=0;
        while(ostacoli.length>0) ostacoli.pop();
        //rocce da 100 a 1000
        quanti=rand(3,15);
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(2);
            t.px=15;
            t.py=rand(800,8000);
            t.dy=-8;
            ostacoli.push(t);
        }
        quanti=rand(2,10);
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(2);
            t.px=canvasW-80;
            t.py=rand(800,8000);
            t.dy=-8;
            ostacoli.push(t);
        }
        //il fuoco, più lento
        quanti=rand(10,30);
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(1);
            t.px=rand(75,canvasW-180);
            t.dy=rand(-3,-6);
            t.py=rand(-t.dy*100+300,-t.dy*1000);
            ostacoli.push(t);
        }

	}
    else if(level==2)
    {
        while(ostacoli.length>0) ostacoli.pop();
        pg.py=-190;
        pg.px=400;
        pg.dy=8;
        pg.dx=0;
        pg.ax=-0.1;
        pg.ay=0.5;
    }
    else if(level==3)
    {
        while(ostacoli.length>0) ostacoli.pop();
        pg.px=303;
        pg.py=400;
        pg.dx=0;
        pg.dy=0;
        pg.ax=0;
        pg.ay=0;
        pg.width=75;
        //rocce cadenti (meteoriti?)
        quanti=rand(20,60);
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(2);
            t.px=rand(20,canvasW-85);
            t.py=rand(-100,-10000);
            t.dy=rand(6,8);
            ostacoli.push(t);
        }
    }
    else if(level==4)
    {
        pg.ax=0;
        pg.dx=0;
        if(pg.px<62) pg.px=62;
    }
    else if(level==5)
    {
        while(aliens.length>0) aliens.pop();
        pg.px=pg.px-42;
        pg.width=115;
        if(pg.px<62) pg.px=62;
        pg.py=canvasH-46;
        shooting=false;
        bullet=new Object();
        //generiamo gli alieni
        string="ALIENS";
        for(k=0;k<3;k++)
            for(i=0;i<12;i++)
            {
                t=new Object();
                t.txt=string[i%string.length];
                t.px=40*i+20;
                t.py=35*k-72+18;
                t.width=35;
                t.height=35;
                aliens.push(t);
            }
        aliens.px=20;
        aliens.dx=3;
        aliens.width=470;
    }
    else if(level==7)
    {
        while(ostacoli.length>0) ostacoli.pop();
        pg.px=300;
        pg.py=300;
        pg.dx=0;
        pg.dy=0;
        pg.ax=0;
        pg.ay=0;
        pg.width=160;

        //generiamo rocce
        quanti=rand(25,50);
        for(i=0;i<quanti;i++)
        {
            t=new ostacoloObj(2);
            t.px=rand(1000,14000);
            t.py=rand(0,canvasH-75);
            t.dx=-rand(7,14)
            ostacoli.push(t);
        }
    }

}
function drawFire(x,y)
{
    ctx.save();
    ctx.translate(0,30);
	ctx.font = "50px Courier";
	string="FIRE";
	for(fi=0;fi<4;fi++)
	{
		r=rand(0,4);
		if(r==0) ctx.fillStyle="#ff0000";
		else if(r==1) ctx.fillStyle="#ffcc00";
		else if(r==2) ctx.fillStyle="#ff4400";
		else if(r==3) ctx.fillStyle="#ff8800";
		else ctx.fillStyle="#ffaa00";
		ctx.fillText(string[fi],x+fi*25,y);
	}
    ctx.restore();
}
function drawRock(x,y)
{
    ctx.save();
    ctx.translate(0,38);
    ctx.font = "60px Courier";
    ctx.fillStyle="#7B7B7B";
    ctx.fillText("R",x,y);
    ctx.fillStyle="#7B7B7B";
    ctx.fillText("O",x+28,y);
    ctx.fillStyle="#7B7B7B";
    ctx.fillText("C",x,y+35);
    ctx.fillStyle="#7B7B7B";
    ctx.fillText("K",x+28,y+35);
    ctx.restore();
}
function drawPg()
{
    //ctx.fillRect(pg.px,pg.py,pg.width,pg.height);
    ctx.save();
    ctx.translate(0,45);
	if(level<=2)
	{
		if(Kpressed[68]) ctx.fillStyle="#FF0000";
		else ctx.fillStyle="#00FF00";
    	ctx.font = "60px Arial";
    	ctx.translate(pg.px+20,pg.py-25);
    	ctx.rotate(pg.dx*TO_RADIANS);
    	ctx.translate(-20,25);
    	ctx.fillText("D",0,0);
	}
    else if(level<=4)
    {
        ctx.font = "60px Arial";
        ctx.translate(pg.px,pg.py);
        if(Kpressed[76]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("L",0,0);
        if(Kpressed[68]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("D",34,0);
    }
    else if(level<=6)
    {
        ctx.font = "60px Arial";
        ctx.translate(pg.px,pg.py);
        if(Kpressed[82]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("R",0,0);
        if(Kpressed[76]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("L",42,0);
        if(Kpressed[68]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("D",76,0);
    }
    else if(level==7)
    {
        ctx.font = "60px Arial";
        ctx.translate(pg.px,pg.py);
        if(Kpressed[79]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("O",0,0);
        if(Kpressed[82]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("R",44,0);
        ctx.globalAlpha=0.2;
        ctx.fillText("▲",34,0);
        ctx.globalAlpha=1;
        if(Kpressed[76]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("L",86,0);
        ctx.globalAlpha=0.2;
        ctx.fillText("▼",76,0);
        ctx.globalAlpha=1;
        if(Kpressed[68]) ctx.fillStyle="#FF0000";
        else ctx.fillStyle="#00FF00";
        ctx.fillText("D",120,0);
    }
    ctx.restore();

	//lo muovo
	pg.px+=pg.dx;
	pg.py+=pg.dy;
	pg.dx+=pg.ax;
	pg.dy+=pg.ay;
}
function keyDown(e) {
	Kpressed[e.keyCode]=true;
	//alert(e.keyCode);
}
function keyUp(e) {
	Kpressed[e.keyCode]=false;
}
function rand(da, a)
{
    if(da>a) return rand(a,da);
    a=a+1;
    return Math.floor(Math.random()*(a-da)+da);
}

function ostacoloObj(tipo) {
  //1=fire, 2=rock  
  this.tipo=tipo;
  this.px=0;
  this.py=0;
  this.dx=0;
  this.dy=0;
  this.ax=0;
  this.ay=0;
  if(tipo==1)
  {
    this.width=100;
    this.height=30;
  }
  else if(tipo==2)
  {
    this.width=60;
    this.height=75;
  }
  this.draw = function () {
    if(this.tipo==1) drawFire(this.px,this.py);
    else if(this.tipo==2) drawRock(this.px,this.py);
    this.px+=this.dx;
    this.py+=this.dy;
    this.dx+=this.ax;
    this.dy+=this.ay;
  }
}
//EYE CANDY
function playStars()
{
    if(stars.length<=0)
    {
        //generiamo stars
        while(stars.length>0) stars.pop();
        quanti=rand(50,100);
        for(i=0;i<quanti;i++)
        {
            t=new Object();
            t.px=rand(0,canvasW*2);
            t.py=rand(0,canvasH);
            t.dx=-rand(20,22);
            stars.push(t);
        }
    }
    ctx.save();
    //stars di sottofondo
    ctx.fillStyle="#FFFFFF";
    ctx.globalAlpha=0.7;
    for(i=0;i<stars.length;i++)
    {
        ctx.fillRect(stars[i].px,stars[i].py,1,1);
        stars[i].px+=stars[i].dx;
        if(stars[i].px<0) stars[i].px+=canvasW*2;
    }
    ctx.restore();
}
function hurtParticle(x,y,color)
{
    for(ip=0;ip<10;ip++)
    {
        t=new Object();
        t.px=x;
        t.py=y;
        t.dx=rand(-3,3);
        t.dy=rand(-3,3);
        t.color=color;
        t.ttl=rand(5,20);
        particles.push(t);
    }
}
function drawParticle()
{
    ctx.save();
    for(ipd=0;ipd<particles.length;ipd++)
    {
        ctx.fillStyle=particles[ipd].color;
        ctx.fillRect(particles[ipd].px,particles[ipd].py,1,1);
        particles[ipd].px+=particles[ipd].dx;
        particles[ipd].py+=particles[ipd].dy;
        particles[ipd].ttl--;
        if(particles[ipd].ttl<=0)
        {
            particles.splice(ipd,1);
            ipd=ipd-1;
        }
    }
    ctx.restore();
}