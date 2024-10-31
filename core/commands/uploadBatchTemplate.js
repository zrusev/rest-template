import usersService from './../../services/usersService.js';
import { username } from 'username';

import validateTemplate from './../../templates/validate-template.js';
import uploadTemplate from './../../templates/upload-template.js';

export default uploadBatchTemplate = async () => {
    const fileNames = usersService.getAll('./data/users/templates');
    const filePath = `./data/users/templates`;

    const users = JSON.parse(usersService.get('users.json'));
    const userName = await username();
    const lanIdResult = users.find(r => r[userName]);
    if (lanIdResult === undefined) { throw new Error(`${userName}: Missing Lan IDs.`); }
    const lanId = lanIdResult[userName];

    for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i];

        if (fileName.match(/\d+/) === null) { throw new Error(`${fileName}: Invalid template name.`); }

        const formName = fileName.match(/.+(?=\s\d)/)[0];
        const forms = JSON.parse(usersService.get('forms.json'));
        const form = forms.find(r => r.name == formName);
        if (form === undefined) { throw new Error(`${fileName}: Invalid template name.`); }
        const formValue = form.value;

        const validationResult = await validateTemplate(filePath, fileName, lanId, formValue);

        if(validationResult && validationResult.msg) {
            console.log(`${fileName}: Validation failed.`);
            console.log(validationResult.msg);
            throw new Error(`Validation failed for ${fileName}`);
        }

        if (validationResult && validationResult.InvalidData.length > 0) {
            console.log(`${fileName}: Validation failed.`);
            console.log(validationResult.InvalidData);
            throw new Error(`Validation failed for ${fileName}`);
        }

        console.log(`${fileName}: Validation successful.`);

        const uploadResult = await uploadTemplate(fileName, lanId, formValue, validationResult.record);
        console.log(`${fileName}: Uploaded successfully.`);
        console.log(`${fileName}: ${uploadResult.table[0].column1}.`);

        await new Promise(async (resolve, reject) => {
            await usersService.removeFile(`${filePath}/${fileName}`,
                () => {
                    console.log(`${fileName}: File removed from folder.`);
                    resolve();
                });
        });

        console.log('------------------------------------------------------');
    }
}