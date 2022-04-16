<script>
  import { onMount } from 'svelte';
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import 'firebase/storage';
  import { docData } from 'rxfire/firestore';
  import { Doc, StorageRef } from 'sveltefire';
  import 'paper-css/paper.css';

  import SyncedCanvas from '@/components/SyncedCanvas.svelte';

  export let currentRoute;

  const db = firebase.firestore();
  const ref = db
    .collection('skeletons')
    .doc(currentRoute.namedParams.id);
  const doc = docData(ref);

  let canEdit = true;
  let marks;
  let values;

  $: if ($doc) {
    marks = $doc.marks;
    values = $doc.values;
  }

  const syncData = () => {
    canEdit = false;
    ref.update({ values })
      .then(syncMarks);
  };

  const syncMarks = async () => {
    canEdit = false;

    marks[1] = values[0] !== '';
    marks[2] = values[1] !== '';
    marks[3] = values[2] !== '';
    marks[5] = values[3] !== '';
    marks[6] = values[4] !== '';

    await ref.update({ marks });

    canEdit = true;
  };

  onMount(() => {
    document.body.classList.add('A4');
    document.body.classList.add('landscape');
  });
</script>

{#if doc}
  <div class="p-sheet">
    <div class="w-full h-full overflow-hidden A4">
      <section class="flex flex-col gap-4 p-6 landscape md:(flex-row px-8)">
        <div class="w-full text md:w-1/2">
          <Doc
            path={`skeletons/${currentRoute.namedParams.id}`}
            let:data={doc}
          >
            <h1 class="mb-1 uppercase font-extrabold text-[42px]">
              {doc.title}
            </h1>
            <p class="font-extrabold text-[13px] italic">
              {doc.description}
            </p>
            <form class="mt-4" on:submit|preventDefault={syncData}>
              <h2 class="uppercase font-extrabold text-[16px]">Questões</h2>

              <div class="form__section">
                <h3 class="form__section-title">
                  Responda isso enquanto criam o mapa juntos:
                </h3>
                <div class="question">
                  <div class="question__header">
                    <input
                      type="checkbox"
                      name="q0"
                      bind:checked={marks[0]}
                      on:change={syncMarks}
                      disabled={!canEdit}
                    />
                    <label
                      for="q0"
                      on:click={() => { marks[0] = !marks[0]; syncMarks(); }}
                    >
                      {doc.special}
                    </label>
                  </div>
                </div>
              </div>

              <div class="mt-4 form__section">
                <h2 class="form__section-title">
                  Responda conforme o tempo passa:
                </h2>

                <div class="question">
                  <div class="question__header">
                    <input
                      type="checkbox"
                      name="q1"
                      bind:checked={marks[1]}
                      disabled
                    />
                    <label for="q1">Qual era o seu nome?</label>
                  </div>
                  <input type="text" bind:value={values[0]} disabled={!canEdit} />
                </div>

                <div class="question">
                  <div class="question__header">
                    <input
                      type="checkbox"
                      name="q2"
                      bind:checked={marks[2]}
                      disabled
                    />
                    <label for="q2">A quem você já amou um dia?</label>
                  </div>
                  <input type="text" bind:value={values[1]} disabled={!canEdit} />
                </div>

                <div class="question">
                  <div class="question__header">
                    <input
                      type="checkbox"
                      name="q3"
                      bind:checked={marks[3]}
                      disabled
                    />
                    <label for="q3">
                      Que apelido que você recebeu descreve a sua maior
                      conquista?
                    </label>
                  </div>
                  <input type="text" bind:value={values[2]} disabled={!canEdit} />
                </div>

                <div class="question">
                  <div class="question__header">
                    <input
                      type="checkbox"
                      name="q4"
                      bind:checked={marks[4]}
                      on:change={syncMarks}
                      disabled={!canEdit}
                    />
                    <label
                      for="q4"
                      on:click={() => { marks[4] = !marks[4]; syncMarks(); }}
                    >
                      {doc.first}
                    </label>
                  </div>
                </div>

                <div class="question">
                  <div class="question__header">
                    <input
                      type="checkbox"
                      name="q5"
                      bind:checked={marks[5]}
                      disabled
                    />
                    <label for="q5">{doc.second}</label>
                  </div>
                  <input
                    type="text"
                    bind:value={values[3]}
                    disabled={!canEdit}
                  />
                </div>

                <div class="question">
                  <div class="question__header">
                    <input
                      type="checkbox"
                      name="q6"
                      bind:checked={marks[6]}
                      disabled
                    />
                    <label for="q6">
                      Que conexão você tem com aqueles que acabou de matar ou
                      afugentar?<br>
                      Que memória eles evocaram?
                    </label>
                  </div>
                  <input
                    type="text"
                    bind:value={values[4]}
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div class="mt-4 form__section">
                <h3 class="form__title">Memórias</h3>
                <p>
                  Aqui estão alguns nomes de pessoas e coisas que {doc.title}
                  deve recordar-se dos dias ensolarados do passado:
                </p>
                <p class="italic">{doc.memories}</p>
              </div>

              <div class="mt-2 form__section">
                <h3 class="form__title">Observações</h3>
                <p>Aqui estão algumas coisas que podem ser vistas na tumba:</p>
                <p class="italic">{doc.observations}</p>
              </div>

              <input type="submit" class="invisible" />
            </form>
          </Doc>
        </div>
        <div class="relative flex items-center justify-center w-full p-12 md:1/2">
          <SyncedCanvas id={currentRoute.namedParams.id} />
          <StorageRef
            path={`images/skeletons/${currentRoute.namedParams.id}.jpg`}
            let:downloadURL
          >
            <img class="w-full h-auto" src="{downloadURL}" alt="" />
          </StorageRef>
        </div>
      </section>
    </div>
  </div>
{:else}
  <h1>Carregando...</h1>
{/if}

<style lang="postcss" scoped>
  @page {
    size: A4 landscape;
  }

  .text {
    font-family: 'Vollkorn', serif;
  }

  .form__section-title {
    @apply font-extrabold italic;
    font-size: 12px;
    line-height: 1.2;
  }

  .form__section p {
    @apply font-extrabold;
    font-size: 14px;
    line-height: 1.2;
  }

  .form__section p.italic {
    @apply mt-1 italic;
    font-size: 15px;
    line-height: 1.3;
  }

  .form__section .form__title {
    @apply uppercase font-extrabold;
    font-size: 16px;
  }

  .question {
    @apply flex flex-col mb-2;
  }

  .question input[type="checkbox"] {
    @apply flex-shrink-0;
  }

  .question input[type="text"] {
    @apply w-full mt-1 px-2 py-1 border-default border-gray-500 rounded-lg;
    /* width: 500px; */
  }

  .question__header {
    @apply flex items-start gap-2 mt-2;
  }

  .question__header input {
    margin-top: 1px;
  }

  .question__header label {
    font-size: 13px;
    line-height: 1.3;
  }
</style>
