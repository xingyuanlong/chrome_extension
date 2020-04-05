<template>
  <div id="app" class="app">
    <div class="header">
      <p class="title" :style="{color:color}">chrome extension Demo</p>
      <el-color-picker
        v-model="color"
        size="mini"
        show-alpha
        :predefine="predefineColors"
        @change="handleColorChanage"
      />
    </div>
    <div class="body" :style="{backgroundColor:color}">
      <el-button type="primary" @click="deleteHistory">删除历史记录</el-button>
      <el-button type="primary" @click="getWeather">天气</el-button>
      <div class="weather" v-if="weatherData.length">
        <el-collapse accordion>
          <el-collapse-item v-for="(day, index) in weatherData" :key="day.date">
            <template slot="title">
              <div style="padding-left: 10px;">
                {{day.date}} {{day.week}}
                <span>风速：{{day.win_speed}}</span>
                <span style="color: blue">天气：{{day.wea}}</span>
              </div>
            </template>
            <div v-if="index === 0" style="padding-left: 10px;">
              <p>
                <span style="color: red;">空气质量</span>
                ：{{day.air_level}}
              </p>
              <p>
                <span style="color: red;">活动Tips</span>
                ：{{day.air_tips}}
              </p>
            </div>
            <div v-else style="padding-left: 10px;"></div>
            <div style="padding-left: 10px;">
              <p style="color: red;">风速详情：{{day.win.join('、')}}</p>
              <p class="index" v-for="(h, i) in day.index" :key="i">
                <span style="color: red;">
                  {{gtitle(h.title)}}
                  </span>
                ： {{h.level || '-'}}
                <span class="desc">({{h.desc || '-'}})</span>
              </p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import request from "../utils/request";
import moment from "moment";
export default {
  data() {
    return {
      color: "rgba(0, 0, 0, 0.5)",
      predefineColors: [
        "rgba(0, 0, 0, 0.5)",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsla(181, 100%, 37%,  0.73)",
        "#c7158577"
      ],
      weatherData: []
    };
  },
  methods: {
    deleteHistory() {
      this.$confirm("此操作将删除所有历史记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          chrome.history.deleteAll(result => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleColorChanage(color) {
      // 保存主题信息
      chrome.storage.sync.set({ theme: color }, res => {
        console.log("颜色保存成功");
      });
    },
    async getWeather() {
      const appsecret = Date.now();
      const { errcode, errmsg, data } = await request(
        "https://www.tianqiapi.com/api",
        {
          method: "get",
          params: {
            version: "v1",
            appid: 1001,
            appsecret: appsecret,
            cityId: "101210101"
          }
        }
      ).catch(e => e);
      if (errcode) {
        this.$message({
          type: "error",
          message: errmsg
        });
      }
      if (Array.isArray(data)) {
        this.weatherData = data;
      }
    }
  },
  created() {
    // 读取 主题信息
    chrome.storage.sync.get("theme", ({ theme }) => {
      if (!theme) {
        return false;
      }
      this.color = theme;
    });
    // 读取 书签信息
    chrome.bookmarks.getTree(data => {
      console.log(data);
    });
  },
  computed: {
    gtitle(){
      return (t)=>{
        return t === "</em><em></em><em></em><em>" ? '运动指数' : t
      }
    }
  }
};
</script>

<style lang="less">
.app {
  width: 600px;
  .header {
    height: 30px;
    margin: 10px;
    .el-color-picker {
      float: right;
      margin: 1px;
    }
    .title {
      float: left;
      height: 30px;
      line-height: 30px;
      font-size: 26px;
      font-weight: bolder;
      transition: color 0.5s;
    }
  }
  .body {
    min-height: 370px;
    padding: 10px;
    transition: background 0.5s;
  }
}
.weather {
  margin-top: 10px;
  .el-collapse-item {
    color: #333333;
  }
  .index {
    color: #333333;
    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}
.v-modal {
  background: rgba(0, 0, 0, 0.2);
}
</style>
