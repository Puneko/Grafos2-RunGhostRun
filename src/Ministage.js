var YES = 500;
class Ministage {
    constructor(scene, stage_name, tileset='labTile',height,width,player) {
        this.height = height;
        this.width = width;
        this.scene = scene;
        this.player = player;
        this.create();
        
        this.cherry = scene.add.sprite(((this.width-1)*16)+8, 8, 'cherry').setScale(0.5);
        this.scene.physics.add.staticGroup(this.cherry);
        this.scene.physics.add.collider(this.cherry, this.layer);
        this.tileset = this.map.addTilesetImage(tileset);
        this.layer = this.map.createStaticLayer('layer', tileset, 0, 0);
        this.time = 10000+(Math.floor(playerCount)*5000);
        this.timer = this.scene.time.delayedCall(this.time, this.timeout, [], this);
        this.text = this.scene.add.text(400, 200);
        this.text.setScrollFactor(0);
        this.scene.anims.create({
            key: 'pac_waka',
            frames: scene.anims.generateFrameNumbers('pacman', { start: 0, end: 2 }),
            frameRate: 12,
            yoyo: true,
            repeat: -1
            
        });

    }
    setPlayer(){
        
        this.scene.physics.add.collider(this.player.entity, this.layer);
        this.layer.setCollision(0);
        this.scene.physics.add.collider(this.player.entity, this.cherry, ()=>{
            playerCount += 0.5;
            this.scene.events.once('postupdate', () => {
            this.scene.scene.restart('maze_stage');
                //game.scene.stop('maze_stage');
            })
        });

    }
    timeout(){
        this.vibeChecker = this.scene.physics.add.sprite(8,8,'pacman').setScale(0.4);
        this.scene.physics.add.collider(this.vibeChecker, this.player);
        this.vibeChecker.body.setAllowGravity(false);
        this.vibeChecker.anims.play('pac_waka', true);
        this.scene.physics.add.collider(this.vibeChecker, this.player.entity, () => {
			game.sound.stopAll()
			this.scene.events.once('postupdate', () => {
				game.scene.start('game_over');
				game.scene.stop(this.scene.scene.key);
			});
		});
        
    }
    update(){
        if(this.vibeChecker){
            this.vibeChecker.rotation = Phaser.Math.Angle.Between(this.vibeChecker.x, this.vibeChecker.y, this.player.entity.x, this.player.entity.y);
		    this.scene.physics.velocityFromRotation(this.vibeChecker.rotation, 500, this.vibeChecker.body.velocity);
        }
        this.text.setText('Time left: ' + parseInt(((this.time/1000) - this.timer.getElapsedSeconds())));
    }
    create(){
        var maze = new Maze(this.height,this.width);
        var level = maze.prim();
        var config = {
            data: level,  
            tileWidth: 16,
            tileHeight: 16,
            width: this.width,
            height: this.height
        }
         this.map = this.scene.make.tilemap(config);
    }
}