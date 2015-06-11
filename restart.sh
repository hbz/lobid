#!/bin/sh

USAGE="<GIT REPO NAME> {start|stop} <PORT> [<JAVA ARGS>]"

if [ $# -lt 3 ]; then
	echo "$USAGE
				First 3 parameters are mandatory.
				Don't forget that the process is monitored by 'monit'.
				It will restart automatically if you stop the API.
				If you want to stop it permanently, do 'sudo /etc/ini.d/monit stop' first.
				"
	exit 65
fi

REPO=$1
ACTION=$2
PORT=$3
JAVA_ARGS="$4"

HOME="/home/sol"

# it is important to set the proper locale
. $HOME/.locale

cd $HOME/git/$REPO
case $ACTION in
	start)
		kill $(cat target/universal/stage/RUNNING_PID)
		$HOME/activator-1.2.10-minimal/activator "start $PORT" $JAVA_ARGS
		;;
	stop)
		kill $(cat target/universal/stage/RUNNING_PID)
		;;
	*) 
		echo "usage: $USAGE"
		;;
esac
exit 0

