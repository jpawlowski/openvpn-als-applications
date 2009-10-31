#!/bin/sh
# Stupid script to chmod rdekstop before executing it...

chmod +x "`dirname $0`/rdesktop"
`dirname $0`/rdesktop $@
