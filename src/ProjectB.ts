import paper from "paper";

function drawCurveStitching(parent:paper.Group,start1:paper.Point, start2:paper.Point, end1:paper.Point, end2:paper.Point,color1:paper.Color,color2:paper.Color, numSegments:number){

  for (let i = 0; i <= numSegments; i++) {
    const start = start1.add(start2.subtract(start1).multiply(i / numSegments));
    
    const end = end1.add(end2.subtract(end1).multiply(i / numSegments));

    const color = color1.add(color2.subtract(color1).multiply(i/numSegments));
    
    const line=new paper.Path.Line({
      from: start,
      to: end,
      strokeWidth:0.1,
      strokeColor: color,
      blendMode:"multiply",
    });
    parent.addChild(line);
  }
}


interface CurveStitchingItem{
  point:paper.Point;
  color:paper.Color;
}

export default class ProjectB extends paper.Project{
  constructor(element: string | HTMLCanvasElement | paper.SizeLike){
    super(element);
    

    const layer = new paper.Layer({
      applyMatrix:false,
    });
    // layer.position=this.view.center;
    
    this.addLayer(layer);

    const itemList:CurveStitchingItem[]=[
      {
        point:new paper.Point(0,0),
        color:new paper.Color("#ff0000"),
      },
      {
        point:new paper.Point(400,0),
        color:new paper.Color("#00ff00"),
      },
      {
        point:new paper.Point(400,400),
        color:new paper.Color("#0000ff"),
      },
      {
        point:new paper.Point(0,400),
        color:new paper.Color("#ffff00"),
      },
      {
        point:new paper.Point(0,0),
        color:new paper.Color("#ff0000"),
      },
      {
        point:new paper.Point(400,0),
        color:new paper.Color("#00ff00"),
      },
    ];
    for(let i=0;i<itemList.length-2;i++){
      const item1=itemList[i];
      const item2=itemList[i+1];
      const item3=itemList[i+2];
      drawCurveStitching(
        layer,
        item1.point,
        item2.point,
        item2.point,
        item3.point,
        item1.color,
        item2.color,
        400
      )
  
    }



    
  

  }
}



