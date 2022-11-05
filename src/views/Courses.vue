<template>
  <section class="courses">
    <!-- 表单部分 -->
    <el-form class="actions" :inline="true" :model="filter">
      <el-form-item class="input-title" label="课程名称">
        <el-input
          v-model="filter.courseName"
          type="search"
          placeholder="课程名称"
        />
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="filter.status" placeholder="课程状态">
          <el-option label="全部" value></el-option>
          <el-option label="已发布" value="1"></el-option>
          <el-option label="草稿" value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="filterQuery">查询</el-button>
      </el-form-item>

      <el-form-item class="btn-add">
        <el-button type="primary" icon="el-icon-plus" @click="addCourse"
          >新建课程</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格部分 -->
    <el-table
      :data="courses"
      v-loading="loading"
      element-loading-text="数据加载中..."
    >
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column
        prop="courseName"
        label="课程名称"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        align="center"
        width="120"
        :formatter="priceFormatter"
      ></el-table-column>
      <el-table-column
        prop="sortNum"
        label="排序"
        align="center"
        width="120"
      ></el-table-column>

      <!-- 状态展示 -->
      <el-table-column prop="status" label="状态" align="center" width="120">
        <template slot-scope="scope">
          <i
            class="status status-success"
            title="已发布"
            v-if="scope.row.status == '1'"
          >已发布</i>
          <i
            class="status status-warning"
            title="草稿"
            v-else-if="scope.row.status == '0'"
          >草稿</i>
        </template>
      </el-table-column>

      <!-- 操作部分 -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <!-- 状态按钮 -->
          <el-button
            size="mini"
            :type="scope.row.status == '1' ? 'danger' : 'success'"
            @click="updateStatus(scope.row)"
            >{{ scope.row.status == "1" ? "下架" : "发布" }}</el-button
          >

          <!-- 营销信息按钮 -->
          <el-button
            size="mini"
            @click="handleNavigate('CourseItem', scope.row.id)"
            >营销信息</el-button
          >

          <!-- 内容管理按钮 -->
          <el-button
            size="mini"
            @click="handleNavigate('CourseTasks', scope.row.id)"
            >内容管理</el-button
          >
        </template>
      </el-table-column>
    </el-table>

<!--分页-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

<!--    dialog对话框-->
    <el-dialog title="新增课程" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="课程名称">
          <el-input v-model="form.courseName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input v-model="form.brief" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程价格">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-upload
            class="upload-demo"
            action="http://localhost:8080/ssm-web/course/courseUpload"
            :on-success=uploadpath
            :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savebutton">确 定</el-button>
      </div>
    </el-dialog>
  </section>


</template>

// JS部分代码
<script>

import {findAllCourse, saveOrUpdateCourse, updateCourseStatus} from "@/api/course";

export default {
  name: "Courses",
  title: "课程管理",
  //定义数据部分
  data() {
    return {
      filter: {currentPage:1, pageSize:5, courseName: "", status: "" }, //查询对象
      courses: [], //课程信息集合
      loading: false, //是否弹出加载
      total:undefined,
      dialogFormVisible:false,
      pagesize:undefined,
      fileList:[],
      form:{
        courseName:undefined,
        brief:undefined,
        price:undefined,
        courseListImg:undefined,
      }
    };
  },

  //钩子函数
  created() {
    this.loadCourses();
  },

  methods: {
    //当前页改变事件
    handleCurrentChange(date){
      this.filter.currentPage=date;
      this.loadCourses();
    },
    //每页显示条数切换
    handleSizeChange(date){
      this.filter.pageSize=date;
      this.loadCourses();
    },


    //方法1: 获取课程列表
    loadCourses() {
      findAllCourse(this.filter).then(response=>{
        this.courses = response.content.list;
        this.total=response.content.total;
        this.pagesize = response.content.pageSize;
      })
    },

    //方法2: 条件查询课程信息
    filterQuery() {
      this.loadCourses()
    },

    //方法3: 添加课程跳转方法
    addCourse() {
            this.courseName=undefined
            this.brief=undefined
            this.price=undefined
            this.courseListImg=undefined
            this.dialogFormVisible=true;
    },

    //方法4: 修改课程状态
    updateStatus(item) {
      updateCourseStatus({id:item.id,status:item.status==1?0:1})
      // if (item.status == 1){
      //   updateCourseStatus(item.id,0)
      //   this.loadCourses()
      // }else {
      //   updateCourseStatus(item.id,1)
      //   this.loadCourses()
      // }

      this.loadCourses()
    },

    savebutton(){
      saveOrUpdateCourse(this.form).then(data=>{
        if(data.success==true){
          this.loadCourses()
          this.dialogFormVisible=false;
        }else {
          Msesage.error(data.message);
        }
      })
    },

    //方法5: 根据路由名称, 导航到对应组件
    handleNavigate(name,id) {
      this.$router.push({name:name,params:{courseId:id}})
    },

    uploadpath(resp,file){
      this.form.courseListImg=resp.content.filepath;
    },
    //价格前面添加¥ 方法
    priceFormatter(row, column, value, index) {
      return `¥${value}`;
    }
  }
};
</script>
