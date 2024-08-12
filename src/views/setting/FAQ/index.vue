<template>
  <div class="faq-main">
    <div class="button-group">
      <el-button type="primary" @click="addFAQ">添加</el-button>
      <el-button type="danger" @click="delFAQ">删除</el-button>
    </div>
    <div class="faq-box" v-for="(i, index) in faqs">
      <div class="faq-question">
        <el-input v-model="i.question" placeholder="输入" style="width: 90%">
          <template #prepend>问题</template>
        </el-input>
        <el-input v-model="i.idx" placeholder="" style="width: 10%">
          <template #prepend>排序</template>
        </el-input>
      </div>
      <div class="faq-answer">
        <div></div>
        <el-input v-model="i.answer" placeholder="回答" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"/>
      </div>
    </div>

    <el-row style="justify-content: center;">
      <el-button :loading="editLoading" type="primary" @click="submitForm()"> 保存</el-button>
    </el-row>

  </div>
</template>

<script setup>
  import {
    getCurrentInstance,
    onMounted,
    reactive,
    ref,
  } from "vue";

  const { $api } = getCurrentInstance().appContext.config.globalProperties;

  const editLoading = ref(false);
  const faqs = ref([
    {question: '', answer: '', idx: 0}
  ]);

  onMounted(() => {
    getFAQList();
  });
  const addFAQ = () => {
    faqs.value.push({question: '', answer: '', idx: 0})
  };
  const delFAQ = () => {
    faqs.value.pop()
  };
  const getFAQList = () => {
    $api.setting
        .getFAQ({})
        .then((res) => {
          console.log("getFAQList", res);
          let faq_json = JSON.parse(res.data.faq_json)
          if (faq_json.length > 0) {
            faqs.value = faq_json;
          }
        });
  };
  const submitForm = () => {
      let payload = {}
      payload.faq_json = JSON.stringify(faqs.value)
      console.log('payload', payload)
      editLoading.value = true;
      $api.setting
            .setFAQ(payload)
            .then((res) => {
              if (res.result) {
                ElMessage({
                  type: "success",
                  showClose: true,
                  message: "保存成功",
                });
                getFAQList()
              }
            })
            .finally(() => {
              editLoading.value = false;
            });
  };

</script>
<style lang="scss" scoped>
  .button-group {
    margin-left: 15px;
  }
  .faq-box {
    padding: 15px;
    .faq-question {
      margin-bottom: 5px;
    }
  }
</style>
