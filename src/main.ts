import ProjectA from './ProjectA';
import './style.scss'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <section class="p-section-first">
    <canvas class="p-section-first__view" data-paper-resize="true"></canvas>
  </section>
`

async function mainAsync(){
  const viewElement=document.querySelector<HTMLCanvasElement>(".p-section-first__view");
  if(!viewElement){
    throw new Error("viewElement is null");
  }
  const project=new ProjectA(viewElement);

  console.log(project.exportSVG({
    asString:true,
  }));

}


mainAsync().catch((error)=>{
  console.error(error);
})