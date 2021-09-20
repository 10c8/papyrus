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
  const ref = db.collection('skeletons').doc(currentRoute.namedParams.id);
  const doc = docData(ref);

  let canEdit = true;
  let marks;
  let values;

  $: if ($doc) {
    marks = $doc.marks;
    values = $doc.values;

    // db.collection('skeletons').doc('big-head').set($doc);
  }

  const syncData = () => {
    canEdit = false;
    ref.update({ values }).then(syncMarks);
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
    <div class="A4">
      <section class="sheet landscape px-8 py-6">
        <div class="half text">
          <Doc
            path={`skeletons/${currentRoute.namedParams.id}`}
            let:data={doc}
          >
            <h1 class="title">{doc.title}</h1>
            <p class="description">{doc.description}</p>
            <form class="form mt-4" on:submit|preventDefault={syncData}>
              <h2 class="form__title">Questões</h2>

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
                    <label for="q0">{doc.special}</label>
                  </div>
                </div>
              </div>

              <div class="form__section mt-4">
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
                    <label for="q4">{doc.first}</label>
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

              <div class="form__section mt-4">
                <h3 class="form__title">Memórias</h3>
                <p>
                  Aqui estão alguns nomes de pessoas e coisas que {doc.title}
                  deve recordar-se dos dias ensolarados do passado:
                </p>
                <p class="italic">{doc.memories}</p>
              </div>

              <div class="form__section mt-2">
                <h3 class="form__title">Observações</h3>
                <p>Aqui estão algumas coisas que podem ser vistas na tumba:</p>
                <p class="italic">{doc.observations}</p>
              </div>

              <input type="submit" class="invisible" />
            </form>
          </Doc>
        </div>
        <div class="half image">
          <SyncedCanvas id={currentRoute.namedParams.id} />
          <StorageRef
            path={`images/skeletons/${currentRoute.namedParams.id}.jpg`}
            let:downloadURL
          >
            <img class="art" src="{downloadURL}" alt="" />
          </StorageRef>
        </div>
      </section>
    </div>
  </div>
{:else}
  <h1>Carregando...</h1>
{/if}

<style lang="scss" scoped>
  @page {
    size: A4 landscape;
  }
  
  .p-sheet {
    .A4 {
      @apply w-full h-full;

      .sheet {
        @apply flex gap-4;
      }

      .half {
        @apply w-1/2;
      }

      .text {
        font-family: 'Vollkorn', serif;

        .title {
          @apply mb-1 uppercase;
          font-weight: 700;
          font-size: 42px;
          line-height: 1;
        }

        .description {
          font-weight: 700;
          font-size: 13px;
          font-style: italic;
          line-height: 1.2;
        }

        .form {
          &__title {
            @apply uppercase;
            font-weight: 700;
            font-size: 16px;
          }

          &__section {
            &-title {
              font-weight: 700;
              font-size: 12px;
              font-style: italic;
              line-height: 1.2;
            }

            p {
              font-weight: 700;
              font-size: 14px;
              line-height: 1.2;
              
              &.italic {
                @apply mt-1;
                font-weight: 400;
                font-size: 15px;
                font-style: italic;
                line-height: 1.3;
              }
            }
          }
        }
      }
      
      .image {
        @apply relative flex justify-center items-center p-12;

        .art {
          @apply w-full h-auto;
        }
      }
    }

    .question {
      @apply flex flex-col mb-2;

      &__header {
        @apply flex items-start gap-2 mt-2;

        input {
          margin-top: 1px;
        }
        
        label {
          font-size: 13px;
          line-height: 1.3;
        }
      }

      input[type="text"] {
        @apply mt-1 px-2;
        border: 1px solid #a3a3a3;
        width: 500px;
        height: 20px;
      }
    }
  }
</style>
