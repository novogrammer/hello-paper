import paper from "paper";


interface FrameEvent{
  delta:number;
  time:number;
  count:number;
}

class Agent{
  position:paper.Point;
  velocity:paper.Point;
  constructor(position:paper.Point){
    this.position=position;
    this.velocity=new paper.Point(0,0);
  }
  update(delta:number){
    this.velocity=this.velocity.add({
      x:(Math.random()-0.5)*2*100,
      y:(Math.random()-0.5)*2*100,
    })
    this.position=this.position.add(this.velocity.multiply(delta));
    if(this.position.x<0){
      this.position.x=0;
      if(this.velocity.x<0){
        this.velocity.x=0;
      }
    }
    if(this.position.y<0){
      this.position.y=0;
      if(this.velocity.y<0){
        this.velocity.y=0;
      }
    }
    if(400<this.position.x){
      this.position.x=400;
      if(0<this.velocity.x){
        this.velocity.x=0;
      }
    }
    if(400<this.position.y){
      this.position.y=400;
      if(0<this.velocity.y){
        this.velocity.y=0;
      }
    }
    
  }
}

export default class ProjectC extends paper.Project{
  agentList:Agent[];
  pathList:paper.Path[];
  constructor(element: string | HTMLCanvasElement | paper.SizeLike){
    super(element);
    
    
    const layer=new paper.Layer({
      applyMatrix:false,
    });
    this.addLayer(layer);

    const rect = new paper.Path.Rectangle({
      point: [0, 0],
      size: [this.view.size.width, this.view.size.height],
      strokeWidth: 0,
      fillColor: 'black',
    });
    rect.sendToBack();

    const colors=[
      new paper.Color("#ff0000"),
      new paper.Color("#00ff00"),
      new paper.Color("#0000ff"),
    ];
    this.agentList=[];
    this.pathList=[];
    for(let i=0;i<colors.length;i++){
      const color=colors[i];
      const agent=new Agent(new paper.Point(200,200));
      this.agentList.push(agent);
      const path=new paper.Path({
        strokeWidth:10,
        strokeColor: color,
        blendMode:"screen",
      });
      this.pathList.push(path);
      layer.addChild(path);
    }

    this.view.onFrame=(event:FrameEvent)=>{
      for(let i=0;i<this.agentList.length&&i<this.pathList.length;i++){
        const agent=this.agentList[i];
        const path=this.pathList[i];
        
        agent.update(event.delta);
        path.add(agent.position);
        // console.log(path);
      }
      // console.log(event);
    }
  }
}



