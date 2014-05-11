module.exports = function(grunt) {

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("viewport-cropper.jquery.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.licenses[0].type %> License\n" +
				" */\n"
		},

		// CoffeeScript compilation
		coffee: {
			compile: {
				files: {
					"dist/jquery.viewport-cropper.js": "src/jquery.viewport-cropper.coffee"
				}
			}
		},

		// Concat definitions
		concat: {
			dist: {
				src: ["src/jquery.viewport-cropper.js"],
				dest: "dist/jquery.viewport-cropper.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/jquery.viewport-cropper.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			my_target: {
				src: ["dist/jquery.viewport-cropper.js"],
				dest: "dist/jquery.viewport-cropper.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		}

	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-coffee");

	grunt.registerTask("default", ["coffee","jshint", "concat", "uglify"]);
	grunt.registerTask("travis", ["jshint"]);

};
