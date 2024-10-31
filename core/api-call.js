import fetch from 'node-fetch';
import tokenService from '../services/tokenService.js';

//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const callBlob = async (template) => {
  const fetchResult = await fetch(template.url, {
    headers: {
        ...template.headers,
        "authorization": `Bearer ${tokenService.get()}`
    },
    method: template.method,
    body: template.body,
    referrer: template.referrer,
    referrerPolicy: template.referrerPolicy,
    mode: template.mode,
    credentials: template.credentials
  });

  if (!fetchResult.ok) {
    console.log(template);
    throw new Error(`Unexpected response ${fetchResult.statusText}`);
  }

  return fetchResult;
}

const callAllBlobs = async (templates) => {
  const fetchResults = await Promise.all(templates.map(template => fetch(template.url, {
      headers: {
          ...template.headers,
          "authorization": `Bearer ${tokenService.get()}`
      },
      referrer: template.referrer,
      body: template.body,
      method: template.method
    })
    .catch(err => {
      throw new Error(err.message);
    })
  ));

  return await Promise.all(fetchResults.map(res => res));
}

const call = async (template) => {
  const fetchResult = await fetch(template.url, {
    headers: {
        ...template.headers,
        "authorization": `Bearer ${tokenService.get()}`
    },
    referrer: template.referrer,
    referrerPolicy: template.referrerPolicy,
  });

  const result = await fetchResult.json();

  if (fetchResult.ok) {
    return result;
  }

  const responseError = {
    type: 'Error',
    message: result.message || 'Something went wrong',
    data: result.data || '',
    code: result.code || '',
  };

  let error = new Error();
  error = {
     ...error,
     ...responseError
  };

  throw (error);
}

const callAll = async (templates) => {
  const fetchResults = await Promise.all(templates.map(template => fetch(template.url, {
      headers: {
          ...template.headers,
          "authorization": `Bearer ${tokenService.get()}`
      },
      referrer: template.referrer,
      referrerPolicy: template.referrerPolicy,
    })
    .catch(err => console.log(err))
  ));

  return await Promise.all(fetchResults.map(res => res.json()));
}

export {
  callBlob,
  callAllBlobs,
  call,
  callAll,
}