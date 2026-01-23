(function($)
{
    $.fn.autosave = function(options)
    {

        /*
         * Get/Set the settings
         */
        var settings = $.extend(
        {
            'id'             : 'autosaveCookie-',
            'erase'          : false,
            'days'           : 3,
            'autosave'       : true,
            'savenow'        : false,
            'recover'        : false,
            'autorecover'    : true,
            'checksaveexists': false,
            'exclude'        : []
        }, options);

        /*
         * Define the cookie name
         */
        var cookie_id = settings.id;

        /*
         * Erase a cookie
         */
        if(settings['erase'] == true)
        {
            $.cookie( cookie_id, null);
            if (typeof(Storage) !== "undefined") {
                localStorage.removeItem(cookie_id);
            }
            else {
                $.cookie(cookie_id, null);
            }

            return true;
        }


        /*
         * Get the saved cookie (if it has one of course)
         */
        var autoSavedCookie;
        if (typeof(Storage) !== "undefined") {
            autoSavedCookie = localStorage.getItem(cookie_id);
        }
        else {
            autoSavedCookie = $.cookie(cookie_id);
        }



        /*
         * Check to see if a save exists
         */
        if(settings['checksaveexists'] == true)
        {
            if(autoSavedCookie)
            {
                return true;
            }
            else
            {
                return false;
            }

            return false;
        }


        /*
         * Perform a manual save
         */
        if(settings['savenow'] == true)
        {
            saveData($(this).val());
            return true;
        }


        /*
         * Recover the form info from the cookie (if it has one)
         */
        if(settings['autorecover'] == true || settings['recover'] == true)
        {
            if(autoSavedCookie)
            {
                $(this).val(autoSavedCookie);
            }

            /*
             * if manual recover action, return
             */
            if(settings['recover'] == true)
            {
                return true;
            }
        }


        /*
         * Autosave - on typing and changing
         */
        if(settings['autosave'] == true)
        {
           saveData($(this).val());
           $(this).change(function()
           {
               console.log( "change" );
               saveData($(this).val());
           });

           $(this).keyup(function()
           {
               console.log( "keyup" );
               saveData($(this).val());
           });
        }

        function saveData(theData)
        {
            console.log( "Save Data " + theData );
            $.cookie(cookie_id, theData, { expires: settings['days'] });
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem(cookie_id, theData );
            }
            else {
                $.cookie(cookie_id, theData, { expires: settings['days'] });
            }
        }

    };
})(jQuery);
