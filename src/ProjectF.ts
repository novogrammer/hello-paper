import paper from "paper";
import { rgbToCmyk } from "./color_utils";


interface FrameEvent{
  delta:number;
  time:number;
  count:number;
}







function hexSegments(innerRadius:number):paper.Point[]{
  const outerRadius=innerRadius / Math.sqrt(3) * 2;
  const segments:paper.Point[]=[];
  for(let i=0;i<6;i++){
    const rad=(i*60+90)/180*Math.PI;
    const point=new paper.Point(
      Math.cos(rad)*outerRadius,
      Math.sin(rad)*outerRadius,
    );
    segments.push(point);
  }
  return segments;
}

export default class ProjectF extends paper.Project{
  isLoaded:boolean;
  raster:paper.Raster;
  
  constructor(element: string | HTMLCanvasElement | paper.SizeLike){
    super(element);
    this.isLoaded=false;
    this.raster=new paper.Raster("./mona.jpg");
    this.raster.remove();
    // this.raster.position=this.view.center;
    this.raster.visible=false;
    this.raster.on("load",()=>{
      this.isLoaded=true;
    })
    

    const layer = new paper.Layer({
      applyMatrix:false,
    });
    // layer.position=this.view.center;
    
    this.addLayer(layer);

    // const area=new paper.Rectangle(0,0,400,300);

    const innerRadius=10;
    const outerRadius=innerRadius / Math.sqrt(3) * 2;

    const {width,height}=this.view.bounds;
    const length=Math.sqrt(width*width+height*height)/2+innerRadius;
    const halfYQty=Math.ceil((length-outerRadius*0.5)/(outerRadius*1.5));
    const halfXQty=Math.ceil((length-innerRadius)/(innerRadius*2));


    this.view.onFrame=(_event:FrameEvent)=>{
      if(!this.isLoaded){
        return;
      }

      layer.removeChildren();
      this.raster.fitBounds(this.view.bounds,true);

      const degBaseList=[15,75,30,45];
      const colorList=[
        new paper.Color("#00ffff"),
        new paper.Color("#ff00ff"),
        new paper.Color("#ffff00"),
        new paper.Color("#000000"),
      ];

      for(let ic=0;ic<4;ic++){
        const degTime=performance.now()/1000*10;
        // const degTime=0;
        let deg=degBaseList[ic]+degTime;
        for(let iy=-halfYQty;iy<=halfYQty;iy++){
          const y=(outerRadius*1.5)*iy;
          for(let ix=-halfXQty;ix<=halfXQty;ix++){
            const x=(innerRadius*2)*ix-((iy%2==0)?0:innerRadius);
            const matrixForSampling=new paper.Matrix();
            matrixForSampling.translate(this.view.center);
            matrixForSampling.rotate(deg,[0,0]);
            matrixForSampling.translate([x,y]);
        
            const segments=hexSegments(innerRadius).map((point:paper.PointLike):paper.Point=>{
              return matrixForSampling.transform(point);
            });
        
        
            const area=new paper.Path({
              segments,
              closed:true,
              strokeWidth: 0,
              fillColor: "black",
              insert: false,
            });
        
            const color=this.raster.getAverageColor(area);
            if(color){
              const cmyk = rgbToCmyk({
                r:color.red,
                g:color.green,
                b:color.blue,
              });
              // const cmykEach={
              //   c:0,
              //   m:0,
              //   y:0,
              //   k:0,
              // };

              let scale:number;
              switch(ic){
                case 0:
                  scale=Math.sqrt(cmyk.c);
                  break;
                case 1:
                  scale=Math.sqrt(cmyk.m);
                  break;
                case 2:
                  scale=Math.sqrt(cmyk.y);
                  break;
                case 3:
                  scale=Math.sqrt(cmyk.k);
                  break;
                default:
                  throw new Error("unexpected ic");
              }
              // cmyk.c=0;
              // cmyk.m=0;
              // cmyk.y=0;
              // cmyk.k=0;

              const polygonSegments=hexSegments(innerRadius * scale).map((point:paper.PointLike):paper.Point=>{
                return matrixForSampling.transform(point);
              });
              const polygon = new paper.Path({
                segments:polygonSegments,
                closed:true,
                strokeWidth: 0,
                fillColor:colorList[ic],
                applyMatrix:false,
                blendMode:"multiply",
              });
        
              layer.addChild(polygon);
    
            }


          }
        }
      }
  

  
    };

  

  }
}



