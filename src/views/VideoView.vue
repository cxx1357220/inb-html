<template>
    <div class="video">
        <video ref="videoPlay" :src="obj.newPath" class="video-js " controls>
            <track kind="chapter" default label="vtt" :src="obj.vtt" />
        </video>
    </div>
</template>

<script>
import videojs from "video.js";
import 'video.js/dist/video-js.css'
import 'video.js/dist/video-js.min.css'
export default {
    name: 'videoP',
    data() {
        return {
            obj: {}
        }
    },
    created() {
        console.log(this.$route.query.id);
        this.obj = JSON.parse(sessionStorage.getItem(this.$route.query.id) || "{}")
        console.log('this.obj : ', this.obj);
        let l = this.obj.newPath.split('.')
        l.pop()
        this.obj.vtt = l.join('.') + '.vtt'
    },
    mounted() {
        videojs(this.$refs.videoPlay, {
            controls: true,
            sources: [
                {
                    src: this.obj.newPath.replace('#', '%23'),
                }
            ],
            autoplay: false,
            fluid: true, // 自适应宽高
            language: 'zh-CN', // 设置语言
            muted: false, // 是否静音
            inactivityTimeout: false,
            playbackRates: [0.5, 1, 1.5, 2, 3, 5],
            bigPlayButton: true,
            controlBar: {
                fullscreenToggle: true,
                volumePanel: {
                    inline: false,
                },
            },

        }, function () {
            this.play()
        })
    },
    methods: {
    }

}
</script>
<style lang="less" scoped>
.video {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    & /deep/ .video-js {
        padding-top: 100vh !important;
    }
}

video {
    width: 100vw;
    height: 100vh !important;
    overflow: hidden;
}
</style>