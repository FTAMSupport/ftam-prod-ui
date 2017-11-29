import { CallExpression, SourceFile } from 'typescript';
import { FileCache } from '../util/file-cache';
import { BuildContext, ChangedFile, DeepLinkConfigEntry, DeepLinkDecoratorAndClass, DeepLinkPathInfo, File } from '../util/interfaces';
export declare function getDeepLinkData(appNgModuleFilePath: string, fileCache: FileCache, isAot: boolean): DeepLinkConfigEntry[];
export declare function filterTypescriptFilesForDeepLinks(fileCache: FileCache): File[];
export declare function getNgModulePathFromCorrespondingPage(filePath: string): string;
export declare function getRelativePathToPageNgModuleFromAppNgModule(pathToAppNgModule: string, pathToPageNgModule: string): string;
export declare function getNgModuleDataFromPage(appNgModuleFilePath: string, filePath: string, className: string, fileCache: FileCache, isAot: boolean): DeepLinkPathInfo;
export declare function getDeepLinkDecoratorContentForSourceFile(sourceFile: SourceFile): DeepLinkDecoratorAndClass;
export declare function hasExistingDeepLinkConfig(appNgModuleFilePath: string, appNgModuleFileContent: string): boolean;
export declare function convertDeepLinkConfigEntriesToString(entries: DeepLinkConfigEntry[]): string;
export declare function convertDeepLinkEntryToJsObjectString(entry: DeepLinkConfigEntry): string;
export declare function updateAppNgModuleAndFactoryWithDeepLinkConfig(context: BuildContext, deepLinkString: string, changedFiles: ChangedFile[], isAot: boolean): void;
export declare function getUpdatedAppNgModuleContentWithDeepLinkConfig(appNgModuleFilePath: string, appNgModuleFileContent: string, deepLinkStringContent: string): string;
export declare function getUpdatedAppNgModuleFactoryContentWithDeepLinksConfig(appNgModuleFactoryFileContent: string, deepLinkStringContent: string): string;
export declare function addDefaultSecondArgumentToAppNgModule(appNgModuleFileContent: string, ionicModuleForRoot: CallExpression): string;
export declare function addDeepLinkArgumentToAppNgModule(appNgModuleFileContent: string, ionicModuleForRoot: CallExpression, deepLinkString: string): string;
export declare function generateDefaultDeepLinkNgModuleContent(pageFilePath: string, className: string): string;