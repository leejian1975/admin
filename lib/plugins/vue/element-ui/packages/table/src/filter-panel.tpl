<transition name="el-zoom-in-top">
    <div class="el-table-filter" v-if="multiple" v-show="showPopper">
      <div class="el-table-filter__content">
        <el-checkbox-group class="el-table-filter__checkbox-group" v-model="filteredValue">
          <el-checkbox
            v-for="filter in filters"
            :label="filter.value">{{ filter.text }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="el-table-filter__bottom">
        <button @click="handleConfirm"
          :class="{ 'is-disabled': filteredValue.length === 0 }"
          :disabled="filteredValue.length === 0">{{ t('el.table.confirmFilter') }}</button>
        <button @click="handleReset">{{ t('el.table.resetFilter') }}</button>
      </div>
    </div>
    <div class="el-table-filter" v-else v-show="showPopper">
      <ul class="el-table-filter__list">
        <li class="el-table-filter__list-item"
            :class="{ 'is-active': !filterValue }"
            @click="handleSelect(null)">{{ t('el.table.clearFilter') }}</li>
        <li class="el-table-filter__list-item"
            v-for="filter in filters"
            :label="filter.value"
            :class="{ 'is-active': isActive(filter) }"
            @click="handleSelect(filter.value)" >{{ filter.text }}</li>
      </ul>
    </div>
  </transition>