export const result = (result) => //https://redux-toolkit.js.org/rtk-query/api/createApi#providestags
    result
        ? [
            ...result.map(({ id }) => ({ type: 'Contacts', id })),
            { type: 'Contacts', id: 'LIST' },
        ]
        : [{ type: 'Contacts', id: 'LIST' }];