import inboxService from './../../services/inboxService.js';
import flattenJSON from './../../helpers/jsonFlattener.js';
import context from './../../helpers/context.js';
import { callAll } from './../api-call.js';
import process from './../../templates/process.js';

export default exportAllProcessesFromJson = async () => {
    //Initalize store
    const initialState = [];
    context.create(initialState);

    //Get all processes to look for
    const userProcesses = JSON.parse(inboxService.get('processes.json'));
    context.add({
        userProcesses: userProcesses
    });

    //6. Loop through all processes to get each details
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

    //Log a summary
    console.log(flattenJSON(context.get()[context.size() - 1]));
}