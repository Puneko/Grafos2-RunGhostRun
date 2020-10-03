class Ministage {
    constructor(scene, stage_name, tileset='labTile',height,width) {
        this.height = height;
        this.width = width;
		this.scene = scene;
        this.create();
        this.cherry = scene.add.sprite(((this.width-1)*16)+8, 8, 'cherry').setScale(0.5);
        this.scene.physics.add.staticGroup(this.cherry);
        this.scene.physics.add.collider(this.cherry, this.layer);
        this.tileset = this.map.addTilesetImage(tileset);
        this.layer = this.map.createStaticLayer('layer', tileset, 0, 0);
        

    }
    setPlayer(player){
        
        this.scene.physics.add.collider(player.entity, this.layer);
        this.layer.setCollision(0);
        this.scene.physics.add.collider(player.entity, this.cherry, ()=>{
            playerCount += 1;
            this.scene.events.once('postupdate', () => {
                game.scene.start('stage_1');
                game.scene.stop('maze_stage');
            });
            
            
        });
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