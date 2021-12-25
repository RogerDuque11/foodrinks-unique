import React, { useState } from 'react';
import _ from "lodash"


class DataOptions  {
    constructor(){ }

    sort(data, key, direction){
        const def = key === 0 ? true : false
        const dir = !direction ? "asc" : direction === "desc" ? "asc" : "desc" 
        const sorted = def ? null : _.orderBy(data, [key], [dir])
        return {data: sorted, direction: dir}
    }
    
    filter(data, key, value){
        const empty = value === '' ? true : false
        const filtered = empty ? null : _.filter(data, function(obj) { return obj[key].indexOf(value) !== -1 })
        return {data: filtered }
    }
    
    find(data, key, value){
        const all = value === '' ? true : false
        const finded = all ? null :  _.find(data, function(obj) { return obj[key].indexOf(value) !== -1 });
        return {data: finded }
    }

}

export default new DataOptions()