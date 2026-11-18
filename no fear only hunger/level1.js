class level1 extends Phaser.Scene {
  constructor() {
    super({ key: "level1" });

    // Put global variable here
  }

  init(data) {
    this.playerpos = data.playerpos;
  }

  preload() {
    this.load.tilemapTiledJSON("level1", "assets/level-1.tmj");

    this.load.image("furniture01", "assets/furnitureTiles1.png");
    this.load.image("interior01", "assets/interiorTiles1.png");
    this.load.image("grocery01", "assets/groceryTiles1.png");


    //character
    this.load.spritesheet("en", "assets/en.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("en-flipped", "assets/enflipped.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('fruit', 'assets/apple.png',{ frameWidth:32, frameHeight:32 });

    
    //enemy
    this.load.spritesheet("fruitseller", "assets/fruitsell.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("fruitseller-flipped", "assets/fruitsellflipped.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio("collectItem","assets/collectitempop.mp3");

        this.load.audio("angrymusic","assets/angrymusic.mp3");
  }
  

  create() {
    console.log("*** level1 scene");

    let map = this.make.tilemap({ key: "level1" });

    let level1Tiles1 = map.addTilesetImage("furniture", "furniture01");
    let level1Tiles2 = map.addTilesetImage("grocery", "grocery01");
    let level1Tiles3 = map.addTilesetImage("interior", "interior01");

    let tilesArray = [level1Tiles1, level1Tiles2, level1Tiles3];

    //level1
    this.groundLayer = map.createLayer("groundLayer", tilesArray, 0, 0);
    this.furnitureLayer2 = map.createLayer("furnitureLayer2", tilesArray, 0, 0);
    this.furnitureLayer = map.createLayer("furnitureLayer", tilesArray, 0, 0);
    this.itemLayer = map.createLayer("itemLayer", tilesArray, 0, 0);
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
        key:"applemove",
        frames:this.anims.generateFrameNumbers('fruit',
        { start:0, end:1 }),
        frameRate:10,
        repeat:-1
    });

    // enemy animations - same frame layout as the player sheet
    this.anims.create({
      key: "seller-down",
      frames: this.anims.generateFrameNumbers("fruitseller", {
        start: 70,
        end: 73,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "seller-up",
      frames: this.anims.generateFrameNumbers("fruitseller", {
        start: 86,
        end: 89,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "seller-right",
      frames: this.anims.generateFrameNumbers("fruitseller", {
        start: 74,
        end: 81,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "seller-left",
      frames: this.anims.generateFrameNumbers("fruitseller-flipped", {
        start: 93,
        end: 99,
      }),
      frameRate: 5,
      repeat: -1,
    });

   let fruit = map.findObject("ObjectLayer",(obj) => obj.name === "fruit");

   this.fruit=this.physics.add.sprite(fruit.x, fruit.y, "fruit").play("applemove")

    //this.player = this.physics.add.sprite(200, 200, "en");

    this.player = this.physics.add.sprite(
      this.playerpos.x,
      this.playerpos.y,
      "en",
    );

    // Enable debugging
    window.player = this.player;

    this.player.setCollideWorldBounds(true); // don't go out of the this.map

    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // create the arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();



    this.furnitureLayer.setCollisionByExclusion(-1, true);
    this.itemLayer.setCollisionByExclusion(-1, true);

    this.physics.add.collider(this.player, this.furnitureLayer);
    this.physics.add.collider(this.player, this.itemLayer);

    // enemy from Tiled "ObjectLayer" -> object named "enemy"
    let enemyObj = map.findObject("ObjectLayer", (obj) => obj.name === "enemy");
    if (enemyObj) {
      this.enemy = this.physics.add.sprite(enemyObj.x, enemyObj.y, "fruitseller");
      this.enemy.setCollideWorldBounds(true);
      this.physics.add.collider(this.enemy, this.furnitureLayer);
      this.physics.add.collider(this.enemy, this.itemLayer);
      this.physics.add.collider(this.player, this.enemy);

      // hitboxes shown while physics debug is on
      this.enemy.body.setSize(26, 26).setOffset(3, 6);

      // becomes true after the item is collected, then the enemy chases
      this.enemyChase = false;
    }

     		// camera follow player
    this.cameras.main.startFollow(this.player);


    // fruit to world
    let fruitex = map.findObject(
      "ObjectLayer",
      (obj) => obj.name === "fruitex",
    );
    if (fruitex) {
      let exitZone = this.add
        .zone(fruitex.x, fruitex.y)
        .setSize(fruitex.width, fruitex.height)
        .setOrigin(0);
      this.physics.world.enable(exitZone);
      exitZone.body.setAllowGravity(false);
      exitZone.body.moves = false;
      this.physics.add.overlap(
        this.player,
        exitZone,
        this.goToWorld1,
        null,
        this,
      );
    }

          this.physics.add.overlap(this.player, this.fruit, this.collectItem, null, this);

          this.collectFruitsnd = this.sound.add("collectItem").setVolume(1.5);
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
          this.enemy.anims.play(vx > 0 ? "seller-right" : "seller-left", true);
        } else {
          this.enemy.anims.play(vy > 0 ? "seller-down" : "seller-up", true);
        }
      } else {
        this.enemy.anims.stop();
        this.enemy.body.setVelocity(0, 0);
      }
    }
  } /////////////////// end of update //////////////////////////////

  goToWorld1(player, tile) {
    console.log("goToWorld1");
    let playerpos = {};
    playerpos.x = 746;
    playerpos.y = 272;
    // chase music ends here; world.js brings the background music back
    if (this.angryMusic) {
      this.angryMusic.stop();
      this.angryMusic.destroy();
      this.angryMusic = null;
    }

    this.scene.start("world", { playerpos: playerpos });
  }

     collectItem(player, item){
      console.log("collectFruit");
      
			// play a sound
      this.collectFruitsnd.play();

 

      // disable enemy body
      // start chasing the player now that the item is collected
      this.enemyChase = true;

      // remember this item so home.js can tell when everything is collected
      this.registry.set("fruitCollected", true);

      // angry music takes over the background music while being chased
      let bgm = this.sound.get("bgm");
      if (bgm) bgm.pause();

      this.angryMusic = this.sound.add("angrymusic", {
        loop: true,
        volume: 1,
      });
      this.angryMusic.play();

      item.disableBody (true, true);
   }

}

