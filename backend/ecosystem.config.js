module.exports = {
	  apps : [
	      {
	        name: "InviHR_Server_Dev",
	        script: "./server.js",
	        instances: 1,
	        exec_mode: "fork",
	        watch: false,
	        increment_var : 'PORT',
	        env: {
	            "PORT": 5107,
	            "NODE_ENV": "production"
	        }
	      }
	  ]
	}
