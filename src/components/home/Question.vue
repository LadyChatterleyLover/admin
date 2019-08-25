<template>
  <div>
    <el-card>
      <div slot="header">
        <h1>网站问卷调查</h1>
      </div>
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="name"
            label="问卷名称"
            align="center">
        </el-table-column>
        <el-table-column
            prop="desc"
            label="问卷描述"
            align="center">
        </el-table-column>
        <el-table-column
            prop="startTime"
            label="创建时间"
            sortable
            align="center">
        </el-table-column>
        <el-table-column
            prop="endTime"
            label="截止时间"
            sortable
            align="center">
        </el-table-column>
        <el-table-column
            label="问卷主题"
            align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0">已发布</el-tag>
            <el-tag v-if="scope.row.status === 1">未发布</el-tag>
            <el-tag v-if="scope.row.status === 2">已截止</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="网站名称"
            align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.url.includes('baidu')">百度</el-tag>
            <el-tag type="warning" v-if="scope.row.url.includes('juejin')">掘金</el-tag>
            <el-tag type="danger" v-if="scope.row.url.includes('douban')">豆瓣</el-tag>
            <el-tag type="info" v-if="scope.row.url.includes('git')">Github</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="check(scope.row)">查看网站详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
        title="复制地址"
        width="40%"
        :visible.sync="dialogVisible"
    >
      <div>
        <div class="top">
          <div class="input">
            <el-input v-model="url" size="mini"></el-input>
          </div>
          <div>
            <el-button type="danger"
                       size="small"
                       v-clipboard:copy="url"
                       v-clipboard:success="onCopy"
                       v-clipboard:error="onError">复制
            </el-button>
          </div>
        </div>
        <div class="desc">
          如无法使用上方复制按钮，请选中内容后，使用 Ctrl + C 复制。也可扫描下方二维码或右键保存二维码进行访问。
        </div>
      </div>
      <div class="code">
        <div id='code' ref="qrcode"></div>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="sure">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </span>
    </el-dialog>
  </div>

</template>

<script>
  import QRCode from 'qrcodejs2'

  export default {
    name: "Question",
    components: {},
    props: {},
    data() {
      return {
        tableData: [],
        dialogVisible: false,
        url: '',
        qrcodeObj: {}, // 二维码
      }
    },
    methods: {
      getData() {
        this.$com.req('api/question').then(res => {
          if (res.code === 200) {
            this.tableData = res.data
          }
        })
      },
      check(row) {
        this.dialogVisible = true
        this.url = row.url
        this.$nextTick(() => {
          this.qrcode()
        })
      },
      qrcode() {
        this.qrcodeObj = new QRCode('code', {
          width: 200, // 设置宽度，单位像素
          height: 200, // 设置高度，单位像素
          text: this.url// 设置二维码内容或跳转地址
        })
      },
      onCopy() {
        this.$message({
          type: 'success',
          message: '复制成功'
        })
      },
      onError() {
        this.$message({
          type: 'error',
          message: '复制失败'
        })
      },
      sure() {
        this.dialogVisible = false
        this.$refs.qrcode.innerHTML = ''
      }
    },
    mounted() {
      this.getData()
    },
    created() {

    },
    filters: {},
    computed: {},
    watch: {},
    directives: {}
  }
</script>

<style scoped lang="scss">
  .top {
    width: 100%;
    display: flex;
    align-items: center;

    .input {
      flex: 1;
      margin-right: 20px;
    }
  }

  .desc {
    background: #EBF5FF;
    color: #657180;
    font-size: 14px;
    padding: 15px 10px;
    margin-top: 20px;
    line-height: 1.5;
    border-radius: 8px;
  }

  .code {
    height: 200px;
    width: 100%;
    display: flex;
    margin-top: 20px;
    align-items: center;
    justify-content: center;

    #code {
      width: 200px;
      height: 200px;
    }
  }
</style>
