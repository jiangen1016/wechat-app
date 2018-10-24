//index.js
//获取应用实例
const app = getApp();
const utils = require('../../utils/util');
const bdMap = require("../../lib/bmap-wx");

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        isPlay: false,
        cityName: '',
        musicStop: '',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        musicDetail: {},
        musicList: [],



        animationData0: {},
        animationData1: {},
        animationData2: {},
        animationData3: {},
        animationData4: {},
        runMove: '',
        showInfo: false
    },
    // 初始化
    onReady: function () {
        // 获取当前位置
        this.getLocation();
        // this.getCurrentPages();
    },
    // onLoad: function (options) {
    //     wx.showLoading({
    //         title: '登录中'
    //     })
    //     wx.getSetting({
    //         success: res => {
    //             console.log(res)
    //             if (res.authSetting['scope.userInfo'] === true) { // 成功授权
    //                 // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //                 wx.getUserInfo({
    //                     success: res => {
    //                         console.log(res)
    //                         this.setUserInfoAndNext(res)
    //                     },
    //                     fail: res => {
    //                         console.log(res)
    //                     }
    //                 })
    //             } else if (res.authSetting['scope.userInfo'] === false) { // 授权弹窗被拒绝
    //                 wx.openSetting({
    //                     success: res => {
    //                         console.log(res)
    //                     },
    //                     fail: res => {
    //                         console.log(res)
    //                     }
    //                 })
    //             } else { // 没有弹出过授权弹窗
    //                 wx.getUserInfo({
    //                     success: res => {
    //                         console.log(res)
    //                         this.setUserInfoAndNext(res)
    //                     },
    //                     fail: res => {
    //                         console.log(res)
    //                         wx.openSetting({
    //                             success: res => {
    //                                 console.log(res)
    //                             },
    //                             fail: res => {
    //                                 console.log(res)
    //                             }
    //                         })
    //                     }
    //                 })
    //             }
    //         }
    //     })
    // },
    // 获取个人信息成功，然后处理剩下的业务或跳转首页
    // setUserInfoAndNext(res) {
    //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //     // 所以此处加入 callback 以防止这种情况
    //     if (this.userInfoReadyCallback) {
    //         this.userInfoReadyCallback(res)
    //     }
    //     wx.hideLoading()
    //     // 跳转首页
    //     setTimeout(() => {
    //         // wx.reLaunch({
    //         //     url: '../home/home'
    //         // })
    //         this.setData({
    //             userInfo: res.userInfo
    //         })
    //     }, 1000)
    // },
    onLoad: function () {
        // if (options.finish) {
        //     wx.navigateBack({
        //         delta: 1
        //     })
        // }
        // if (app.globalData.userInfo) {
        //     this.setData({
        //         userInfo: app.globalData.userInfo,
        //         hasUserInfo: true
        //     })
        // } else if (this.data.canIUse) {
        //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //     // 所以此处加入 callback 以防止这种情况
        //     app.userInfoReadyCallback = res => {
        //         this.setData({
        //             userInfo: res.userInfo,
        //             hasUserInfo: true
        //         })
        //     }
        // } else {
        //     // 在没有 open-type=getUserInfo 版本的兼容处理
        //     wx.getUserInfo({
        //         success: res => {
        //             app.globalData.userInfo = res.userInfo
        //             this.setData({
        //                 userInfo: res.userInfo,
        //                 hasUserInfo: true
        //             })
        //         }
        //     })
        // }
    },
    // 获取当前位置
    getLocation: function () {
        wx.showLoading({
            title: '请稍后'
        });
        var that = this;
        var BMap = new bdMap.BMapWX({
            ak: '17eOMvLsul4j50OaWL9yB77StaZwkbGW'
        });
        var fail = function (data) {
            console.log(data);
            wx.hideLoading();
            // wx.showModal({
            //     title: '提示',
            //     content: '本程序需要获取您当前位置以提供天气信息!',
            //     success: function (res) {
            //         if (res.confirm) {
            //             // wx.navigateTo({
            //             //     url: 'index?finish=true'
            //             // })
            //         } else if (res.cancel) {
            //             // wx.navigateTo({
            //             //     url: 'index?finish=true'
            //             // })
            //         } else {
            //             // wx.navigateTo({
            //             //     url: 'index?finish=true'
            //             // })
            //         }
            //     }
            // })
        };
        var success = function (data) {
            setTimeout(() => {
                wx.hideLoading();
            }, 300)
            var weatherData = data.currentWeather[0];
            that.setData({
                // cityName: weatherData.currentCity,
                weatherData: weatherData,
                showInfo: true
            });
            app.globalData.weatherData = weatherData;
            that.setAnimation();
        }
        // 发起weather请求 
        BMap.weather({
            fail: fail,
            success: success
        });
    },
    // 点击基本信息时
    showError: function () {
        var that = this;
        this.setData({
            runMove: 'runMove'
        });
        setTimeout(function () {
            that.setData({
                runMove: ''
            });
        }, 1000);
        wx.showToast({
            title: '这些才是菜单哦！',
            icon: 'none'
        })
    },
    // 听音乐
    goMusic: function () {
        wx.navigateTo({
            url: '../music/music'
        })
    },
    // 查天气
    goWeather: function () {
        wx.navigateTo({
            url: '../weather/weather'
        })
    },
    // 查快递
    goExpress: function () {
        wx.navigateTo({
            url: '../express/express'
        })
    },
    // 更多
    goMore: function () {
        wx.showToast({
            'title': '其他功能正在开发中，敬请期待！',
            icon: 'none'
        })
    },
    // 首页渐进动画
    setAnimation: function () {
        var that = this;
        var animation = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease-in-out'
        });
        this.animation = animation;
        animation.translateY('0px').opacity(1).step();
        that.setData({
            animationData0: animation.export(),
        });
        setTimeout(function () {
            animation.translateY('0px').opacity(1).step();
            that.setData({
                animationData1: animation.export()
            });
            setTimeout(function () {
                animation.translateY('0px').opacity(1).step();
                that.setData({
                    animationData2: animation.export()
                });
                setTimeout(function () {
                    animation.translateY('0px').opacity(1).step();
                    that.setData({
                        animationData3: animation.export()
                    });
                    setTimeout(function () {
                        animation.translateY('0px').opacity(1).step();
                        that.setData({
                            animationData4: animation.export()
                        });
                    }, 400)
                }, 400)
            }, 400)
        }, 400)
    }
})