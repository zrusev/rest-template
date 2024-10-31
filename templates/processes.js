export default {
    url: "https://site.com/api/processes/?from=0&size={size}&query=id:{id}&sort=createdAt:desc",
    headers: {
        "accept": "application/json, text/plain, */*",
        "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\""
    },
    referrer: "https://site.com/inboxes/{id}/processes",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include"
}
