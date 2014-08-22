/*
 * component.list-view-scroll
 * http://github.amexpub.com/modules/component.list-view-scroll
 *
 * Copyright (c) 2013 Amex Pub. All rights reserved.
 */

'use strict';
var path = require('path');

module.exports = function (grunt) {
	grunt.initConfig({
		jsbeautifier: {
			files: ["<%= jshint.all %>", "src/**/*.css", "src/**/*.ejs"],
			options: {
				config: '.jsbeautify'
			},
		},
		simplemocha: {
			options: {
				globals: ['should'],
				timeout: 3000,
				ignoreLeaks: false,
				ui: 'bdd',
				reporter: 'tap'
			},
			all: {
				src: 'test/**/*.js'
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'index.js',
				'src/**/*.js',
				'!src/assets/js/main.js',
				'test/**/*.js'
			]
		},
		browserify: {
			dist: {
				files: {
					'src/assets/js/main.js': ['src/assets/js/main_src.js'],
					'assets/js/main.js': ['src/assets/js/main_src.js'],
				}
			}
		},
		uglify: {
			options: {
				sourceMap: true,
				compress: {
					drop_console: false,
				}
			},
			all: {
				files: {
					'assets/js/main.min.js': ['assets/js/main.js']
				}
			}
		},
		less: {
			development: {
				options: {
					// paths: ["src/assets/css"],
					sourceMap: false,
					yuicompress: true,
					compress: true
				},
				files: {
					"assets/css/main.min.css": "src/assets/less/main.less"
				}
			}
		},
		template: {
			all: {
				files: [{
					expand: true,
					cwd: 'src/views',
					src: ['pages/*.ejs', 'index.ejs', '!shared/**/*.ejs'],
					dest: '',
					ext: '.html'
				}],
				variables: {
					env: true
				}
			}
		},
		imagemin: { // Task
			dynamic: { // Another target
				options: { // Target options
					optimizationLevel: 7
				},
				files: [{
					expand: true, // Enable dynamic expansion
					cwd: 'src/', // Src matches are relative to this path
					src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
					dest: '' // Destination path prefix
				}]
			}
		},
		watch: {
			scripts: {
				// files: '**/*.js',
				files: [
					'Gruntfile.js',
					'src/**/*.js',
					'src/**/*.png',
					'src/**/*.svg',
					'src/**/*.gif',
					'src/**/*.jpg',
					'test/**/*.js',
					'src/**/*.ejs',
					'src/**/*.less'
				],
				tasks: ['lint', 'css', 'html', 'packagejs', 'minimg', 'minjs'],
				options: {
					interrupt: true
				}
			}
		} //,
		// buildcontrol: {
		// 	options: {
		// 		dir: 'dist',
		// 		commit: true,
		// 		push: true,
		// 		message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
		// 	},
		// 	pages: {
		// 		options: {
		// 			remote: 'git@github.com:typesettin/getperiodic.git',
		// 			branch: 'gh-pages'
		// 		}
		// 	},
		// 	// heroku: {
		// 	//   options: {
		// 	//     remote: 'git@heroku.com:example-heroku-webapp-1988.git',
		// 	//     branch: 'master',
		// 	//     tag: pkg.version
		// 	//   }
		// 	// },
		// 	// local: {
		// 	//   options: {
		// 	//     remote: '../',
		// 	//     branch: 'build'
		// 	//   }
		// 	// }
		// }
	});

	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-templater');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-build-control');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	// grunt.registerTask('default', ['imagemin']);
	grunt.registerTask('default', ['jshint', 'simplemocha', 'template', 'less']);
	grunt.registerTask('lint', ['newer:jshint', 'newer:jsbeautifier']);
	grunt.registerTask('test', 'newer:simplemocha');
	grunt.registerTask('build', ['buildcontrol:pages']);
	grunt.registerTask('packagejs', 'newer:browserify');
	grunt.registerTask('minjs', 'newer:uglify');
	grunt.registerTask('html', 'newer:template');
	grunt.registerTask('css', 'newer:less');
	// grunt.registerTask('minimg', ['imagemin:dynamic']);
	grunt.registerTask('minimg', ['newer:imagemin:dynamic']);
};
