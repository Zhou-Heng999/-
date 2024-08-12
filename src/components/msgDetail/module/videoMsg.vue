<template>
    <div class="flex-column">
        <div class="font16 mb20 font-bold">视频消息</div>
        <!-- <div class="mb10">文件名：{{ data.FileName }}</div> -->
        <div class="mb10">大小：{{ Math.ceil((data.VideoSize)/1048576) }}MB</div>
        <div class="mb20">视频地址：{{ data.VideoUrl }}</div>
        <!-- <div class="mb20">{{ data }}</div> -->
        <!-- <div style="width:200px">
            <el-button type="primary" size="medium" @click="download">点击下载</el-button>
        </div> -->
    </div>
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

const download = () => {

    const option = {
        mode: "cors",
        headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded",
        }),
    };

    if (typeof window.fetch !== 'undefined') {
        let data = props.data
        // 浏览器支持 Fetch API
        fetch(data.Url, option)
            .then((res) => res.blob())
            .then((blob) => {
                const a = document.createElement("a");
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = data.FileName;
                a.click();
            });
    } else {
        // 浏览器不支持 Fetch API
        const a = document.createElement("a");
        a.href = data.Url;
        a.target = "_blank";
        a.download = data.FileName;
        a.click();
    }
}
</script>
<style lang="scss" scoped></style>