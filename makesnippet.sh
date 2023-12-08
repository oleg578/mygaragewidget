#!/usr/bin/env bash

rm -f shopify/mygarage-snippet.liquid

echo "<script>" > shopify/mygarage-snippet.liquid

cat vehicle.js \
garage.js \
main.js >> shopify/mygarage-snippet.liquid

echo "</script>" >> shopify/mygarage-snippet.liquid

cat shopify/component.liquid >> shopify/mygarage-snippet.liquid