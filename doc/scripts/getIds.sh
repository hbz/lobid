#!/bin/bash
#
# Updates the test data. Get their ID's , lookup in production, do some regex to get the
# right form, and write that to a file. The metadata for ES (index, index-type etc) is not
# updated.

NEW_DATA_FILE=generatedJson-ld-index-data.json
rm $NEW_DATA_FILE
# get the old ES metadata and append this to the file:
for i in $(grep '^{"index' ../../test/tests/json-ld-index-data.json ); do
  echo "$i" >> $NEW_DATA_FILE
  a=$(echo "$i" | perl -pe 's|.*_type":"(.*?)","_id":"(.*?)".*_index":"(.*?)".*|\3/\1/\2|' | sed -e 's#\\/#%2F#g'| sed 's#\ #%20#g')
 curl -XGET "http://quaoar1.hbz-nrw.de:9200/$a" |  sed 's#.*\({"@graph.*\)}#\1#g' >> $NEW_DATA_FILE ; echo "" >> $NEW_DATA_FILE
done
