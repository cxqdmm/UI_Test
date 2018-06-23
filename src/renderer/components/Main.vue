<template>
  <div class="d-flex h-100 w-100 flex-column">
    <header class="p-4 mb-auto">
    </header>
    <main class="mt-5">
      <transition name="fade" mode="out-in">
<template>
    <Input v-model="name" placeholder="Enter something..." style="width: 300px"></Input>
</template>

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
