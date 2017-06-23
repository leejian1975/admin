<transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="el-autocomplete-suggestion"
      :class="{ 'is-loading': parent.loading }"
      :style="{ width: dropdownWidth }"
    >
      <el-scrollbar
        tag="ul"
        wrap-class="el-autocomplete-suggestion__wrap"
        view-class="el-autocomplete-suggestion__list"
      >
        <li v-if="parent.loading"><i class="el-icon-loading"></i></li>
        <template v-for="(item, index) in suggestions" v-else>
          <li
            v-if="!parent.customItem"
            :class="{'highlighted': parent.highlightedIndex === index}"
            @click="select(item)"
          >
            {{item.value}}
          </li>
          <component
            v-else
            :class="{'highlighted': parent.highlightedIndex === index}"
            @click="select(item)"
            :is="parent.customItem"
            :item="item"
            :index="index">
          </component>
        </template>
      </el-scrollbar>
    </div>
  </transition>