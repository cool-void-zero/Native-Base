const is_local = true;
const domain = (is_local)? "192.168.80.140": "greenstem.dyndns.org";
const port = 1111;
//  all apis service name
const apis = [
    "stock-check-main", 
    "stock-check-detail", 
    "check-stock-master", 
    "add-new-stock", 
    "upload-image", 
];

//  return a object urls
const getAPIUrls = () => {
    let urls = {};

    for(let api of apis)
        urls[api] = `http://${domain}:${port}/${api}`;
    return urls;
}

/*
    convert object to url parameters, 
    suggest if more than two parameters, 
    use this function to build up url parameters
*/
const objectToParameter = (obj={}) => {
    //  insert format: [[key, value], [key, value], ...]
    let parameters = [];

    for(let property in obj)
        parameters.push([property, obj[property]]);
    return `?${parameters.map(params => params.join("=")).join("&")}`;
}

//  build urls refer by "apis"
let urls = getAPIUrls();

/*
    Get Server Database "SC_Check_Pre_Main" Data
*/
export const getMainListAPI = async() => {
    return new Promise((resolve, reject) => {
        const url = urls['stock-check-main'];
        
        fetch(url)
            .then(res => res.json())
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}

/**
 * Get checking of stock code list
 * 
 * @param {String} doc_no ([Document No])
 */
export const getStockListAPI = (doc_no) => {
    return new Promise((resolve, reject) => {
        const url = urls['stock-check-detail'] + `?doc_no=${doc_no}`;
        
        fetch(url)
            .then(res => res.json())
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}

export const checkStockMasterAPI = async(stock_code="") => {
    return new Promise((resolve, reject) => {
        const url = urls['check-stock-master'] + `?stock_code=${stock_code}`;
        
        fetch(url)
            .then(res => res.json())
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}

export const addNewStockAPI = async(document_no, stock_code="") => {
    return new Promise((resolve, reject) => {
        const url = urls['add-new-stock'];
        
        const options = {
            method: "post", 
            body: JSON.stringify({
                document_no: document_no, 
                stock_code: stock_code, 
            }), 
            
            headers: {
                "content-type": "application/json", 
                'accept': 'application/json',
            }
        }

        fetch(url, options)
            .then(res => res.json())
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}

export const uploadImageAPI = async(base64) => {
    return new Promise(async (resolve, reject) => {
        const url = urls['upload-image'];
        
        const options = {
            method: "post", 
            body: JSON.stringify({
                base64: base64
            }), 
            
            headers: {
                "content-type": "application/json", 
                'accept': 'application/json',
            }
        }

        fetch(url, options)
            .then(res => res.json())
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}
