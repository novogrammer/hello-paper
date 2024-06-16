import paper from "paper";

function makeLinePath(parent:paper.Group,from:paper.Point,to:paper.Point,lineWidth:number):paper.PathItem{
  
  const dir=to.subtract(from).normalize();
  const up=dir.rotate(90,[0,0]);
  const segments:paper.PointLike[]=[
    from.add(up.multiply(lineWidth*-0.5)),
    from.add(up.multiply(lineWidth*0.5)),
    to.add(up.multiply(lineWidth*0.5)),
    to.add(up.multiply(lineWidth*-0.5)),
  ];

  const path=new paper.Path({
    segments,
    parent,
    closed:true,
  });
  return path;
}

function makeCapsulePath(parent:paper.Group,from:paper.Point,to:paper.Point,lineWidth:number):paper.PathItem{
  const temporaryGroup=new paper.Group({
    insert:false,
  });
  const linePath=makeLinePath(temporaryGroup,from,to,lineWidth);

  const fixBugFactor=0.999;
  const fromCircle=new paper.Path.Circle({
    parent:temporaryGroup,
    center:from,
    radius:lineWidth*0.5*fixBugFactor,
  });
  const toCircle=new paper.Path.Circle({
    parent:temporaryGroup,
    center:to,
    radius:lineWidth*0.5*fixBugFactor,
  });
  const path=linePath.unite(fromCircle).unite(toCircle);
  path.addTo(parent);

  return path;
}

export default class ProjectA extends paper.Project{
  constructor(element: string | HTMLCanvasElement | paper.SizeLike){
    super(element);
    
    var originals = new paper.Group({
      insert: false,
    });
  
    const square = new paper.Path.Rectangle({
        position: this.view.center,
        size: 300,
        parent: originals,
        fillColor: new paper.Color('white'),
    });


    const line = makeCapsulePath(
      originals,
      this.view.center.add(new paper.Point(-100,-100)),
      this.view.center.add(new paper.Point(100,100)),
      10,
    );
    
    line.fillColor=new paper.Color('white');

    
    // Make a ring using subtraction of two circles:
    const inner = new paper.Path.Circle({
        center: this.view.center,
        radius: 100,
        parent: originals,
        fillColor: new paper.Color('white'),
    });
    
    const outer = new paper.Path.Circle({
        center: this.view.center,
        radius: 140,
        parent: originals,
        fillColor: new paper.Color('white'),
    });  
    const ring = outer.subtract(inner);
  
    ring.position.x+=100;
    ring.position.y+=100;
  
    const result = square.exclude(ring).exclude(line);
    // const result = square.exclude(ring);
    // result.selected = true;
    const gradient=new paper.Gradient();
    gradient.radial=true;
    gradient.stops=[
      new paper.GradientStop(new paper.Color("yellow"),0),
      new paper.GradientStop(new paper.Color("red"),0.1),
      new paper.GradientStop(new paper.Color("black"),1),
    ]
    result.fillColor=new paper.Color(gradient,this.view.center,this.view.center.clone().add(new paper.Point(300,0)));
    result.addTo(this);
  

  }
}



