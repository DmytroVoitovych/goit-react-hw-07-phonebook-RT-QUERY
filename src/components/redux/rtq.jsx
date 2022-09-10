import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { result } from './reduxResult';



export const bookApi = createApi({
    reducerPath: 'bookApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://631aefbddc236c0b1ee7c2e4.mockapi.io/' }),
    tagTypes: ['Contacts'],
    endpoints: (builder) => ({
        getContacts: builder.query({
            query: () => `contacts/contacts`,
            providesTags: result,
        }),
   
        addContacts: builder.mutation({
            query: (body) => ({
                url: `contacts/contacts`,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'Contacts', id: 'LIST'}]
        }),
         dellContacts: builder.mutation({
            query: (id) => ({
                url: `contacts/contacts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{type: 'Contacts', id: 'LIST'}]
        }),
    }),
});




export const {useGetContactsQuery, useAddContactsMutation, useDellContactsMutation} = bookApi;