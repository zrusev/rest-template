import { callBlob } from './../api-call.js';
import uploadTemplate from './../../templates/upload-template.js';
import templateBody from './../../templates/upload-template-body.js';

export default uploadTemplate = async (fileName, lanId, formValue, record) => {
    const requestBody = {
        ...templateBody,
        sendData: {
            ...templateBody['sendData'],
            ReviewId: parseInt(formValue),
            JsonContent: {
                record,
                InvalidData: []
            },
            loggedinuser: lanId,
        }
    }

    const template = {
        ...uploadTemplate,
        body: JSON.stringify(requestBody)
    };

    let result = '';
    let data = '';
    try {
        console.log(`${fileName}: Uploading...`);
        result = await callBlob(template);
        data = await result.json();

    } catch (e) {
        console.log(e);
        return;
    }

    return data;
}
