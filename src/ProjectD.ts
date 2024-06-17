import paper from "paper";


interface FrameEvent{
  delta:number;
  time:number;
  count:number;
}


class Sampler{
  raster:paper.Raster;
  isLoaded:boolean;
  grayList:number[];
  grayTotal:number;
  constructor(source:string){
    this.raster=new paper.Raster("./mona.jpg");
    this.raster.visible=false;
    this.isLoaded=false;
    this.grayList=[];
    this.grayTotal=0;
    this.raster.on("load",()=>{
      this.setupRaster();
    });
  
  }
  setupRaster(){
    this.isLoaded=true;
    this.grayList=[];
    this.grayTotal=0;
    const rect=new paper.Rectangle(0,0,this.raster.width,this.raster.height);
    const imageData=this.raster.getImageData(rect);
    for(let i=0;i<imageData.data.length;i+=4){
      const r=imageData.data[i+0]/255;
      const g=imageData.data[i+1]/255;
      const b=imageData.data[i+2]/255;
      const color=new paper.Color(r,g,b);
      this.grayList.push(color.gray);
      this.grayTotal+=color.gray;
    }

  }
  getPoint(ratio:number):paper.Point|null{
    if(!this.isLoaded){
      return null;
    }
    if(ratio<0 || 1<=ratio){
      throw new Error("ratio out of range");
    }
    let remain=this.grayTotal*ratio;
    for(let i=0;i<this.grayList.length;i++){
      const gray=this.grayList[i];
      remain-=gray;
      if(remain<=0){
        const y=Math.floor(i/this.raster.width);
        const x=i-(y*this.raster.width);
        return new paper.Point(x,y);
      }
    }
    

    throw new Error("something wrong");
  }
}



export default class ProjectD extends paper.Project{
  sampler:Sampler;
  whiteCount:number;
  constructor(element: string | HTMLCanvasElement | paper.SizeLike){
    super(element);
    this.sampler=new Sampler("./mona.jpg");
    

    const layer = new paper.Layer({
      applyMatrix:false,
    });
    // layer.position=this.view.center;
    
    this.addLayer(layer);

    const rect = new paper.Path.Rectangle({
      point: [0, 0],
      size: [400,300],
      strokeWidth: 0,
      fillColor: 'black',
    });
    layer.addChild(rect);

    const path = new paper.Path({
      strokeWidth: 0,
      fillColor:'white',
    })
    layer.addChild(path);

    this.whiteCount=0;
    this.view.onFrame=(_event:FrameEvent)=>{
      const q=1;
      for(let i=0;i<q;i++){
        if(this.sampler.grayTotal<this.whiteCount){
          console.log("over");
          return;
        }
        const point=this.sampler.getPoint(Math.random());
        if(point){
          // console.log("point.x: "+point.x);
          // console.log("point.y: "+point.y);
          const center=point.add(new paper.Point(Math.random(),Math.random()));
  
          const dot=new paper.Path.Rectangle({
            from:center.add([-0.5,-0.5]),
            to:center.add([0.5,0.5]),
            strokeWidth:0,
            fillColor:'white',
          });

          layer.addChild(dot);
          this.whiteCount+=1;
        }
  
      }
    };

  

  }
}



