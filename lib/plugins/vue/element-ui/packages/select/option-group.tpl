<ul class="el-select-group__wrap">
    <li class="el-select-group__title" v-show="visible">{{ label }}</li>
    <li>
      <ul class="el-select-group">
        <slot></slot>
      </ul>
    </li>
  </ul>