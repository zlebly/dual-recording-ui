<template>
  <div class="app-container">
    <!-- 高级查询区域 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="100px">
      <el-form-item label="录入人" prop="userId">
        <el-select v-model="queryParams.userId" placeholder="请选择录入人">
          <el-option
            v-for="item in userIdOptions"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- TODO 此处机构号先使用deptId -->
      <el-form-item label="机构号" prop="orgCode">
        <el-select v-model="queryParams.orgCode" placeholder="请选择机构号">
          <el-option
            v-for="item in orgCodeOptions"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId">
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
    <el-table v-loading="loading" :data="customerDualRecordingReport">
      <el-table-column label="机构号" width="150" align="center" prop="orgCode" />
      <el-table-column label="录入人" width="150" align="center" prop="userName" />
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
import { getCustomerDualRecordingReport, getUserIdOptions, getOrgCodeOptions} from "@/api/dualRecording/customer";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 录入人选项
      userIdOptions: [],
      // 机构号选项
      orgCodeOptions: [],
      // 总条数
      total: 0,
      // 查询参数
      queryParams : {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        orgCode: undefined,
      },
      // 用户双录视频数量统计列表
      customerDualRecordingReport: [],
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
      // 请求获取录入人
      getUserIdOptions().then(response => {
        this.userIdOptions = response.data;
      });
      // 请求获取机构号
      getOrgCodeOptions().then(response => {
        console.log(response.data);
        this.orgCodeOptions = response.data;
      });
    },

    /** 查询用户双录视频数量统计列表 */
    getList() {
      this.loading = true;
      getCustomerDualRecordingReport(this.queryParams.orgCode, this.queryParams.userId).then(response => {
        this.customerDualRecordingReport = response.data;
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