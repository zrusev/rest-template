import inboxService from './../../services/inboxService.js';
import usersService from './../../services/usersService.js';
import context from './../../helpers/context.js';

import { callBlob } from './../api-call.js';
import mime from 'mime-types';
import mkdirp from 'mkdirp';
import { systemConstants } from './../../constants.js';

export default getAllFromTemplate = async () => {
    //1. Initalize store
    const initialState = [];
    context.create(initialState);

    //2. Get all reports to look for
    const reports = JSON.parse(usersService.get('reports.json'));
    context.add({
        reports: reports
    });

    const filtered = reports['reports'];

    const dt = new Date(systemConstants.START_DATE).toISOString().split('T')[0].replace(/-/g, '').toString()
        + '-'
        + new Date(systemConstants.END_DATE).toISOString().split('T')[0].replace(/-/g, '').toString();
    const dir = systemConstants.INBOXES_PATH + dt;
    await mkdirp(dir);

    let tasks = [];

    //3. Download all based on subProcessName, formName & formtype
    for (const [rIndex, report] of filtered.entries()) {
        const subProcessName = report['subProcessName'];

        for (const [fIndex, form] of report['formName'].entries()) {
            const formName = form['name'];
            const formNameValue = form['value'];
            const formtype = form['formtype'];

            const userTemplate = {
                ...template,
                body: template.body
                    .replace('{subProcessName}', subProcessName)
                    .replace('{formName}', formName)
                    .replace('{reviewName}', formNameValue)
                    .replace('{formtype}', formtype["name"])
                    .replace('{reviewType}', formtype["value"])
                    .replace('{startDate}', systemConstants.START_DATE)
                    .replace('{endDate}', systemConstants.END_DATE)
            };

            const task = new Promise(async (resolve, reject) => {
                try {
                    const result = await callBlob(userTemplate);
                    const type = result.headers.get('Content-Type');

                    await inboxService.storeBlob(`${dt}/${subProcessName}-${formName}.${mime.extension(type)}`, result.body);
                    console.log(`Added: ${rIndex}. ${subProcessName}-${fIndex}. ${formName}...`);

                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            });

            tasks.push(task);
        }
    }

    await Promise.all(tasks)
        .catch(err => console.log(err));
}