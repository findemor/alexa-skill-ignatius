#!/bin/sh
for D in *; do
    if [ -d "${D}" ]; then
	for i in ${D}/*.mp3;
	  do name=`echo $i | cut -d'.' -f1`;
	  echo $name;
	done
    fi
done