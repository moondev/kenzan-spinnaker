# Dependencies
1. Docker https://www.docker.com/products/overview#/install_the_platform
2. Docker-compose (this is included in the docker for mac beta) https://docs.docker.com/compose/install/
3. Ensure you have 8GB memory provisioned for the vm if using docker for mac beta.

# Instructions
1. Clone repo and checkout the exp-dsb branch, navigate to experimental/docker-dsb
1. Fill out key and secret inside `env.env` and rename to `.env`
2. Run `python launch.py`
3. Once complete a browser will launch with spinnaker running at `http://localhost:9000`
