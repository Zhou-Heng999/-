<template>
    <div v-if="data.userID" class="flex-column">
        <div class="font16 mb20 font-bold">个人名片</div>
        <div v-for="(item,index) in keyList" :key="index" class="mb10 flex-wrap">
            <div class="font-bold">{{ item.name }}：</div>
            <div class="">{{ data[item.key] }}</div>
        </div>
    </div>

    <div v-if="data.businessID=='group_create'">
        <div class="font16 mb20 font-bold">创建群聊消息</div>
        <div>{{ data.opUser }}创建了群聊</div>
    </div>

    <div v-else>{{ data }}</div>
</template>

<script setup>
// import { getCurrentInstance, watch } from "@vue/runtime-core";
// const { $api } = getCurrentInstance().appContext.config.globalProperties;
// console.log(getCurrentInstance().appContext.config.globalProperties);
const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
});

const keyList = [
    {key: 'userID',name: '账号'},
    {key: 'nick',name: '昵称'},
    {key: 'selfSignature',name: '个性签名'},
]
</script>
<style lang="scss" scoped></style>