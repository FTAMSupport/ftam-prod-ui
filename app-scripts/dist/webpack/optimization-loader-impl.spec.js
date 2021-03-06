"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var optimization_loader_impl_1 = require("./optimization-loader-impl");
var helpers = require("../util/helpers");
var file_cache_1 = require("../util/file-cache");
describe('optimization loader impl', function () {
    describe('optimizationLoader', function () {
        it('should not cache files not in srcDir or ionicAngularDir', function () {
            var appDir = path_1.join('some', 'fake', 'path', 'myApp');
            var srcDir = path_1.join(appDir, 'src');
            var ionicAngularDir = path_1.join(appDir, 'node_modules', 'ionic-angular');
            var fileCache = new file_cache_1.FileCache();
            var context = {
                srcDir: srcDir,
                ionicAngularDir: ionicAngularDir,
                fileCache: fileCache
            };
            var spy = jasmine.createSpy('callback');
            var webpackContext = {
                cacheable: function () { },
                async: function () { return spy; },
                resourcePath: path_1.join(appDir, 'node_modules', '@angular', 'core', 'index.js')
            };
            spyOn(helpers, helpers.getContext.name).and.returnValue(context);
            optimization_loader_impl_1.optimizationLoader('someSource', {}, webpackContext);
            expect(fileCache.getAll().length).toEqual(0);
        });
        it('should cache files in the ionicAngularDir', function () {
            var appDir = path_1.join('some', 'fake', 'path', 'myApp');
            var srcDir = path_1.join(appDir, 'src');
            var ionicAngularDir = path_1.join(appDir, 'node_modules', 'ionic-angular');
            var fileCache = new file_cache_1.FileCache();
            var context = {
                srcDir: srcDir,
                ionicAngularDir: ionicAngularDir,
                fileCache: fileCache
            };
            var spy = jasmine.createSpy('callback');
            var webpackContext = {
                cacheable: function () { },
                async: function () { return spy; },
                resourcePath: path_1.join(ionicAngularDir, 'index.js')
            };
            spyOn(helpers, helpers.getContext.name).and.returnValue(context);
            var knownSource = 'someSource';
            optimization_loader_impl_1.optimizationLoader(knownSource, {}, webpackContext);
            expect(fileCache.getAll().length).toEqual(1);
            expect(fileCache.get(webpackContext.resourcePath).path).toEqual(webpackContext.resourcePath);
            expect(fileCache.get(webpackContext.resourcePath).content).toEqual(knownSource);
        });
        it('should cache files in the srcDir', function () {
            var appDir = path_1.join('some', 'fake', 'path', 'myApp');
            var srcDir = path_1.join(appDir, 'src');
            var ionicAngularDir = path_1.join(appDir, 'node_modules', 'ionic-angular');
            var fileCache = new file_cache_1.FileCache();
            var context = {
                srcDir: srcDir,
                ionicAngularDir: ionicAngularDir,
                fileCache: fileCache
            };
            var spy = jasmine.createSpy('callback');
            var webpackContext = {
                cacheable: function () { },
                async: function () { return spy; },
                resourcePath: path_1.join(srcDir, 'pages', 'page-one.ts')
            };
            spyOn(helpers, helpers.getContext.name).and.returnValue(context);
            var knownSource = 'someSource';
            optimization_loader_impl_1.optimizationLoader(knownSource, {}, webpackContext);
            expect(fileCache.getAll().length).toEqual(1);
            expect(fileCache.get(webpackContext.resourcePath).path).toEqual(webpackContext.resourcePath);
            expect(fileCache.get(webpackContext.resourcePath).content).toEqual(knownSource);
        });
    });
});
