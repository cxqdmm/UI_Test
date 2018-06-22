<template>
  <div class="d-flex h-100 w-100 flex-column">
    <header class="p-4 mb-auto">
        <label for="">1212</label>
    </header>
    <main class="mt-5">
      <transition name="fade" mode="out-in">
        <div>
          <b-card title="Card Title"
                  img-src="https://picsum.photos/600/300/?image=25"
                  img-alt="Image"
                  img-top
                  tag="article"
                  style="max-width: 20rem;"
                  class="mb-2">
            <p class="card-text">
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </p>
            <b-button href="#" variant="primary">Go somewhere</b-button>
          </b-card>
        </div>

      </transition>
    </main>
    <footer class="mt-auto p-4" v-if="form === 'INVOICE_COUNT'">
      <div class="row">
        <div class="col">
          <p class="progress-tip text-center pt-5"><i id="progress-tip" class="far fa-2x fa-question-circle"></i></p>
          <b-popover  ref="popover" target="progress-tip" triggers="click" placement="top">
             <template slot="title">Speed</template>
             We purposely check your account slowly to prevent the Uber website from knowing you are running a script.
             <br/>
             <p class="text-right"><a class="js-external-link" href="https://github.com/mrgodhani/uberrun#limitation">Learn more</a></p>
          </b-popover>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "123"
    };
  }
};
</script>

<style lang="scss">
</style>
