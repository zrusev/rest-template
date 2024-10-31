let state = [];

const context = {
    create: (payload) => {
        state = payload;

        return state;
    },
    get: () => {
        return state;
    },
    add: (payload) => {
        state = [...context.get(), payload];

        return state;
    },
    remove: () => {},
    size: () => state.length,
}

export default context;