const IN = 3;
const FRONTIER = 2;
const nodeC = {
    x: 1,
    
}
class Prim {
    constructor(height, width){
        this.height = height;
        this.width = width;
        this.grid = new Array(this.height).fill(new Array(this.width).fill(1));
        this.frontier = [];
    }

    add_frontier(x,y){
        var node = {
            x: -1,
            y: -1
        }
        if(x >= 0 && y >= 0 && y < this.grid.length && x < this.grid[y].length && this.grid[y][x] == 1){
            //this.grid[y][x] = FRONTIER;
            node.x = x;
            node.y = y;
            this.frontier.push(node);
        }

    }

    mark(x,y){
        this.grid[y][x] = IN;
        console.log("mark",this.grid)
        this.add_frontier(x-1, y);
        this.add_frontier(x+1, y);
        this.add_frontier(x, y-1);
        this.add_frontier(x, y+1);
    }

    neighbors(x,y){
        console.log("x",x);
        console.log("y",y);
        console.log("BRUH",this.grid)
        var n = [];
        var node = {
            x: -1,
            y: -1
        } 
        if(x > 0 && this.grid[y][x-1] & IN != 0){
            node.x = x-1;
            node.y = y;
            n.push(node);
        }
        if (x+1 < this.grid[y].length && this.grid[y][x+1] & IN != 0){
            node.x = x+1;
            node.y = y;
            n.push(node);
        }
        if (y > 0 && this.grid[y-1][x] & IN != 0){
            node.x = x;
            node.y = y-1; 
            n.push(node);
        }
        if (y+1 < this.grid.length && this.grid[y+1][x] & IN != 0){
            node.x = x;
            node.y = y+1;
            n.push(node);
        }
        return n;
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    deleteFrontier(index){
        var node = {
            x: -1,
            y: -1
        }
        node.x = this.frontier[index].x;
        node.y = this.frontier[index].y;
        this.frontier.splice(index);
        return node;
    }
    

    prim(){
        console.log("Init Prim",this.grid);
        
        this.mark(this.getRandomInt(0,this.width),this.getRandomInt(0,this.height))
        console.log("Yeet",this.grid)
        while(this.frontier.length){
            var nodeN = {
                x: -1,
                y: -1
            }
            var node = this.deleteFrontier(this.getRandomInt(0,this.frontier.length))
            var n = this.neighbors(node.x,node.y);
            nodeN.x = n[this.getRandomInt(0,n.length)].x;
            nodeN.y = n[this.getRandomInt(0,n.length)].y;
            this.mark(node.x,node.y);
            this.grid[node.y][node.x] = 5;
            this.grid[nodeN.y][nodeN.x] = 5;

            
        }
        console.log("Finished Prim",this.grid)

    }

}