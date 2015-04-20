## Purpose
This branch contains dev work for www.pawar.ca<br>
Pushes to this branch are auto-deployed to heroku at http://pawar.herokuapp.com

## Keys
Google authentication keys and callback url listed in config/express.js

## Where to enforce authentication
Policies are simple functions which run **before** your controllers. You can apply one or more policies to a given controller, or protect its actions individually.<br>
To control which controller goes through Google OAuth, set it in /config/policies.js file

## Where to retrieve OAuth keys
Go to https://console.developers.google.com/ <br>
Get OAuth Credentials <br>
Two types of OAuth keys:
	* web application keys --> when using Google+ for login authentication etc.
							NOTE: do not forget to register your callbacks under
							"Redirect URIs" and "Javascript Origins" tabs

	* service account keys --> using google API to get files from
	 						google drive etc.


## Node.js + Sails framework
#### Install node
sudo apt-get install python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs

#### Update node.js
sudo npm cache clean -f
sudo npm install -g n
sudo n stable

#### Check node.js version
node -v

#### Install sails framework
sudo npm install sails -g

#### Using "Forever" to keep node.js server running 24/7
sudo npm install -g forever

#### Running server
git clone [repo] [dir] <br>
cd [dir]  <br>
sudo npm install  <br>
node forever  <br>


