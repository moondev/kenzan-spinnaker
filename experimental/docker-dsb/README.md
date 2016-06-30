# Dependencies
1. Docker https://www.docker.com/products/overview#/install_the_platform
2. Docker-compose https://docs.docker.com/compose/install/

# Instructions

1. Fill out key and secret inside `env.env`
2. Run `python config.py` to generate configs and build deck
3. Run `docker-compose up` to start Spinnaker.
4. Once complete Spinnaker should be up on `http://localhost:9000`
