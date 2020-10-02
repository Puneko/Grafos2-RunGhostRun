const _WALL = 1;
const _PATH = 0;

class Maze {
    constructor(height, width){
        this.height = height;
        this.width = width;
        this.grid = [];
    }

    prim(){
        for(let i = 0; i < this.height; i++){
            this.grid.push([]);
            for(let j = 0; j < this.width; j++)
              this.grid[i][j] = _WALL;
          }
        
        let cell = {x:Math.floor(Math.random()*this.height), y:Math.floor(Math.random()*this.width)};
        
        this.grid[cell.x][cell.y] = _PATH;
        let walls = [];
        if(cell.x+1 < this.height)  walls.push({x:cell.x+1, y:cell.y});
        if(cell.x-1 >= 0)     walls.push({x:cell.x-1, y:cell.y});
        if(cell.y+1 < this.width)  walls.push({x:cell.x, y:cell.y+1});
        if(cell.y-1 >= 0)     walls.push({x:cell.x, y:cell.y-1});
        while(walls.length > 0){
          let wallIndex = Math.floor(Math.random() * walls.length);
          let wall = walls[wallIndex];
        
          let uc = []; 
          if(wall.x+1 < this.height && this.grid[wall.x+1][wall.y] === _PATH) uc.push({x:wall.x-1, y:wall.y});
          if(wall.x-1 >= 0 	&& this.grid[wall.x-1][wall.y] === _PATH) uc.push({x:wall.x+1, y:wall.y});
          if(wall.y+1 < this.width && this.grid[wall.x][wall.y+1] === _PATH) uc.push({x:wall.x, y:wall.y-1});
          if(wall.y-1 >= 0 	&& this.grid[wall.x][wall.y-1] === _PATH) uc.push({x:wall.x, y:wall.y+1});
        
          if(uc.length === 1){
        
            this.grid[wall.x][wall.y] = _PATH;
            if(uc[0].x >=0 && uc[0].x <this.height && uc[0].y >=0 && uc[0].y<this.width){
              this.grid[uc[0].x][uc[0].y] = _PATH;
        
              if(uc[0].x+1 < this.height  && this.grid[uc[0].x+1][uc[0].y] === _WALL) walls.push({x:uc[0].x+1, y:uc[0].y});
              if(uc[0].x-1 >= 0     && this.grid[uc[0].x-1][uc[0].y] === _WALL) walls.push({x:uc[0].x-1, y:uc[0].y});
              if(uc[0].y+1 < this.width  && this.grid[uc[0].x][uc[0].y+1] === _WALL) walls.push({x:uc[0].x, y:uc[0].y+1});
              if(uc[0].y-1 >= 0     && this.grid[uc[0].x][uc[0].y-1] === _WALL) walls.push({x:uc[0].x, y:uc[0].y-1});
              }
            }
        
          walls.splice(wallIndex, 1);
        }
        console.table(this.grid)
       return this.grid;
    }

}