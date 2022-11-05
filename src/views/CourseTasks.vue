<template>
  <section class="course-tasks">
    <!-- 头部 -->
    <div class="header">
      <!-- 显示当前课程的名称 -->
      <el-page-header @back="() => this.$router.back()" :content="addSectionForm.courseName" />

      <!-- 添加章节按钮 -->
      <el-button type="primary" icon="el-icon-plus" @click="handleShowAddSection">添加章节</el-button>
    </div>

    <!-- 树形控件,展示课程对应的章节信息 -->
    <el-tree
      :data="sections"
      :props="treeProps"
      v-loading="loading"
      element-loading-text="数据加载中..."
    >
      <!-- slot-scope:代表当前树节点内容,有两个参数 data表示当前树节点, node表示当前节点状态 -->
      <div class="inner" slot-scope="{ data, node }">
        <span>{{ data.sectionName || data.theme }}</span>

        <!-- 操作按钮 -->
        <span class="actions">
          <!-- 编辑章节  @click.stop 阻止事件冒泡 -->
          <el-button v-if="node.level == 1" size="small" @click.stop="handleEditSection(data)">编辑</el-button>

          <!-- 修改章节状态 -->
          <el-button
            v-if="node.level == 1"
            size="small"
            @click.stop="showStatus(data)"
          >{{ statusMapping[data.status] }}</el-button>
        </span>
      </div>
    </el-tree>
    <!-- 树形控件,展示课程对应的章节信息 -->

    <!-- 修改章节状态-对话框 -->
    <el-dialog class="toggle-dialog" title="提示" :visible.sync="showStatusForm" width="30%">
      <header class="toggle-header">
        <i class="el-icon-info"></i>
        <span>
          当前状态：{{
          statusMapping[statusForm.status]
          }}
        </span>
      </header>

      <el-form label-position="right" label-width="110px" :model="statusForm">
        <el-form-item label="状态变更为：">
          <el-select v-model="statusForm.status" style="width: 100%">
            <el-option
              v-for="(item,index) in Object.keys(statusMapping)"
              :key="index"
              :label="statusMapping[item]"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showStatusForm = false">取 消</el-button>
        <el-button type="primary" @click="updateStatus">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改章节状态 -->

    <!-- 添加或修改章节 -->
    <el-dialog class="add-dialog" title="章节信息" :visible.sync="showAddSection">
      <el-form
        label-position="right"
        label-width="80px"
        ref="addSectionForm"
        :model="addSectionForm"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="addSectionForm.courseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input v-model="addSectionForm.sectionName"></el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input type="textarea" v-model="addSectionForm.description"></el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="orderNum">
          <el-input v-model="addSectionForm.orderNum" type="number">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddSection = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSection">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加或修改章节 -->
  </section>
</template>

<script>

import {
  findCourseByCourseId,
  findSectionAndLesson,
  saveOrUpdateSection,
  updateSectionStatus
} from "@/api/courseContent";

export default {
  name: "CourseTasks",
  title: "课程结构",
  data() {
    //定义章节信息
    const addSectionForm = {
      courseId: undefined,
      courseName: "",
      sectionName: "",
      description: "",
      orderNum: 0,
      id:undefined
    };

    //章节与课时信息,树形结构
    const treeProps = {
      label: item => {
        return item.sectionName || item.theme;
      },
      children: "courseLessonList"
    };

    //定义章节状态信息
    const statusMapping = {
      0: "已隐藏",
      1: "待更新",
      2: "已更新"
    };

    const statusForm = {
      status: 0
    };

    return {
      addSectionForm,
      treeProps,
      sections: [],
      statusForm, //状态表单
      statusMapping,
      huixianzhangjieshuju:undefined,

      loading: false, //树形控件
      showAddSection: false, //添加或修改章节
      showStatusForm: false //状态修改
    };
  },
  created() {
    //1.显示当前页面在网站中的位置
    this.$breadcrumbs = [
      { name: "Courses", text: "课程管理" },
      { text: "课程结构" }
    ];

    //2. 从路由中获取传递的参数, 课程id
    const id = this.$route.params.courseId;
    if (!id) return this.redirectToError();

    //3.加载课程信息
    this.loadCourse(id);

    //4.加载课程对应的章节与课时
    this.loadChildren(id);
  },
  methods: {
    //方法1: 加载课程信息
    loadCourse(id) {
      findCourseByCourseId({courseId:id}).then(resp=>{
        this.addSectionForm.courseId = id
        this.addSectionForm.courseName = resp.content.courseName
      })
    },

    //方法2: 加载树(章节与课程)
    loadChildren(id) {
      findSectionAndLesson({courseId:id}).then(resp=>{
        this.sections=resp.content
      })
    },

    //方法3: 显示添加章节表单,回显课程信息
    handleShowAddSection() {
      this.showAddSection=true;

    },
    //方法4: 添加&修改章节操作
    handleAddSection() {
      saveOrUpdateSection(this.addSectionForm).then(resp=>{
        if(resp.success){
          this.showAddSection=false;
              this.addSectionForm.sectionName= "";
              this.addSectionForm.description= "";
              this.addSectionForm.orderNum= 0;
              this.addSectionForm.id=undefined
          this.loadChildren(this.addSectionForm.courseId)
        }
      })
    },

    //方法5: 修改章节回显方法
    handleEditSection(section) {
      this.addSectionForm.id=section.id
      this.addSectionForm.sectionName = section.sectionName
      this.addSectionForm.description = section.description
      this.addSectionForm.orderNum = section.orderNum
      this.showAddSection=true
    },

    //方法6: 显示章节状态
    showStatus(data) {
      this.showStatusForm = true
      this.statusForm.status=data.status
      this.huixianzhangjieshuju=data
    },

    //方法7: 修改章节状态
    updateStatus() {
      updateSectionStatus({id:this.huixianzhangjieshuju.id,status: this.statusForm.status}).then(resp=>{
        if(resp.success){
          this.showStatusForm = false
          this.loadChildren(this.addSectionForm.courseId)
        }
      })
    },

    //跳转到错误页面
    redirectToError() {
      this.$router.replace({ path: "/not-found" });
    }
  }
};
</script>

<style lang="scss">
.course-tasks {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-tree {
    margin-top: 20px;
  }

  .el-tree,
  .el-tree__empty-block {
    min-height: 200px;
  }

  .el-tree-node__content {
    height: auto;
  }

  .inner {
    display: flex;
    flex: 1 0 0;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .actions {
    margin-left: auto;
  }
}
</style>
