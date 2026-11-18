class level3 extends Phaser.Scene {

    constructor() {
        super({ key: 'level3' });
        
        // Put global variable here
    }


 init(data) {
    this.playerpos = data.playerpos;
  }

    preload() {

         this.load.tilemapTiledJSON("level3", "assets/level-3.tmj");

this.load.image("furniture03","assets/furnitureTiles3.png");
    this.load.image("interior03","assets/interiorTiles3.png");
    this.load.image("grocery03","assets/groceryTiles3.png");

              //character
    this.load.spritesheet('en', 'assets/en.png',
                            { frameWidth:32, frameHeight:32 });
    this.load.spritesheet('en-flipped', 'assets/enflipped.png',
                            { frameWidth:32, frameHeight:32 });

     this.load.spritesheet('fish', 'assets/fish.png',{ frameWidth:32, frameHeight:32 });

         //enemy
    this.load.spritesheet("fisher", "assets/fisher.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("fisher-flipped", "assets/fisherflipped.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio("collectItem","assets/collectitempop.mp3");

            this.load.audio("angrymusic","assets/angrymusic.mp3");
            
    }



    create() {
        console.log('*** level3 scene');
         let map = this.make.tilemap({ key: "level3" });

         let level3Tiles1 = map.addTilesetImage("furniture3", "furniture03");
    let level3Tiles2 = map.addTilesetImage("grocery3", "grocery03");
    let level3Tiles3 = map.addTilesetImage("interior3", "interior03");

    let tilesArray = [level3Tiles1, level3Tiles2,level3Tiles3];


        //level3
    this.groundLayer = map.createLayer("groundLayer", tilesArray, 0, 0);
    this.furnitureLayer = map.createLayer("furnitureLayer", tilesArray, 0, 0);
    this.itemLayer = map.createLayer("itemLayer", tilesArray, 0, 0);
    this.itemLayer2 = map.createLayer("itemLayer2", tilesArray, 0, 0);
    this.pipingLayer = map.createLayer("pipingLayer", tilesArray, 0, 0);

this.anims.create({
        key:'en-up',
        frames:this.anims.generateFrameNumbers('en',
        { start:86, end:89 }),
        frameRate:5,
        repeat:-1
    });

    this.anims.create({
        key:'en-left',
        frames:this.anims.generateFrameNumbers('en-flipped',
        { start:93, end:96 }),
        frameRate:5,
        repeat:-1
    });

    this.anims.create({
        key:'en-down',
        frames:this.anims.generateFrameNumbers('en',
        { start:70, end:73 }),
        frameRate:5,
        repeat:-1
    });

    this.anims.create({
        key:'en-right',
        frames:this.anims.generateFrameNumbers('en',
        { start:78, end:81 }),
        frameRate:5,
        repeat:-1
    });
    
    this.anims.create({
        key:'fishmove',
        frames:this.anims.generateFrameNumbers('fish',
        { start:0, end:1 }),
        frameRate:5,
        repeat:-1
    });

    // enemy animations - same frame layout as the player sheet
    this.anims.create({
      key: "fisher-down",
      frames: this.anims.generateFrameNumbers("fisher", {
        start: 70,
        end: 73,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "fisher-up",
      frames: this.anims.generateFrameNumbers("fisher", {
        start: 86,
        end: 89,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "fisher-right",
      frames: this.anims.generateFrameNumbers("fisher", {
        start: 74,
        end: 81,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "fisher-left",
      frames: this.anims.generateFrameNumbers("fisher-flipped", {
        start: 93,
        end: 99,
      }),
      frameRate: 5,
      repeat: -1,
    });

       this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

           let fish = map.findObject("ObjectLayer",(obj) => obj.name === "fish");
      this.fish=this.physics.add.sprite(fish.x, fish.y, "fish").play("fishmove")

  
        this.player = this.physics.add.sprite(this.playerpos.x, this.playerpos.y, "en");

    // Enable debugging
    window.player = this.player;

    this.player.setCollideWorldBounds(true); // don't go out of the this.map

    // create the arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

 		// camera follow player
    this.cameras.main.startFollow(this.player);


    this.furnitureLayer.setCollisionByExclusion(-1, true);
    this.itemLayer.setCollisionByExclusion(-1, true);

    this.physics.add.collider(this.player, this.furnitureLayer);
    this.physics.add.collider(this.player, this.itemLayer);

    // enemy from Tiled "ObjectLayer" -> object named "enemy"
    let enemyObj = map.findObject("ObjectLayer", (obj) => obj.name === "enemy");
    if (enemyObj) {
      this.enemy = this.physics.add.sprite(enemyObj.x, enemyObj.y, "fisher");
      this.enemy.setCollideWorldBounds(true);
      this.physics.add.collider(this.enemy, this.furnitureLayer);
      this.physics.add.collider(this.enemy, this.itemLayer);
      this.physics.add.collider(this.player, this.enemy);

      // hitboxes shown while physics debug is on
      this.enemy.body.setSize(26, 26).setOffset(3, 6);

      // becomes true after the item is collected, then the enemy chases
      this.enemyChase = false;
    }

            // fish to world
    let fishex = map.findObject(
      "ObjectLayer",
      (obj) => obj.name === "fishex",
    );
    if (fishex) {
      let exitZone = this.add
        .zone(fishex.x, fishex.y)
        .setSize(fishex.width, fishex.height)
        .setOrigin(0);
      this.physics.world.enable(exitZone);
      exitZone.body.setAllowGravity(false);
      exitZone.body.moves = false;
      this.physics.add.overlap(
        this.player,
        exitZone,
        this.goToWorld3,
        null,
        this,
      );
    }

  this.physics.add.overlap(this.player, this.fish, this.collectItem, null, this);
  
      this.collectFishsnd = this.sound.add("collectItem").setVolume(1.5);
        
    }

        


    update() {
if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-200);
      this.player.anims.play("en-left", true); // walk left
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(200);
      this.player.anims.play("en-right", true);
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-200);
      this.player.anims.play("en-up", true);
      //console.log('up');
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(200);
      this.player.anims.play("en-down", true);
      //console.log('down');
    } else {
      this.player.anims.stop();
      this.player.body.setVelocity(0, 0);
    }

    // enemy chases the player once the item has been collected
    if (this.enemyChase && this.enemy) {
      let distance = Phaser.Math.Distance.Between(
        this.enemy.x,
        this.enemy.y,
        this.player.x,
        this.player.y,
      );
      if (distance > 40) {
        this.physics.moveToObject(this.enemy, this.player, 200);

        // face the direction the enemy is walking
        let vx = this.enemy.body.velocity.x;
        let vy = this.enemy.body.velocity.y;
        if (Math.abs(vx) > Math.abs(vy)) {
          this.enemy.anims.play(vx > 0 ? "fisher-right" : "fisher-left", true);
        } else {
          this.enemy.anims.play(vy > 0 ? "fisher-down" : "fisher-up", true);
        }
      } else {
        this.enemy.anims.stop();
        this.enemy.body.setVelocity(0, 0);
      }
    }

    }

      goToWorld3(player, tile) {
    console.log("goToWorld3");
    let playerpos = {};
    playerpos.x = 687;
    playerpos.y = 670;


    // chase music ends here; world.js brings the background music back
    if (this.angryMusic) {
      this.angryMusic.stop();
      this.angryMusic.destroy();
      this.angryMusic = null;
    }

    this.scene.start("world", { playerpos: playerpos });
  }

   collectItem(player, item){
      console.log("collectFish");
      
			// play a sound
      this.collectFishsnd.play();
   

      // disable enemy body
      // start chasing the player now that the item is collected
      this.enemyChase = true;

      // remember this item so home.js can tell when everything is collected
      this.registry.set("fishCollected", true);

      // angry music takes over the background music while being chased
      let bgm = this.sound.get("bgm");
      if (bgm) bgm.pause();

      this.angryMusic = this.sound.add("angrymusic", {
        loop: true,
        volume: 1.5,
      });
      this.angryMusic.play();

      item.disableBody (true, true);
   }

}
    

