'use strict';

module.exports = function (grunt) {
	grunt.initConfig({
		express: {
			livereloadServer: {
				server: path.resolve(__dirname, 'server.js'),
				bases: path.resolve(__dirname, 'src'),
				livereload: true,
				serverreload: true
			}
		},
		rsync: {
			options: {
				args: ['-avz', '--verbose', '--delete', '--compress'],
				exclude: ['.git*', '/node_modules/', '/app/tmp/**', '/app/Data/**'],
				recursive: true
			},
			development: {
				options: {
					src: './',
					dest: '/home/mid/Documents/jobs/Pakgon/rta-finance',
					host: 'mid@mafia.local',
					port: 22
				}
			}
		},
		watch: {
			development: {
				files: [
					'app/**'
				],
				tasks: ['rsync:development'],
				options: {
					livereload: {
						host: '10.0.0.3',
						port: 9000
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-rsync');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express');
	grunt.registerTask('default', ['express']);
}
