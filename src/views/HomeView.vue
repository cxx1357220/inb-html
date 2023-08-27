<template>
  <div class="home">
    <div class="search">
      <div class="button-list">
        <el-button size="mini" plain
          :icon="key == 'date' ? (sortT == 1 ? 'el-icon-caret-bottom' : 'el-icon-caret-top') : ''"
          :type="key == 'date' ? 'primary' : ''" @click="sort('date')">date</el-button>
        <el-button size="mini" plain
          :icon="key == 'star' ? (sortT == 1 ? 'el-icon-caret-bottom' : 'el-icon-caret-top') : ''"
          :type="key == 'star' ? 'primary' : ''" @click="sort('star')">star</el-button>
        <el-button size="mini" plain
          :icon="key == 'visits' ? (sortT == 1 ? 'el-icon-caret-bottom' : 'el-icon-caret-top') : ''"
          :type="key == 'visits' ? 'primary' : ''" @click="sort('visits')">visits</el-button>
        <el-button size="mini" plain :type="type == 'video' ? 'primary' : ''"
          @click="changeType('video')">video</el-button>
        <el-button size="mini" plain :type="type == 'other' ? 'primary' : ''"
          @click="changeType('other')">other</el-button>
        <el-button size="mini" plain :type="type == 'all' ? 'primary' : ''" @click="changeType('all')">all</el-button>
      </div>
      <!-- search:<input type="text" v-model="filterVal">{{ showList.length }} -->
      <el-input type="text" prefix-icon="el-icon-search" :suffix="showList.length" size="mini" placeholder="search"
        v-model="filterVal">
        <template slot="append"> {{ showList.length }}</template>
      </el-input>

    </div>
    <div class="home-list">
      <div v-for="obj in showList">
        <div class="img-box" @click="open(obj)">
          <img v-lazy="obj.newimg" alt="" />
          <el-button v-if="obj.visits" type="text" icon="el-icon-view" disabled> {{ obj.visits }}</el-button>

        </div>
        <div class="stars">
          <b v-for="idx in [0, 1, 2, 3, 4]" @click="changeStar(idx, obj)"
            :style="{ 'background-color': idx < obj.star ? 'red' : 'darkgray' }"></b>
        </div>
        <p @click="openPath(obj)">openPath</p>
        <label>{{ obj.title }}</label>
        <span>{{ obj.file }}</span>
        <i>{{ obj.allSize || 0 }}MB</i>
        <span v-date="obj.date"></span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'HomeView',
  data() {
    return {
      list: [],
      showList: [],
      filterVal: '',
      key: 'date',
      sortT: 1,
      type: 'all'
    }
  },
  directives: {
    date: {
      bind(el, binding) {
        try {
          el.innerHTML = new Date(binding.value).toISOString().split('T')[0];
        } catch (error) {
          console.log(binding.value);
        }
      },
      update(el, binding) {
        try {
          el.innerHTML = new Date(binding.value).toISOString().split('T')[0];
        } catch (error) {
          console.log(binding.value);
        }
      },
    },
  },
  watch: {
    filterVal(n) {
      this.filterList(n)
    }
  },
  async created() {
    if (this.$route.params.value || sessionStorage.getItem('old')) {
      let list = []
      // if (sessionStorage.getItem('list')) {
      //   list = JSON.parse(sessionStorage.getItem('list'))
      // } else {
      await axios.get('/api/list').then((item) => {
        list = item?.data
        console.log('item: ', item);
        sessionStorage.setItem('list', JSON.stringify(list))
      }).catch((err) => {
        console.log('err: ', err);
      })
      // }
      this.list = list
      this.showList = JSON.parse(JSON.stringify(list))
      sessionStorage.setItem('old', 1)
      let pageData = sessionStorage.getItem('pageData')
      if (pageData) {
        let obj = JSON.parse(pageData)
        this.sortT = obj.sortT;
        this.key = obj.key;
        this.type = obj.type;
        this.filterVal = obj.filterVal;
        this.filterList(this.filterVal)
        // this.sort()
        document.body.scrollTop = document.documentElement.scrollTop = obj.scrollTop;

      }
    }
  },
  methods: {
    open(obj) {
      let pageData = JSON.stringify({
        filterVal: this.filterVal,
        type: this.type,
        key: this.key,
        sortT: this.sortT,
        scrollTop: document.body.scrollTop || document.documentElement.scrollTop
      })
      sessionStorage.setItem('pageData', pageData)
      obj.visits ? obj.visits++ : (obj.visits = 1);
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].filePath == obj.filePath) {
          this.list[i].visits = obj.visits
          break;
        }
      }
      sessionStorage.setItem('list', JSON.stringify(this.list))
      axios.post('/api/visits', obj).then((item) => {
        console.log('item: ', item);
      }).catch((err) => {
        console.log('err: ', err);
      })

      sessionStorage.setItem(obj.newBasePath, JSON.stringify(obj))
      // if (obj.type == 'video') {
      //   this.$router.push({
      //     name: 'video',
      //     params: obj
      //   })
      // } else {
      //   this.$router.push({
      //     name: 'content',
      //     params: obj
      //   })
      // }
      let routeData = this.$router.resolve({
        query: { id: obj.newBasePath },
        name: obj.type == 'video' ? 'video' : 'content'
      });
      window.open(routeData.href, '_blank');

    },
    openPath(obj) {
      console.log('obj: ', obj);
      location.href = location.origin + obj.newBasePath
    },
    sort(key) {
      if (key) {
        if (this.key == key) {
          this.sortT = this.sortT * -1
        } else {
          this.key = key
        }
      }
      this.showList = this.showList.sort((a, b) => { return ((b[this.key] || 0) - (a[this.key] || 0)) * this.sortT })
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    async changeStar(i, obj) {
      obj.star = i + 1;
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].filePath == obj.filePath) {
          this.list[i].star = obj.star
          break;
        }
      }
      sessionStorage.setItem('list', JSON.stringify(this.list))
      await axios.post('/api/changeStar', obj).then((item) => {
        console.log('item: ', item);
      }).catch((err) => {
        console.log('err: ', err);
      })
    },

    filterList(n) {
      let isType = (obj) => {
        if (this.type == 'all') {
          return true
        } else if (this.type == 'other') {
          return obj.type != 'video'
        } else {
          return obj.type == this.type
        }
      }
      this.showList = this.list.filter(obj => {
        if (!n) { return isType(obj) }
        let reg = new RegExp(n, 'i');
        return (reg.test(obj.title) || reg.test(obj.file)) && isType(obj)
      })
      this.sort()
    },
    changeType(type) {
      this.type = type;
      this.filterList(this.filterVal)
    },
  }

}
</script>
<style lang="less">
.home {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.search {
  box-sizing: border-box;
  padding: 10px 10px;
  // background-color: wheat;
  position: sticky;
  top: 0;
  z-index: 9;
  width: 100vw;
}

.button-list {
  display: flex;
  align-items: center;
  justify-content: left;
  padding-bottom: 10px;


}

.el-button {
  flex: 1;
  padding: 5px 0 !important;
}

.button-list /deep/ .el-button {
  flex: 1;
}

.home-list {
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  flex: 1;
  overflow-y: auto;

  &>div {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 33%;
    border-radius: 5px;
    padding: 5px;
    padding-bottom: 20px;
    text-align: center;

    .img-box {
      position: relative;
      padding-top: 100%;
      width: 100%;
      background-color: beige;

      &>.el-button {
        padding: 0;
        font-size: 10px;
        z-index: 9;
        position: absolute;
        bottom: 5px;
        left: 5px;

        // color: #606266;
        span {
          margin: 0;
          // color: #606266;
          font-weight: 100;
        }
      }
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    label {
      color: black;
      padding-bottom: 5px;
      word-break: break-word;
    }

    span {
      color: gray;
      word-break: break-word;
    }

    p {
      color: darkgreen;
      cursor: pointer;
    }

    p+p {
      color: red;
    }

    i {
      padding-top: 12px;
    }

    .stars {
      box-sizing: border-box;
      padding: 20px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row;

      b {
        display: block;
        width: 15%;
        height: 0;
        padding-top: 15%;
        border-radius: 50%;
      }
    }


  }
}

@media screen and (min-width:1200px) {
  .home-list>div {
    width: 10%;
  }
}

@media screen and (max-width:1200px) {
  .home-list>div {
    width: calc(100%/6);
  }
}

@media screen and (max-width:700px) {
  .home-list>div {
    width: calc(100%/3);
  }
}
</style>