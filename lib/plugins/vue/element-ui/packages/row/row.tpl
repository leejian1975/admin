<div
    class="el-row"
    :style="style"
    :class="[
      justify !== 'start' ? 'is-justify-' + justify : '',
      align !== 'top' ? 'is-align-' + align : '',
      {
        'el-row--flex': type === 'flex'
      }
    ]"
  >
    <slot></slot>
  </div>