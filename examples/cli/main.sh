pnpm exec node dist/cli.mjs --input examples/cli/app.ts --name binarium-cli-test --onlyOs --type bin --debug

echo "Execute bin paths:"
find "$(pwd)/build/bin" -type f