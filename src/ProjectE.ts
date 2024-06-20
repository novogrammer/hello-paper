import paper from "paper";
import chroma from "chroma-js";

export default class ProjectE extends paper.Project{
  pathList:paper.Path[];
  
  constructor(element: string | HTMLCanvasElement | paper.SizeLike){
    super(element);

    const layer = new paper.Layer({
      applyMatrix:false,
    });
    layer.position=this.view.center;
    
    this.addLayer(layer);

    this.pathList=[];


    const q=20;

    const getColor=(i:number):paper.Color=>{
      // const scale=chroma.scale(["#e60012","#fff100","#009944","#00a0e9","#1d2088","#e4007f"]).mode("lch");
      const scale=chroma.scale(["#0583F2","#0597F2","#05AFF2","#74BF04","#858F01"]).mode("lch").domain([0.00,0.33,0.66,0.67,1.00]);
      const color=scale(i/20);
      return new paper.Color(color.hex());
    }

    for(let i=0;i<q;++i){

      const path = new paper.Path({
        strokeWidth: 0,
        fillColor: getColor(i),
        closed: true,
        blendMode:"multiply",
      });

      // const baseDeg=i/q*360;
      const baseDeg=Math.pow(i/q,1.2)*1.04*360;

      const unitWidth=0.2;

      const step=300;
      for(let j=0;j<step;++j){
        const l=j/step*190;
        const deg=baseDeg+Math.sin(l*(i+10)/q*10*Math.PI/180)*10;
        const positionBase=new paper.Point(l,0);
        const position=positionBase.rotate(deg,new paper.Point(0,0));
        const width=unitWidth*l;
        const sideBase=new paper.Point(0,width);
        const side=sideBase.rotate(deg,new paper.Point(0,0));
        path.add(position.add(side));
        path.insert(0, position.subtract(side));
      }
      layer.addChild(path);

    }


  }
}



