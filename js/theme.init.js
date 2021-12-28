(function ($) {
    'use strict';
    if (typeof theme.PluginScrollToTop !== 'undefined') {
        theme.PluginScrollToTop.initialize();
    }
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });
    if ($.isFunction($.validator) && typeof theme.PluginValidation !== 'undefined') {
        theme.PluginValidation.initialize();
    }
  
   
    if ($.isFunction($.fn['themePluginSort']) && ($('[data-plugin-sort]').length || $('.sort-source').length)) {
        theme.fn.intObsInit('[data-plugin-sort]:not(.manual), .sort-source:not(.manual)', 'themePluginSort');
    }
    
    if ($.isFunction($.fn['themePluginToggle']) && $('[data-plugin-toggle]').length) {
        theme.fn.intObsInit('[data-plugin-toggle]:not(.manual)', 'themePluginToggle');
    }
    
    if (typeof theme.Nav !== 'undefined') {
        theme.Nav.initialize();
    }
   
}).apply(this, [jQuery]);