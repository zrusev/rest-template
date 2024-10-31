import inboxService from './../../services/inboxService.js';
import usersService from './../../services/usersService.js';
import flattenJSON from './../../helpers/jsonFlattener.js';
import context from './../../helpers/context.js';
import delay from './../../helpers/delay.js';

import { call, callAll } from './../api-call.js';
import personal from './../../templates/personal.js';
import processes from './../../templates/processes.js';
import process from './../../templates/process.js';

export default exportAllProcesses = async () => {
    //1. Initalize store
    const initialState = [];
    context.create(initialState);

    //2. Get all users to look for
    const users = JSON.parse(usersService.get('users.json'));
    context.add({
        users: users
    });

    //3. Get my inboxes
    console.log('Getting my inboxes...');
    const myTemplate = personal;

    let myInboxes = { 'inboxes': [] };
    try {
        myInboxes = await call(myTemplate);
    } catch (e) {
        console.log(e);
        return;
    }

    context.add(myInboxes);
    if(myInboxes['inboxes'].length !== 0) {
        inboxService.store('myInboxes.json', JSON.stringify(myInboxes));
    }

    console.log('My inboxes successfully exported.');

    //4. Filter only needed
    const filtered = myInboxes['inboxes']
        .filter(ibx => users['inboxes']
        .map(i => i['id'])
        .includes(ibx['id']))

    context.add({
        filtered: filtered
    });

    //5. Download all based on process count & inbox id
    console.log('Downloading user processes...');

    let userProcesses = [];
    for (const inbox of filtered) {
        const inboxDetails = {
            ...inbox,
            size: inbox.businessProcessesActiveCount
        }

        const processesTemplate = {
            ...processes,
            url: processes.url
                .replace('{id}', inboxDetails.id)
                .replace('{size}', inboxDetails.size),
            referrer: processes.referrer.replace('{id}', inboxDetails.id)
        };

        //Set user's template in case of no records
        let inboxData = {
            inbox: {
                id: inbox.id,
                user: {
                    name: inbox['user'].name
                },
                name: inbox.name
            }
        }
        try {
            const queryResult = await call(processesTemplate);
            if (queryResult['totalCount'] === 0) {
                inboxData = {
                    processes: [],
                    ...inboxData
                }
            }
            userProcesses.push({
                ...queryResult,
                ...inboxData
            });
        } catch (e) {
            console.log(e);
            return;
        }

        await delay(100);
    }

    context.add({
        userProcesses: userProcesses
    });

    inboxService.store('userProcesses.json', JSON.stringify(userProcesses));
    console.log('User processes successfully exported.');

    const processIds = userProcesses
        .filter(p => p['totalCount'] !== 0)
        .map(k => k['processes']
        .map(i => i.id))
        .flatMap(p => p);

    console.log('Downloading all processes...');

    let processTemplates = [];
    const allProcesses = [];
    for (const [index, id] of processIds.entries()) {
        const processTemplate = {
            ...process,
            url: process.url.replace('{id}', id),
            referrer: process.referrer.replace('{id}', id)
        };

        processTemplates.push(processTemplate);

        if (index % 50 !== 0 || index === processIds.length - 1) {
            try {
                const results = await callAll(processTemplates);
                allProcesses.push(...results);
                processTemplates = [];
            } catch (e) {
                console.log(e);
                return;
            }
        }
    }

    context.add({
        allProcesses: allProcesses
    });

    inboxService.store(`allProcesses ${new Date().toISOString().split('T')[0].replace(/-/g, '')}.json`, JSON.stringify(allProcesses));
    console.log('All processes successfully exported.');

    //7. Log a summary
    console.log(flattenJSON(context.get()[context.size() - 1]));
}
