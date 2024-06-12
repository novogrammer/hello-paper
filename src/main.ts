import './style.css'

import paper from "paper";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <section class="p-section-first">
    <canvas class="p-section-first__view"></canvas>
  </section>
`

async function mainAsync(){
  const viewElement=document.querySelector<HTMLCanvasElement>(".p-section-first__view");
  if(!viewElement){
    throw new Error("viewElement is null");
  }
  paper.setup(viewElement);
  const path = new paper.Path();
  path.strokeColor = new paper.Color('black');
  const start = new paper.Point(100, 100);
  path.moveTo(start);

  path.lineTo(start.add([ 200, -50 ]));
  // paper.view.draw();
  path.
}


mainAsync().catch((error)=>{
  console.error(error);
})