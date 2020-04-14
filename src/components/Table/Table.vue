<template>
  <div class="w-table" :class="{'w-table_moving': dragState.dragging}">
    <el-table
      :data="TableData"
      :border="option.border"
      :height="option.height"
      :max-height="option.maxHeight"
      :style="{ width: parseInt(option.width)+'px' }"
      :cell-class-name="cellClassName"
      :header-cell-class-name="headerCellClassName"
      :header-cell-style="{background:'#525A67',color:'#fff','text-align':'center'}"
      @selection-change="TableIsCheck"
      :row-class-name="tableRowClassName"
      @cell-click="EditData"
      ref="multipleTable"
      @row-dblclick="ActiveRow"
      stripe
      :show-overflow-tooltip="true"
    >
      <!-- 为了能让表格搜索独占一行 所以需要嵌套多选跟表头数据 -->
      <el-table-column>
        <!-- 自定义表头搜索栏 -->
        <template slot="header" slot-scope="scope">
          <div class="input-box">
            <div v-if="option.isSort" style="width:200px;"></div>
            <div v-for="item in header" :key="item.prop" :style="{width:item.minWidth+8+'px'}">
              <el-select
                @change="InquireData"
                v-model="item.isSearch"
                v-if="item.isSelectType == 'select'"
                placeholder="请选择"
              >
                <el-option
                  v-for="data in item.SelectArr"
                  :key="data.value"
                  :label="data.label"
                  :value="data.value"
                ></el-option>
              </el-select>
              <el-date-picker
                @change="InquireData"
                v-model="item.isSearch"
                v-else-if="item.isSelectType == 'time'"
                type="datetimerange"
                :picker-options="GetpickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>

              <el-input
                v-model="item.isSearch"
                @input="InquireData"
                v-else
                :placeholder="item.label=='ID'?'':'请输入'+item.label+'查询'"
                clearable
              ></el-input>
            </div>
          </div>
        </template>
        <!-- 多选 -->
        <slot name="fixed"></slot>
        <!-- 表头数据 -->
        <el-table-column
          v-for="(col, index) in tableHeader"
          :key="index"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :min-width="col.minWidth"
          :type="col.type"
          :header-align="col.headerAlign"
          :column-key="index.toString()"
          :render-header="renderHeader"
          sortable
        >
          <template slot-scope="scope">
            <div
              :class="{'cells':true,'active-row':scope.row.isChecked==true,'active-cell':scope.row.index === tabClickIndex && tabClickLabel === col.label&& tabClickLabel !== 'ID'}"
            >
              <span
                v-if="scope.row.index === tabClickIndex && tabClickLabel === col.label && tabClickLabel !== 'ID'"
              >
                <el-select
                  @change="inputBlur(scope.row,scope.row[col.prop])"
                  v-if="col.isSelectType == 'select'"
                  v-model="scope.row[col.prop]"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in col.SelectArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>

                <el-date-picker
                  @change="inputBlur(scope.row,scope.row[col.prop])"
                  v-else-if="col.isSelectType == 'time'"
                  v-model="scope.row[col.prop]"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  :picker-options="pickerOptions"
                ></el-date-picker>

                <el-popover v-else-if="col.isSelectType == 'cron'" v-model="cronPopover">
                  <cron @change="changeCron" @close="cronPopover=false"></cron>
                  <el-input
                    slot="reference"
                    @click="cronPopover=true"
                    v-model="scope.row[col.prop]"
                    placeholder="请输入定时策略"
                  ></el-input>
                </el-popover>

                <el-button
                  v-else-if="col.isShowDialog"
                  type="primary"
                  size="mini"
                  @click="ShowDialog(scope.row,col)"
                  :autofocus="true"
                  round
                >
                  <span v-if="col.prop != 'mfgPartNo'">设置</span>
                  {{col.label}}
                </el-button>

                <el-input
                  v-else
                  placeholder="请输入"
                  v-model="scope.row[col.prop]"
                  size="mini"
                  @blur="inputBlur(scope.row,scope.row[col.prop])"
                />
              </span>
              <span
                v-else-if="col.isFiltersType == 'time'"
              >{{scope.row[col.prop] | formatDates('yyyy-MM-dd hh:mm:ss') }}</span>
              <span v-else-if="col.isFiltersType == 'state'">{{scope.row[col.prop] | jobState }}</span>
              <span v-else-if="col.isFiltersType == 'isState'">{{scope.row[col.prop] | isJobState }}</span>
              <span v-else>
                <span v-if="scope.row[col.prop] == '' || scope.row[col.prop] == null">null</span>
                <span v-else>
                  {{scope.row[col.prop]}}</span>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { cron } from "vue-cron";
export default {
  components: {
    cron
  },
  props: {
    TableData: {  //表格数据
      default: function() {
        return [];
      },
      type: Array
    },
    header: {  //表格头部
      default: function() {
        return [];
      },
      type: Array
    },
    option: {   //表格选项
      default: function() {
        return {};
      },
      type: Object
    }
  },
  data() {
    return {
      tableHeader: this.header,//表格头部
      dragState: {
        start: -9, // 起始元素的 index
        end: -9, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined // 拖动方向
      },
      checkActiveDataRow: [], //多选表格列数据
      activeDataRow: {}, //选中表格行
      tabClickIndex: null, // 点击的单元格
      tabClickLabel: "", // 当前点击的列名Label
      pickerOptions: {   //时间选择器
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      GetpickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      changeData: [],   
      newChangeData: [],//修改后的数据
      headLabel: "",   //表头的label值
      cronPopover: false, 
      oldRowData: "" //修改之前数据
    };
  },
  watch: {
    header(val, oldVal) {
      this.tableHeader = val;
    }
  },
  methods: {
    renderHeader(createElement, { column }) {
      return createElement(
        "div",
        {
          class: ["thead-cell"],
          on: {
            mousedown: $event => {
              this.handleMouseDown($event, column);
            },
            mousemove: $event => {
              this.handleMouseMove($event, column);
            }
          }
        },
        [
          // 添加 <a> 用于显示表头 label
          createElement("a", column.label),
          // 添加一个空标签用于显示拖动动画
          createElement("span", {
            class: ["virtual"]
          })
        ]
      );
    },
    // 按下鼠标开始拖动
    handleMouseDown(e, column) {
      this.dragState.dragging = true;
      this.dragState.start = parseInt(column.columnKey);
      // 给拖动时的虚拟容器添加宽高
      let table = document.getElementsByClassName("w-table")[0];
      let virtual = document.getElementsByClassName("virtual");
      for (let item of virtual) {
        item.style.height = table.clientHeight - 1 + "px";
        item.style.width = item.parentElement.parentElement.clientWidth + "px";
      }
      document.addEventListener("mouseup", this.handleMouseUp);
    },

    // 鼠标放开结束拖动
    handleMouseUp() {
      this.dragColumn(this.dragState);
      // 初始化拖动状态
      this.dragState = {
        start: -9,
        end: -9,
        dragging: false,
        direction: undefined
      };
      document.removeEventListener("mouseup", this.handleMouseUp);
    },

    // 拖动中
    handleMouseMove(e, column) {
      if (this.dragState.dragging) {
        let index = parseInt(column.columnKey); // 记录起始列
        if (index - this.dragState.start !== 0) {
          this.dragState.direction =
            index - this.dragState.start < 0 ? "left" : "right"; // 判断拖动方向
          this.dragState.end = parseInt(column.columnKey);
        } else {
          this.dragState.direction = undefined;
        }
      } else {
        return false;
      }
    },

    // 拖动易位
    dragColumn({ start, end, direction }) {
      let tempData = [];
      let left = direction === "left";
      let min = left ? end : start - 1;
      let max = left ? start + 1 : end;
      for (let i = 0; i < this.tableHeader.length; i++) {
        if (i === end) {
          tempData.push(this.tableHeader[start]);
        } else if (i > min && i < max) {
          tempData.push(this.tableHeader[left ? i - 1 : i + 1]);
        } else {
          tempData.push(this.tableHeader[i]);
        }
      }
      this.tableHeader = tempData;
    },
    headerCellClassName({ column, columnIndex }) {
      let active =
        columnIndex - 1 === this.dragState.end
          ? `darg_active_${this.dragState.direction}`
          : "";
      let start = columnIndex - 1 === this.dragState.start ? `darg_start` : "";
      return `${active} ${start}`;
    },

    cellClassName({ column, columnIndex }) {
      return columnIndex - 1 === this.dragState.start ? `darg_start` : "";
    },
    TableIsCheck(val) {
      //表格多选选中事件   通过isChecked动态切换class
      let _this = this;
      _this.checkActiveDataRow = val;
      _this.$emit("getCheckData", _this.checkActiveDataRow);
      let indexArr = []; //用于存放多选按钮选中行的下标
      for (let index = 0; index < _this.TableData.length; index++) {
        //把所有的isCheck初始值设为false 为了避免多选取消选中后 行还持续高亮
        _this.TableData[index].isChecked = false;
      }
      for (let index = 0; index < val.length; index++) {
        //循环表里多选选中的
        const element = val[index];
        let i = _this.TableData.findIndex(x => {
          //通过每个对象的index查找到在表格数据所属位置然后将下标放进数组
          return x.index == element.index;
        });
        indexArr.push(i);
      }
      indexArr.forEach(e => {
        //遍历放下标的数组然后修改isCheck
        _this.TableData[e].isChecked = true;
      });
    },
    tableRowClassName({ row, rowIndex }) {
      //把每一行的索引放进row
      // debugger;  //进入debugger
      row.index = rowIndex;
    },
    ActiveRow(row) {
      //   //表格选中行通过isChecked动态切换class
      let _this = this;
      _this.activeDataRow = row; //因为前面的方法把每个下标都加进了row  所以只是row有分别每行的下标
      // if (_this.data[row.index].isChecked == true) {
      //   //点击行通过下标改变样式
      //   _this.data[row.index].isChecked = false;
      // } else {
      //   _this.data[row.index].isChecked = true;
      // }
      // this.$refs.multipleTable.toggleRowSelection(_this.activeDataRow);
    },
    EditData(row, column, cell, event) {
      //单元格修改数据
      this.changeData = []; //始终保持长度为1  避免重复
      this.headLabel = column.label; //获取头部label用来查找 方便于按左右的时候切换
      this.oldRowData = JSON.stringify(row);
      if (cell.getElementsByTagName("input").length > 0) {
        //因为点击单元格后会有个input所以需要判断然后通过.value还是innerHtml来获取
        this.changeData.push({
          id: cell,
          text: cell.getElementsByTagName("input")[0].value
        }); //添加节点以及修改前的内容
      } else {
        this.changeData.push({ id: cell, text: cell.innerText }); //添加节点以及修改前的内容
      }
      this.tabClickIndex = row.index;
      this.tabClickLabel = column.label;
    },
    inputBlur(row, text, event, column) {
      // 失去焦点初始化进行编辑
      let _this = this;
      _this.newChangeData = []; //使数组长度为1避免重复在添加
      _this.newChangeData.push(text);
      _this.tabClickIndex = null;
      _this.tabClickLabel = "";
      for (let index = 0; index < this.changeData.length; index++) {
        const element = this.changeData[index]; //获取聚焦没修改前的值
        const texts = this.newChangeData[index]; //获取失去焦点后的值
        if (element.text == texts) {
          //两个数组进行对比 看是否有没有改变值
          break;
        } else {
          _this.$emit("getEditData", _this.TableData, row, _this.oldRowData); //表格数据  修改后的行 修改前的行
          element.id
            .getElementsByClassName("cell")[0]
            .classList.add("change-cell");
        }
      }
    },
    changeCron(row) {
      this.TableData[this.activeDataRow.index].cron = row;
    },
    InquireData() {
      let search = this.header.map(x => {
        return {label:x.label,search:x.isSearch};
      });
      this.$emit("getSearchData", search);
    },
    ShowDialog(row, col) {
      //单前行 单前列
      this.$emit("showDiaLog", row, col);
      this.tabClickIndex = null;
      this.tabClickLabel = "";
      // console.log(row)
      // console.log(col)
    }
  },

  mounted: function() {
    var _this = this;
    document.onkeydown = function(e) {
      let key = window.event.keyCode;
      if (key == 38) {
        _this.tabClickIndex = _this.tabClickIndex - 1;
      } else if (key == 39) {
        let index = _this.header.findIndex(x => {
          return x.label == _this.headLabel;
        });
        _this.tabClickLabel = _this.header[index + 1].label;
        _this.headLabel = _this.header[index + 1].label;
      } else if (key == 37) {
        let index = _this.header.findIndex(x => {
          return x.label == _this.headLabel;
        });
        _this.tabClickLabel = _this.header[index - 1].label;
        _this.headLabel = _this.header[index - 1].label;
      } else if (key == 40) {
        _this.tabClickIndex = _this.tabClickIndex + 1;
      } else if (key == 67 && e.ctrlKey) {
        var oInput = document.createElement("input"); //创建一个隐藏input（重要！）
        oInput.value = _this.changeData[0].text; //赋值
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = "oInput";
        oInput.style.display = "none";
        _this.$message.success("复制成功");
      }
    };
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.getElementsByClassName("el-input__inner")[0].focus();
      }
    }
  }
};
</script>

<style lang="scss">
.w-table {
  　.el-table .darg_start {
    background-color: #f3f3f3;
  }
  .el-table th,tr td {
    padding: 0;
    height: 40px;
    .virtual {
      position: fixed;
      display: block;
      width: 0;
      height: 0;
      margin-left: -10px;
      background: none;
      border: none;
    }
    &.darg_active_left {
      .virtual {
        border-left: 2px dotted #666;
        z-index: 99;
      }
    }
    &.darg_active_right {
      .virtual {
        border-right: 2px dotted #666;
        z-index: 99;
      }
    }
  }
  .thead-cell {
    padding: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: left;
    cursor: pointer;
    overflow: initial;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }
  &.w-table_moving {
    .el-table th .thead-cell {
      cursor: move !important;
    }
    .el-table__fixed {
      cursor: not-allowed;
    }
  }
  .active-row {
    background-color: #ebb563;
    color: #fff;
  }
  tr:hover {
    background-color: #f0f0f0;
  }
  tr:hover .active-row {
    background-color: #f0f0f0;
    color: #606266;
  }
  .cells {
      width: 100%;
      height: 100%;
    border: 2px solid transparent;
  }
  .change-cell {
    background-color: #ebb563;
    color: white;
  }
  .el-date-editor.el-input.el-input--medium.el-input--prefix.el-input--suffix.el-date-editor--datetime {
    width: 240px;
    padding-right: 10px;
  }
  .active-cell {
    border: 2px solid #ebb563 !important;
    background-color: #fff !important;
  }
  .el-input__inner {
    border: 0px !important;
  }
  .input-box {
    display: flex;
  }

  .gutter {
    display: none !important;
  }
  .el-table th > .cell {
    padding: 0px !important;
  }
}
.is-group.has-gutter tr:first-child th {
  background-color: white !important;
  padding: 0px;
}
.el-date-editor.el-range-editor.el-input__inner.el-date-editor--datetimerange.el-range-editor--medium {
  width: 100%;
  text-indent: 0px;
}
[data-v-348a3283]
  .el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--medium {
  border-top: 1px solid #dfe6ec;
}
.cell{
    height: 100%;
    padding: 0px !important;
}
</style>


