class home extends Phaser.Scene {

    constructor() {
        super({ key: 'home' });
        
        // Put global variable here
    }


    init(data) {
        this.playerpos = data.playerpos

    }

    preload() {

    this.load.tilemapTiledJSON("home", "assets/home.tmj");

    this.load.image("furniture04","assets/furnitureTiles4.png");
    this.load.image("interior04","assets/interiorTiles4.png");
    this.load.image("room04","assets/roomTiles4.png");

    //character
    this.load.spritesheet('en', 'assets/en.png',
                            { frameWidth:32, frameHeight:32 });
    this.load.spritesheet('en-flipped', 'assets/enflipped.png',
                            { frameWidth:32, frameHeight:32 });

    // win screen
    this.load.image("winscreen", "assets/winscreen.png");

    
  //this.input.once('pointerdown', function(){
        



    }

    create() {
        console.log('*** home scene');

           let map = this.make.tilemap({ key: "home" });

    let homeTiles1 = map.addTilesetImage("furniture4", "furniture04");
    let homeTiles2 = map.addTilesetImage("interior4", "interior04");
    let homeTiles3 = map.addTilesetImage("room4", "room04");

        let tilesArray = [homeTiles1, homeTiles2, homeTiles3];


    //home
    this.groundLayer = map.createLayer("groundLayer", tilesArray, 0, 0);
    this.furnitureLayer = map.createLayer("furnitureLayer", tilesArray, 0, 0);
    this.itemLayer = map.createLayer("itemLayer", tilesArray, 0, 0);

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



        this.player = this.physics.add.sprite(this.playerpos.x, this.playerpos.y, "en");

         // Enable debugging
    window.player = this.player;

    this.player.setCollideWorldBounds(true); // don't go out of the this.map

        this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // create the arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

 		// camera follow player
    this.cameras.main.startFollow(this.player);

        this.furnitureLayer.setCollisionByExclusion(-1, true)

    
        this.physics.add.collider(this.player, this.furnitureLayer);

          // homeexit to world
        let homeexit = map.findObject("Object Layer 1", (obj) => obj.name === "homeexit");
        if (homeexit) {
            let exitZone = this.add.zone(homeexit.x, homeexit.y).setSize(homeexit.width, homeexit.height).setOrigin(0);
            this.physics.world.enable(exitZone);
            exitZone.body.setAllowGravity(false);
            exitZone.body.moves = false;
            this.physics.add.overlap(this.player, exitZone, this.goToWorld, null, this);
        }

        // all three items collected -> show the win screen
        let won =
            this.registry.get("fruitCollected") &&s
            this.registry.get("breadCollected") &&
            this.registry.get("fishCollected");

        if (won) {
            this.add.image(320, 320, "winscreen").setScale(4).setDepth(100);
            this.winShown = true;
        }




        
    }

    update() {
        // freeze the player while the win screen is showing
        if (this.winShown) {
            this.player.body.setVelocity(0, 0);
            return;
        }

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
  }


    
         // Function to jump to room1
           goToWorld(player, tile) {
    console.log("goToWorld");

;
    let playerpos = {}
    playerpos.x = 220
    playerpos.y = 880
    this.scene.start("world",  { playerpos: playerpos })
  }
  }




