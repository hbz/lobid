#!/bin/bash

set -e

ajv test -s schemas/person.json -r "schemas/!(person).json" -d "gatsby/lobid/static/team/*.json" -c ajv-formats --strict=log --valid
ajv test -s schemas/person.json -r "schemas/!(person).json" -d "examples/person/invalid/*.json" -c ajv-formats --strict=log --invalid
ajv test -s schemas/product.json -r "schemas/!(product).json" -d "gatsby/lobid/static/product/*.json" -c ajv-formats --strict=log --valid
ajv test -s schemas/product.json -r "schemas/!(product).json" -d "examples/product/invalid/*.json" -c ajv-formats --strict=log --invalid
ajv test -s schemas/group.json -r "schemas/!(group).json" -d "gatsby/lobid/static/team.json" -c ajv-formats --strict=log --valid
ajv test -s schemas/group.json -r "schemas/!(group).json" -d "examples/group/invalid/*.json" -c ajv-formats --strict=log --invalid
ajv test -s schemas/publication.json -r "schemas/!(publication).json" -d "gatsby/lobid/static/publication/*.json" -c ajv-formats --strict=log --valid
ajv test -s schemas/publication.json -r "schemas/!(publication).json" -d "examples/publication/invalid/*.json" -c ajv-formats --strict=log --invalid
ajv test -s schemas/project.json -r "schemas/!(project).json" -d "gatsby/lobid/static/project/*.json" -c ajv-formats --strict=log --valid
ajv test -s schemas/project.json -r "schemas/!(project).json" -d "examples/project/invalid/*.json" -c ajv-formats --strict=log --invalid

if [ $? -eq 0 ]
then
  echo -e "All tests \033[0;32mPASSED\033[0m\n"
fi
