
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
var playerWidth = 40;
var playerHeight = 30;
var projectileWidth = 6;
var projectileHeight = 10;
var enemiesKilled = 0;
//trash and weaponNames indexes coordinate with eachother
var trash = ["trash", "recycling", "compost"];
var weaponNames = ["Trash Teleporter", "Recycling Rocket", "Compost Cannon"];
var currWeapon = 0;

var score = 0;

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
    else if(event.keyCode == 38)
    {
        //if the weapon isnt fired then we update both projectile type and increment currWeapon
        if(!weapon_shoot)
        {
            //document.write("UP");
            if(currWeapon==(trash.length-1))
            {
                currWeapon = 0;
                projectile.trashType = trash[currWeapon];
                weaponBox.textContent="Weapon: " + weaponNames[currWeapon];
            }
            else
            {
                currWeapon++;
                projectile.trashType = trash[currWeapon];
                weaponBox.textContent="Weapon: " + weaponNames[currWeapon];
            }
        }
        else //else the projectile is on screen so we only increment the currWeapon
        {
            //document.write("UP");
            if(currWeapon==(trash.length-1))
            {
                currWeapon = 0;
                weaponBox.textContent="Weapon: " + weaponNames[currWeapon];
            }
            else
            {
                currWeapon++;
                weaponBox.textContent="Weapon: " + weaponNames[currWeapon];
            }
        }
    }
    else if(event.keyCode == 40)
    {
        //if the weapon isnt fired then we update both projectile type and decrement currWeapon
        if(!weapon_shoot)
        {
            if(currWeapon==0)
            {
                currWeapon = (trash.length-1);
                projectile.trashType = trash[currWeapon];
                weaponBox.textContent="Weapon: " + weaponNames[currWeapon];
            }
            else
            {
                currWeapon--;
                projectile.trashType = trash[currWeapon];
                weaponBox.textContent="Weapon: " + weaponNames[currWeapon];
            }
        }
        else //else the projectile is on screen so we only decrement the currWeapon
        {
            if(currWeapon==0)
            {
                currWeapon = (trash.length-1);
                weaponBox.textContent="Weapon: " + weaponNames[currWeapon];
            }
            else
            {
                currWeapon--;
                weaponBox.textContent="Weapon: " + weaponNames[currWeapon];
            }
        }
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
            projectile.x = player_x + (playerWidth/2) - (projectile.width/2);
        }
        weapon_shoot = true;
    }

}

function Projectile(x, y){
    this.x = x;
    this.y = y;
    this.width = projectileWidth;
    this.height = projectileHeight;
    this.speedy = 3;
    this.trashType = trash[currWeapon];
}
Projectile.prototype.draw = function(){
    if(this.trashType == "trash"){
        context.fillStyle = "red";
    }
    else if(this.trashType == "recycling"){
        context.fillStyle = "white";
    }
    else if(this.trashType == "compost"){
        context.fillStyle = "pink";
    }
    context.fillRect(this.x, this.y, this.width, this.height);
    //if the projectile reaches the top of the game, set weapon_shoot to false, reset projectile y val and change projectile type to currWeapon
    if(this.y <= 0)
    {
        weapon_shoot = false;
        this.y = player_y - (projectileHeight/2);
        projectile.trashType = trash[currWeapon];
    }

}
Projectile.prototype.update = function(){
    if(weapon_shoot){
        this.y -= this.speedy;
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
    this.width = 20;
    this.height = 20;
    this.direction = -1;
    this.speedy = 0.1
    this.alive = true;
    this.trashType = "trash";
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
        //if not alive, remove from screen by making coordinates large and negative
        //may be better way to do this
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

//function to detect whether projectile has hit an enemy
function collisionDetection(enemies) {
    for(k = 0; k < enemies.length; k++)
    {
        var currEnemy = enemies[k];
        //if its a hit
        if(itsAHit(projectile, currEnemy))
        {
            //if correct weapon for enemy type and enemy is alive
            if(projectile.trashType == currEnemy.trashType && currEnemy.alive)
            {
                //set enemy to not alive, weapon_shoot to false, and projectile type to currWeapon
                currEnemy.alive = false;
                weapon_shoot = false;
                projectile.trashType = trash[currWeapon];

                //increase score and update scoreboard
                score += 10;
                scoreboard.textContent="Score: " + score;

                //setting projectile y to negative value to reset it
                //may be better way to do this
                projectile.y = -1000;

                //increase enemiesKilled and check if that was the last enemy
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

//determines whether or not the projectile has hit a specific enemy
//returns true if hit, false if miss
function itsAHit(proj, currEnemy)
{
    //if the projectiles y coordinate is within the enemies current y range
    if(proj.y >= currEnemy.y && proj.y <= (currEnemy.y + currEnemy.height)){
        //if the projectiles x coordinate is within the enemies current x range
        if((proj.x+proj.width) >= currEnemy.x && proj.x <= (currEnemy.x+currEnemy.width)){
            //return true cuz its a hit
            return true;
        }
        else{
            //return false cuz not in x range
            return false;
        }
    }
    else{
        //return false cuz not in y range
        return false;
    }
}

var player_x = canvas.width/2;
//var player_y = 175;
var player_y = 366;
var player1 = new Player(player_x, player_y);
var projectile = new Projectile(player_x,player_y-(projectileHeight/2));
var enemy1 = new Enemy(30,25);
var enemy2 = new Enemy(70,25);
var enemy3 = new Enemy(110,25);
var enemy4 = new Enemy(150,25);
var enemy5 = new Enemy(190,25);
var enemy6 = new Enemy(230,25);
var enemy7 = new Enemy(270,25);
var enemy8 = new Enemy(310,25);
var enemy9 = new Enemy(350,25);
var enemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6, enemy7, enemy8, enemy9];

//used to track the leftmost and rightmost enemies for when they hit the canvas ends
var leftEnemy = enemy1;
var rightEnemy = enemy9;
//initialize scoreboard
var scoreboard = document.getElementById("scoreboard");
scoreboard.textContent="Score: " + score;
//initialize weaponBox for displaying the current weapon
var weaponBox = document.getElementById("weaponBox");
weaponBox.textContent="Weapon: " + weaponNames[currWeapon]

function execution() {
    var canvas = document.getElementById("game_layer");
    var context = canvas.getContext("2d");
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    player1.update();
    player1.draw();

    if(weapon_shoot){
        collisionDetection(enemies);
        projectile.update();
        projectile.draw();
    }
    
    for(i = 0; i < enemies.length; i++)
    {
        enemies[i].update();
        enemies[i].draw();
    }

    
    window.requestAnimationFrame(execution);

}

execution();