<script>
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import 'firebase/storage';
  import { docData } from 'rxfire/firestore';
  import P5 from 'p5-svelte';
  import { Buffer } from 'buffer';

  export let id;

  const db = firebase.firestore();
  const ref = db.collection('skeletons-art').doc(id);
  const doc = docData(ref);

  let drawing = null;
  let newDrawing = null;
  let isEditing = false;

  $: if ($doc) {
    drawing = JSON.parse(Buffer.from($doc.data, 'base64').toString());
  };

  const sketch = p5 => {
    let canvas;
    let isDrawing = false;
    let currentPath = [];

    p5.setup = () => {
      canvas = p5.createCanvas(521, 741);
      canvas.mousePressed(startPath);
      canvas.mouseReleased(endPath);
    };

    p5.draw = () => {
      if (drawing === null)
        return;

      if (isDrawing) {
        currentPath.push({
          x: p5.mouseX,
          y: p5.mouseY
        });
      }

      if (newDrawing !== null) {
        p5.clear();

        drawing = [...newDrawing];
        newDrawing = null;
      }

      p5.colorMode(p5.HSB);
      // p5.stroke(255, 204, 100);
      p5.stroke(255, 255, 50);
      p5.strokeWeight(2);
      p5.noFill();

      // Draw each point in the drawing
      for (let i = 0; i < drawing.length; i++) {
        const path = drawing[i];

        p5.beginShape();
        for (let j = 0; j < path.length; j++) {
          p5.vertex(path[j].x, path[j].y);
        }
        p5.endShape();
      }
    };

    const startPath = () => {
      if (!isEditing)
        return;

      isDrawing = true;

      currentPath = [];
      drawing.push(currentPath);
    };

    const endPath = () => {
      if (!isEditing)
        return;

      isDrawing = false;
    };
  };

  const toggleEditing = () => {
    isEditing = !isEditing;
  };

  const syncData = () => {
    toggleEditing();

    const data = Buffer.from(JSON.stringify(drawing)).toString('base64');
    ref.update({ data });
  };

  const onUndo = () => {
    newDrawing = [...drawing];
    newDrawing.pop();
  };

  const onClear = () => {
    if (!confirm("Tem certeza?"))
      return;

    newDrawing = [];
  };
</script>

<div class="absolute w-full h-full">
  {#if isEditing}
    <div class="absolute flex gap-3 top-[10px] left-[10px]">
      <button class="btn" title="Desfazer" on:click={onUndo}>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <button class="btn" title="Limpar" on:click={onClear}>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  {/if}
  <div class="absolute flex gap-3 top-[10px] right-[10px]">
    {#if !isEditing}
      <button class="btn" title="Editar" on:click={toggleEditing}>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    {:else}
      <button class="btn" title="Salvar" on:click={syncData}>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    {/if}
  </div>
  <P5 {sketch} />
</div>

<style lang="postcss" scoped>
  .btn {
    @apply flex items-center justify-center p-2 bg-black rounded-lg;
    --tw-bg-opacity: 0.2;
  }

  .btn:hover {
    --tw-bg-opacity: 0.1;
  }

  .btn:active {
    --tw-bg-opacity: 0.3;
  }
</style>
