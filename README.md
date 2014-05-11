# viewport-cropper

viewport-cropper is a JQuery plugin to crop images on the front end combined with a Ruby gem to actually create a new image file on the back end from the resulting front end interaction.

This repo contains the JQuery plugin. If you're interested in an asset pipeline compatible version along with backend cropping functionality, checkout the rails-viewport-cropper repo, which should be going up soon.

## dependencies

This plugin depends on JQuery-UI/Draggable.

## usage

To use the plugin, you'll need a form with a file upload field like so:

```html
<form enctype="multipart/form-data">
	<input type="file" id="file" name="file">
</form>
```

Then just call the viewportCropper on it in your JavaScript:

```javascript
$("#file").viewportCropper();
```

When a file is added to the input, a cropper window will show up below it with zoom in and out buttons. 

## options

You can set a few options for viewportCropper, by passing them into the instantation statement in an object literal:

```javascript
$("#file").viewportCropper({
  //sets the class of the viewport
	viewport_class: ".vc-viewport",
	//sets up a logger function to log errors and instructions to the user - default is to log to the console
	logger: (message)-> console.log(message),
	//width of the viewport cropper box
	width: 300,
	//height of the viewport cropper box
	height: 200
});
```

## getting crop data

**viewport-cropper does not actually change the image file uploaded.**

You'll need to take care of these changes on the back end of your app - for this, see the rails-viewport-cropper gem.

What viewport-cropper DOES do is give you an easy to use method to get width, height, offset from the top of the frame, offset from the left of the frame, frame width, and frame height in an easy to use object. Just call window.imageInformation() to retrieve the information.

viewport-cropper will also automatically append all of this information upon form submittal within an [image] object.

## contributing

Pull request very welcome!

Before sending a pull request remember to follow [jQuery Core Style Guide](http://contribute.jquery.org/style-guide/js/).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Make your changes on the `src` folder, never on the `dist` folder.
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin my-new-feature`
6. Submit a pull request :D

# thanks

This plugin used the (jquery-boilerplate)[https://github.com/jquery-boilerplate/jquery-boilerplate] repo to get started. Thanks to those peeps!

