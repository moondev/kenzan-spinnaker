import yaml
import os
import time
import collections


os.system("rm -rf config")
os.system("mkdir config")

with open('../../config/spinnaker.yml', 'r') as f:
  overrides = yaml.load(f.read())

with open('../../config/front50.yml', 'r') as f:
  front50 = yaml.load(f.read())

with open('../../config/clouddriver.yml', 'r') as f:
  clouddriver = yaml.load(f.read())

with open('../../config/rosco.yml', 'r') as f:
  rosco = yaml.load(f.read())

with open('../../config/orca.yml', 'r') as f:
  orca = yaml.load(f.read())

with open('../../config/gate.yml', 'r') as f:
  gate = yaml.load(f.read())

overrides["services"]["redis"]["host"] = "redis-alias"
overrides["services"]["redis"]["connection"] = "redis://" + overrides["services"]["redis"]["host"] + ":" + str(overrides["services"]["redis"]["port"])
overrides["providers"]["aws"]["primaryCredentials"]["name"] = "default"

overrides["services"]["cassandra"]["host"] = "cassandra-alias"
overrides["services"]["cassandra"]["cluster"] = "Test Cluster"

overrides["services"]["front50"]["host"] = "front50-alias"
overrides["services"]["front50"]["baseUrl"] = overrides["services"]["default"]["protocol"] + "://" + overrides["services"]["front50"]["host"] + ":" + str(overrides["services"]["front50"]["port"])

overrides["services"]["orca"]["host"] = "orca-alias"
overrides["services"]["orca"]["baseUrl"] = overrides["services"]["default"]["protocol"] + "://" + overrides["services"]["orca"]["host"] + ":" + str(overrides["services"]["orca"]["port"])

overrides["services"]["oort"]["host"] = "clouddriver-alias"
overrides["services"]["oort"]["baseUrl"] = overrides["services"]["default"]["protocol"] + "://" + overrides["services"]["oort"]["host"] + ":" + str(overrides["services"]["clouddriver"]["port"])

overrides["services"]["mort"]["host"] = "clouddriver-alias"
overrides["services"]["mort"]["baseUrl"] = overrides["services"]["default"]["protocol"] + "://" + overrides["services"]["mort"]["host"] + ":" + str(overrides["services"]["clouddriver"]["port"])

overrides["services"]["rosco"]["host"] = "rosco-alias"
overrides["services"]["rosco"]["baseUrl"] = overrides["services"]["default"]["protocol"] + "://" + overrides["services"]["rosco"]["host"] + ":" + str(overrides["services"]["rosco"]["port"])

overrides["services"]["kato"]["host"] = "clouddriver-alias"
overrides["services"]["kato"]["baseUrl"] = overrides["services"]["default"]["protocol"] + "://" + overrides["services"]["kato"]["host"] + ":" + str(overrides["services"]["clouddriver"]["port"])

front50["cassandra"]["host"] = overrides["services"]["cassandra"]["host"]
front50["cassandra"]["enabled"] = True
#front50["spinnaker"]["cassandra"]["enabled"] = False
#front50["spinnaker"]["s3"]["enabled"] = True
#front50["spinnaker"]["s3"]["bucket-name"] = "cdm-spin"
front50["spinnaker"]["cassandra"]["host"] = overrides["services"]["cassandra"]["host"]
front50["spinnaker"]["cassandra"]["cluster"] = overrides["services"]["cassandra"]["cluster"]
front50["server"].pop("address", None)
front50.update({"spinnaker":{"cassanadra":{"enabled":True, "cluster": overrides["services"]["cassandra"]["cluster"], "host": overrides["services"]["cassandra"]["host"]},"s3":{"enabled":False,"rootFolder": "spinroot", "bucket": "cdm-spin-bucket"}}})

clouddriver["aws"]["enabled"] = True

clouddriver["redis"]["connection"] = overrides["services"]["redis"]["connection"]
clouddriver["default"]["account"]["env"] = overrides["providers"]["aws"]["primaryCredentials"]["name"]
clouddriver["aws"]["defaultFront50Template"] = overrides["services"]["front50"]["baseUrl"]
#clouddriver["aws"]["defaultKeyPairTemplate"] = overrides["providers"]["aws"]["defaultKeyPairTemplate"]
clouddriver["credentials"]["primaryAccountTypes"] = overrides["providers"]["aws"]["primaryCredentials"]["name"]
clouddriver["credentials"]["challengeDestructiveActionsEnvironments"] = overrides["providers"]["aws"]["primaryCredentials"]["name"]

#add missing key for front50

clouddriver.update({"services":{"front50":{"baseUrl":overrides["services"]["front50"]["baseUrl"]}}})
clouddriver["server"].pop("address", None)

rosco["redis"]["connection"] = overrides["services"]["redis"]["connection"]
rosco["docker"]["bakeryDefaults"]["targetRepository"] = overrides["services"]["docker"]["targetRepository"]
#rosco["rosco"]["configDir"] = overrides["services"]["rosco"]["configDir"]
rosco["server"].pop("address", None)

orca["redis"]["connection"] = overrides["services"]["redis"]["connection"]
orca["front50"]["baseUrl"] = overrides["services"]["front50"]["baseUrl"]
orca["oort"]["baseUrl"] = overrides["services"]["oort"]["baseUrl"]
orca["bakery"]["baseUrl"] = overrides["services"]["oort"]["baseUrl"]
orca["mort"]["baseUrl"] = overrides["services"]["mort"]["baseUrl"]
orca["kato"]["baseUrl"] = overrides["services"]["kato"]["baseUrl"]
orca["bakery"]["baseUrl"] = overrides["services"]["rosco"]["baseUrl"]

orca["default"]["bake"]["account"] = overrides["providers"]["aws"]["primaryCredentials"]["name"]
orca.update({"igor":{"enabled":False}})
orca.update({"tide":{"enabled":False, "baseUrl": "http://not-a-host"}})
orca.update({"services":{"orca":{"timezone": "west"}}})
orca["server"].pop("address", None)

gate["redis"]["connection"] = overrides["services"]["redis"]["connection"]
gate.update({"services":{"deck":{"baseUrl":"http://deck-alias:9000"}, "clouddriver":{"baseUrl": overrides["services"]["oort"]["baseUrl"]}, "orca":{"baseUrl": overrides["services"]["orca"]["baseUrl"]}, "front50":{"baseUrl": overrides["services"]["front50"]["baseUrl"]}}})
gate["server"].pop("address", None)

with open('config/front50.yml', 'w') as yaml_file:
  yaml_file.write(yaml.dump(front50, default_flow_style=False))

with open('config/clouddriver.yml', 'w') as yaml_file:
  yaml_file.write(yaml.dump(clouddriver, default_flow_style=False))

with open('config/rosco.yml', 'w') as yaml_file:
  yaml_file.write(yaml.dump(rosco, default_flow_style=False))

with open('config/orca.yml', 'w') as yaml_file:
  yaml_file.write(yaml.dump(orca, default_flow_style=False))

with open('config/gate.yml', 'w') as yaml_file:
  yaml_file.write(yaml.dump(gate, default_flow_style=False))

#build deck

#os.system("docker run -d -e CI=true -e API_HOST='/gate' -e BAKERY_DETAIL_URL='/bakery' --name spin-deck quay.io/spinnaker/deck")
#os.system("docker exec -it spin-deck npm install")
#os.system("docker exec -it spin-deck npm run build")
#os.system("docker cp spin-deck:/deck/build/webpack `pwd`/deck")
#os.system("docker stop spin-deck")
#os.system("docker rm spin-deck")
