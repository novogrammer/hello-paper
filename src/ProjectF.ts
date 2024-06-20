import paper from "paper";


interface FrameEvent{
  delta:number;
  time:number;
  count:number;
}


interface RGB{
  r:number;
  g:number;
  b:number;
}
interface CMYK{
  c:number;
  m:number;
  y:number;
  k:number;
}


function rgbToCmyk({ r, g, b }: RGB): CMYK {
  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 1 };
  }
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return { c, m, y, k };
}
function cmykToRgb({ c, m, y, k }: CMYK): RGB {
  const r = (1 - c) * (1 - k);
  const g = (1 - m) * (1 - k);
  const b = (1 - y) * (1 - k);
  return { r, g, b };
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
    // this.raster.remove();
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


      for(let iy=-halfYQty;iy<=halfYQty;iy++){
        const y=(outerRadius*1.5)*iy;
        for(let ix=-halfXQty;ix<=halfXQty;ix++){
          const x=(innerRadius*2)*ix-((iy%2==0)?0:innerRadius);
          const matrix=new paper.Matrix();
          matrix.translate(this.view.center);
          matrix.rotate(performance.now()/1000*10,[0,0]);
          matrix.translate([x,y]);
      
          const segments=hexSegments(innerRadius).map((point:paper.PointLike):paper.Point=>{
            return matrix.transform(point);
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
            // cmyk.c=0;
            // cmyk.m=0;
            // cmyk.y=0;
            // cmyk.k=0;
            const rgb=cmykToRgb(cmyk);
            const newColor=new paper.Color(rgb.r,rgb.g,rgb.b);
            const polygon = new paper.Path({
              segments,
              closed:true,
              strokeWidth: 0,
              fillColor:newColor,
              applyMatrix:false,
            });
      
            layer.addChild(polygon);
  
          }


        }
      }
  

  
    };

  

  }
}



