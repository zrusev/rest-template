import inboxService from './../../services/inboxService.js';
import usersService from './../../services/usersService.js';
import context from './../../helpers/context.js';

import { callBlob } from './../api-call.js';
import mime from 'mime-types';
import mkdirp from 'mkdirp';
import { username } from 'username';
import { systemConstants } from './../../constants.js';

export default getTemplate = async () => {
    //1. Initalize store
    const initialState = [];
    context.create(initialState);

    //2. Get all reports to look for
    const reports = JSON.parse(usersService.get('reports.json'));
    context.add({
        reports: reports
    });

    const users = JSON.parse(usersService.get('ids.json'));
    const userName = await username();
    const lanIdResult = users.find(r => r[userName]);

    if (lanIdResult === undefined) {
        throw new Error(`${userName}: Missing mapping Lan IDs.`);
    }
    const lanId = lanIdResult[userName];

    const filtered = reports['reports'];

    //3. Download all based on subProcessName, formName & formtype
    for (const report of filtered) {
        const subProcessName = report['subProcessName'];

        for (const form of report['formName']) {
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
                    .replace('{loggedinUser}', lanId)
                    .replace('{reviewType}', formtype["value"])
                    .replace('{startDate}', systemConstants.START_DATE)
                    .replace('{endDate}', systemConstants.END_DATE)
            };
            console.log(`Downloading: ${subProcessName}-${formName}...`);

            let result = '';
            try {
                result = await callBlob(userTemplate);

            } catch (e) {
                console.log(e);
                return;
            }
            const type = result.headers.get('Content-Type');
            const fileName = `${formName.trim()}`;

            const dt = new Date(systemConstants.START_DATE).toISOString().split('T')[0].replace(/-/g, '').toString()
                       + '-'
                       + new Date(systemConstants.END_DATE).toISOString().split('T')[0].replace(/-/g, '').toString();
            const dir = systemConstants.INBOXES_PATH + dt;
            await mkdirp(dir);

            await inboxService.storeBlob(`${dt}/${fileName}.${mime.extension(type)}`, result.body);
        }
    }
}