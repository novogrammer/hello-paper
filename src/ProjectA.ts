import paper from "paper";

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
  
    const result = square.exclude(ring);
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



