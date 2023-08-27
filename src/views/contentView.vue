<template>
    <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="list" name="list">
            <div class="list">
                <img v-for=" s in imgs" v-lazy="s" alt="">
                <div v-for=" s in audios">
                    <audio controls v-data="s">
                    </audio>
                </div>
                <div v-for=" s in videos">
                    <video controls v-data="s" >
                    </video>
                </div>
                <el-empty v-if="!imgs.length && !audios.length && !videos.length" description="nothing"></el-empty>

            </div>
        </el-tab-pane>
        <el-tab-pane label="html" v-if="haveHtml" name="html">
            <iframe :src="haveHtml" frameborder="0"></iframe>
        </el-tab-pane>
        <el-tab-pane label="upload" name="upload">
            <el-upload class="upload-demo" :on-success="onSuccess" :headers="headers" multiple ref="upload"
                action="/api/upload" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            </el-upload>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import axios from 'axios';
export default {
    name: 'contentList',
    data() {
        return {
            activeName: 'list',
            haveHtml: '',
            obj: { filePath: '' },
            headers: {},
            imgs: [],
            videos: [],
            audios: [],
            fileList: [],
            haveUpload: false
        }
    },
    directives: {
        data: {
            bind(el, binding) {
                try {
                    el.src = binding.value.replace('#', '%23')
                } catch (error) {
                    console.log(binding.value);
                }
            },
            update(el, binding) {
                try {
                    el.src = binding.value.replace('#', '%23')
                } catch (error) {
                    console.log(binding.value);
                }
            },
        },
    },
    watch: {
        activeName(n) {
            if (n == 'list' && this.haveUpload) {
                this.haveUpload = false
                this.getList()
            }
        },
    },
    created() {
        console.log(this.$route.query.id);
        let obj = JSON.parse(sessionStorage.getItem(this.$route.query.id) || "{}")
        console.log('obj: ', obj);
        this.obj = obj
        this.headers = {
            basepath: encodeURIComponent(obj.basePath),
            newbasepath: encodeURIComponent(obj.newBasePath)
        }
        this.getList()
    },
    mounted() {
    },
    methods: {
        getList() {
            axios.post('/api/contentList', this.obj).then((res) => {
                console.log('res: ', res);
                this.imgs = res?.data?.imgs || []
                this.videos = res?.data?.videos || []
                this.audios = res?.data?.audios || []
                this.haveHtml = res?.data?.haveHtml || false
            }).catch((err) => {
                console.log('err: ', err);
                alert(err)
            })
        },
        submitUpload() {
            this.haveUpload = true
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        onSuccess() {
            console.log('success');
        }
    }

}
</script>
<style lang="less">
.list {

    // width:100vw;
    img {
        width: 100%;
        vertical-align: bottom;
    }

    video,
    audio {
        max-width: 100%;
    }
}

iframe {
    width: 100%;
    height: 100%;
}

.el-tabs {
    border: 0;
    height: calc(100vh);
    overflow: hidden;
    font-size: 0;

    .el-tabs__content {
        padding: 0;
        height: calc(100vh - 40px);
        overflow-y: auto;

        &>div {
            height: 100%;
        }
    }
}
</style>