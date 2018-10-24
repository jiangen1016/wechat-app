const app = getApp();
const myCity = require('../../utils/json');

Page({
    data: {
        cityName: '',
        cityList: [],
        animationList: [],
        weatherData: {},
        animationData0: {},
        region: [],
        noWeatherData: false,
        customItem: '全部'
    },
    onLoad: function () {
        if (app.globalData.weatherData && app.globalData.weatherData.currentCity) {
            this.setData({
                cityName: app.globalData.weatherData.currentCity
            });
        }
        this.getWeather(this.data.cityName);
    },
    // 天气网络请求
    getWeather: function (cityName) {
        const that = this;
        wx.showLoading({
            title: '请稍等……'
        });
        if (cityName) {
            wx.request({
                url: 'https://www.apiopen.top/weatherApi',
                dataType: 'json',
                data: {
                    city: cityName
                },
                success: (res) => {
                    if (res.data.code === 200 && res.data.data) {
                        let weatherDataArr = res.data.data;
                        if (weatherDataArr.forecast && weatherDataArr.forecast.length) {
                            for (let item of weatherDataArr.forecast) {
                                item.icon = that.setWeatherIcon(item.type);
                                item.high = item.high.replace('温', '')
                                item.low = item.low.replace('温', '')
                            }
                            console.log(weatherDataArr);
                        }
                        weatherDataArr.wendu += '°';
                        that.setData({
                            weatherData: weatherDataArr,
                            noWeatherData: false
                        });
                        setTimeout(() => {
                            wx.hideLoading();
                            // that.setWeatherAnimation();
                        }, 500)
                    } else {
                        setTimeout(function () {
                            wx.hideLoading();
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'none'
                            })
                            that.setData({
                                noWeatherData: true
                            })
                        }, 500)
                    }
                }
            })
        }
    },
    // // 设置天气卡片动画
    // setWeatherAnimation: function () {
    //     const b = [];
    //     // b.push(a);
    //     for (let i = 0; i < 5; i++) {
    //         var that = this;
    //         var animation = wx.createAnimation({
    //             duration: 600,
    //             timingFunction: 'ease-in-out'
    //         });
    //         this.animation = animation;
    //         animation.translateX('0px').opacity(1).step();
    //         const a = animation.export();
    //         b.push(a);
    //     }
    //     that.setData({
    //         animationList: b,
    //     });
    // },
    // 输出要查询的城市
    onBindKeyInput: function (e) {
        this.setData({
            cityName: e.detail.value
        })
    },
    // 输入查询天气
    searchWearther: function () {
        if (this.data.cityName) {
            this.getWeather(this.data.cityName);
        }
        // if (!wx.getStorageSync('city')) {
        //     wx.setStorageSync('city', myCity.cityList);
        // } else {
        //     const getCityList = wx.getStorageSync('city');
        //     this.setData({
        //         cityList: getCityList
        //     })
        // }
    },
    // 城市选择完毕
    bindRegionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
        const regionList = this.data.region;
        var getCityName = '';
        if (regionList && regionList.length) {
            if (regionList[2] !== '全部') {
                getCityName = regionList[2];
            } else if (regionList[1] !== '全部') {
                getCityName = regionList[1];
            } else if (regionList[0].substr(regionList[0].length - 1, 1) === '市') {
                getCityName = regionList[0];
            } else {
                wx.showToast({
                    title: '请正确选择一个城市！',
                    icon: 'none'
                })
            }
            if (getCityName) {
                this.setData({
                    cityName: getCityName
                })
                this.getWeather(getCityName);
            }
        }
    },
    // 设置天气图片icon
    setWeatherIcon: function (itemType) {
        if (itemType) {
            return 'http://hellohuge.win/weather/' + encodeURI(encodeURI(itemType)) + '.png';
            // return '../../../image/weather/' + encodeURI(encodeURI(itemType)) + '.png';
            // return encodeURI(encodeURI(itemType));
        }
    }
})