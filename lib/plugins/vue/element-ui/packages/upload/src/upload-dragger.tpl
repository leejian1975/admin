<div
    class="el-upload-dragger"
    :class="{
      'is-dragover': dragover
    }"
    @drop.prevent="onDrop"
    @dragover.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
  >
    <slot></slot>
  </div>