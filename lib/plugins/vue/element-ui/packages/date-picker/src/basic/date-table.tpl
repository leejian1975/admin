<table
    cellspacing="0"
    cellpadding="0"
    class="el-date-table"
    @click="handleClick"
    @mousemove="handleMouseMove"
    :class="{ 'is-week-mode': selectionMode === 'week' }">
    <tbody>
    <tr>
      <th v-if="showWeekNumber">{{ t('el.datepicker.week') }}</th>
      <th v-for="week in WEEKS">{{ t('el.datepicker.weeks.' + week) }}</th>
    </tr>
    <tr
      class="el-date-table__row"
      v-for="row in rows"
      :class="{ current: value && isWeekActive(row[1]) }">
      <td
        v-for="cell in row"
        :class="getCellClasses(cell)"
        v-text="cell.type === 'today' ? t('el.datepicker.today') : cell.text"></td>
    </tr>
    </tbody>
  </table>