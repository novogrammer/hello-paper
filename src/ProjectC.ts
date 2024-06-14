import paper from "paper";


interface FrameEvent{
  delta:number;
  time:number;
  count:number;
}

class Agent{
  position:paper.Point;
  velocity:paper.Point;
  force:paper.Point;
  mass:number;
  constructor(position:paper.Point,velocity:paper.Point){
    this.position=position;
    this.velocity=velocity;
    this.force=new paper.Point(0,0);
    this.mass=0.2;
  }
  updateForce(agentList:Agent[]){
    this.force=new paper.Point(0,0);
    const g=30000;
    // 急激な変化を避けたい。
    const minLength=5;
    {
      const mCenter=60;
      const v=new paper.Point(200,200).subtract(this.position);
      
      const l=v.length;
      if(minLength<l){
        const f=g*mCenter*1/(l*l);
        const forceCenter=v.divide(l).multiply(f);
    
        this.force=this.force.add(forceCenter);
      }
    }
    for(let agent of agentList){
      if(this!=agent){
        const v=agent.position.subtract(this.position);
        const l=v.length;
        if(minLength<l){
          const f=g*this.mass*agent.mass/(l*l);
          const forceAgent=v.divide(l).multiply(f);
          this.force=this.force.add(forceAgent);
        }
      }
    }


  }
  updatePosition(delta:number){


    this.velocity=this.velocity.add(this.force.multiply(delta));
    // 速度を制限する
    this.velocity=this.velocity.normalize().multiply(Math.min(100000,this.velocity.length))

    // this.velocity.x=Math.max(-1000,this.velocity.x);
    // this.velocity.x=Math.min(1000,this.velocity.x);
    // this.velocity.y=Math.max(-1000,this.velocity.y);
    // this.velocity.y=Math.min(1000,this.velocity.y);

    this.position=this.position.add(this.velocity.multiply(delta));
    // if(this.position.x<0){
    //   this.position.x=0;
    //   if(this.velocity.x<0){
    //     this.velocity.x=0;
    //   }
    // }
    // if(this.position.y<0){
    //   this.position.y=0;
    //   if(this.velocity.y<0){
    //     this.velocity.y=0;
    //   }
    // }
    // if(400<this.position.x){
    //   this.position.x=400;
    //   if(0<this.velocity.x){
    //     this.velocity.x=0;
    //   }
    // }
    // if(400<this.position.y){
    //   this.position.y=400;
    //   if(0<this.velocity.y){
    //     this.velocity.y=0;
    //   }
    // }
    
  }
}

export default class ProjectC extends paper.Project{
  agentList:Agent[];
  pathList:paper.Path[];
  starList:paper.Path.Circle[];
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
      new paper.Color("#808080"),
    ];
    this.agentList=[];
    this.pathList=[];
    this.starList=[];
    for(let i=0;i<colors.length;i++){
      const color=colors[i];
      let agent;
      switch(i){
        case 0:
          agent=new Agent(
            new paper.Point(100,100),
            new paper.Point(100,-20)
          );
          break;
        case 1:
          agent=new Agent(
            new paper.Point(100,50),
            new paper.Point(50,0)
          );
          break;
        case 2:
          agent=new Agent(
            new paper.Point(300,300),
            new paper.Point(-100,20)
          );
          break;
          case 3:
            agent=new Agent(
              new paper.Point(300,350),
              new paper.Point(-50,0)
            );
            break;
          default:
            throw new Error("unexpected index");
      }
      this.agentList.push(agent);
      const path=new paper.Path({
        strokeWidth:0.5,
        strokeColor: color,
        blendMode:"screen",
      });
      this.pathList.push(path);
      layer.addChild(path);
      const star=new paper.Path.Circle({
        center:0,
        radius:2,
        strokeWidth:0,
        fillColor:color,
        blendMode:"screen",
      })
      this.starList.push(star);
      layer.addChild(star);
    }

    this.view.onFrame=(_event:FrameEvent)=>{
      const subFrameQty=10;
      const myDelta=1/60;
      for(let j=0;j<subFrameQty;j++){
        for(let i=0;i<this.agentList.length;i++){
          const agent=this.agentList[i];
          agent.updateForce(this.agentList);
        }
        for(let i=0;i<this.agentList.length;i++){
          const agent=this.agentList[i];
          
          agent.updatePosition(myDelta/subFrameQty);
          // console.log(path);
        }
      }
      for(let i=0;i<this.agentList.length&&i<this.pathList.length&&i<this.starList.length;i++){
        const agent=this.agentList[i];
        const path=this.pathList[i];
        path.add(agent.position);
        const star=this.starList[i];
        star.position=agent.position.clone();
        // console.log(path);
      }
    // console.log(event);
    }
  }
}



