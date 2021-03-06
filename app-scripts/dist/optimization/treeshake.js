"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var logger_1 = require("../logger/logger");
var Constants = require("../util/constants");
var helpers_1 = require("../util/helpers");
function calculateUnusedComponents(dependencyMap) {
    return calculateUnusedComponentsImpl(dependencyMap, process.env[Constants.ENV_VAR_IONIC_ANGULAR_ENTRY_POINT]);
}
exports.calculateUnusedComponents = calculateUnusedComponents;
function calculateUnusedComponentsImpl(dependencyMap, importee) {
    var filteredMap = filterMap(dependencyMap);
    processImportTree(filteredMap, importee);
    calculateUnusedIonicProviders(filteredMap);
    return generateResults(filteredMap);
}
exports.calculateUnusedComponentsImpl = calculateUnusedComponentsImpl;
function generateResults(dependencyMap) {
    var toPurgeMap = new Map();
    var updatedMap = new Map();
    dependencyMap.forEach(function (importeeSet, modulePath) {
        if ((importeeSet && importeeSet.size > 0) || requiredModule(modulePath)) {
            logger_1.Logger.debug("[treeshake] generateResults: " + modulePath + " is not purged");
            updatedMap.set(modulePath, importeeSet);
        }
        else {
            logger_1.Logger.debug("[treeshake] generateResults: " + modulePath + " is purged");
            toPurgeMap.set(modulePath, importeeSet);
        }
    });
    return {
        updatedDependencyMap: updatedMap,
        purgedModules: toPurgeMap
    };
}
function requiredModule(modulePath) {
    var mainJsFile = helpers_1.changeExtension(process.env[Constants.ENV_APP_ENTRY_POINT], '.js');
    var mainTsFile = helpers_1.changeExtension(process.env[Constants.ENV_APP_ENTRY_POINT], '.ts');
    var appModule = helpers_1.changeExtension(process.env[Constants.ENV_APP_NG_MODULE_PATH], '.js');
    var appModuleNgFactory = getAppModuleNgFactoryPath();
    return modulePath === mainJsFile || modulePath === mainTsFile || modulePath === appModule || modulePath === appModuleNgFactory;
}
function filterMap(dependencyMap) {
    var filteredMap = new Map();
    dependencyMap.forEach(function (importeeSet, modulePath) {
        if (isIonicComponentOrAppSource(modulePath)) {
            filteredMap.set(modulePath, importeeSet);
        }
    });
    return filteredMap;
}
function processImportTree(dependencyMap, importee) {
    var importees = [];
    dependencyMap.forEach(function (importeeSet, modulePath) {
        if (importeeSet && importeeSet.has(importee)) {
            importeeSet.delete(importee);
            // if it importer by an `ngfactory` file, we probably aren't going to be able to purge it
            var ngFactoryImportee = false;
            var importeeList = Array.from(importeeSet);
            for (var _i = 0, importeeList_1 = importeeList; _i < importeeList_1.length; _i++) {
                var entry = importeeList_1[_i];
                if (isNgFactory(entry)) {
                    ngFactoryImportee = true;
                    break;
                }
            }
            if (!ngFactoryImportee) {
                importees.push(modulePath);
            }
        }
    });
    importees.forEach(function (importee) { return processImportTree(dependencyMap, importee); });
}
function calculateUnusedIonicProviders(dependencyMap) {
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: beginning to purge providers");
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to purge action sheet controller");
    processIonicProviders(dependencyMap, process.env[Constants.ENV_ACTION_SHEET_CONTROLLER_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to purge alert controller");
    processIonicProviders(dependencyMap, process.env[Constants.ENV_ALERT_CONTROLLER_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to loading controller");
    processIonicProviders(dependencyMap, process.env[Constants.ENV_LOADING_CONTROLLER_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to modal controller");
    processIonicProviders(dependencyMap, process.env[Constants.ENV_MODAL_CONTROLLER_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to picker controller");
    processIonicProviders(dependencyMap, process.env[Constants.ENV_PICKER_CONTROLLER_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to popover controller");
    processIonicProviders(dependencyMap, process.env[Constants.ENV_POPOVER_CONTROLLER_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to toast controller");
    processIonicProviders(dependencyMap, process.env[Constants.ENV_TOAST_CONTROLLER_PATH]);
    // check if the controllers were deleted, if so, purge the component too
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to action sheet component");
    processIonicProviderComponents(dependencyMap, process.env[Constants.ENV_ACTION_SHEET_CONTROLLER_PATH], process.env[Constants.ENV_ACTION_SHEET_COMPONENT_FACTORY_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to alert component");
    processIonicProviderComponents(dependencyMap, process.env[Constants.ENV_ALERT_CONTROLLER_PATH], process.env[Constants.ENV_ALERT_COMPONENT_FACTORY_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to loading component");
    processIonicProviderComponents(dependencyMap, process.env[Constants.ENV_LOADING_CONTROLLER_PATH], process.env[Constants.ENV_LOADING_COMPONENT_FACTORY_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to modal component");
    processIonicProviderComponents(dependencyMap, process.env[Constants.ENV_MODAL_CONTROLLER_PATH], process.env[Constants.ENV_MODAL_COMPONENT_FACTORY_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to picker component");
    processIonicProviderComponents(dependencyMap, process.env[Constants.ENV_PICKER_CONTROLLER_PATH], process.env[Constants.ENV_PICKER_COMPONENT_FACTORY_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to popover component");
    processIonicProviderComponents(dependencyMap, process.env[Constants.ENV_POPOVER_CONTROLLER_PATH], process.env[Constants.ENV_POPOVER_COMPONENT_FACTORY_PATH]);
    logger_1.Logger.debug("[treeshake] calculateUnusedIonicProviders: attempting to toast component");
    processIonicProviderComponents(dependencyMap, process.env[Constants.ENV_TOAST_CONTROLLER_PATH], process.env[Constants.ENV_TOAST_COMPONENT_FACTORY_PATH]);
}
function processIonicProviderComponents(dependencyMap, providerPath, componentPath) {
    var importeeSet = dependencyMap.get(providerPath);
    if (importeeSet && importeeSet.size === 0) {
        processIonicProviders(dependencyMap, componentPath);
    }
}
function getAppModuleNgFactoryPath() {
    var appNgModulePath = process.env[Constants.ENV_APP_NG_MODULE_PATH];
    var jsVersion = helpers_1.changeExtension(appNgModulePath, '.js');
    return helpers_1.convertFilePathToNgFactoryPath(jsVersion);
}
exports.getAppModuleNgFactoryPath = getAppModuleNgFactoryPath;
function processIonicProviders(dependencyMap, providerPath) {
    var importeeSet = dependencyMap.get(providerPath);
    var appModuleNgFactoryPath = getAppModuleNgFactoryPath();
    // we can only purge an ionic provider if it is imported from one module, which is the AppModuleNgFactory
    if (importeeSet && importeeSet.size === 1 && importeeSet.has(appModuleNgFactoryPath)) {
        logger_1.Logger.debug("[treeshake] processIonicProviders: Purging " + providerPath);
        importeeSet.delete(appModuleNgFactoryPath);
        // loop over the dependency map and remove this provider from importee sets
        processImportTreeForProviders(dependencyMap, providerPath);
    }
}
function processImportTreeForProviders(dependencyMap, importee) {
    var importees = [];
    dependencyMap.forEach(function (importeeSet, modulePath) {
        if (importeeSet.has(importee)) {
            importeeSet.delete(importee);
            importees.push(modulePath);
        }
    });
    importees.forEach(function (importee) { return processImportTreeForProviders(dependencyMap, importee); });
}
function isIonicComponentOrAppSource(modulePath) {
    // for now, just use a simple filter of if a file is in ionic-angular/components
    var ionicAngularComponentDir = path_1.join(process.env[Constants.ENV_VAR_IONIC_ANGULAR_DIR], 'components');
    var srcDir = process.env[Constants.ENV_VAR_SRC_DIR];
    return modulePath.indexOf(ionicAngularComponentDir) >= 0 || modulePath.indexOf(srcDir) >= 0;
}
exports.isIonicComponentOrAppSource = isIonicComponentOrAppSource;
function isNgFactory(modulePath) {
    return modulePath.indexOf('.ngfactory.') >= 0;
}
exports.isNgFactory = isNgFactory;
function purgeUnusedImportsAndExportsFromIndex(indexFilePath, indexFileContent, modulePathsToPurge) {
    logger_1.Logger.debug("[treeshake] purgeUnusedImportsFromIndex: Starting to purge import/exports ... ");
    for (var _i = 0, modulePathsToPurge_1 = modulePathsToPurge; _i < modulePathsToPurge_1.length; _i++) {
        var modulePath = modulePathsToPurge_1[_i];
        // I cannot get the './' prefix to show up when using path api
        logger_1.Logger.debug("[treeshake] purgeUnusedImportsFromIndex: Removing " + modulePath + " from " + indexFilePath);
        var extensionless = helpers_1.changeExtension(modulePath, '');
        var relativeImportPath = './' + path_1.relative(path_1.dirname(indexFilePath), extensionless);
        var importPath = helpers_1.toUnixPath(relativeImportPath);
        logger_1.Logger.debug("[treeshake] purgeUnusedImportsFromIndex: Removing imports with path " + importPath);
        var importRegex = generateImportRegex(importPath);
        // replace the import if it's found
        var results = null;
        while ((results = importRegex.exec(indexFileContent)) && results.length) {
            indexFileContent = indexFileContent.replace(importRegex, "/*" + results[0] + "*/");
        }
        results = null;
        var exportRegex = generateExportRegex(importPath);
        logger_1.Logger.debug("[treeshake] purgeUnusedImportsFromIndex: Removing exports with path " + importPath);
        while ((results = exportRegex.exec(indexFileContent)) && results.length) {
            indexFileContent = indexFileContent.replace(exportRegex, "/*" + results[0] + "*/");
        }
    }
    logger_1.Logger.debug("[treeshake] purgeUnusedImportsFromIndex: Starting to purge import/exports ... DONE");
    return indexFileContent;
}
exports.purgeUnusedImportsAndExportsFromIndex = purgeUnusedImportsAndExportsFromIndex;
function generateImportRegex(relativeImportPath) {
    var cleansedString = helpers_1.escapeStringForRegex(relativeImportPath);
    return new RegExp("^import.*?{(.+)}.*?from.*?['\"`]" + cleansedString + "['\"`];", 'gm');
}
function generateExportRegex(relativeExportPath) {
    var cleansedString = helpers_1.escapeStringForRegex(relativeExportPath);
    return new RegExp("^export.*?{(.+)}.*?from.*?'" + cleansedString + "';", 'gm');
}
function purgeComponentNgFactoryImportAndUsage(appModuleNgFactoryPath, appModuleNgFactoryContent, componentFactoryPath) {
    logger_1.Logger.debug("[treeshake] purgeComponentNgFactoryImportAndUsage: Starting to purge component ngFactory import/export ...");
    var extensionlessComponentFactoryPath = helpers_1.changeExtension(componentFactoryPath, '');
    var relativeImportPath = path_1.relative(path_1.dirname(appModuleNgFactoryPath), extensionlessComponentFactoryPath);
    var importPath = helpers_1.toUnixPath(relativeImportPath);
    logger_1.Logger.debug("[treeshake] purgeComponentNgFactoryImportAndUsage: Purging imports from " + importPath);
    var importRegex = generateWildCardImportRegex(importPath);
    var results = importRegex.exec(appModuleNgFactoryContent);
    if (results && results.length >= 2) {
        appModuleNgFactoryContent = appModuleNgFactoryContent.replace(importRegex, "/*" + results[0] + "*/");
        var namedImport = results[1].trim();
        logger_1.Logger.debug("[treeshake] purgeComponentNgFactoryImportAndUsage: Purging code using named import " + namedImport);
        var purgeFromConstructor = generateRemoveComponentFromConstructorRegex(namedImport);
        var purgeFromConstructorResults = purgeFromConstructor.exec(appModuleNgFactoryContent);
        if (purgeFromConstructorResults && purgeFromConstructorResults.length) {
            appModuleNgFactoryContent = appModuleNgFactoryContent.replace(purgeFromConstructor, "/*" + purgeFromConstructorResults[0] + "*/");
        }
    }
    logger_1.Logger.debug("[treeshake] purgeComponentNgFactoryImportAndUsage: Starting to purge component ngFactory import/export ... DONE");
    return appModuleNgFactoryContent;
}
exports.purgeComponentNgFactoryImportAndUsage = purgeComponentNgFactoryImportAndUsage;
function purgeProviderControllerImportAndUsage(appModuleNgFactoryPath, appModuleNgFactoryContent, providerPath) {
    logger_1.Logger.debug("[treeshake] purgeProviderControllerImportAndUsage: Starting to purge provider controller and usage ...");
    var extensionlessComponentFactoryPath = helpers_1.changeExtension(providerPath, '');
    var relativeImportPath = path_1.relative(path_1.dirname(process.env[Constants.ENV_VAR_IONIC_ANGULAR_DIR]), extensionlessComponentFactoryPath);
    var importPath = helpers_1.toUnixPath(relativeImportPath);
    logger_1.Logger.debug("[treeshake] purgeProviderControllerImportAndUsage: Looking for imports from " + importPath);
    var importRegex = generateWildCardImportRegex(importPath);
    var results = importRegex.exec(appModuleNgFactoryContent);
    if (results && results.length >= 2) {
        var namedImport = results[1].trim();
        // purge the getter
        var purgeGetterRegEx = generateRemoveGetterFromImportRegex(namedImport);
        var purgeGetterResults = purgeGetterRegEx.exec(appModuleNgFactoryContent);
        var purgeIfRegEx = generateRemoveIfStatementRegex(namedImport);
        var purgeIfResults = purgeIfRegEx.exec(appModuleNgFactoryContent);
        if (purgeGetterResults && purgeIfResults) {
            logger_1.Logger.debug("[treeshake] purgeProviderControllerImportAndUsage: Purging imports " + namedImport);
            appModuleNgFactoryContent = appModuleNgFactoryContent.replace(importRegex, "/*" + results[0] + "*/");
            logger_1.Logger.debug("[treeshake] purgeProviderControllerImportAndUsage: Purging getter logic using " + namedImport);
            var getterContentToReplace = purgeGetterResults[0];
            var newGetterContent = "/*" + getterContentToReplace + "*/";
            appModuleNgFactoryContent = appModuleNgFactoryContent.replace(getterContentToReplace, newGetterContent);
            logger_1.Logger.debug("[treeshake] purgeProviderControllerImportAndUsage: Purging additional logic using " + namedImport);
            var purgeIfContentToReplace = purgeIfResults[0];
            var newPurgeIfContent = "/*" + purgeIfContentToReplace + "*/";
            appModuleNgFactoryContent = appModuleNgFactoryContent.replace(purgeIfContentToReplace, newPurgeIfContent);
        }
    }
    logger_1.Logger.debug("[treeshake] purgeProviderControllerImportAndUsage: Starting to purge provider controller and usage ... DONE");
    return appModuleNgFactoryContent;
}
exports.purgeProviderControllerImportAndUsage = purgeProviderControllerImportAndUsage;
function purgeProviderClassNameFromIonicModuleForRoot(indexFileContent, providerClassName) {
    logger_1.Logger.debug("[treeshake] purgeProviderClassNameFromIonicModuleForRoot: Purging reference in the ionicModule forRoot method ...");
    var regex = generateIonicModulePurgeProviderRegex(providerClassName);
    var results = regex.exec(indexFileContent);
    if (results && results.length) {
        indexFileContent = indexFileContent.replace(regex, "/*" + results[0] + "*/");
    }
    logger_1.Logger.debug("[treeshake] purgeProviderClassNameFromIonicModuleForRoot: Purging reference in the ionicModule forRoot method ... DONE");
    return indexFileContent;
}
exports.purgeProviderClassNameFromIonicModuleForRoot = purgeProviderClassNameFromIonicModuleForRoot;
function generateWildCardImportRegex(relativeImportPath) {
    var cleansedString = helpers_1.escapeStringForRegex(relativeImportPath);
    return new RegExp("import.*?as(.*?)from '" + cleansedString + "';");
}
exports.generateWildCardImportRegex = generateWildCardImportRegex;
function generateRemoveComponentFromConstructorRegex(namedImport) {
    return new RegExp(namedImport + "..*?,");
}
exports.generateRemoveComponentFromConstructorRegex = generateRemoveComponentFromConstructorRegex;
function generateRemoveGetterFromImportRegex(namedImport) {
    var regexString = "(get _.*?_\\d*\\(\\) {[\\s\\S][^}]*?" + namedImport + "[\\s\\S]*?}[\\s\\S]*?})";
    return new RegExp(regexString);
}
exports.generateRemoveGetterFromImportRegex = generateRemoveGetterFromImportRegex;
function generateRemoveIfStatementRegex(namedImport) {
    return new RegExp("if \\(\\(token === " + namedImport + ".([\\S]*?)\\)\\) {([\\S\\s]*?)}", "gm");
}
exports.generateRemoveIfStatementRegex = generateRemoveIfStatementRegex;
function generateIonicModulePurgeProviderRegex(className) {
    return new RegExp(className + ",", "gm");
}
exports.generateIonicModulePurgeProviderRegex = generateIonicModulePurgeProviderRegex;
