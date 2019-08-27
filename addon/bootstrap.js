/* Copyright 2012 Will Shanks.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";
/* global Components, Services */
/* global Zutilo */
const {classes: Cc, utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");

const BOOTSTRAP_REASONS = [
    "", // the bootstrap reason is 1 based
    "APP_STARTUP",
    "APP_SHUTDOWN",
    "ADDON_ENABLE",
    "ADDON_DISABLE",
    "ADDON_INSTALL",
    "ADDON_UNINSTALL",
    "ADDON_UPGRADE",
    "ADDON_DOWNGRADE"
];

// eslint-disable-next-line no-unused-vars
function install(data, reason) {

}

// eslint-disable-next-line no-unused-vars
function startup(data, reason) {
    Cu.import("chrome://zutilo/content/zutilo.jsm");
    Zutilo.init();
}

// eslint-disable-next-line no-unused-vars
function shutdown(data, reason) {
    if (reason == APP_SHUTDOWN) {
        return;
    }

    var windows = Services.wm.getEnumerator('navigator:browser');
    while (windows.hasMoreElements()) {
        var tmpWin=windows.getNext();

        tmpWin.ZutiloChrome.removeXUL();
        if (typeof tmpWin.ZutiloChrome.firefoxOverlay != 'undefined') {
            tmpWin.ZutiloChrome.firefoxOverlay.unload();
        }
        if (typeof tmpWin.ZutiloChrome.zoteroOverlay != 'undefined') {
            tmpWin.ZutiloChrome.zoteroOverlay.unload();
        }
        delete tmpWin.ZutiloChrome;
        delete tmpWin.Zutilo;
    }

    Zutilo.cleanup();

    Cc["@mozilla.org/intl/stringbundle;1"].
        getService(Components.interfaces.nsIStringBundleService).flushBundles();

    Cu.unload("chrome://zutilo/content/zutilo.jsm");
}

// eslint-disable-next-line no-unused-vars
function uninstall(data, reason) {

}
