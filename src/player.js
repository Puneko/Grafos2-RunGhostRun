var player;
class Player {
	constructor(scene, x = 0, y = 0) {
        this.isAlive = true;
		this.entity = scene.physics.add.sprite(x, y, 'ghost');
		this.entity.setCollideWorldBounds(true);
        this.entity.setGravityY(300);
		this.scene = scene;
        this.speed = 100;
        this.cursors = scene.input.keyboard.createCursorKeys();
        player = this;
        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('ghost', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('ghost', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'stop',
            frames: [ { key: 'ghost', frame: 0 } ],
            frameRate: 10,
        });
	}

    kill(){
        this.isAlive = false;
        this.entity.destroy();
    }

	update() {[]
        if(!this.isAlive)
            return
        if (this.cursors.left.isDown)
        {
            this.entity.setVelocityX(-160);
        
            this.entity.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.entity.setVelocityX(160);
        
            this.entity.anims.play('right', true);
        } else {
            this.entity.anims.play('stop', true);
            this.entity.setVelocityX(0);
        }
        
        if (this.cursors.up.isDown && this.entity.body.blocked.down)
        {
            
            this.entity.setVelocityY(-400);
        }
	}
}