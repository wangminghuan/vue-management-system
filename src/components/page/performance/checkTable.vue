<template>
<section>
<div style="margin:36px 0">
<span class="perform-select-left">职级</span>
 <el-select v-model="value" @change="handleSelct" clearable placeholder="请选择" style="margin-left:50px">
    <el-option
      v-for="item in optionData"
      :key="item.s_id"
      :label="item.s_name"
      :value="item.s_id">
    </el-option>
  </el-select>
 </div>
  <div   class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition" style="width: 1000px;min-width:1000px">
        <div class="el-table__header-wrapper">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 819px;">
            <colgroup>
              <col name="el-table_5_column_13" width="277">
              <col name="el-table_5_column_14" width="278">
              <col name="el-table_5_column_15" width="278">
              <col name="el-table_5_column_16" width="150">
             <col name="gutter" width="17">
            </colgroup>
            <thead class="has-gutter">
                <tr class="">
                    <th colspan="1" rowspan="1" class="el-table_5_column_13 is-leaf">
                        <div class="cell">职级</div>
                    </th>
                    <th colspan="1" rowspan="1" class="el-table_5_column_14 is-leaf">
                        <div class="cell">考核指标</div>
                    </th>
                    <th colspan="1" rowspan="1" class="el-table_5_column_15 is-leaf">
                        <div class="cell">指标值</div>
                    </th>
                    <th colspan="1" rowspan="1" class="el-table_5_column_16 is-leaf">
                        <div class="cell">操作</div>
                    </th>
                    <th class="gutter" style="width: 17px;"></th>
                </tr>
            </thead>
        </table>
      </div>
        <div class="el-table__body-wrapper is-scroll-left" style="max-height:600px;overflow-y:scroll">
        <div v-if="renderData.length==0" class="el-table__empty-block" style="width: 981px;"><span class="el-table__empty-text">暂无数据</span></div>
        <table v-else cellspacing="0" cellpadding="0" border="0" class="el-table__body perform-check-table">
        <tbody>
          <tr class="el-table__row" v-for="(item,index) in myRenderData" :key="index">
              <td class="single">
                  <div class="cell">{{item.s_name}}</div>
              </td>
              <td class="multi">
              <ul v-for="(sub,_index) in item.n_config" :key="_index" class="clearfix">
                  <div class="cell fl"><em>{{sub.r_name}}</em></div>
                  <div class="cell fr"><em>{{sub.num+sub.r_unit}}</em></div>
              </ul>
              </td>
              <td class="option">
                  <div class="cell" @click="handleClickEdit(item,tabName,tabIndex)">
                      <button type="button" class="el-button el-button--text el-button--small">
                      <span>编辑</span>
                      </button>
                  </div>
              </td>
          </tr>
        </tbody>
        </table>
        </div>
        </div>

</section>
</template>
<script>
export default {
  props:{
      renderData:Array,
      tabIndex:Number,
      tabName:String
  },
  data(){
      return{
        value:"",
        myRenderData:[],
        copyData:[]
      }
      
  },
  watch:{
     renderData:function(val){
      this.myRenderData=val;
      this.copyData=val
     }
  },
  computed:{
      optionData:function(){
        let result=[];
         this.copyData.map((item)=>{
            result.push({
                s_id:item.s_id,
                s_name:item.s_name
            })
         })
         return result;
      }
  },
  methods:{
      handleSelct(val){
        let _data=[];
         this.copyData.map((item)=>{
            if(item.s_id===val){
                _data.push(item)
            }
         })
         if(_data.length>0){
            this.myRenderData=_data;
         }else{
            this.myRenderData=this.renderData;
         }
      },
      //用户管理编辑按钮
    handleClickEdit(row,name,index) {
      let __data={
           data:row,
           name:name,
           index:index
      }
      sessionStorage.setItem("__p_check_table__",JSON.stringify(__data))
      setTimeout(()=>{
          this.$router.push("/performance_check_tabledit")
      },0)
    }
  }
}
</script>

<style lang="scss">
.perform-select-left{
  position: absolute;
font-size:14px;
left:0;
color:#353535;
line-height: 40px;
}
 .perform-check-table {
    .single {
      width: 284px;
    }
    .option {
      width: 150px;
    }
    .cell {
      text-align: center;
    }

    .multi {
      // height: 50px;
      width: 2*284px;
      padding: 0;
      ul {
        border-bottom: 1px solid #e6ebf5;
        box-sizing: border-box;
      }

      .cell.fl,
      .cell.fr {
        // width: 200px;
        height: 50px;
        line-height: 50px;
        width: 50%;
      }

      .cell.fl {
        float: left;
        border-right: 1px solid #e6ebf5;
      }
      .cell.fr {
        float: right;
      }
    }
    ul:last-child {
      border-bottom: 0;
    }
  }
</style>

