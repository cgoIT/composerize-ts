# composerize-ts

![CI](https://github.com/cgoIT/composerize-ts/actions/workflows/ci.yml/badge.svg)
![npm](https://img.shields.io/npm/v/composerize-ts)

This is a very small tool to convert `docker run/create` commands into (hopefully) working `docker-compose.yml` files.

## CLI

composerize-ts can be run in the cli.

`npm install composerize-ts -g` to install, and run as such:

```bash
$ composerize-ts docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx
```

## Supported docker run/create options

| Docker run/create option | docker-compose equivalent | Remarks                            |
|--------------------------|---------------------------|------------------------------------|
| --add-host               | extra_hosts               |                                    |
| --blkio-weight           | blkio_config.weight       |                                    |
| --cap-add                | cap_add                   |                                    |
| --cap-drop               | cap_drop                  |                                    |
| --cgroupns               | cgroup                    |                                    |
| --cgroup-parent          | cgroup_parent             |                                    |
| --cpu-count              | cpu_count                 |                                    |
| --cpu-period             | cpu_period                |                                    |
| --cpu-quota              | cpu_quota                 |                                    |
| --cpu-rt-period          | cpu_rt_period             |                                    |
| --cpu-rt-quota           | cpu_rt_quota              |                                    |
| --cpus                   | cpus                      |                                    |
| --cpuset-cpus            | cpuset                    |                                    |
| --device                 | devices                   |                                    |
| --device-cgroup-rule     | device_cgroup_rules       |                                    |
| --dns                    | dns                       |                                    |
| --dns-option             | dns_opt                   |                                    |
| --dns-search             | dns_search                |                                    |
| --domainname             | domainname                |                                    |
| --entrypoint             | entrypoint                |                                    |
| --env/-e                 | environment               |                                    |
| --env-file               | env_file                  |                                    |
| --hostname               | hostname                  |                                    |
| --expose                 | expose                    |                                    |
| --group-add              | group_add                 |                                    |
| --health-cmd             | healthcheck.test          |                                    |
| --health-interval        | healthcheck.interval      |                                    |
| --health-retries         | healthcheck.retries       |                                    |
| --health-start-period    | healthcheck.start_period  |                                    |
| --health-timeout         | healthcheck.timeout       |                                    |
| --init                   | init                      |                                    |
| --interactive/-i         | stdin_open                |                                    |
| --ipc                    | ipc                       |                                    |
| --isolation              | isolation                 |
| --label                  | labels                    |                                    |
| --link                   | links                     |                                    |
| --log-driver             | logging.driver            |                                    |
| --log-opt                | logging.options           |                                    |
| --mac-address            | mac_address               |                                    |
| --memory-swappiness      | mem_swappiness            |                                    |
| --name                   | container_name            |                                    |
| --oom-kill-disable       | oom_kill_disable          |                                    |
| --oom-score-adj          | oom_score_adj             |                                    |
| --pid                    | pid                       |                                    |
| --pids-limit             | pids_limit                |                                    |
| --platform               | platform                  |                                    |
| --privileged             | privileged                |                                    |
| --publish/-p             | networks                  | adds a networks block as well      |
| --publish-all            |                           | not convertable to docker-compose  |
| --pull                   | pull_policy               |                                    |
| --read-only              | read_only                 |                                    |
| --quiet                  |                           | not convertable to docker-compose  |
| --restart                | restart                   |                                    |
| --rm                     |                           | not convertable to docker-compose  |
| --runtime                | runtime                   |                                    |
| --security-opt           | security_opt              |                                    |
| --shm-size               | shm_size                  |                                    |
| --stop-signal            | stop_signal               |                                    |
| --stop-timeout           | stop_grace_period         |                                    |
| --storage-opt            | storage_opt               |                                    |
| --sysctl                 | sysctls                   |                                    |
| --tmpfs                  | tmpfs                     |                                    |
| --tty/-t                 | tty                       |                                    |
| --ulimit                 | ulimit                    |                                    |
| --user                   | user                      |                                    |
| --userns                 | userns_mode               |                                    |
| --volume/-v              | volumes                   |                                    |
| --volumes-from           | volumes_from              |                                    |
| --workdir                | working_dir               |                                    |


## Technical documentation

You'll find the documentation in the [docs](./docs) folder.

## Contributing

- [Clone a fork of the repo](https://guides.github.com/activities/forking/) and install the project dependencies by running `pnpm install`
- Make your changes, and build the project by running `pnpm run build`
- Test your changes with `pnpm run test`

## Maintainers

- Carsten Götzinger
