class world extends Phaser.Scene {
  constructor() {
    super("world");
  }

  // incoming data from scene below
  init(data) {
        this.playerpos = data.playerpos

  }

  preload() {
    // Step 1, load JSON
    this.load.tilemapTiledJSON("map","assets/map.tmj");


    //character
    this.load.spritesheet('en', 'assets/en.png',
                            { frameWidth:32, frameHeight:32 });
    this.load.spritesheet('en-flipped', 'assets/enflipped.png',
                            { frameWidth:32, frameHeight:32 });


    // this.load.image("road", "assets/road.png");

    //map
    this.load.image("map","assets/mapTiles.png");
   


  }

  create() {
    //console.log("*** world scene");

    // bring the background music back after leaving a level
    let bgm = this.sound.get("bgm");
    if (bgm && !bgm.isPlaying) {
      if (bgm.isPaused) {
        bgm.resume();
      } else {
        bgm.play();
      }
    }

    //Step 3 - Create the map from main
    let map = this.make.tilemap({key:'map'}); 

    // Step 4 Load the game tiles
    // 1st parameter is name in Tiled,
    // 2nd parameter is key in Preload\
    //map
    let fullmapTiles = map.addTilesetImage("map5", "map");



    let tilesArray = [ fullmapTiles]
    
    // Step 5  Load in layers by layers 



    //map
    this.groundLayer = map.createLayer("groundLayer", tilesArray, 0, 0);
    this.buildingLayer2 = map.createLayer("buildingLayer2", tilesArray, 0, 0);
    this.itemLayer = map.createLayer("itemLayer", tilesArray, 0, 0);
    this.buildingLayer = map.createLayer("buildingLayer", tilesArray, 0, 0);
    this.itemLayer2 = map.createLayer("itemLayer2", tilesArray, 0, 0);







      

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



    this.player = this.physics.add.sprite(this.playerpos.x,this.playerpos.y, 'en');

    this.player.setCollideWorldBounds(true); // don't go out of the this.map

         // Enable debugging
    window.player = this.player;

        this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // create the arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

 		// camera follow player
    this.cameras.main.startFollow(this.player);
    // Prevent black area of edge of the map
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
        if (this.buildingLayer) {
       this.buildingLayer.setCollisionByExclusion(-1, true)
       this.physics.add.collider(this.player, this.buildingLayer);
     }
     if (this.itemLayer) {
       this.itemLayer.setCollisionByExclusion(-1, true)
       this.physics.add.collider(this.player, this.itemLayer);
     }

  // world to home
  let homeentrance = map.findObject("Object Layer 1", (obj) => obj.name === "homeentrance");
  if (homeentrance) {
      let exitZone = this.add.zone(homeentrance.x, homeentrance.y).setSize(homeentrance.width, homeentrance.height).setOrigin(0);
      this.physics.world.enable(exitZone);
      exitZone.body.setAllowGravity(false);
      exitZone.body.moves = false;
      this.physics.add.overlap(this.player, exitZone, this.goToHome, null, this);
    }

    // world to fruit
  let fruitent = map.findObject("Object Layer 1", (obj) => obj.name === "fruitent");
  if (fruitent) {
      let exitZone = this.add.zone(fruitent.x, fruitent.y).setSize(fruitent.width, fruitent.height).setOrigin(0);
      this.physics.world.enable(exitZone);
      exitZone.body.setAllowGravity(false);
      exitZone.body.moves = false;
      this.physics.add.overlap(this.player, exitZone, this.goToLevel1, null, this);
    }

        // world to bakery
  let bakeryent = map.findObject("Object Layer 1", (obj) => obj.name === "bakeryent");
  if (bakeryent) {
      let exitZone = this.add.zone(bakeryent.x, bakeryent.y).setSize(bakeryent.width, bakeryent.height).setOrigin(0);
      this.physics.world.enable(exitZone);
      exitZone.body.setAllowGravity(false);
      exitZone.body.moves = false;
      this.physics.add.overlap(this.player, exitZone, this.goToLevel2, null, this);
    }

        // world to fish
  let fishent = map.findObject("Object Layer 1", (obj) => obj.name === "fishent");
  if (fishent) {
      let exitZone = this.add.zone(fishent.x, fishent.y).setSize(fishent.width, fishent.height).setOrigin(0);
      this.physics.world.enable(exitZone);
      exitZone.body.setAllowGravity(false);
      exitZone.body.moves = false;
      this.physics.add.overlap(this.player, exitZone, this.goToLevel3, null, this);
    }






  } /////////////////// end of create //////////////////////////////

  update() {

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-200);
      this.player.anims.play("en-left", true); // walk left
    } 
    else if (this.cursors.right.isDown) {
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
  } /////////////////// end of update //////////////////////////////


    goToHome(player, tile) {
    console.log("goToHome");
    let playerpos = {}
    playerpos.x = 115
    playerpos.y = 240
    this.scene.start("home",  { playerpos: playerpos })
  }

  goToLevel1(player, tile) {
    console.log("goToLevel1");
    let playerpos = {}
    playerpos.x = 304
    playerpos.y = 507
    this.scene.start("level1",  { playerpos: playerpos })
  }

    goToLevel2(player, tile) {
    console.log("goToLevel2");
    let playerpos = {}
    playerpos.x = 191
    playerpos.y = 549
    this.scene.start("level2",  { playerpos: playerpos })
  }

    goToLevel3(player, tile) {
    console.log("goToLevel3");
    let playerpos = {}
    playerpos.x = 203
    playerpos.y = 447
    this.scene.start("level3",  { playerpos: playerpos })
  }

  }
