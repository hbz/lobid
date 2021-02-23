#!/bin/bash

set -e

ajv test -s schemas/person.json -r "schemas/*.json" -d "examples/person/valid/*.json" --valid
ajv test -s schemas/person.json -r "schemas/*.json" -d "examples/person/invalid/*.json" --invalid
ajv test -s schemas/product.json -r "schemas/*.json" -d "examples/product/valid/*.json" --valid
ajv test -s schemas/product.json -r "schemas/*.json" -d "examples/product/invalid/*.json" --invalid

if [ $? -eq 0 ]
then
  echo -e "All tests \033[0;32mPASSED\033[0m\n"
fi