# Note that when compiling with coffeescript, the plugin is wrapped in another
# anonymous function. We do not need to pass in undefined as well, since
# coffeescript uses (void 0) instead.
do ($ = jQuery, window, document) ->

	# window and document are passed through as local variable rather than global
	# as this (slightly) quickens the resolution process and can be more efficiently
	# minified (especially when both are regularly referenced in your plugin).

	# Create the defaults once
	pluginName = "viewportCropper"
	defaults =
		viewport_class: ".vc-viewport",
		logger: (message)-> console.log(message),
		width: 300,
		height: 200

	# The actual plugin constructor
	class Plugin
		constructor: (@element, options) ->
			# jQuery has an extend method which merges the contents of two or
			# more objects, storing the result in the first object. The first object
			# is generally empty as we don't want to alter the default options for
			# future instances of the plugin
			@settings = $.extend {}, defaults, options
			@_defaults = defaults
			@_name = pluginName
			@init()

		init: ->
			# Place initialization logic here
			# You already have access to the DOM element and the options via the instance,
			# e.g., @element and @settings
			that = @
			window.imageInformation = @imageInformation
			$(@element).parent().after("<div class='vc-viewport'></div>")
			$(@element).parent().submit( (e) ->
				that.appendFields($(e.currentTarget))
			)
			$(@settings.viewport_class).addClass("vc-css").width(@settings.width).height(@settings.height).after("<div class='toolbar'><button class='zoom-in'>+</button><button class='zoom-out'>-</button></div>")
			$(@element).change ()-> that.showThumbnail($(that.element)[0].files[0])

		calculateAspectRatioFit: (el, max_width, max_height) ->
		  src_width = el.width()
		  src_height = el.height()
		  ratio = [max_width / src_width, max_height / src_height]
		  ratio = Math.min(ratio[0], ratio[1])
		  width: src_width * ratio
		  height: src_height * ratio

		imageInformation: (viewport_class='.vc-viewport')->
		  '[image]width': $(viewport_class + " .thumbnail img").width()
		  '[image]height': $(viewport_class + " .thumbnail img").height()
		  '[image]offset_top': $(viewport_class + " .thumbnail img").offset().top - $(viewport_class + " .thumbnail").offset().top
		  '[image]offset_left': $(viewport_class + " .thumbnail img").offset().left - $(viewport_class + " .thumbnail").offset().left
		  '[image]frame_width': $(viewport_class).width()
		  '[image]frame_height': $(viewport_class).height()

		 zoomIn: ->
		   wh = @calculateAspectRatioFit(@$thumbnail, parseInt(@$thumbnail.css("width")) * 1.1, parseInt(@$thumbnail.css("height")) * 1.1)
		   @$thumbnail.width(wh.width).height wh.height

		 zoomOut: ->
		   wh = @calculateAspectRatioFit(@$thumbnail, parseInt(@$thumbnail.css("width")) * .9, parseInt(@$thumbnail.css("height")) * .9)
		   @$thumbnail.width(wh.width).height wh.height

		 showThumbnail: (file) ->
		   that = @
		   if !file.type.match(/image.*/)
		     @settings.logger "You need to upload a valid image file."
		   else
		     image = document.createElement("img");
		     image.file = file;
		     $(@settings.viewport_class).append("<div class='thumbnail'></div>")
		     $(@settings.viewport_class + " .thumbnail").append(image)

		     reader = new FileReader()
		     reader.onload = do (aImg = image) ->
		       (e) ->
		         aImg.src = e.target.result
		     reader.readAsDataURL(file);
		     canvas = document.createElement("canvas").getContext("2d");
		     image.onload= ()->
		       canvas.drawImage(image,100,100)

		     @$thumbnail = $(@settings.viewport_class + " .thumbnail img")

		     $(".toolbar").show()

		     @$thumbnail.draggable()

		     @$thumbnail.load ()->
		       wh = that.calculateAspectRatioFit($(this), $(that.settings.viewport_class).width(), $(that.settings.viewport_class).height())
		       $(this).width(wh.width).height(wh.height)
		       that.settings.logger 'Drag your image to fit into the frame. Use the zoom buttons to resize it if desired.'
		       $(".zoom-in").click ()-> that.zoomIn()
		       $(".zoom-out").click ()-> that.zoomOut()

		  appendFields: (form) ->
		  	$.each @imageInformation(), (i, v) ->
		  	  form.append "<input type='hidden' value='#{v}' name='#{i}'>"

	# A really lightweight plugin wrapper around the constructor,
	# preventing against multiple instantiations
	$.fn[pluginName] = (options) ->
		@each ->
			unless $.data @, "plugin_#{pluginName}"
				$.data @, "plugin_#{pluginName}", new Plugin @, options
