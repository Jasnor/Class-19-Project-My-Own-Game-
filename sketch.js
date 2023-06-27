var PLAY = 1;
var END = 0;
var gameState = PLAY;

var player, player_running, player_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var gameOver, restart;

var score=0;


function preload(){
  player_running =   loadImage("player_running.png");
  player_collided = loadImage("player_Stopped.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("clouds.png");

  gameOverImg = loadImage("game_over.png");
  restartImg = loadImage("restart.jpg");
  
  obstacle1 = loadImage("obstacle.png");
  obstacle2 = loadImage("obstacle.png");
  obstacle3 = loadImage("obstacle.png");
  obstacle4 = loadImage("obstacle.png");
  obstacle5 = loadImage("obstacle.png");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  player = createSprite(50,windowHeight/2 + 100,20,50);
  
  player.addAnimation("running", player_running);
  player.addAnimation("collided", player_collided);
  player.scale = 0.5;
  
  ground = createSprite(windowWidth/2,windowHeight - 200,windowWidth,20);
  ground.addImage("ground",groundImage);
  ground.scale = 1.8;
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);

  gameOver = createSprite(windowWidth/2,windowHeight/2-100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200,windowHeight - 150,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  
  //player.debug = true;
  background(0);
  textSize(35)
  text("Score: "+ score, 500,50);

  player.debug= true;
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") || touches.length>0 && player.y >= windowHeight-550) {
      player.velocityY = -12;
      touches = []
    }

  player.changeAnimation("running",player_running);

    player.velocityY = player.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    player.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(player)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    //set velcity of each game object to 0
    gameOver.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart)) {
      reset();
    }

    ground.velocityX = 0;
    player.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the player animation
    player.changeAnimation("collided",player_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
   
  }
  

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(windowWidth,120,40,10);
    cloud.y = Math.round(random(80,windowHeight/2));
    cloud.addImage(cloudImage);
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = windowWidth/cloud.velocityX;
    
    //adjust the depth
    cloud.depth = player.depth;
    player.depth = player.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(windowWidth,windowHeight-180,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = windowWidth/obstacle.velocityX;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  player.changeAnimation("running",player_running);
  
 
  
  score = 0;
  
}