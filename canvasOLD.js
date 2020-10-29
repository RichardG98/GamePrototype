/*var Vector2d = function(x,y){
    this.x = x;
    this.y = y;
};

function vector_addition(v1, v2){
    return new Vector2d(v1.x + v2.x, v1.y + v2.y);
}

function vector_subtraction(v1, v2){
    return new Vector2d(v1.x - v2.x, v1.y - v2.y);
}

function vector_scalar_multiplicaton(v1, s){
    return new Vector2d (v1.x * s, v1.y * s);
}

function vector_length(v1){
    return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
}
*/







document.addEventListener("keydown",key_down_handler,false);
document.addEventListener("keyup",key_up_handler,false);
document.addEventListener("keypress",key_press_handler,false);


var canvas = document.getElementById("game_layer");
var context = canvas.getContext("2d");

var move_left = false;
var move_right = false;
var weapon_up = false;
var weapon_down = false;
var weapon_shoot = false;
var playerWidth = 20;
var playerHeight = 15;
var enemiesKilled = 0;

function key_down_handler(event){
    if(event.keyCode == 39){
        move_right = true;
    }
    else if(event.keyCode == 37){
        move_left = true;
    }

}

function key_up_handler(event){
    if(event.keyCode == 39){
        move_right = false;
    }
    else if(event.keyCode == 37){
        move_left = false;
    }

}

function key_press_handler(event){
    if(event.keyCode == 38){
        weapon_up = true;
    }   
    else if(event.keyCode == 40){
        weapon_down = true;
    }
    else if(event.keyCode == 32){
        //if projectile isnt on screen then we set its x coordinate to be the middle of the ship
        if(!weapon_shoot)
        {
            projectile.x = player_x + (playerWidth/2);
        }
        weapon_shoot = true;
    }

}

function Projectile(x, y){
    this.x = x;
    this.y = y;
    this.width = 3;
    this.height = 5;
    this.speedy = 3;
}
Projectile.prototype.draw = function(){
    context.fillStyle = "red";
    context.fillRect(this.x, this.y, this.width, this.height);
    //if the projectile reaches the top of the game, set weapon_shoot to false, onScrn to false, and reset y val
    if(this.y <= 0)
    {
        weapon_shoot = false;
        onScrn = false;
        this.y = player_y;
    }

}
Projectile.prototype.update = function(){
    if(weapon_shoot){
        this.y -= this.speedy;
        return this.y;
    }
}


function Player(x, y){
    this.x = x;
    this.y = y;
    this.width = playerWidth;
    this.height = playerHeight;
    this.speedx = 0.6;
    this.hp = 3;
}
Player.prototype.draw = function(){
    context.fillStyle = "gold";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Player.prototype.update = function(){
    if (move_right){
        if((this.x+this.width) >= canvas.width)
        {
            this.x = canvas.width - this.width;
        }
        else
        {
            this.x += this.speedx;
            player_x = this.x;
        }
    }
    else if(move_left){
        if(this.x <= 0)
        {
            this.x == 0;
        }
        else
        {
            this.x -= this.speedx;
            player_x = this.x;
        }
    }
    
};

function Enemy(x, y){
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.direction = -1;
    this.speedy = 0.1
    this.alive = true;
}
Enemy.prototype.draw = function()
{
    if(this.alive)
    {
        context.fillStyle = "green";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
    else
    {
        this.x=-1000;
        this.y=-1000;
    }
};

Enemy.prototype.update = function(){

    this.x = this.x + this.direction * this.speedy;
    //if the 1st or Last enemy hits the canvas end, drop and switch directions
    if (leftEnemy.x <= 0 || rightEnemy.x + this.width >= canvas.width){
        this.direction = this.direction * -1;
        this.y += (this.height/2);
    }
    
}

function collisionDetection(enemies) {
    for(k = 0; k < enemies.length; k++)
    {
        var currEnemy = enemies[k];
        if(projectile.y >= currEnemy.y && projectile.y <= (currEnemy.y + currEnemy.height))
        {
            if(projectile.x >= currEnemy.x && projectile.x <= (currEnemy.x+currEnemy.width))
            {
                currEnemy.alive = false;
                weapon_shoot = false;
                onScrn = false;
                projectile.y = -1000;
                enemiesKilled++;
                if(enemiesKilled >= enemies.length)
                {
                    document.write("YOU WIN!");
                }

                //if we shot the leftmost or rightmost enemy, update
                if(currEnemy == leftEnemy)
                {
                    for(j = (k+1); j<enemies.length; j++)
                    {
                        if(enemies[j].alive)
                        {
                            leftEnemy = enemies[j];
                            break;
                        }
                    }
                }
                else if(currEnemy == rightEnemy)
                {
                    for(j = (enemies.length-1); j>=0; j--)
                    {
                        if(enemies[j].alive)
                        {
                            rightEnemy = enemies[j];
                            break;
                        }
                    }
                }
            }
        }
    }
    
}

var player_x = canvas.width/2;
var player_y = 175;
var player1 = new Player(player_x, player_y);
var projectile = new Projectile(player_x,player_y);
var enemy1 = new Enemy(15,25);
var enemy2 = new Enemy(35,25);
var enemy3 = new Enemy(55,25);
var enemy4 = new Enemy(75,25);
var enemy5 = new Enemy(95,25);
var enemy6 = new Enemy(115,25);
var enemy7 = new Enemy(135,25);
var enemy8 = new Enemy(155,25);
var enemy9 = new Enemy(175,25);
var enemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8, enemy9];
//onScrn is a boolean used as a flag for whether or not the projectile is currently on the screen
//dont know if i really need this
var onScrn = false;
//used to track the leftmost and rightmost enemies for when they hit the canvas ends
var leftEnemy = enemy1;
var rightEnemy = enemy9;


function execution() {
    var canvas = document.getElementById("game_layer");
    var context = canvas.getContext("2d");
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    player1.update();
    player1.draw();

  
    if(weapon_shoot){
        collisionDetection(enemies);
        var pos = projectile.update();
        onScrn = true;
        projectile.draw();
    }

    enemy1.update();
    enemy1.draw();

    enemy2.update();
    enemy2.draw();

    enemy3.update();
    enemy3.draw();

    enemy4.update();
    enemy4.draw();

    enemy5.update();
    enemy5.draw();

    enemy6.update();
    enemy6.draw();

    enemy7.update();
    enemy7.draw();

    enemy8.update();
    enemy8.draw();

    enemy9.update();
    enemy9.draw();

    window.requestAnimationFrame(execution);

}

execution();
