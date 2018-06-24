import request from '../request';

let baseURL = "";

export let findAll = (values) => {
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
    }
    return request({url: baseURL + "/products" + qs})
        .then(data => data = JSON.parse(data))
}


export let findByProdId = (values) => {
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
    }
    return request({url: baseURL + "/product/" + values.prod_id})
  .then(data => data = JSON.parse(data))
}

export let findrmpimages = (values) => {
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
    }
    return request({url: baseURL + "/rmpimages/" + values.rmp_id})
        .then(data => data = JSON.parse(data))
}

