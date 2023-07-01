#!/bin/bash

set -euo pipefail

SALT_LENGTH=32

if [ "$#" -lt 1 ]; then
  echo "usage: $0 password" >&2
  exit
fi

SALT=$(head -c $SALT_LENGTH /dev/urandom | base64 | tr -d '\n')
SSHA=$(echo -n "$1""$SALT" | openssl dgst -binary -sha1 | awk '{print $1}')
ENCODED=$(echo -n "$SSHA""$SALT" | base64 | tr -d '\n')

echo "passwd: $ENCODED"
echo "salt: $SALT"