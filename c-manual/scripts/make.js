#!/usr/bin/env node
'use strict';

var fs = require('fs')
var path = require('path')
var child_process = require('child_process')

var exportedData =  require(path.resolve(__dirname, '../data/exportedData'))
var target = path.resolve(__dirname, '../target')

var mkdir = function(folder, base){
    // base = base || ''
    child_process.execSync('mkdir -p ' + folder)
}

//修复不支持的中文符号
var fixTitle = function(title){
    return title.replace('：', ':')
}

//补充0
var fixIndex = function(index){
    var res = index + ''
    for(var i=res.length; i < 4; i++){
        res = '0' + res
    }
    return res
}

mkdir(target)

var category = ''
var categoryIndex = 0
var index = 0
exportedData.forEach(function(table){
    table.data.forEach(function(row){
        //内容为空则为一个分段落
        if(row[2] === ''){
            category = row[1]
            categoryIndex += 1
            index = 0
            var folder = fixTitle(path.resolve(target, fixIndex(categoryIndex)+'-'+row[1]))
            child_process.execSync('mkdir -p ' + folder)
            console.log('\nCreate Dir ==> ' + folder)
        }else{
            index += 1
            var file = fixTitle(path.resolve(target, fixIndex(categoryIndex)+'-'+category, fixIndex(index)+'-'+row[1])+'.md')
            fs.writeFileSync(file, row[2])
            console.log('Create File ==> ' + file)
        }
    })
})
