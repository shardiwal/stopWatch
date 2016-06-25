/*
 * $.stopWatch v1.0
 * Author  : Rakesh Kumar Shardiwal
 * Version : 1.00
 */

( function($, undefined) {
    var className = 'stopWatch';

    function stopWatchBuilder()
    {
	this._defaults = {
	    version : 1.00,
	    format  : 'HH:MM:SS'
	};
    }

    $.extend(stopWatchBuilder.prototype, {
        _init	: function (target, settings) {

    	if (this._getInstance(target)) {
    	    return false;
    	}

    	var instance = this._newInstance(target);
    	$.extend(instance.settings, this._defaults, settings);
            this._storeInstance( target, instance );
            this._settings = instance.settings;

	    var $clock     = instance.clock;
	    var $clock_container = $('<div/>',{ 'class' : 'display' });
	    var format = instance.settings.format;

	    $.each( format.split(':'), function(i,e) {
		$clock_container.append( $('<span/>',{ 'class' : 't_' + e.toLowerCase() }).text( '00') );
		if ( i + 1 < format.split(':').length ) {
	            $clock_container.append( $('<span/>',{ 'class' : 'seperator' }).text(':') );
		}
	    });
	    $clock.append( $clock_container );
            this._storeInstance( target, instance );
        },

        start	: function( target ) {
	    var self = this;
	    var instance = this._getInstance(target);
	    if ( typeof (instance) == undefined ) { return; }
	    var settings = instance.settings;
	    var timer    = this.do_time;
	    settings.timer = setInterval(
	        function(){ timer(self,target); }, 1000
	    );
            // Override the Start from the settings
            if ( typeof( instance.settings.onStart ) == 'function' ) {
                instance.settings.onStart( instance );
            }
	    this._storeInstance( target, instance );
        },

        stop	: function( target ) {
	    var instance = this._getInstance(target);
	    if ( typeof (instance) == undefined ) { return; }

	    var settings = instance.settings;
	    var clock 	=  $(instance.clock);
	    var h 	= clock.find('.t_hh');
	    var m 	= clock.find('.t_mm');
	    var s 	= clock.find('.t_ss');

	    this._calculateTakenTime(this, target);

	    clearInterval(settings.timer);
	    settings.timer = 0;

            // Override the Stop from the settings
            if ( typeof( instance.settings.onStop ) == 'function' ) {
                instance.settings.onStop( instance );
            }
	    this._storeInstance( target, instance );
        },

        reset	: function( target ) {
	    var instance = this._getInstance(target);
	    if ( typeof (instance) == undefined ) { return; }

	    var settings = instance.settings;
	    var clock 	=  $(instance.clock);
	    var h 	= clock.find('.t_hh');
	    var m 	= clock.find('.t_mm');
	    var s 	= clock.find('.t_ss');

	    this._calculateTakenTime(this, target);

	    clearInterval(settings.timer);
	    settings.timer = 0;
	    h.text("00");
	    m.text("00");
	    s.text("00");

            // Override the Start from the settings
            if ( typeof( instance.settings.onReset ) == 'function' ) {
                instance.settings.onReset( instance );
            }
	    this._storeInstance( target, instance );
        },

	_calculateTakenTime : function(self, target ) {
	    if ( typeof (self) == undefined ) { return; }
	    var instance = self._getInstance(target);
	    if ( typeof (instance) == undefined ) { return; }

	    var settings = instance.settings;
	    var clock 	=  $(instance.clock);
	    var h 	= clock.find('.t_hh');
	    var m 	= clock.find('.t_mm');
	    var s 	= clock.find('.t_ss');

	    var h_time  = parseInt(h.text());
	    var m_time  = parseInt(m.text());
	    var s_time  = parseInt(s.text());

	    var total_sec = parseInt(s_time);
	    if ( m_time > 0 ) {
	        total_sec = total_sec + ( parseInt(m_time) * 60 );
	    }
	    if ( h_time > 0 ) {
	        total_sec = total_sec + ( parseInt(h_time) * 3600 );
	    }
	    settings.timetaken_in_seconds = total_sec;
	    this._storeInstance( target, instance );
	},

        timetaken	: function( target ) {
	    var instance = this._getInstance(target);
	    if ( typeof (instance) == undefined ) { return; }

	    var settings = instance.settings;
	    return settings.timetaken_in_seconds;
	},

        do_time : function( self, target ) {
	    var instance = self._getInstance(target);
	    if ( typeof (instance) == undefined ) { return; }

	    var settings = instance.settings;
	    var clock 	 =  $(instance.clock);
	    var h 	 = clock.find('.t_hh');
	    var m 	 = clock.find('.t_mm');
	    var s 	 = clock.find('.t_ss');
	    
	    hour     = parseFloat(h.text());
	    minute   = parseFloat(m.text());
	    second   = parseFloat(s.text());
	    
	    second++;
	    
	    if(second > 59) {
	    	second = 0;
	    	minute = minute + 1;
	    }
	    if(minute > 59) {
	    	minute = 0;
	    	hour = hour + 1;
	    }
	    
	    h.html("0".substring(hour >= 10) + hour);
	    m.html("0".substring(minute >= 10) + minute);
	    s.html("0".substring(second >= 10) + second);
	   // self._calculateTakenTime(self, target);
        },

        /*
            OOPS based functions
        */
	_getInstance    : function(target) {
	    return $(target).data(className);
	},

	_storeInstance  : function(target, instance) {
	    return $(target).data(className, instance);
	},

	_newInstance    : function(target) {
	    return {
	        id      : $(target).attr('id'),
	        clock   : target,
                self    : this,
		timer   : 0,
	        settings: {}
	    };
	}
    });

    $.fn.stopWatch = function(settings) {
        var otherArgs = Array.prototype.slice.call(arguments, 1);
        return typeof settings == 'string'
            ? $.stopWatch[ settings ].apply( $.stopWatch, [this].concat(otherArgs) )
            : $.stopWatch._init(this, settings);
    }

    $.stopWatch = new stopWatchBuilder();
    $.stopWatch.version = "1.0.1";

} )(jQuery); // Call and execute the function immediately passing the jQuery object
