<template>
  <div class="app-container">
    <!-- 高级查询区域 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="100px">
      <el-form-item label="机构号" prop="orgCode">
        <el-select v-model="queryParams.orgCode" placeholder="请选择机构号">
          <el-option
            v-for="item in orgCodeOptions"
            :key="item.orgCode"
            :label="item.orgName"
            :value="item.orgCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表数据 -->
     <!-- 产品类型需从字典中获取名称展示出来 -->
    <el-table v-loading="loading" :data="organDualRecordingReport">
      <el-table-column label="组织机构代码" width="150" align="center" prop="orgCode" />
      <el-table-column label="双录视频数量" width="150" align="center" prop="imageCount" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getOrganDualRecordingReport, getOrgCodeOptions} from "@/api/dualRecording/customer";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 机构号选项
      orgCodeOptions: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams : {
        pageNum: 1,
        pageSize: 10,
        orgCode: undefined,
      },
      // 用户双录视频数量统计列表
      organDualRecordingReport: [],
    };
  },
  created() {
    try {
      this.getList();
      this.getBeforeData();
    } catch (error) {
      console.error(error);
    }
    
  },
  methods: {
    // 请求获取所有下拉选择数据
    async getBeforeData() {
      // 请求获取机构号
      getOrgCodeOptions().then(response => {
        console.log(response.data);
        this.orgCodeOptions = response.data;
      });
    },

    /** 查询用户双录视频数量统计列表 */
    getList() {
      this.loading = true;
      getOrganDualRecordingReport(this.queryParams.orgCode).then(response => {
        // console.log(response);
        this.organDualRecordingReport = response.data;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
}
</script>