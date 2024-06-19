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
    const baseColorLch=chroma("orange").lch() as number[];
    for(let i=0;i<q;++i){
      const color=chroma(baseColorLch[0],baseColorLch[1],(baseColorLch[2]+i/20*360)%360,"lch");

      const path = new paper.Path({
        strokeWidth: 0,
        fillColor: new paper.Color(color.hex()),
        closed: true,
        blendMode:"multiply",
      });

      // const baseDeg=i/q*360;
      const baseDeg=Math.pow(i,1.2)/q*360;

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



