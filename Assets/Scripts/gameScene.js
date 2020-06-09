//creates the game scene

var player;
var cursors;
var Tunes;
var paused_text;
var play_text;
var quit_text;
var solarPowerUp;
var repair_key;
var solarPanels_Are_Alive;
   
function createGameScene() {
   //bground = game.add.tileSprite(0, 0, 1920, 1920, 'background');
   //game.world.setBounds(0, 0, 1920, 1920);
   bground2 = game.add.tileSprite(2400, 7200, 4800, 9600, 'background2');
   bground = game.add.tileSprite(0, 7200, 2400, 9600, 'background');
   bground3 = game.add.tileSprite(0, 5000, 7200, 7200, 'background2');
   cvbground = game.add.tileSprite(0, 0, 5000, 5000, 'background3');
   wbounds = game.world.setBounds(0, 0, 9600, 9600);

   rubble = game.add.sprite(80, 85, 'rubble');
   rubble.scale.setTo(0.1, 0.1);
   //game.add.tileSprite(0, 0, 1920, 1920, 'background');
   startArcade(game);
   startP2Collision(game);
   //var rubble = game.add.sprite(395, 85, 'rubble');
   //rubble.scale.setTo(0.1, 0.1);
   var playerCollision = game.physics.p2.createCollisionGroup();
   var wallCollisionGroup = game.physics.p2.createCollisionGroup();
   //game.world.setBounds(0, 0, 1920, 1920);
   //The actual rover will be made of separate objects,
   //we put them all in a group so they all act together.
   //This next function will also create the body for each sprite in the group.
        
   createWalls(game);
   createRocks(game);
   createCaveWalls(game);
   buildValleyA(game, walls, rocks, wallCollisionGroup, playerCollision);
   buildCave(cave_walls, wallCollisionGroup, playerCollision);
	
	MakePowerUps(game);
	MakeDeadRovers(game);
   //Now we poll these in our update loop
   //MakeWalls(game);
   //player = game.add.sprite(2055, 2571, 'player');
   //player = game.add.sprite(100, 300, 'player');
   player = game.add.sprite(400, 9400, 'player');
   player.scale.setTo(0.25, 0.25);
   player.anchor.setTo(0.5, 0.5); //new code
   game.physics.p2.enable(player, false);
   
   //give the player health
   player.hp = 100;
   //console.log(player.hp);
   
   //give the player speed
   player.speed = 0;
   solarPanels_Are_Alive = false;
   player.solar = false;
   player.body.mass = 5;
   player.body.setCollisionGroup(playerCollision);
   player.body.collides(wallCollisionGroup);
   player.body.createGroupCallback(wallCollisionGroup, hurt_rover, player);
   cursors = game.input.keyboard.createCursorKeys();
  
  
  
  
   //MakeUpgradeGroup(game);
  
   //Sounds Stuff
  
  
  
   Tunes = game.add.audio('Dusty');
   Tunes.loop = true;
   //Tunes.play();                                                                            //      DUDE!!!! SOund Here!!!!
   game.camera.follow(player);
		
   //HUD
   create_HUD(game);
   game.currentMode = 'gameplay';
   //listen for escape key to handle pausing
   pause_key = game.input.keyboard.addKey(27); //escape key
   pause_key.onDown.add(pauseGameScene);
   
   //listen for mouse clicks to get out of pause menu
   game.input.onDown.add(handlePausedClick, self);

   game.time.events.repeat(Phaser.Timer.SECOND * 30, 100, sandstormSpawner);
   
   /*
   //minigame shit
   repair_key = game.input.keyboard.addKey(Phaser.Keyboard.R);
   repair_key.onDown.add()
*/
}

function updateGameScene() {
   if (game.currentMode != 'gameplay') return;
        
		//This is where you'd poll for input to move a player, check for object collision, etc.
		//The heart of your game
		//calling function for Rover controls
		//Found in Controls.js
		MovePlayer(player, cursors, game);
		drain_battery(player, game);
		charge();
		if(solarPanels_Are_Alive == true){
			upgradeCollision(player, solarPowerUp);
		}
		//HudStuff
		//collision_damage(player.velocity, HP, game, player, walls);
		objective_description(Mish_1);
		minimap(Dead_Rover_1, player, game);
}

function pauseGameScene() {
   paused_text = game.add.sprite(game.camera.x+275, game.camera.y+125, 'paused_txt');
   paused_text.z = 101;
   play_text = game.add.sprite(game.camera.x+300, game.camera.y+250, 'play_txt');
   play_text.z = 102;
   quit_text = game.add.sprite(game.camera.x+300, game.camera.y+425, 'quit_txt');
   quit_text.z = 103;
   game.paused = true;
   console.log('game paused');
}

function handlePausedClick(event) {
   if (!game.paused) return;
   //console.log(play_text.x + ', ' + play_text.y + 'to ' + (play_text.x+play_text.width) + ', ' + (play_text.y+play_text.height));
   //console.log(event.x + ', ' +event.y);
   if (game.camera.x+event.x >= play_text.x && event.x+game.camera.x < play_text.x+play_text.width && game.camera.y+event.y >= play_text.y && game.camera.y+event.y < play_text.y+play_text.height)
       unpauseGameScene();
   if (game.camera.x+event.x >= quit_text.x && game.camera.x+event.x < quit_text.x+quit_text.width
             && game.camera.y+event.y >= quit_text.y && game.camera.y+event.y < quit_text.y+quit_text.height) {
       unpauseGameScene();
       destroyGameScene();
       createMainMenu();
   }
   console.log('handled pause click, mouseX is: ' + event.x+', mouseY is: ' + event.y+', play_text.x is: '+play_text.x+', play_text.y is'+play_text.y);
}
                

function unpauseGameScene() {
   game.paused = false;
   paused_text.destroy();
   play_text.destroy();
   quit_text.destroy();
}

function destroyGameScene() {
   game.input.keyboard.destroy();
   /*player.destroy();
   rubble.destroy();
   bground.destroy();
   Tunes.destroy();
   destroy_HUD();
   destroy_walls();*/
   game.world.removeAll();
   game.camera.reset();
}

