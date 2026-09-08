import { DynamicModule, ModuleMetadata } from '@nestjs/common';

export type TModuleImports = NonNullable<ModuleMetadata['imports']>;
export type TModuleProviders = NonNullable<ModuleMetadata['providers']>;
export type TModuleControllers = NonNullable<ModuleMetadata['controllers']>;
export type TModuleExports = NonNullable<ModuleMetadata['exports']>;

export type TModuleDynamic = NonNullable<Array<DynamicModule>>;
