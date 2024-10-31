export default {
    url: "https://site.com/api/v1/upload",
    headers: {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
    },
    referer: "https://site.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    method: "POST",
    "body": "{\"data\":{\"Id\":1,\"JsonContent\":{\"record\":[],\"InvalidData\":[]},\"loggedinuser\":\"user\",\"LanguageId\":\"1\"}}",
}