<template>
  <div class="app-container">
    <!-- 高级查询区域 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="产品代码"  prop="productId">
        <!-- clearable:输入框清除按钮 -->
        <!-- @keyup.enter.native:输入框回车动作 -->
        <el-input
            v-model="queryParams.productId"
            placeholder="请输入产品代码"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建日期(起)" prop="createTimeStart">
        <el-date-picker 
            clearable
            v-model="queryParams.createTimeStart"
            type="date"
            value-format="yyyyMMdd"
            placeholder="请选择创建日期(起)">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建日期(止)" prop="createTimeEnd">
        <el-date-picker 
            clearable
            v-model="queryParams.createTimeEnd"
            type="date"
            value-format="yyyyMMdd"
            placeholder="请选择创建日期(止)">
        </el-date-picker>
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
          v-hasPermi="['productInfo:productCode:add']"
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
          v-hasPermi="['productInfo:productCode:update']"
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
          v-hasPermi="['productInfo:productCode:delete']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload"
          size="mini"
          @click="handleUpload"
          v-hasPermi="['productInfo:productCode:upload']"
        >导入</el-button>
      </el-col>
      <!-- 用于隐藏搜索栏和刷新列表 -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表数据 -->
     <!-- 产品类型需从字典中获取名称展示出来 -->
    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="产品编号" width="150" align="center" prop="id" />
      <el-table-column label="产品代码" width="150" align="center" prop="productId" />
      <el-table-column label="产品名称" width="150" align="center" prop="productName" />
      <el-table-column label="产品类型" width="150" align="center" prop="productType"/>
        <!-- <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_product_type" :value="scope.row.productType"/>"
        </template>
      </el-table-column> -->
      <el-table-column label="风险提示" width="150" align="center" prop="riskTips" />
      <el-table-column label="创建日期" width="150" align="center" prop="createDate" />
      <el-table-column label="创建人" width="150" align="center" prop="createUserName" />
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
        <el-form-item label="产品编号" prop="id" style="display: none;">
          <el-input v-model="form.id" type="hidden" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品类型" prop="productType">
              <el-input v-model="form.productType" placeholder="请输入产品类型" />
              <!-- <el-select v-model="form.productType" placeholder="请选择产品类型">
                <el-option
                  v-for="dict in dict.type.sys_product_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict"
                ></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品代码" prop="productId">
              <el-input v-model="form.productId" placeholder="请输入产品代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风险提示" prop="riskTips">
              <el-input v-model="form.riskTips" placeholder="请输入风险提示" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="文件上传" :visible.sync="uploadOpen" width="400px" :before-close="handleBeforeClose">
      <el-upload
        ref="upload"
        class="upload-product"
        drag
        :auto-upload="false"
        :on-change="handleChange"
        :before-upload="beforeUpload"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpload">取消</el-button>
        <el-button type="primary" @click="submitUpload">上传</el-button>
      </span>
      <!-- 添加模板下载链接，并使用Vue事件处理下载 -->
      <div style="text-align: center; margin-top: 16px;">
        <a href="/downloads/产品代码导入模版.xlsx" download="产品代码导入模版.xlsx" style="text-decoration: underline; color: blue;">下载模板文件</a>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getProductList, addProduct, updateProduct, delProduct, uploadProductExcel, 
  downloadProductTemplateExcel } from "@/api/product";
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
      // 产品信息表格数据
      productList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示上传界面
      uploadOpen: false,
      // 新增/修改
      isAdd: true,
      // 查询参数
      queryParams : {
        pageNum: 1,
        pageSize: 10,
        productId: undefined,
        createTimeStart: undefined,
        createTimeEnd: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        productId: [
          { required: true, message: "产品代码不能为空", trigger: "blur" }
        ],
        productName: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        productType: [
          { required: true, message: "产品类型不能为空", trigger: "blur" }
       ]
      },
      uploadFiles: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询产品列表 */
    getList() {
      this.loading = true;
      getProductList(this.queryParams).then(response => {
        this.productList = response.rows;
        // console.log(this.productList)
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
        productName: undefined,
        productType: undefined,
        productId: undefined,
        riskTips: undefined
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
      // console.log(this.single)
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
      this.title = "添加产品";
    },
    /** 修改按钮操作 */
    handleUpdate() {
      this.reset();
      this.isAdd = false;
      this.form.id = this.selectedRows.id;
      this.form.productId = this.selectedRows.productId;
      this.form.productName = this.selectedRows.productName;
      this.form.productType = this.selectedRows.productType;
      this.form.riskTips = this.selectedRows.riskTips;
      this.open = true;
      this.title = "修改产品";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if(valid) {
          if(this.isAdd) {
            // console.log(this.form);
            addProduct(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            })
          } else {
            updateProduct(this.form).then(response => {
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
      const id = row.productId || this.ids;
      this.$modal.confirm('是否确认删除产品编号为"' + id + '"的数据项？').then(function() {
        return delProduct(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导入按钮操作 */
    handleUpload() { 
      this.uploadOpen = true;
    },
    submitUpload() {
      try {
        if(this.uploadFiles && this.uploadFiles.length > 0) {
          let formData = new FormData();
          this.uploadFiles.forEach((file) => {
            formData.append(`files`, file);
          });
          uploadProductExcel(formData).then(response => {
            this.$modal.msgSuccess("导入成功");
            this.cancelUpload();
            this.getList();
          })
        } else {
          this.$modal.msgError("导入失败, 请重新选择上传文件");
        }
      } catch (error) {
        console.error('文件上传失败:', error);
        this.$modal.msgError("导入失败, 请重新选择上传文件");
      }
      
    },
    handleChange(file, fileList) {
      console.log(fileList);
      // this.uploadFile = file.raw;
      this.uploadFiles = fileList.map(file => file.raw);
    },
     // 文件上传前的校验
    beforeUpload(file) {
      const isXlsOrXlsx = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const maxSize = 1024 * 1024 * 10; // 10MB限制
      if (!isXlsOrXlsx) {
        this.$message.error('只能上传xls或xlsx格式的文件！');
        return false;
      }
      if (file.size > maxSize) {
        this.$message.error('文件大小不能超过10MB！');
        return false;
      }
      return true;
    },
    // downloadTemplate() {
    //   downloadProductTemplateExcel().then(response => {
    //     this.$modal.msgSuccess("下载成功");
    //   })
    // },
    handleBeforeClose() {
      this.cancelUpload();
    },
    cancelUpload() {
      this.uploadFiles = [];
      this.$refs.upload.clearFiles(); // 清除已选文件列表
      this.uploadOpen = false;
    }
  }
}
</script>