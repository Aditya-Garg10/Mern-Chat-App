export const HOST = "http://localhost:8000";

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE =`${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE =`${AUTH_ROUTES}/login`
export const GET_USER_INFO =`${AUTH_ROUTES}/user-info`
export const UPDATE_PROFILE_ROUTE =`${AUTH_ROUTES}/updateProfile`
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/addProfileImage`
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/removeProfileImage`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`


export const CONTACTS_ROUTES = "api/contacts"
export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/search`
export const GET_DM_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/getContactsForDM`
export const GET_ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/getAllContacts`


export const MESSAGES_ROUTES = "api/messages"
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/getMessages`
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/uploadFile`

export const CHANNEL_ROUTES = "api/channels"
export const CREATE_CHANNEL_ROUTES = `${CHANNEL_ROUTES}/createChannel`
export const GET_USER_CHANNEL_ROUTES = `${CHANNEL_ROUTES}/getUserChannels`
export const GET_CHANNEL_MESSAGES_ROUTE = `${CHANNEL_ROUTES}/getChannelMessage`

