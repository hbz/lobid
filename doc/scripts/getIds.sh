rm generatedJson-ld-index-data.json
for i in $(grep '^{"index' ../../test/tests/json-ld-index-data.json ); do
  echo "$i" >> d
  a=$(echo "$i" | perl -pe 's|.*_type":"(.*?)","_id":"(.*?)".*_index":"(.*?)".*|\3/\1/\2|' | sed -e 's#\\/#%2F#g'| sed 's#\ #%20#g')
 curl -XGET "http://quaoar1.hbz-nrw.de:9200/$a" |  sed 's#.*\({"@graph.*\)}#\1#g' >> d ; echo "" >> generatedJson-ld-index-data.json
done
