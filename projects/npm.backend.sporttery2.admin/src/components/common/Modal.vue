<template>
  <!-- Slide Up Modal -->
  <div class="modal fade">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="block block-themed block-transparent remove-margin-b">
          <div class="block-header bg-primary-dark">
            <ul class="block-options">
              <li>
                <button data-dismiss="modal" type="button"><i class="si si-close"></i></button>
              </li>
            </ul>
            <h3 class="block-title">{{title}}</h3>
          </div>
          <div class="block-content"><slot /></div>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <button
              class="btn btn-sm btn-default"
              type="button"
              data-dismiss="modal"
            >取消</button>
            <button
              class="btn btn-sm btn-primary"
              type="button"
              @click="e => $emit('ok', e)"
            >
              <i class="fa fa-check"></i> 确定
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
  <!-- END Slide Up Modal -->
</template>
<script>

const $ = window.jQuery

export default {
  props: {
    open: {},
    title: {}
  },
  data () {
    return {
      $modal: null
    };
  },
  watch: {
    open (n) {
      if (this.$modal) {
        this.$modal.modal(n ? 'show' : 'hide')
      }
    }
  },
  mounted () {
    this.$modal = $(this.$el);
    this.$modal.on('hidden.bs.modal', () => this.$emit('close'))
  }
}
</script>
