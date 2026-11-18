class preload extends Phaser.Scene {
  constructor() {
    super("preload");

    // Put global variable here
  }

  preload() {
    
    this.load.audio("bgm","assets/mapbgm.mp3");
  this.load.audio("angrymusic","assets/angrymusic.mp3");
  this.load.image("menu","assets/titlescreen.png");
  this.load.font("yuyu", "assets/yuyu.ttf", "truetype");

  }

  create() {
    console.log("*** preload scene");

     this.add.image(320, 320, "menu").setDisplaySize(640, 640);   // new

    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");

    // On spacebar event, call the world scene
    spaceDown.on(
      "down",
      function () {
        console.log("Jump to home scene");
        
        let playerpos = {};
        playerpos.x = 144;
        playerpos.y = 112;
            this.scene.start("home",  { playerpos: playerpos })

      },
      this,
    );

    // Add any text in the main page
    this.add.text(90, 600, "Press spacebar to continue", {
      fontFamily: "yuyu",
      fontSize: "30px",
      fill: "#000000",
    });

    // 48 = 0, 49 = 1, ...
    let key0 = this.input.keyboard.addKey(48);
    let key1 = this.input.keyboard.addKey(49);
    let key2 = this.input.keyboard.addKey(50);
    let key3 = this.input.keyboard.addKey(51);

    key0.on(
      "down",
      function () {
        this.scene.start("world");
      },
      this,
    );

    key1.on(
      "down",
      function () {
        this.scene.start("level1");
      },
      this,
    );

    key2.on(
      "down",
      function () {
        this.scene.start("level2");
      },
      this,
    );

    key3.on(
      "down",
      function () {
        this.scene.start("home");
      },
      this,
    );

    // use global music variable, turn on loop, adjust the volume
globalBgMusic = this.sound.add("bgm",{loop: true}).setVolume(1.5);

// start the background musicc
globalBgMusic.play();
  }
}
