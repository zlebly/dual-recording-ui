<template>
  <div class="app-container">
    <!-- 高级查询区域 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="客户姓名"  prop="cusName">
        <!-- clearable:输入框清除按钮 -->
        <!-- @keyup.enter.native:输入框回车动作 -->
        <el-input
            v-model="queryParams.cusName"
            placeholder="请输入客户姓名"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建日期(起)" prop="createDateStart">
        <el-date-picker 
            clearable
            v-model="queryParams.createDateStart"
            type="date"
            value-format="yyyyMMdd"
            placeholder="请选择创建日期(起)">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建日期(止)" prop="createDateEnd">
        <el-date-picker 
            clearable
            v-model="queryParams.createDateEnd"
            type="date"
            value-format="yyyyMMdd"
            placeholder="请选择创建日期(止)">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="证件类型" prop="idType">
        <el-select v-model="queryParams.idType" placeholder="请选择证件类型">
          <el-option
            v-for="item in idTypeOptions"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode">
          </el-option>
        </el-select>
      </el-form-item>
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
    
    <!-- 工具栏 -->
    <!-- gutter:设置列间距 -->
    <!-- plain:按钮背景色透明-->
    <el-row :gutter="10" class="toolbar">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['customerInfo:customerCode:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['customerInfo:customerCode:update']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['customerInfo:customerCode:delete']"
        >删除</el-button>
      </el-col>
      <!-- 用于隐藏搜索栏和刷新列表 -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表数据 -->
     <!-- 产品类型需从字典中获取名称展示出来 -->
    <el-table v-loading="loading" :data="customerInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" width="150" align="center" prop="id" />
      <el-table-column label="客户姓名" width="150" align="center" prop="cusName" />
      <el-table-column label="证件类型" width="150" align="center" prop="idType" />
      <el-table-column label="证件号码" width="150" align="center" prop="idCard" />
      <el-table-column label="客户账号" width="150" align="center" prop="cusAccNo"/>
      <el-table-column label="产品ID" width="100" align="center" prop="productId" />
      <el-table-column label="用户ID" width="100" align="center" prop="userName" />
      <el-table-column label="创建日期" width="150" align="center" prop="createDate" />
      <el-table-column label="图片编号" width="150" align="center" prop="imageNo" />
      <el-table-column label="组织机构代码" width="150" align="center" prop="orgCode" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或者修改产品信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编号" prop="id" style="display: none;">
          <el-input v-model="form.id" type="hidden" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="cusName">
              <el-input v-model="form.cusName" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户账号" prop="cusAccNo">
              <el-input v-model="form.cusAccNo" placeholder="请输入客户账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件类型" prop="idType">
              <el-select v-model="form.idType" placeholder="请选择证件类型">
                <el-option
                  v-for="item in idTypeOptions"
                  :key="item.dictCode"
                  :label="item.dictName"
                  :value="item.dictCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入证件号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品信息" prop="productId">
              <el-select v-model="form.productId" placeholder="请选择产品信息">
                <el-option
                  v-for="item in productInfoOptions"
                  :key="item.productId"
                  :label="item.productName"
                  :value="item.productId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getIdTypeOptions, getUserIdOptions, getOrgCodeOptions, getCustomerInfoList, getProductList
  , addCustomer, updateCustomer, delCustomer} from "@/api/dualRecording/customer";
export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组编号
      ids: [],
      // 选中数组数据
      selectedRows: {},
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams : {
        pageNum: 1,
        pageSize: 10,
        idType: undefined,
        userId: undefined,
        orgCode: undefined,
        cusName: undefined,
        productId: undefined,
        createDateStart: undefined,
        createDateEnd: undefined
      },
      // 证件列表选项
      idTypeOptions: [],
      // 录入人选项
      userIdOptions: [],
      // 机构号选项
      orgCodeOptions: [],
      // 产品信息选项
      productInfoOptions: [],
      // 用户信息表格数据
      customerInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 新增/修改
      isAdd: true,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cusName: [
          { required: true, message: "客户姓名不能为空", trigger: "blur" }
        ],
        cusAccNo: [
          { required: true, message: "客户账号不能为空", trigger: "blur" }
        ],
        idType: [
          { required: true, message: "证件类型不能为空", trigger: "blur" }
        ],
        idCard: [
          { required: true, message: "证件号码不能为空", trigger: "blur" }
        ],
        productId: [
          { required: true, message: "产品信息不能为空", trigger: "blur" }
        ]
      }
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
      // 请求获取证件类型
      getIdTypeOptions().then(response => {
        this.idTypeOptions = response.data;
      });
      // 请求获取录入人
      getUserIdOptions().then(response => {
        this.userIdOptions = response.data;
      });
      // 请求获取机构号
      getOrgCodeOptions().then(response => {
        console.log(response.data);
        this.orgCodeOptions = response.data;
      });
      // 添加用户时查询产品列表
      getProductList().then(response => {
        this.productInfoOptions = response.data;
      });
    },

    /** 查询用户信息 */
    getList() {
      this.loading = true;
      getCustomerInfoList(this.queryParams).then(response => {
        this.customerInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        id :undefined,
        idCard: undefined,
        idType: undefined,
        cusName: undefined,
        cusAccNo: undefined,
        productId: undefined
      };
      this.resetForm("form");
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
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
      if(!this.single) {
        this.selectedRows = selection[0];
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.isAdd = true;
      this.reset();
      this.open = true;
      this.title = "客户信息添加";
    },
    /** 修改按钮操作 */
    // TODO 产品id和产品名需要转换
    handleUpdate() {
      this.reset();
      this.isAdd = false;
      this.form.id = this.selectedRows.id;
      this.form.cusName = this.selectedRows.cusName;
      this.form.cusAccNo = this.selectedRows.cusAccNo;
      this.form.idCard = this.selectedRows.idCard;
      
      this.form.idType = this.selectedRows.idType;
      // 获取选中产品的名称和ID值
      const selectedProduct = this.productInfoOptions.find(
        item => item.productId === this.selectedRows.productId
      );
      if (selectedProduct) {
        // this.form.productName = selectedProduct.productName;
        this.form.productId = selectedProduct.productName;
      }
      this.open = true;
      this.title = "修改客户信息";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if(valid) {
          if(this.isAdd) {
            addCustomer(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            })
          } else {
            // 获取选中的证件类型和证件号
            const selectedId = this.idTypeOptions.find(
              item => item.dictName === this.form.idType
            );
            if (selectedId) {
              this.form.idType = selectedId.dictCode;
            }
            updateCustomer(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });  
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.customerId || this.ids;
      this.$modal.confirm('是否确认删除用户编号为"' + id + '"的数据项？').then(function() {
        return delCustomer(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
}
</script>