//has sandstorms and other hazards


//var sandstorm_timer = 30000; //how long between sandstorms in ms

function loadHazards(game) {
   game.load.image('Sandstorm1', 'Assets/Art/Hazards/sandstorm1.png');
   game.load.image('Sandstorm2', 'Assets/Art/Hazards/sandstorm2.png');
   game.load.image('Sandstorm3', 'Assets/Art/Hazards/sandstorm3.png');
}

function createSandstorm(x, y, lifetime) {
   console.log('createSanstorm called with args' + arguments);
   main_storm = game.add.sprite(x, y, 'Sandstorm1');
   main_storm.lifespan = lifetime;
   main_storm.anchor.setTo(0.5, 0.5);
   main_storm.update = function() {
      this.angle += 0.5;
      if (AABBoverlap(this, player)) {
         HP -= 0.1;
         //console.log('sandstorm hurt rover');
      }
   }
   main_storm.sandstorm2 = game.add.sprite(x, y, 'Sandstorm2');
   main_storm.sandstorm2.lifespan = lifetime;
   main_storm.sandstorm2.anchor.setTo(0.5, 0.5);
   main_storm.sandstorm2.update = function() {
      this.angle -= 0.7;
      /*if (AABBoverlap(this, player)) {
         rover_health -= 0.2;
         //console.log('sandstorm hurt rover');
      }*/
   }
   main_storm.sandstorm3 = game.add.sprite(x, y, 'Sandstorm3');
   main_storm.sandstorm3.lifespan = lifetime;
   main_storm.sandstorm3.anchor.setTo(0.5, 0.5);
   main_storm.sandstorm3.update = function() {
      this.angle += 0.8;
      /*if (AABBoverlap(this, player)) {
         rover_health -= 0.2;
         console.log('sandstorm hurt rover');
      }*/
   }
   return main_storm;
}

function sandstormSpawner() {
   console.log('sandstormSpawner called');
   createSandstorm(Math.random() * 9600, Math.random() * 9600, Phaser.Timer.SECOND * 30);
}

function AABBoverlap(sprite1, sprite2) {
   return Phaser.Rectangle.intersects(
       sprite1.getBounds(), sprite2.getBounds());
}
