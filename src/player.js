class Player {
	constructor(scene, x = 0, y = 0) {
		this.entity = scene.physics.add.sprite(x, y, 'ghost');
		this.entity.setCollideWorldBounds(true);
        this.entity.setGravityY(300);
		this.scene = scene;
        this.speed = 100;
        this.cursors = scene.input.keyboard.createCursorKeys();

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('ghost', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('ghost', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

	}


	update() {
        if (this.cursors.left.isDown)
        {
            this.entity.setVelocityX(-160);
        
            scene.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.entity.setVelocityX(160);
        
            scene.anims.play('right', true);
        }
        else
        {
            this.entity.setVelocityX(0);
        }
        
        if (this.cursors.up.isDown && this.entity.touching.down)
        {
            scene.setVelocityY(-500);
        }
	}
}