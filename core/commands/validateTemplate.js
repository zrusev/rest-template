import { callBlob } from './../api-call.js';
import validateTemplate from './../../templates/validate-template.js';
import { fileFromSync, FormData } from 'node-fetch';

export default validateTemplate = async (filePath, fileName, lanId, formValue) => {
    const mimetype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    const blob = fileFromSync(`${filePath}/${fileName}`, mimetype);
    const formData = new FormData();
    formData.set('file', blob);
    formData.set('ReviewID', formValue);
    formData.set('loggedInUser', lanId);
    formData.set('ClientName', 'username');
    formData.set('LanguageId', '1');

    const template = {
        ...validateTemplate,
        body: formData
    };

    let result = '';
    let data = '';
    try {
        console.log(`${fileName}: Validating...`);
        result = await callBlob(template);
        data = await result.json();

    } catch (e) {
        console.log(e);
        return;
    }

    return data;
}