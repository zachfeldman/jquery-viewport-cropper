(function() {
  (function($, window, document) {
    var Plugin, defaults, pluginName;
    pluginName = "viewportCropper";
    defaults = {
      viewport_class: ".vc-viewport",
      logger: function(message) {
        return console.log(message);
      },
      width: 300,
      height: 200
    };
    Plugin = (function() {
      function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
      }

      Plugin.prototype.init = function() {
        var that;
        that = this;
        window.imageInformation = this.imageInformation;
        $(this.element).parent().after("<div class='vc-viewport'></div>");
        $(this.element).parent().submit(function(e) {
          return that.appendFields($(e.currentTarget));
        });
        $(this.settings.viewport_class).addClass("vc-css").width(this.settings.width).height(this.settings.height).after("<div class='toolbar'><button class='zoom-in'>+</button><button class='zoom-out'>-</button></div>");
        return $(this.element).change(function() {
          return that.showThumbnail($(that.element)[0].files[0]);
        });
      };

      Plugin.prototype.calculateAspectRatioFit = function(el, max_width, max_height) {
        var ratio, src_height, src_width;
        src_width = el.width();
        src_height = el.height();
        ratio = [max_width / src_width, max_height / src_height];
        ratio = Math.min(ratio[0], ratio[1]);
        return {
          width: src_width * ratio,
          height: src_height * ratio
        };
      };

      Plugin.prototype.imageInformation = function(viewport_class) {
        if (viewport_class == null) {
          viewport_class = '.vc-viewport';
        }
        return {
          '[image]width': $(viewport_class + " .thumbnail img").width(),
          '[image]height': $(viewport_class + " .thumbnail img").height(),
          '[image]offset_top': $(viewport_class + " .thumbnail img").offset().top - $(viewport_class + " .thumbnail").offset().top,
          '[image]offset_left': $(viewport_class + " .thumbnail img").offset().left - $(viewport_class + " .thumbnail").offset().left,
          '[image]frame_width': $(viewport_class).width(),
          '[image]frame_height': $(viewport_class).height()
        };
      };

      Plugin.prototype.zoomIn = function() {
        var wh;
        wh = this.calculateAspectRatioFit(this.$thumbnail, parseInt(this.$thumbnail.css("width")) * 1.1, parseInt(this.$thumbnail.css("height")) * 1.1);
        return this.$thumbnail.width(wh.width).height(wh.height);
      };

      Plugin.prototype.zoomOut = function() {
        var wh;
        wh = this.calculateAspectRatioFit(this.$thumbnail, parseInt(this.$thumbnail.css("width")) * .9, parseInt(this.$thumbnail.css("height")) * .9);
        return this.$thumbnail.width(wh.width).height(wh.height);
      };

      Plugin.prototype.showThumbnail = function(file) {
        var canvas, image, reader, that;
        that = this;
        if (!file.type.match(/image.*/)) {
          return this.settings.logger("You need to upload a valid image file.");
        } else {
          image = document.createElement("img");
          image.file = file;
          $(this.settings.viewport_class).append("<div class='thumbnail'></div>");
          $(this.settings.viewport_class + " .thumbnail").append(image);
          reader = new FileReader();
          reader.onload = (function(aImg) {
            return function(e) {
              return aImg.src = e.target.result;
            };
          })(image);
          reader.readAsDataURL(file);
          canvas = document.createElement("canvas").getContext("2d");
          image.onload = function() {
            return canvas.drawImage(image, 100, 100);
          };
          this.$thumbnail = $(this.settings.viewport_class + " .thumbnail img");
          $(".toolbar").show();
          this.$thumbnail.draggable();
          return this.$thumbnail.load(function() {
            var wh;
            wh = that.calculateAspectRatioFit($(this), $(that.settings.viewport_class).width(), $(that.settings.viewport_class).height());
            $(this).width(wh.width).height(wh.height);
            that.settings.logger('Drag your image to fit into the frame. Use the zoom buttons to resize it if desired.');
            $(".zoom-in").click(function() {
              return that.zoomIn();
            });
            return $(".zoom-out").click(function() {
              return that.zoomOut();
            });
          });
        }
      };

      Plugin.prototype.appendFields = function(form) {
        return $.each(this.imageInformation(), function(i, v) {
          return form.append("<input type='hidden' value='" + v + "' name='" + i + "'>");
        });
      };

      return Plugin;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    };
  })(jQuery, window, document);

}).call(this);
