# composerize-ts

This is a very small tool to convert `docker run/create` commands into (hopefully) working `docker-compose.yml` files.

## CLI

composerize-ts can be run in the cli.

`npm install composerize-ts -g` to install, and run as such:

```bash
$ composerize-ts docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx
```

## Contributing

- [Clone a fork of the repo](https://guides.github.com/activities/forking/) and install the project dependencies by running `pnpm install`
- Make your changes, and build the project by running `pnpm run build`
- Test your changes with `pnpm run test`

## Maintainers

- Carsten Götzinger