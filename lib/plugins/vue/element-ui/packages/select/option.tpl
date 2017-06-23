 <li
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
    class="el-select-dropdown__item"
    v-show="visible"
    :class="{
      'selected': itemSelected,
      'is-disabled': disabled || groupDisabled || limitReached,
      'hover': parent.hoverIndex === index
    }">
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>