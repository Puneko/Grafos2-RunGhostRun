var Mazeplayer;
class MazePlayer  {
    constructor(scene,x = 0, y= 0)
    {
        this.entity = scene.physics.add.sprite(x, y, 'ghost').setScale(0.3);
		this.entity.setCollideWorldBounds(true);
        this.entity.body.setAllowGravity(false);
        this.isAlive = true;
		
		this.scene = scene;
        this.speed = 100;
        this.last_trigger;
        this.cursors = scene.input.keyboard.createCursorKeys();
        Mazeplayer = this;
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

    update() {
       
        if (this.cursors.left.isDown)
        {
            this.entity.setVelocityX(-160);
        
            this.entity.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.entity.setVelocityX(160);
        
            this.entity.anims.play('right', true);
        } 
        else if (this.cursors.up.isDown)
        {
            this.entity.setVelocityY(-160);
            this.entity.anims.play('right', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.entity.setVelocityY(160);
            this.entity.anims.play('left', true);
        } else {
            this.entity.anims.play('stop', true);
            this.entity.setVelocityX(0);
            this.entity.setVelocityY(0);
        }
	}
}