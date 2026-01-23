/*
 * jQuery File Upload Plugin JS Example
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global $, window */

function initBlueImp( tagUid, uploadSectionId, galleryName, galleryRoot, dropZoneElement)
{
    'use strict';

    // Initialize the jQuery File Upload widget:
    $('#'+uploadSectionId).fileupload({
        xhrFields: {withCredentials: true},
        autoUpload: false,
        url: '/cis/FileUpload',
        dropZone: $(dropZoneElement),
        disableExifThumbnail: true,
        formData:
                 [
                     {
                         name: 'galleryName',
                         value: galleryName
                     },
                     {
                         name: 'galleryRoot',
                         value: galleryRoot
                     }
                 ]
    });

    $('#'+uploadSectionId).bind('fileuploaddone', function (e, data)
                                {
                                   document.getElementById( 'section_refresh'+tagUid ).click();
                                }
     );

//  $('#'+uploadSectionId).bind('fileuploadprogressall', function (e, data) {});

    $(document).bind('drop dragover', function (e) {
        e.preventDefault();
    });

    // Enable iframe cross-domain access via redirect option:
    $('#'+uploadSectionId).fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        )
    );

    $('#'+uploadSectionId).addClass('fileupload-processing');

    $.ajax({
        xhrFields: {withCredentials: true},
        url: $('.fileupload').fileupload('option', 'url'),
        dataType: 'json',
        context: $('.fileupload')[0]
    }).always(function () {
        $(this).removeClass('fileupload-processing');
    }).done(function (result) {
        $(this).fileupload('option', 'done')
            .call(this, $.Event('done'), {result: result});
      });

}
