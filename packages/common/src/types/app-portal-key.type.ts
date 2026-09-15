import { APP_PORTAL_KEYS } from "../constants";

export type TAppPortalKeys = typeof APP_PORTAL_KEYS;
export type TAppPortalKeysKeys = keyof TAppPortalKeys;
export type TAppPortalKeysValues = (TAppPortalKeys)[TAppPortalKeysKeys];
