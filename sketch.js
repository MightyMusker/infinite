var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score,restartImage,restart,gameover,gameoverImage;

var jumpsound,checkpointsound,diesound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImage=loadImage("restart.png");
  gameoverImage=loadImage("gameOver.png");
  
  jumpsound=loadSound("jump.mp3");
  checkpointsound=loadSound("checkPoint.mp3");
  diesound=loadSound("die.mp3");
  
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,height-20,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-15,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(width/2,height-10,width,5);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  restart=createSprite(width/2,height/2-50);
  restart.addImage(restartImage);
  restart.scale=0.75;
  
  gameover=createSprite(width/2,height/2);
  gameover.addImage(gameoverImage);
  gameover.scale=0.75;
  
  
  trex.setCollider("rectangle",0,0,50,80,60);
  //trex.debug = true;
  
  score = 0;
  textSize(20);
  fill("saphirewhite");
}

function draw() {
  background(180);
  //displaying score
 
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4+(score/100));
    //scoring
    score = score + Math.round(getFrameRate()/60);
    camera.position.x=trex.x
    camera.position.y=trex.y
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=150) {
        trex.velocityY = -15;
        jumpsound.play();
    }
    
  if(score%100===0&&score>0){
    checkpointsound.play();
  }
    //add gravity
    trex.velocityY = trex.velocityY + 1.4
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    gameover.visible=false;
    restart.visible=false;
    
    if(obstaclesGroup.isTouching(trex)){
       gameState = END;
       //  trex.velocityY = -13;
        diesound.play();
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     
     //we gave velocity to groups for stopping them
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     //giving color to background
     background("red");  
    
      ground.velocityX = 0;
    
      trex.velocityY=0;
         
     //giving lifetime to each group so that they do not dissappear
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-5);
    
     //giving visibility to gameover and restart button
      gameover.visible=true;
      restart.visible=true;
     
     //changing the animation of trex to make it stop after touching obstacle
      trex.changeAnimation("collided" , trex_collided);
  if(mousePressedOver(restart)) {
    reset();
  }
   }
  
 
  //stop trex from falling down
 
  
 
  
   trex.collide(invisibleGround);
  drawSprites();
   text("Score: "+ score, 500,50);
  
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-30,10,40);
   obstacle.velocityX =  -(4+(score/100));
   
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
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(width,100,40,10);
    cloud.y = Math.round(random(height/3,height/2));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 600/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
   trex.changeAnimation("running", trex_running);
  score=0;
}
