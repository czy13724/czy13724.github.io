import type { Config } from '../prompts';
export declare type Variables = {
    isLocalEnvVarName: string;
};
export declare type DatabaseAdapterTypes = 'upstash-redis';
export declare const databaseTemplate: ({ config }: {
    config: Config;
}) => string;
