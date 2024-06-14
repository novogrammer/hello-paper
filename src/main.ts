import ProjectA from './ProjectA';
import './style.scss'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <section class="p-section-first">
    <canvas class="p-section-first__view" data-paper-resize="true"></canvas>
  </section>
  <div class="p-float">
    <button class="p-float__export">Export</button>
  </div>
`

function downloadAsFile(text:string, filename:string) {
  const blob = new Blob([text], { type: "text/plain"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function mainAsync(){
  const viewElement=document.querySelector<HTMLCanvasElement>(".p-section-first__view");
  if(!viewElement){
    throw new Error("viewElement is null");
  }

  const exportElement=document.querySelector<HTMLButtonElement>(".p-float__export");
  if(!exportElement){
    throw new Error("exportElement is null");
  }

  const project=new ProjectA(viewElement);

  exportElement.addEventListener("click",()=>{
    const svgData=project.exportSVG({
      asString:true,
    }) as string;
    downloadAsFile(svgData,"projectA.svg");

  
  });


  

}


mainAsync().catch((error)=>{
  console.error(error);
})