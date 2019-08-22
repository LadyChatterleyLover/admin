import Mock from 'mockjs'

let arr = ['成都分公司', '北京分公司', '上海分公司', '哈尔滨公司', '微易', '郑州公司','测试部门', '财务部', '地州区', '盒马项目组', '成都区', '贵州区', '电商部', '综合管理部', '全民营销项目组', '单团部', '新销售业务部', '欧洲组', '中东非组', '票务组', '外联部', '西南总经理办公室', '市场营销部', '单团计调部', '票务部', '南亚计调部', '欧洲散拼计调部', '签证部', '东南亚事业部', '产品组', '途牛组', '携程组', '其他电商组', '资料组', '运营支持组', '京津组', '河北组', '太原公司', '内蒙古组']
import treeData from './tree'


// 获取通讯录
 Mock.mock('api/getMailList', 'get', {
  code: 200,
  msg: 'success',
  'data|666': [
    {
      id: '@increment(1)',
      name: '@cword(2, 4)',
      img: '@dataImage(80x80,@name)',
      phone: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
      tel: /\d{3}-\d{8}|\d{4}-\d{7}/,
      email: /[1-9]\d{7,10}@(qq|163|gmail)\.com/,
      gender: '@integer(0,1)',
      qq: /[1-9]\d{7,10}/,
      department: () => {
        let num = parseInt(Math.random() * arr.length)
        return arr[num]
      }, // 部门
      position: /经理|主管|员工|实习生/, // 职位
      'tag|0-3': [{
        name: '@cword(1, 4)'
      }]
    }
  ]
})


// 获取通讯录左边树形结构
Mock.mock('api/getTreeData', 'get', {
  code: 200,
  msg: 'success',
  data: treeData
})

// offer管理
Mock.mock('api/getOffer', 'get', {
  code: 200,
  msg: 'success',
  'data|100': [
    {
      name: '@cword(2, 4)',
      img: '@dataImage(80x80,@name)',
      phone: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
      tel: /\d{3}-\d{8}|\d{4}-\d{7}/,
      email: /[1-9]\d{7,10}@(qq|163|gmail)\.com/,
      gender: '@integer(0,1)',
      qq: /[1-9]\d{7,10}/,
      // 部门
      department: () => {
        let num = parseInt(Math.random() * arr.length)
        return arr[num]
      },
      position: /经理|主管|员工|实习生/, // 职位
      nativePlace: '@city(true)', // 籍贯
      marriage: '@integer(0,1)', // 婚姻状态
      certificates: '@cword(2,4)', // 证件类型
      certificatesNum: '@id', // 证件号码
      birthday: '@date', // 出生日期
      status: '@integer(0,4)', // 审批状态: 待发 已发 已接受 已拒绝 已入职
      age: '@integer(18,60)', // 年龄
      education: '@integer(0,6)', // 学历: 初中 高中 大专 本科 硕士 博士 博士以上
      createTime: '@date', // 入职时间
      nation: '@cword(1,5)', // 民族
      workAddress: '@city', // 工作地点
    }
  ]
})

// 人员信息
Mock.mock('api/userInfo', 'get', {
  code: 200,
  msg: 'success',
  'data|100': [
    {
      id: '@increment(1)',
      name: '@cword(2, 4)',
      num: '@integer(1000,9999)',
      mechanism: '区域中心',
      // 部门
      department: () => {
        let num = parseInt(Math.random() * arr.length)
        return arr[num]
      },
      startTime: '@date',
      endTime: '@date',
      state: '@integer(0,2)', // 审批状态: 0 审批通过 1 审批未通过 2 审批中
      position: /经理|主管|员工|实习生/, // 职位
    }
  ]
})

// 新通知
Mock.mock('api/update', 'get', {
  code: 200,
  msg: 'success',
  'data|5': [
    {
      id: '@increment(1)',
      update:'@boolean',
      text: '@cparagraph(1,3)'
    }
  ]
})

// 获取薪酬
Mock.mock('api/pay', 'get', {
  code: 200,
  msg: 'success',
  'data|3': [
    {
      name: '@cword(2,5)',
      planMoney: '@integer(0, 1000000)',
      actualMoney: '@integer(0, 1000000)',
      lastMonth: '@integer(0, 1000000)',
      thisMonth: '@integer(0, 1000000)'
    }
  ]
})


// 获取首页城市数据
Mock.mock('api/getCityData', 'get', {
  code: 200,
  msg: 'success',
  'data|30': [
    {
      city: '@city',
      value: '@integer(0,100)'
    }
  ]
})

// 获取首页进度条数据
Mock.mock('api/progress', 'get', {
  code: 200,
  msg: 'success',
  'data|3': [
    {
      id: '@increment(1)',
      value: '@integer(0,100)',
      money: '@integer(0,100000)'
    }
  ]
})

