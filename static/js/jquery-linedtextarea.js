/**
* jQuery Lined Textarea Plugin 
*   http://alan.blog-city.com/jquerylinedtextarea.htm
*
* Copyright (c) 2010 Alan Williamson
* 
* Version: 
*    $Id: jquery-linedtextarea.js 464 2010-01-08 10:36:33Z alan $
*
* Released under the MIT License:
*    http://www.opensource.org/licenses/mit-license.php
* 
* Usage:
*   Displays a line number count column to the left of the textarea
*   
*   Class up your textarea with a given class, or target it directly
*   with JQuery Selectors
*   
*   $(".lined").linedtextarea({
*   	selectedLine: 10,
*    selectedClass: 'lineselect'
*   });
*
* History:
*   - 2010.01.08: Fixed a Google Chrome layout problem
*   - 2010.01.07: Refactored code for speed/readability; Fixed horizontal sizing
*   - 2010.01.06: Initial Release
*
*/
(function($) {
    $.fn.linedtextarea = function(options) {

        // Get the Options
        var opts = $.extend({}, $.fn.linedtextarea.defaults, options);
        /*
            * Helper function to make sure the line numbers are always
            * kept up to the current system
        */
        var fillOutLines = function(codeLines, h, lineNo, ccodeLines){
            while ( (codeLines.height() - h ) <= 0 ){
                codeLines.append("<div id='cell_" + lineNo + "' class='lineno'>" + lineNo + "</div>");
                ccodeLines.append("<div class='lineval row'><div style='padding-right:5px;' class='lineno col-lg-1'>r" + lineNo + 
                    ": </div><div id='eval_" + lineNo + "' class='nowrapping col-lg-11'></div></div>");
                lineNo++;
            }
            return lineNo;
        };


        var query = window.location.search.slice(1);
        if(query) {
            tarea = $("#calcbody");
            tarea.val(decodeURIComponent(query));
        }


        /*
            * Iterate through each of the elements are to be applied to
        */
        return this.each(function() {
            var lineNo = 1;
            var textarea = $(this);

            /* Turn off the wrapping of as we don't want to screw up the line numbers */
            textarea.attr("wrap", "off");
            textarea.css({resize:'none'});
            var originalTextAreaWidth	= textarea.outerWidth();

            /* Wrap the text area in the elements we need */
            textarea.wrap("<div class='linedtextarea'></div>");
            var linedTextAreaDiv	= textarea.parent().wrap("<div class='row linedwrap' style='/*width:" + originalTextAreaWidth + "px*/'></div>");
            var linedWrapDiv 			= linedTextAreaDiv.parent();

            linedWrapDiv.prepend("<div class='col-lg-2 lines' style='width:50px'></div>");
            linedWrapDiv.parent().append("<div class='clinesWrap' style='width:100%;'><div class='row' id='clines' style='width:100%;'></div></div>");

            var linesDiv	= linedWrapDiv.find(".lines");
            var clinesDiv	= linedWrapDiv.parent().find("#clines");
            linedWrapDiv.parent().find(".clinesWrap").height( textarea.height() + 6 );
            linesDiv.height( textarea.height() + 6 );
            clinesDiv.height( 1.38 * (textarea.height() + 6));


            /* Draw the number bar; filling it out where necessary */
            linesDiv.append( "<div class='codelines'></div>" );
            clinesDiv.append( "<div class='codelines'></div>" );
            var codeLinesDiv	= linesDiv.find(".codelines");
            var ccodeLinesDiv	= clinesDiv.find(".codelines");
            var domTextArea		= $(this)[0];
            lineNo = fillOutLines( codeLinesDiv, domTextArea.scrollHeight, lineNo, ccodeLinesDiv);

            /* Move the textarea to the selected line */ 
            if ( opts.selectedLine != -1 && !isNaN(opts.selectedLine) ){
                var fontSize = parseInt( textarea.height() / (lineNo-2) );
                var position = parseInt( fontSize * opts.selectedLine ) - (textarea.height()/2);
                textarea[0].scrollTop = position;
            }


            /* Set the width */
            var sidebarWidth					= linesDiv.outerWidth();
            var paddingHorizontal 		= (parseInt( linedWrapDiv.css("border-left-width") ) + 
                parseInt( linedWrapDiv.css("border-right-width") ) + 
                parseInt( linedWrapDiv.css("padding-left") ) + 
                parseInt( linedWrapDiv.css("padding-right") ));
            var linedWrapDivNewWidth 	= originalTextAreaWidth - paddingHorizontal;
            var textareaNewWidth			= originalTextAreaWidth - sidebarWidth - paddingHorizontal - 20;

            textarea.width( textareaNewWidth );
            // linedWrapDiv.width( linedWrapDivNewWidth );



            /* React to the scroll event */
            textarea.scroll( function(tn){
                var scrollTop 		= domTextArea.scrollTop;
                var clientHeight 	= domTextArea.clientHeight;
                codeLinesDiv.css( {'margin-top': (-1*scrollTop - 2) + "px"} );
                ccodeLinesDiv.css( {'margin-top': (-1.4373*scrollTop) + "px"} ); // magical number
                lineNo = fillOutLines( codeLinesDiv, scrollTop + clientHeight, lineNo, ccodeLinesDiv);
                if(scrollTop == 0) {
                    clinesDiv.height( 1.38 * (textarea.height() + 6));
                } else {
                    clinesDiv.height( 1.42 * (textarea.height() + 6));
                }
            });


            /* Should the textarea get resized outside of our control */
            textarea.resize( function(tn){
                var domTextArea	= $(this)[0];
                linesDiv.height( domTextArea.clientHeight + 6 );
                clinesDiv.height( 1.42 * (textarea.height() + 6));
            });

            var runcalcs = true;

            textarea.bind('input propertychange', function() {
                if(runcalcs) {
                    var lines = textarea.val().split('\n');
                    for(var i = 1; i < lineNo; i++) {
                        var l = $.trim(lines[i - 1]);
                        if(l) {
                            try {
                                eval("r" + i + " = " + l);
                                $("#eval_" + i).text(window["r"+i].toString());
                                $("#cell_" + i).removeClass("lineselect");
                            } catch (e) {
                                $("#eval_" + i).text("Error.");
                                $("#cell_" + i).addClass("lineselect");
                            }
                        } else {
                            $("#eval_" + i).text("");
                            $("#cell_" + i).removeClass("lineselect");
                        }
                    }
                }
                for(var i = 1; i < lineNo; i++) {
                    $("#eval_" + i).text("r" + i in window ? window["r" + i].toString() : "");
                }
            });

            tarea.triggerHandler('scroll');
            tarea.triggerHandler('input');

            $('#pausebtn').click(function () {
                runcalcs = !runcalcs;
                if(runcalcs) {
                    $(this).text("Pause"); 
                } else {
                    $(this).text("Continue"); 
                }
            });

            $('#linkbtn').click(function() {
                function copyToClipboard(element) {
                    var $temp = $("<input>");
                    $("body").append($temp);
                    var link = location.protocol + '//' + location.host + location.pathname + "?";
                    $temp.val(link + encodeURIComponent(element.val())).select();
                    document.execCommand("copy");
                    $temp.remove();
                }
                copyToClipboard(textarea);
            });
        });
    };

    // default options
    $.fn.linedtextarea.defaults = {
        selectedLine: -1,
        selectedClass: 'lineselect'
    };
})(jQuery);