const expressData = require('../../utils/json');

Page({
    data: {
        expressList: [],
        lineList: [],
        expressDetail: {
            com: '',
            name: '请选择快递公司'
        },
        expressNumber: '',
        noLineData: true
    },
    onReady: function () {
        this.setData({
            expressList: expressData.expressList
        })
    },
    // 选择快递公司
    bindPickerChange: function (event) {
        const index = event.detail.value;
        this.setData({
            expressDetail: this.data.expressList[index]
        })
    },
    // 查询
    searchLine: function () {
        let that = this;
        if (this.data.expressNumber && this.data.expressDetail.com) {
            wx.showLoading({
                title: '请稍后……'
            });
            wx.request({
                url: 'https://www.kuaidi100.com/query',
                data: {
                    type: this.data.expressDetail.com,
                    postid: this.data.expressNumber,
                },
                success: function (res) {
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 600)
                    if (res.statusCode === 200 && res.data) {
                        if (res.data.status === '200') {
                            if (res.data.data.length) {
                                let originData = res.data.data;
                                for (let item of originData) {
                                    item.context = that.setRichText(item.context).context;
                                    item.phone = that.setRichText(item.context).phone;
                                }
                                that.setData({
                                    lineList: originData,
                                    noLineData: false
                                })
                            } else {
                                that.setData({
                                    lineList: []
                                })
                            }
                        } else {
                            wx.showToast({
                                title: res.data.message,
                                icon: 'none'
                            })
                        }
                    }
                },
                fail: function (res) {
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 1000)
                    wx.showToast({
                        title: '服务器出错了，请稍后再试!'
                    })
                }
            })
        } else {
            wx.showToast({
                title: '信息不完整',
                duration: 2000,
                icon: 'none'
            });
        }
    },
    // 快递单号输入
    onBindKeyInput: function (e) {
        this.setData({
            expressNumber: e.detail.value
        })
    },
    // 设置是否有电话或者手机号设置rich-text
    setRichText: function (string) {
        const obj = {};
        let reg = /[1-9]-?[0-9]*/g;
        let reg2 = /0\d{2,3}-\d{7,8}/;
        let contextStr = string;
        let newStr = contextStr.match(reg) ? contextStr.match(reg) : [];
        let newStr2 = contextStr.match(reg2) ? contextStr.match(reg2) : [];
        let allStr = newStr.concat([], newStr2);
        let getPhone = [];
        if (allStr && allStr.length) {
            getPhone = allStr.filter(item => item.length > 8)
        }
        if (getPhone.length) {
            for (let n = 0; n < getPhone.length; n++) {
                contextStr = contextStr.replace(getPhone[n], "<a style='color:rgb(161, 43, 58);'>" + getPhone[n] + "</a>");
            }
        }
        obj['context'] = contextStr;
        obj['phone'] = getPhone;
        return obj;
    },
    // 当卡片点击的时候弹出电话选择
    onrichClick: function (e) {
        const phoneList = e.currentTarget.dataset.phone;
        if (phoneList.length) {
            wx.showActionSheet({
                itemList: phoneList,
                success: function (res) {
                    if (!isNaN(res.tapIndex)) {
                        wx.makePhoneCall({
                            phoneNumber: phoneList[res.tapIndex]
                        })
                    }
                }
            });
        }
    }
})