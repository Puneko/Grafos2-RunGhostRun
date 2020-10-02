class Ministage {
    constructor(scene, stage_name, tileset='labTile') {
		this.scene = scene;
        this.create();
        this.tileset = this.map.addTilesetImage(tileset);
        this.layer = this.map.createStaticLayer('layer', tileset, 0, 0);
        
        console.log("Grid",this.map)
        

		//this.stage_info = stages_info.get(stage_name);
		//this.player_spawn_point = this.stage_info.player_spawn_point;
	
		//this.end_area = this.stage_info.end_area;

        //this.wall_layer.setCollisionByExclusion([-1]);
        

    }
    setPlayer(player){
        
        this.scene.physics.add.collider(player.entity, this.layer);
        this.layer.setCollision(1);
    }
    
    create(){
        var maze = new Maze(45,80);
        var level = maze.prim();
        var config = {
            data: level,  // [ [], [], ... ]
            tileWidth: 16,
            tileHeight: 16,
            width: 80,
            height: 45
        }
         this.map = this.scene.make.tilemap(config);
        console.log("Map",this.map);
    }
}